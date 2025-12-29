import { Component, Input, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TemplateTunerComponent } from '../../components/template-tuner/template-tuner.component';
import { ConceptCreatorComponent } from '../../components/concept-creator/concept-creator.component';
import { ProposalsService } from '../../services/proposals.service';
import { TeamsService } from '../../../../services/teams.service';
import { SportsService } from '../../../../services/sports.service';
import { SeasonService } from '../../../../services/season.service';
import { SubscriptionsService } from '../../../../services/subscriptions.service';
import { PlanningTemplateService } from '../../../../services/planning-template.service';
import { SportConceptService } from '../../../../services/sport-concept.service';
import { ConceptProposalResponseDto, ScoredConceptDto, ConceptTag, ConceptProposalGroupDto, PlanningTemplateDto, ProposalPriority } from '../../models/proposal.models';

// --- New Hierarchical Interfaces ---
interface SubCategoryRow {
    name: string;
    categoryId: number;
    activeConcepts: ScoredConceptDto[];
    availableConcepts: ScoredConceptDto[]; // Right column: "The Library"
    
    isExpanded: boolean;
    // Helper connection IDs
    activeListId: string;
    availableListId: string;
}

interface CategoryGroup {
    name: string;
    isCollapsed: boolean;
    hasActiveContent: boolean;
    subCategories: SubCategoryRow[];
}

interface MethodologicalSection {
    name: string;
    isCollapsed: boolean;
    categories: CategoryGroup[];
}

@Component({
    selector: 'app-proposal-manager',
    standalone: true,
    imports: [CommonModule, FormsModule, DragDropModule, RouterModule, TemplateTunerComponent, ConceptCreatorComponent],
    templateUrl: './proposal-manager.component.html',
    styleUrls: ['./proposal-manager.component.css']
})
export class ProposalManagerComponent implements OnInit, OnChanges {
    @Input() response: ConceptProposalResponseDto | null = null;
    @Input() selectedTeamId: number | null = null;
    @Input() embedded: boolean = false;
    @Input() initialSelectedConceptIds: number[] = [];

    // Local state
    teams: any[] = [];
    templates: PlanningTemplateDto[] = [];
    selectedTemplateId: number | null = null;
    defaultTemplateName: string = '';
    loading: boolean = false;
    currentLevelOffset: number = 0;
    methodologicalSections: MethodologicalSection[] = [];
    allListIds: string[] = [];
    readonly INITIAL_VISIBLE_COUNT = 3;

    private seasonService: SeasonService = inject(SeasonService);

    // Modal State
    showCreateModal: boolean = false;
    newConceptName: string = '';
    newConceptCategoryId: number | null = null;
    conceptCategories: any[] = [];
    flattenedCategories: any[] = [];
    isCreating: boolean = false;

    constructor(
        private proposalsService: ProposalsService,
        private teamsService: TeamsService,
        private sportsService: SportsService,
        private subscriptionsService: SubscriptionsService,
        private planningTemplateService: PlanningTemplateService,
        private sportConceptService: SportConceptService
    ) { }

    openCreateConceptModal() {
        this.showCreateModal = true;
        this.newConceptName = '';
        this.newConceptCategoryId = null;
        if (this.conceptCategories.length === 0) {
            this.loadCategories();
        }
    }

    closeCreateConceptModal() {
        this.showCreateModal = false;
    }

    handleConceptCreated(savedConcept: any) {
        if (!savedConcept || savedConcept.id <= 0) {
            console.warn('Received invalid concept (no ID or negative ID)');
            return;
        }

        console.log('Concept created and saved:', savedConcept.name, 'ID:', savedConcept.id);
        
        // Reload proposals to include the newly created concept
        // The backend will now return this concept in the appropriate group
        this.generateProposals();
    }

    loadCategories() {
        this.sportConceptService.getCategories().subscribe({
            next: (cats) => {
                this.conceptCategories = cats;
                this.flattenedCategories = [];
                this.flattenCategoriesRecursive(cats);
            },
            error: (err) => console.error('Error loading categories', err)
        });
    }

    flattenCategoriesRecursive(cats: any[]) {
        cats.forEach(c => {
            if (!c.parentId) {
                this.flattenedCategories.push({ id: c.id, name: c.name, level: 0 });
            }
            if (c.subCategories && c.subCategories.length > 0) {
                 this.processChildren(c.subCategories, 1);
            }
        });
    }

    processChildren(cats: any[], level: number) {
        cats.forEach(c => {
            this.flattenedCategories.push({ id: c.id, name: '- '.repeat(level) + c.name, level: level });
             if (c.subCategories && c.subCategories.length > 0) {
                 this.processChildren(c.subCategories, level + 1);
            }
        });
    }

    saveNewConcept() {
        // ... (Keep existing implementation)
    }

    ngOnInit(): void {
        this.loadTeams();
    }

