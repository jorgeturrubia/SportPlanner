import { Component, Input, OnChanges, SimpleChanges, OnInit, inject } from '@angular/core';
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
    immediatePrevConcepts: ScoredConceptDto[];
    immediateNextConcepts: ScoredConceptDto[];
    distantPastConcepts: ScoredConceptDto[];
    distantFutureConcepts: ScoredConceptDto[];
    isExpanded: boolean;
    showAllLevels: boolean;
    isPrevExpanded: boolean;
    isNextExpanded: boolean;
    activeListId: string;
    prevListId: string;
    nextListId: string;
    distantListId: string;
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
    imports: [CommonModule, FormsModule, DragDropModule, TemplateTunerComponent, ConceptCreatorComponent],
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
        console.trace('closeCreateConceptModal called');
        this.showCreateModal = false;
    }

    handleConceptCreated(newConcept: any) {
        // Did not close modal to allow rapid/bulk creation
        console.log('handleConceptCreated triggered', newConcept);
        if (newConcept) {
            this.initialSelectedConceptIds.push(newConcept.id);
        }
        this.generateProposals(newConcept);
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
        if (!this.newConceptName || !this.newConceptCategoryId) return;

        this.isCreating = true;
        const newConceptPayload = {
            name: this.newConceptName,
            conceptCategoryId: this.newConceptCategoryId,
            technicalDifficulty: 1,
            tacticalComplexity: 1
        };

        this.sportConceptService.create(newConceptPayload).subscribe({
            next: (concept) => {
                this.isCreating = false;
                this.closeCreateConceptModal();
                
                if (this.response) {
                    this.initialSelectedConceptIds.push(concept.id);
                    this.generateProposals(concept); 
                }
            },
            error: (err) => {
                console.error('Error creating concept', err);
                this.isCreating = false;
            }
        });
    }

    ngOnInit(): void {
        this.loadTeams();
    }



    private loadTeams() {
        this.teamsService.getMyTeams().subscribe({
            next: (res) => {
                this.teams = res;
                // If we have a selectedTeamId but it wasn't processed in ngOnChanges because teams were empty
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
                    // Temporarily add to list and process
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
        // Broad search for sportId in the team object
        let sportId = team.sportId ||
            team.sport?.id ||
            team.teamCategory?.sportId ||
            team.teamCategory?.sport?.id;

        if (!sportId) {
            this.subscriptionsService.getMySubscriptions().subscribe({
                next: (subs) => {
                    const activeSub = subs.find(s => s.isActive);
                    if (activeSub) {
                        this.fetchTemplates(activeSub.sportId, team);
                    } else if (subs.length > 0) {
                        this.fetchTemplates(subs[0].sportId, team);
                    } else {
                        console.error('ProposalManager: No subscriptions found to determine sportId');
                        this.generateProposals();
                    }
                },
                error: (err) => {
                    console.error('ProposalManager: Error fetching subscriptions', err);
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
                     // No templates: Force Custom/Manual mode
                     this.selectedTemplateId = -1;
                     this.defaultTemplateName = 'Sin Plantilla';
                } else {
                    // Determine default template name
                    const categoryName = team.teamCategory?.name || '';
                    const expectedLevel = this.calculateTargetLevel(categoryName);

                    // Try to find exact match or partial match
                    const match = this.templates.find(i => i.name === categoryName)
                        || this.templates.find(i => i.level === expectedLevel);

                    this.defaultTemplateName = match ? match.name : categoryName;

                    // Only set selectedTemplateId if not already set (to preserve user selection or edit mode)
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

        // If initialSelectedConceptIds changes, we need to regenerate to ensure we fetch forced concepts that might have been filtered out
        if (changes['initialSelectedConceptIds'] && !changes['initialSelectedConceptIds'].firstChange) {
            this.generateProposals();
        }

        if (changes['selectedTeamId'] && this.selectedTeamId) {
            // We call processSelectedTeam directly. It will fetch the team if not in the list.
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

    private calculateTargetLevel(categoryName: string): number {
        const n = categoryName.toLowerCase();
        if (n.includes('mini') || n.includes('escuela') || n.includes('u8') || n.includes('u6')) return 1;
        if (n.includes('u10') || n.includes('pre')) return 2;
        if (n.includes('u12') || n.includes('ale')) return 3;
        if (n.includes('u14') || n.includes('inf')) return 4;
        if (n.includes('u16') || n.includes('cad')) return 5;
        if (n.includes('u18') || n.includes('jun') || n.includes('sen')) return 6;
        return 3; // Default
    }

    generateProposals(forceIncludeConcept?: any) {
        console.log('--- GENERATE PROPOSALS START ---');
        console.log('Selected Team ID:', this.selectedTeamId);
        console.log('Selected Template ID:', this.selectedTemplateId);
        console.log('Initial Selected Concept IDs:', this.initialSelectedConceptIds);

        if (!this.selectedTeamId) {
            console.warn('No team selected, aborting.');
            return;
        }

        this.loading = true;
        this.response = null;
        this.methodologicalSections = [];
        this.allListIds = [];

        // If -1 (Manual), we send undefined to get defaults, then clear suggestions locally
        // Or send active template ID if standard
        const templateIdToSend = (this.selectedTemplateId === -1) ? undefined : (this.selectedTemplateId ?? undefined);

        const payload = {
            teamId: this.selectedTeamId,
            levelOffset: this.currentLevelOffset,
            planningTemplateId: templateIdToSend,
            includeConceptIds: this.initialSelectedConceptIds,
            skipLevelFilter: this.selectedTemplateId === -1
        };
        console.log('Sending payload to service:', payload);

        this.proposalsService.generateProposals(payload).subscribe({
            next: (res) => {
                console.log('Response received from service:', res);
                this.response = res;

                // Handle "Sin plantilla" (Manual Mode)
                if (this.selectedTemplateId === -1 && this.response) {
                    console.log('Manual Mode detected (-1). Moving suggested groups to optional.');
                    // Move all suggested groups to optional groups to make them available but not "suggested"
                    this.response.optionalGroups = [
                        ...this.response.optionalGroups,
                        ...this.response.suggestedGroups
                    ];
                    this.response.suggestedGroups = [];
                }

                console.log('Final Response Structure (before hierarchy):', {
                   suggested: this.response?.suggestedGroups?.length,
                   optional: this.response?.optionalGroups?.length
                });

                // INJECTION LOGIC: If we just created a concept, ensure it exists in the response
                if (forceIncludeConcept && this.response) {
                    this.ensureConceptInResponse(this.response, forceIncludeConcept);
                }

                this.processResponseIntoHierarchy();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error generating proposals', err);
                this.loading = false;
            }
        });
    }

    onLevelOffsetChange(newOffset: number) {
        this.currentLevelOffset = newOffset;
        this.generateProposals();
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

    toggleShowAllLevels(row: SubCategoryRow) {
        row.showAllLevels = !row.showAllLevels;
    }

    togglePrev(row: SubCategoryRow) {
        row.isPrevExpanded = !row.isPrevExpanded;
    }

    toggleNext(row: SubCategoryRow) {
        row.isNextExpanded = !row.isNextExpanded;
    }

    getVisibleFutureConcepts(row: SubCategoryRow): ScoredConceptDto[] {
        // This method is now deprecated or needs re-evaluation based on new buckets
        // For now, returning empty or adapting to new structure
        return [];
    }

    getVisiblePastConcepts(row: SubCategoryRow): ScoredConceptDto[] {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return [];
    }

    hasHiddenFutureConcepts(row: SubCategoryRow): boolean {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return false;
    }

    hasHiddenPastConcepts(row: SubCategoryRow): boolean {
        // This method is now deprecated or needs re-evaluation based on new buckets
        return false;
    }

    // --- MOVEMENT LOGIC (Click-based) ---

    moveToActive(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // 1. Remove from source bucket
        this.removeFromContext(row, conceptWrapper);

        // 2. Update Tag
        conceptWrapper.tag = ConceptTag.Own;

        // 3. Add to Active
        row.activeConcepts.push(conceptWrapper);
    }

    moveToContext(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        // 1. Remove from Active
        const idx = row.activeConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            row.activeConcepts.splice(idx, 1);
        }

        // 2. Determine Destination & Tag properties
        // We use the first concept of immediate lists to guess the "window" levels
        // But simpler logic: 
        // If level > currentLevel -> Future (Aspirational)
        // If level <= currentLevel -> Past (Reinforcement/Inherited)

        // Note: Ideally we compare against the 'template level', but strictly:
        // Future = Tag.Aspirational
        // Past = Tag.Inherited (or Reinforcement)

        // Let's rely on the concept level vs "active" logic. 
        // For simplicity, we can revert to original logic or just check level.

        // Heuristic: If it was in "Next" before, it should go back to "Next".
        // Generally, higher level = Future.

        // We need to re-evaluate where it belongs.
        // Let's use a helper to place it back.
        this.placeInContext(row, conceptWrapper);
    }

    private removeFromContext(row: SubCategoryRow, concept: ScoredConceptDto) {
        // Try removing from all possible context buckets
        let idx = row.immediatePrevConcepts.indexOf(concept);
        if (idx !== -1) { row.immediatePrevConcepts.splice(idx, 1); return; }

        idx = row.immediateNextConcepts.indexOf(concept);
        if (idx !== -1) { row.immediateNextConcepts.splice(idx, 1); return; }

        idx = row.distantFutureConcepts.indexOf(concept);
        if (idx !== -1) { row.distantFutureConcepts.splice(idx, 1); return; }

        idx = row.distantPastConcepts.indexOf(concept);
        if (idx !== -1) { row.distantPastConcepts.splice(idx, 1); return; }
    }

    private placeInContext(row: SubCategoryRow, conceptWrapper: ScoredConceptDto) {
        const level = conceptWrapper.concept.developmentLevel;

        // Identify "Next Level" value from existing list if possible, or just assume higher level is 'Reto'
        // Simpler approach: Re-run the split logic or just simple insertion?
        // Let's try to match existing buckets first.

        const prevLevel = row.immediatePrevConcepts.length > 0 ? row.immediatePrevConcepts[0].concept.developmentLevel : -1;
        const nextLevel = row.immediateNextConcepts.length > 0 ? row.immediateNextConcepts[0].concept.developmentLevel : 999;

        if (level === nextLevel) {
            conceptWrapper.tag = ConceptTag.Aspirational;
            row.immediateNextConcepts.push(conceptWrapper);
            row.immediateNextConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
        } else if (level === prevLevel) {
            conceptWrapper.tag = ConceptTag.Inherited; // or Reinforcement
            row.immediatePrevConcepts.push(conceptWrapper);
            row.immediatePrevConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
        } else if (level > nextLevel) {
            conceptWrapper.tag = ConceptTag.Aspirational;
            row.distantFutureConcepts.push(conceptWrapper);
            row.distantFutureConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
        } else {
            // level < prevLevel or fallback
            conceptWrapper.tag = ConceptTag.Inherited;
            row.distantPastConcepts.push(conceptWrapper);
            row.distantPastConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
        }
    }

    private ensureConceptInResponse(response: ConceptProposalResponseDto, concept: any) {
        // 1. Check if it already exists
        const allGroups = [...response.suggestedGroups, ...response.optionalGroups];
        let found = false;
        
        for (const group of allGroups) {
            if (group.concepts.some(c => c.concept.id === concept.id)) {
                found = true;
                break;
            }
        }

        if (found) return;

        // 2. Not found, we must inject it
        // Find suitable group by Category ID
        let targetGroup = allGroups.find(g => g.categoryId === concept.conceptCategoryId);

        if (!targetGroup) {
            // Need to create a new group?
            // If the category is totally missing from response, we need to fetch category details to make a nice group name?
            // For now, let's try to infer or just add it to a generic group if absolutely necessary, 
            // BUT usually categories exist if we just selected it from the tree.
            
            // If we don't have the group, checking 'flattenedCategories' might help get the name
            const catInfo = this.flattenedCategories.find(c => c.id === concept.conceptCategoryId);
            const catName = catInfo ? catInfo.name : 'Nueva Categoría';
             // We don't have full path here easily unless we traverse tree, but name is okay.

            targetGroup = {
                categoryName: catName,
                categoryId: concept.conceptCategoryId,
                section: 'General', // Fallback
                concepts: []
            };
            // Add to optional groups
            response.optionalGroups.push(targetGroup);
        }

        // 3. Add concept to the group
        targetGroup.concepts.push({
            concept: concept,
            score: 100,
            scoreReason: 'Recién creado',
            priority: ProposalPriority.Essential,
            tag: ConceptTag.Own
        });
    }

    /**
     * Core logic: Transforms flat proposal groups into a distinct 
     * Section > Category > Subcategory hierarchy
     */
    private processResponseIntoHierarchy() {
        if (!this.response) return;

        const allGroups = [...this.response.suggestedGroups, ...this.response.optionalGroups];
        const sectionsMap = new Map<string, Map<string, SubCategoryRow>>();

        // 1. Iterate all groups to build the structure
        allGroups.forEach(group => {
            // Unpack hierarchy from categoryName string (e.g., "Ataque > Técnica Individual > Finalizaciones")
            const pathParts = group.categoryName.split(' > ');

            // Heuristic for Hierarchy:
            // Section: explicitly on group.section OR 1st part of path
            const sectionName = group.section || (pathParts.length > 0 ? pathParts[0] : 'General');

            // Category: 2nd part OR Section if missing
            const categoryName = pathParts.length > 1 ? pathParts[1] : sectionName;

            // Subcategory: 3rd part OR Category if missing
            // If the group has displaySubCategoryName set by backend logic (unlikely if strictly string), we use path
            const subCategoryName = pathParts.length > 2 ? pathParts[2] : (pathParts.length > 1 ? pathParts[1] : categoryName);

            // --- Ensure Section Exists ---
            if (!sectionsMap.has(sectionName)) {
                sectionsMap.set(sectionName, new Map<string, SubCategoryRow>());
            }
            const sectionCategories = sectionsMap.get(sectionName)!;

            // --- Ensure Subcategory Row Exists ---
            // Key by subCategoryName + Category to avoid collisions across categories
            const rowKey = `${categoryName}|${subCategoryName}`;

            if (!sectionCategories.has(rowKey)) {
                sectionCategories.set(rowKey, {
                    name: subCategoryName,
                    categoryId: group.categoryId,
                    activeConcepts: [],

                    immediatePrevConcepts: [],
                    immediateNextConcepts: [],
                    distantPastConcepts: [],
                    distantFutureConcepts: [],

                    isExpanded: false, // Default collapsed view
                    showAllLevels: false, // Default to not showing all distant levels
                    isPrevExpanded: false,
                    isNextExpanded: false,

                    activeListId: `active-${group.categoryId}`,
                    prevListId: `prev-${group.categoryId}`,
                    nextListId: `next-${group.categoryId}`,
                    distantListId: `dist-${group.categoryId}` // Shared for both distant past/future if needed, or just logically grouped
                });
            }

            const row = sectionCategories.get(rowKey)!;

            // --- Distribute Concepts by Tag Initial Sweep ---
            // Temporarily store all future in distantFutureConcepts and all past in distantPastConcepts
            // These will be split into immediate/distant later.
            group.concepts.forEach(concept => {
                // If it's in initialSelectedConceptIds, force it to Active/Own
                if (this.initialSelectedConceptIds.includes(concept.concept.id)) {
                    concept.tag = ConceptTag.Own;
                }

                if (concept.tag === ConceptTag.Own) {
                    row.activeConcepts.push(concept);
                } else if (concept.tag === ConceptTag.Aspirational) {
                    // Temporarily store all future in distantFuture
                    row.distantFutureConcepts.push(concept);
                } else {
                    // Inherited (2) or Reinforcement (3)
                    // Temporarily store all past in distantPast
                    row.distantPastConcepts.push(concept);
                }
            });
        });

        // 2. Finalize Buckets (Split logic) & Convert to Array
        this.methodologicalSections = [];
        this.allListIds = [];

        sectionsMap.forEach((subCatsMap, sectName) => {
            // Group subcategories by their parent Category
            const categoriesMap = new Map<string, SubCategoryRow[]>();

            subCatsMap.forEach((row, rowKey) => {
                // --- SPLIT LOGIC ---

                // 1. Sort Future (Ascending Level)
                row.distantFutureConcepts.sort((a, b) => a.concept.developmentLevel - b.concept.developmentLevel);
                // 2. Identify "Next Level"
                // It's the lowest level present in Future list.
                if (row.distantFutureConcepts.length > 0) {
                    const nextLevel = row.distantFutureConcepts[0].concept.developmentLevel;
                    // Move all of this level to immediateNext
                    const nextCs = row.distantFutureConcepts.filter(c => c.concept.developmentLevel === nextLevel);
                    const distantCs = row.distantFutureConcepts.filter(c => c.concept.developmentLevel !== nextLevel);

                    row.immediateNextConcepts = nextCs;
                    row.distantFutureConcepts = distantCs;
                }

                // 3. Sort Past (Descending Level) - closest to current
                row.distantPastConcepts.sort((a, b) => b.concept.developmentLevel - a.concept.developmentLevel);
                // 4. Identify "Prev Level"
                // It's the highest level present in Past list.
                if (row.distantPastConcepts.length > 0) {
                    const prevLevel = row.distantPastConcepts[0].concept.developmentLevel;
                    // Move all of this level to immediatePrev
                    const prevCs = row.distantPastConcepts.filter(c => c.concept.developmentLevel === prevLevel);
                    const distantCs = row.distantPastConcepts.filter(c => c.concept.developmentLevel !== prevLevel);

                    row.immediatePrevConcepts = prevCs;
                    row.distantPastConcepts = distantCs;
                }
                // -------------------

                const catName = rowKey.split('|')[0];
                if (!categoriesMap.has(catName)) {
                    categoriesMap.set(catName, []);
                }

                // Only add row if it has content in at least one bucket
                const hasContent = row.activeConcepts.length > 0
                    || row.immediateNextConcepts.length > 0
                    || row.immediatePrevConcepts.length > 0
                    || row.distantFutureConcepts.length > 0
                    || row.distantPastConcepts.length > 0;

                if (hasContent) {
                    categoriesMap.get(catName)!.push(row);
                    // Collect IDs for drag & drop connections
                    this.allListIds.push(row.activeListId, row.prevListId, row.nextListId, row.distantListId);

                    // --- Manual Mode UI Polish ---
                    if (this.selectedTemplateId === -1) {
                        row.isPrevExpanded = row.immediatePrevConcepts.length > 0;
                        row.isNextExpanded = row.immediateNextConcepts.length > 0;
                        row.showAllLevels = row.distantFutureConcepts.length > 0 || row.distantPastConcepts.length > 0;
                    }
                }
            });

            const categories: CategoryGroup[] = [];
            categoriesMap.forEach((rows, catName) => {
                if (rows.length > 0) {
                    const activeContent = rows.some(r => r.activeConcepts.length > 0);
                    const isManual = this.selectedTemplateId === -1;
                    
                    categories.push({
                        name: catName,
                        isCollapsed: isManual ? false : !activeContent, // Auto-expand if has active content OR Manual Mode
                        hasActiveContent: activeContent,
                        subCategories: rows.sort((a, b) => a.name.localeCompare(b.name))
                    });
                }
            });

            if (categories.length > 0) {
                const isManual = this.selectedTemplateId === -1;
                this.methodologicalSections.push({
                    name: sectName,
                    isCollapsed: isManual ? false : true, // Auto-expand sections in Manual Mode
                    categories: categories.sort((a, b) => a.name.localeCompare(b.name)) // Simple sort for now
                });
            }
        });

        // Sort sections (Specific sorting preference: Ataque, Defensa, Físico...)
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

    /**
     * Handle drag & drop events strictly within permissible logic
     */
    drop(event: CdkDragDrop<ScoredConceptDto[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            // --- Logic for moving between pools (Active / Immediate / Distant) ---
            const targetId = event.container.id; // active-101, prev-101, next-101, dist-101
            // Extract type from ID (e.g., "active-102" -> "active")
            const targetType = targetId.split('-')[0];

            // Deep validation could go here (check if section matches, etc.)
            // But visually user can only drag to connected lists.

            const concept = event.previousContainer.data[event.previousIndex];

            // Update tag immediately for UI feedback
            if (targetType === 'active') {
                concept.tag = ConceptTag.Own;
            } else if (targetType === 'next') {
                concept.tag = ConceptTag.Aspirational;
            } else if (targetType === 'prev') {
                concept.tag = ConceptTag.Inherited; // Simplified
            } else if (targetType === 'dist') {
                // If conceptual level > current => Future, else Past?
                // Ideally we drag to specific buckets. 
                // For "distant", we need to know if it goes to distantFuture or distantPast?
                // If the user drops in "Distant", we'll just assign based on level relative to what?
                // Or simpler: Dropping to "Distant" isn't a primary action. 
                // Primary is Active <-> Next/Prev.

                // Logic:
                if (concept.tag === ConceptTag.Own) {
                    // Leaving Active -> determine based on bucket?
                    // If dropped in "dist", maybe default to Inherited if level < current, else Aspirational?
                    // Just rely on the container.
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
                    sub.activeConcepts.forEach(c => ids.push(c.concept.id));
                });
            });
        });
        return ids;
    }
}