    private loadTeams() {
        this.teamsService.getMyTeams().subscribe({
            next: (res) => {
                this.teams = res;
                if (this.selectedTeamId) {
                    this.processSelectedTeam();
                }
            },
            error: (err) => console.error('Error loading teams', err)
        });
    }

    processSelectedTeam() {
        const team = this.teams.find(t => t.id === this.selectedTeamId);

        if (!team) {
            this.teamsService.getTeam(this.selectedTeamId!).subscribe({
                next: (t) => {
                    if (!this.teams.find(existing => existing.id === t.id)) {
                        this.teams.push(t);
                    }
                    this.setupTemplateForTeam(t);
                },
                error: (err) => console.error('ProposalManager: Error fetching team context', err)
            });
            return;
        }

        this.setupTemplateForTeam(team);
    }

    private setupTemplateForTeam(team: any) {
        // Broad search for sportId
        let sportId = team.sportId || team.sport?.id || team.teamCategory?.sportId || team.teamCategory?.sport?.id;

        if (!sportId) {
            this.subscriptionsService.getMySubscriptions().subscribe({
                next: (subs) => {
                    const activeSub = subs.find(s => s.isActive) || subs[0];
                    if (activeSub) {
                        this.fetchTemplates(activeSub.sportId, team);
                    } else {
                        this.generateProposals();
                    }
                },
                error: (err) => {
                    this.generateProposals();
                }
            });
        } else {
            this.fetchTemplates(sportId, team);
        }
    }

    private fetchTemplates(sportId: number, team: any) {
        this.planningTemplateService.getMyTemplates(sportId).subscribe({
            next: (res) => {
                this.templates = res as unknown as PlanningTemplateDto[];
                
                if (this.templates.length === 0) {
                     this.selectedTemplateId = -1;
                     this.defaultTemplateName = 'Sin Plantilla';
                } else {
                    const categoryName = team.teamCategory?.name || '';
                    const match = this.templates.find(i => i.name === categoryName);
                    this.defaultTemplateName = match ? match.name : categoryName;
                    if (!this.selectedTemplateId && match) {
                        this.selectedTemplateId = match.id;
                    }
                }
                this.generateProposals();
            },
            error: (err) => {
                console.error('ProposalManager: Error loading templates', err);
                this.generateProposals();
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['response'] && this.response) {
            this.processResponseIntoHierarchy();
        }

        if (changes['initialSelectedConceptIds'] && !changes['initialSelectedConceptIds'].firstChange) {
            this.generateProposals();
        }

        if (changes['selectedTeamId'] && this.selectedTeamId) {
            this.processSelectedTeam();
        } else if (changes['selectedTeamId'] && !this.selectedTeamId) {
            this.response = null;
        }
    }

    onTeamChange() {
        if (this.selectedTeamId) {
            this.processSelectedTeam();
        } else {
            this.response = null;
        }
    }

    generateProposals(forceIncludeConcept?: any) {
        if (!this.selectedTeamId) return;

        // Capture state before reload
        const expandedState = this.captureExpansionState();

        this.loading = true;
        // Do NOT clear response or sections here to enable Ghost Loading
        // this.response = null; 
        // this.methodologicalSections = []; 
        this.allListIds = [];

        // -1 means Manual Mode -> No Template. 
        // We set SkipLevelFilter = true to get "All Concepts" on the Right side.
        const isManual = this.selectedTemplateId === -1;
        const templateIdToSend = isManual ? undefined : (this.selectedTemplateId ?? undefined);

        // Get current season
        const currentSeason = this.seasonService.currentSeason();
        if (!currentSeason) {
            console.error('No hay temporada seleccionada');
            this.loading = false;
            return;
        }

        // Filter out negative IDs (pending concepts) - backend can't process them
        const validConceptIds = this.initialSelectedConceptIds.filter(id => id > 0);

        const payload = {
            teamId: this.selectedTeamId,
            seasonId: currentSeason.id,
            levelOffset: this.currentLevelOffset,
            planningTemplateId: templateIdToSend,
            includeConceptIds: validConceptIds,
            skipLevelFilter: true // ALWAYS true now because we want "The Rest" on the right side.
        };
        
        console.log('Sending payload:', payload);


        this.proposalsService.generateProposals(payload).subscribe({
            next: (res) => {
                this.response = res;
                // Note: Backend now guarantees strict separation:
                // Suggested = Template Concepts / Selected Concepts
                // Optional = Everything Else
                
                if (forceIncludeConcept && this.response) {
                    this.ensureConceptInResponse(this.response, forceIncludeConcept);
                }

                this.processResponseIntoHierarchy();
                this.restoreExpansionState(expandedState); // Restore state

                if (forceIncludeConcept) {
                    this.expandRowForConcept(forceIncludeConcept.id);
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error generating proposals', err);
                this.loading = false;
            }
        });
    }

    onTemplateChange(templateId: number) {
        this.selectedTemplateId = templateId;
        this.generateProposals();
    }

    sectionHasActive(section: MethodologicalSection): boolean {
        return section.categories.some(c => c.hasActiveContent);
    }

    toggleSection(section: MethodologicalSection) {
        section.isCollapsed = !section.isCollapsed;
    }

    toggleCategory(category: CategoryGroup) {
        category.isCollapsed = !category.isCollapsed;
    }

    toggleRow(row: SubCategoryRow) {
        row.isExpanded = !row.isExpanded;
    }

    // --- MOVEMENT LOGIC ---

    moveToActive(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // Move from Available -> Active
        const idx = row.availableConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            row.availableConcepts.splice(idx, 1);
            conceptWrapper.tag = ConceptTag.Own;
            row.activeConcepts.push(conceptWrapper);
            
            // Sync with selection state
            if (!this.initialSelectedConceptIds.includes(conceptWrapper.concept.id)) {
                this.initialSelectedConceptIds.push(conceptWrapper.concept.id);
            }
        }
    }

    moveToAvailable(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // Move from Active -> Available
        const idx = row.activeConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            row.activeConcepts.splice(idx, 1);
            // Returning to available - tag doesn't matter much visually on right side, but conceptually it's available
            conceptWrapper.tag = ConceptTag.Inherited; 
            row.availableConcepts.push(conceptWrapper);
            
             // Sync with selection state
             const selIdx = this.initialSelectedConceptIds.indexOf(conceptWrapper.concept.id);
             if (selIdx !== -1) {
                 this.initialSelectedConceptIds.splice(selIdx, 1);
             }
        }
    }

    private ensureConceptInResponse(response: ConceptProposalResponseDto, concept: any) {
        // If just created, we want it selected (Active)
        const allGroups = [...response.suggestedGroups, ...response.optionalGroups];
        if (allGroups.some(g => g.concepts.some(c => c.concept.id === concept.id))) return;

        // Add to Suggested (Active)
        let targetGroup = response.suggestedGroups.find(g => g.categoryId === concept.conceptCategoryId);
        if (!targetGroup) {
            const catInfo = this.flattenedCategories.find(c => c.id === concept.conceptCategoryId);
            targetGroup = {
                categoryName: catInfo ? catInfo.name : 'Nueva Categoría',
                categoryId: concept.conceptCategoryId,
                section: 'General',
                concepts: []
            };
            response.suggestedGroups.push(targetGroup);
        }

        targetGroup.concepts.push({
            concept: concept,
            score: 1.0,
            scoreReason: 'Recién creado',
            priority: ProposalPriority.Essential,
            tag: ConceptTag.Own
        });
    }

    private expandRowForConcept(conceptId: number) {
        for (const section of this.methodologicalSections) {
            for (const category of section.categories) {
                const targetRow = category.subCategories.find(r => 
                    r.activeConcepts.some(c => c.concept.id === conceptId) || 
                    r.availableConcepts.some(c => c.concept.id === conceptId)
                );
                
                if (targetRow) {
                    targetRow.isExpanded = true;
                    category.isCollapsed = false;
                    category.hasActiveContent = true; 
                    section.isCollapsed = false;
                    return;
                }
            }
        }
    }

    private captureExpansionState(): Set<string> {
        const state = new Set<string>();
        this.methodologicalSections.forEach(section => {
             if (!section.isCollapsed) state.add(`sec:${section.name}`);
             section.categories.forEach(cat => {
                 if (!cat.isCollapsed) state.add(`cat:${section.name}|${cat.name}`);
                 cat.subCategories.forEach(row => {
                     if (row.isExpanded) state.add(`row:${row.categoryId}`);
                 });
             });
        });
        return state;
    }

    private restoreExpansionState(state: Set<string>) {
        this.methodologicalSections.forEach(section => {
             if (state.has(`sec:${section.name}`)) section.isCollapsed = false;
             section.categories.forEach(cat => {
                 if (state.has(`cat:${section.name}|${cat.name}`)) {
                     cat.isCollapsed = false;
                 }
                 cat.subCategories.forEach(row => {
                     if (state.has(`row:${row.categoryId}`)) {
                         row.isExpanded = true;
                     }
                 });
             });
        });
    }

    /**
     * Core logic: Simplified Hierarchy (Active vs Available)
     */
    private processResponseIntoHierarchy() {
        if (!this.response) return;

        // Group by Section > Category > Subcategory
        const sectionsMap = new Map<string, Map<string, SubCategoryRow>>();

        const processGroups = (groups: ConceptProposalGroupDto[], isActiveList: boolean) => {
            groups.forEach(group => {
                const pathParts = group.categoryName.split(' > ');
                const sectionName = group.section || (pathParts.length > 0 ? pathParts[0] : 'General');
                const categoryName = pathParts.length > 1 ? pathParts[1] : sectionName;
                const subCategoryName = pathParts.length > 2 ? pathParts[2] : (pathParts.length > 1 ? pathParts[1] : categoryName);

                if (!sectionsMap.has(sectionName)) sectionsMap.set(sectionName, new Map());
                const sectionCategories = sectionsMap.get(sectionName)!;
                const rowKey = `${categoryName}|${subCategoryName}`;

                if (!sectionCategories.has(rowKey)) {
                    sectionCategories.set(rowKey, {
                        name: subCategoryName,
                        categoryId: group.categoryId,
                        activeConcepts: [],
                        availableConcepts: [],
                        isExpanded: false,
                        activeListId: `active-${group.categoryId}`,
                        availableListId: `avail-${group.categoryId}` // One right-side list
                    });
                }
                const row = sectionCategories.get(rowKey)!;

                // Add concepts to appropriate list
                if (isActiveList) {
                    row.activeConcepts.push(...group.concepts);
                } else {
                    row.availableConcepts.push(...group.concepts);
                }
            });
        };

        processGroups(this.response.suggestedGroups, true); 
        processGroups(this.response.optionalGroups, false);

        // Build View Models
        this.methodologicalSections = [];
        this.allListIds = [];

        sectionsMap.forEach((subCatsMap, sectName) => {
             const categoriesMap = new Map<string, SubCategoryRow[]>();
             subCatsMap.forEach((row, rowKey) => {
                 const catName = rowKey.split('|')[0];
                 if (!categoriesMap.has(catName)) categoriesMap.set(catName, []);
                 
                 // Sort concepts
                 row.activeConcepts.sort((a,b) => a.concept.name.localeCompare(b.concept.name));
                 row.availableConcepts.sort((a,b) => a.concept.developmentLevel - b.concept.developmentLevel); // Sort available by level

                 if (row.activeConcepts.length > 0 || row.availableConcepts.length > 0) {
                     categoriesMap.get(catName)!.push(row);
                     this.allListIds.push(row.activeListId, row.availableListId);
                 }
             });

             const categories: CategoryGroup[] = [];
             categoriesMap.forEach((rows, catName) => {
                 if (rows.length > 0) {
                     const activeContent = rows.some(r => r.activeConcepts.length > 0);
                     // Auto-expand if has active content OR Manual Mode (since everything is 'Available' initially)
                     const isManual = this.selectedTemplateId === -1;
                     categories.push({
                         name: catName,
                         isCollapsed: isManual ? false : !activeContent,
                         hasActiveContent: activeContent,
                         subCategories: rows.sort((a, b) => a.name.localeCompare(b.name))
                     });
                 }
             });

             if (categories.length > 0) {
                 this.methodologicalSections.push({
                     name: sectName,
                     isCollapsed: false, // Default open for visibility
                     categories: categories.sort((a, b) => a.name.localeCompare(b.name))
                 });
             }
        });

        // Sort sections
        const sectionOrder = ['Ataque', 'Defensa', 'Físico', 'Psicología'];
        this.methodologicalSections.sort((a, b) => {
            const idxA = sectionOrder.indexOf(a.name);
            const idxB = sectionOrder.indexOf(b.name);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.name.localeCompare(b.name);
        });
    }

    drop(event: CdkDragDrop<ScoredConceptDto[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // Drag between Active and Available
            const targetId = event.container.id; 
            const isTargetActive = targetId.startsWith('active');
            
            const concept = event.previousContainer.data[event.previousIndex];

            if (isTargetActive) {
                // Moving to Active
                concept.tag = ConceptTag.Own;
                if (!this.initialSelectedConceptIds.includes(concept.concept.id)) {
                    this.initialSelectedConceptIds.push(concept.concept.id);
                }
            } else {
                // Moving to Available
                concept.tag = ConceptTag.Inherited;
                const idx = this.initialSelectedConceptIds.indexOf(concept.concept.id);
                if (idx !== -1) {
                    this.initialSelectedConceptIds.splice(idx, 1);
                }
            }

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }
    }

    getSelectedConceptIds(): number[] {
        const ids: number[] = [];
        this.methodologicalSections.forEach(section => {
            section.categories.forEach(category => {
                category.subCategories.forEach(sub => {
                    sub.activeConcepts.forEach(c => {
                        ids.push(c.concept.id);
                    });
                });
            });
        });
        return ids;
    }



    deleteConcept(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        const idx = row.activeConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            row.activeConcepts.splice(idx, 1);
            
            // Remove from selection state
            const selIdx = this.initialSelectedConceptIds.indexOf(conceptWrapper.concept.id);
            if (selIdx !== -1) {
                this.initialSelectedConceptIds.splice(selIdx, 1);
            }
        }
    }
}
