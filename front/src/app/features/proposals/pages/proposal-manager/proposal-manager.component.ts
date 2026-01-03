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
import { ConceptProposalResponseDto, ScoredConceptDto, ConceptTag, PlanningTemplateDto, ProposalPriority } from '../../models/proposal.models';

interface CategoryNode {
    id: number;
    name: string;
    subCategories: CategoryNode[];
    concepts?: ScoredConceptDto[];
    isExpanded?: boolean;
    hasMatches?: boolean; // For search filtering
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

    // SIMPLIFIED: Two flat lists
    selectedConcepts: ScoredConceptDto[] = [];
    availableConcepts: ScoredConceptDto[] = [];
    
    // Key: Category ID, Value: List of concepts
    availableConceptsMap: Map<number, ScoredConceptDto[]> = new Map();
    selectedConceptsMap: Map<number, ScoredConceptDto[]> = new Map();

    private seasonService: SeasonService = inject(SeasonService);

    // Modal State
    showCreateModal: boolean = false;
    newConceptName: string = '';
    newConceptCategoryId: number | null = null;
    
    // Category Tree State
    conceptCategories: any[] = []; // Full Tree Structure
    flattenedCategories: any[] = []; // Lookup
    
    // UI State
    currentCategoryId: number | null = null; // Drill-Down Navigation State
    expandedCategoryIds: Set<number> = new Set<number>();
    searchQuery: string = '';
    
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
        this.generateProposals();
    }

    loadCategories() {
        this.sportConceptService.getCategories().subscribe({
            next: (cats) => {
                this.flattenedCategories = cats; 
                this.conceptCategories = this.buildCategoryTree(cats);
                
                // Initialize expanded state for top level
                this.conceptCategories.forEach(c => this.expandedCategoryIds.add(c.id));
                
                console.log('Categories loaded and structured:', this.conceptCategories);
            },
            error: (err) => console.error('Error loading categories', err)
        });
    }

    buildCategoryTree(flatCats: any[]): any[] {
        const idMap = new Map();
        flatCats.forEach(c => {
            idMap.set(c.id, { ...c, subCategories: [] });
        });
        
        const roots: any[] = [];
        idMap.forEach(cat => {
            if (!cat.parentId) {
                roots.push(cat);
            } else {
                const parent = idMap.get(cat.parentId);
                if (parent) {
                    parent.subCategories.push(cat);
                } else {
                    roots.push(cat);
                }
            }
        });
        return roots;
    }


    // --- NAVIGATION (DRILL DOWN) ACTIONS ---

    setCurrentCategory(categoryId: number | null) {
        this.currentCategoryId = categoryId;
        if (categoryId) {
            this.expandedCategoryIds.add(categoryId);
        }
    }

    get breadcrumbs(): { id: number | null, name: string }[] {
        const crumbs: { id: number | null, name: string }[] = [{ id: null, name: 'Inicio' }];
        
        if (this.currentCategoryId !== null) {
            const path = this.findPathToCategory(this.currentCategoryId, this.conceptCategories);
            if (path) {
                path.forEach(cat => crumbs.push({ id: cat.id, name: cat.name }));
            }
        }
        return crumbs;
    }

    get navigationButtons(): any[] {
        if (this.currentCategoryId === null) {
            return this.conceptCategories;
        } else {
            const node = this.findCategoryNode(this.currentCategoryId, this.conceptCategories);
            return node && node.subCategories ? node.subCategories : [];
        }
    }

    /**
     * Finds a node by ID and returns the path (array of ancestors including self).
     */
    private findPathToCategory(targetId: number, nodes: any[]): any[] | null {
        for (const node of nodes) {
            if (node.id === targetId) {
                return [node];
            }
            if (node.subCategories) {
                const subPath = this.findPathToCategory(targetId, node.subCategories);
                if (subPath) {
                    return [node, ...subPath];
                }
            }
        }
        return null;
    }

    private findCategoryNode(id: number, nodes: any[]): any | null {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.subCategories) {
                const found = this.findCategoryNode(id, node.subCategories);
                if (found) return found;
            }
        }
        return null; // Should not happen if data consistent
    }

    // --- NESTED TREE LOGIC ---

    toggleCategory(categoryId: number, event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        if (this.expandedCategoryIds.has(categoryId)) {
            this.expandedCategoryIds.delete(categoryId);
        } else {
            this.expandedCategoryIds.add(categoryId);
        }
    }

    isExpanded(categoryId: number): boolean {
        // If searching, always expand matches
        if (this.searchQuery && this.searchQuery.trim().length > 0) {
            return true;
        }
        // Always expand the current drill-down root for clarity
        if (categoryId === this.currentCategoryId) {
            return true;
        }
        return this.expandedCategoryIds.has(categoryId);
    }

    // --- NESTED TREE LOGIC (LIBRARY) ---

    /**
     * Builds the visible tree structure for Available Concepts (Library)
     */
    get visibleTree(): CategoryNode[] {
        let roots = this.conceptCategories;
        
        if (this.currentCategoryId !== null) {
            const contextNode = this.findCategoryNode(this.currentCategoryId, this.conceptCategories);
            if (contextNode) {
                roots = [contextNode]; 
            }
        }

        const query = this.searchQuery.toLowerCase().trim();
        const nodes: CategoryNode[] = [];

        for (const root of roots) {
            const node = this.buildNode(root, query, this.availableConceptsMap);
            if (node) {
                nodes.push(node);
            }
        }

        return nodes;
    }

    // --- NESTED TREE LOGIC (SELECTED / PLAN) ---

    /**
     * Builds the visible tree structure for Selected Concepts (Planification)
     */
    get selectedTree(): CategoryNode[] {
        const nodes: CategoryNode[] = [];
        
        for (const root of this.conceptCategories) {
            const node = this.buildNode(root, '', this.selectedConceptsMap);
            if (node) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    private buildNode(category: any, query: string, conceptsMap: Map<number, ScoredConceptDto[]>): CategoryNode | null {
        // 1. Get concepts for this category from the provided map
        let concepts = conceptsMap.get(category.id) || [];
        
        // 2. Filter by query if applicable (usually for library)
        if (query) {
            concepts = concepts.filter(c => c.concept.name.toLowerCase().includes(query));
        }

        // 3. Process subcategories recursively
        const subNodes: CategoryNode[] = [];
        if (category.subCategories) {
            for (const sub of category.subCategories) {
                const subNode = this.buildNode(sub, query, conceptsMap);
                if (subNode) {
                    subNodes.push(subNode);
                }
            }
        }

        const hasConcepts = concepts.length > 0;
        const hasSubNodes = subNodes.length > 0;
        
        // If we are building the Selected Tree, we only show nodes that actually have something selected
        const isValid = query ? (hasConcepts || hasSubNodes) : (hasConcepts || hasSubNodes);

        if (isValid) {
            return {
                id: category.id,
                name: category.name,
                subCategories: subNodes,
                concepts: concepts,
                isExpanded: true // In Plan view we usually want items visible
            };
        }

        return null;
    }

    // --- TRACEABILITY & HELPERS ---
    
    getTraceabilityPath(conceptWrapper: any): string {
        const concept = conceptWrapper.concept || conceptWrapper;
        const catId = concept.conceptCategory?.id || concept.conceptCategoryId;
        if (!catId) return 'Sin Categoría';

        const pathNodes = this.findPathToCategory(catId, this.conceptCategories);
        if (pathNodes && pathNodes.length > 0) {
            return pathNodes.map(n => n.name).join(' > ');
        }

        return concept.conceptCategory?.name || 'Sin Categoría';
    }

    ngOnInit(): void {
        this.loadTeams();
        this.loadCategories(); 
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
                error: () => {
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
                    
                    if (match) {
                        this.selectedTemplateId = match.id;
                    } else {
                        this.selectedTemplateId = -1;
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
            this.processResponseIntoFlatLists();
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

        this.loading = true;

        const isManual = this.selectedTemplateId === -1;
        const templateIdToSend = isManual ? undefined : (this.selectedTemplateId ?? undefined);

        const currentSeason = this.seasonService.currentSeason();
        if (!currentSeason) {
            console.error('No hay temporada seleccionada');
            this.loading = false;
            return;
        }

        const validConceptIds = this.initialSelectedConceptIds.filter(id => id > 0);

        const payload = {
            teamId: this.selectedTeamId,
            seasonId: currentSeason.id,
            levelOffset: this.currentLevelOffset,
            planningTemplateId: templateIdToSend,
            includeConceptIds: validConceptIds,
            skipLevelFilter: true
        };
        
        console.log('Sending payload:', payload);

        this.proposalsService.generateProposals(payload).subscribe({
            next: (res) => {
                this.response = res;
                this.processResponseIntoFlatLists();
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

    private processResponseIntoFlatLists() {
        if (!this.response) return;

        // Flatten all concepts from suggested groups (LEFT)
        const suggested = this.response.suggestedGroups.flatMap(g => g.concepts);
        
        // Flatten all concepts from optional groups (RIGHT)
        const optional = this.response.optionalGroups.flatMap(g => g.concepts);

        // Sort by category name 
        this.selectedConcepts = suggested.sort((a, b) => 
            (a.concept.conceptCategory?.name || '').localeCompare(b.concept.conceptCategory?.name || '')
        );
        
        this.availableConcepts = optional.sort((a, b) => 
            (a.concept.conceptCategory?.name || '').localeCompare(b.concept.conceptCategory?.name || '')
        );
        
        this.buildConceptsMaps();
    }

    private buildConceptsMaps() {
        this.availableConceptsMap.clear();
        this.availableConcepts.forEach(c => {
            const catId = c.concept.conceptCategory?.id || c.concept.conceptCategoryId;
            if (catId) {
                if (!this.availableConceptsMap.has(catId)) {
                    this.availableConceptsMap.set(catId, []);
                }
                this.availableConceptsMap.get(catId)!.push(c);
            }
        });

        this.selectedConceptsMap.clear();
        this.selectedConcepts.forEach(c => {
            const catId = c.concept.conceptCategory?.id || c.concept.conceptCategoryId;
            if (catId) {
                if (!this.selectedConceptsMap.has(catId)) {
                    this.selectedConceptsMap.set(catId, []);
                }
                this.selectedConceptsMap.get(catId)!.push(c);
            }
        });
    }

    // --- DRAG & DROP ---
    drop(event: CdkDragDrop<ScoredConceptDto[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const concept = event.previousContainer.data[event.previousIndex];
            const targetId = event.container.id;
            const isTargetSelected = targetId === 'selected-list';

            if (isTargetSelected) {
                concept.tag = ConceptTag.Own;
                if (!this.initialSelectedConceptIds.includes(concept.concept.id)) {
                    this.initialSelectedConceptIds.push(concept.concept.id);
                }
            } else {
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
        
        // Rebuild maps logic
        this.buildConceptsMaps(); 
    }

    // --- MOVEMENT ACTIONS ---
    moveToSelected(conceptWrapper: ScoredConceptDto) {
        const idx = this.availableConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            this.availableConcepts.splice(idx, 1);
            conceptWrapper.tag = ConceptTag.Own;
            this.selectedConcepts = [...this.selectedConcepts, conceptWrapper];
            
            if (!this.initialSelectedConceptIds.includes(conceptWrapper.concept.id)) {
                this.initialSelectedConceptIds.push(conceptWrapper.concept.id);
            }
            
            this.buildConceptsMaps();
        }
    }

    moveToAvailable(conceptWrapper: ScoredConceptDto) {
        const idx = this.selectedConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            this.selectedConcepts.splice(idx, 1);
            conceptWrapper.tag = ConceptTag.Inherited;
            this.availableConcepts = [...this.availableConcepts, conceptWrapper];
            
            const selIdx = this.initialSelectedConceptIds.indexOf(conceptWrapper.concept.id);
            if (selIdx !== -1) {
                this.initialSelectedConceptIds.splice(selIdx, 1);
            }
            
            this.buildConceptsMaps();
        }
    }

    getSelectedConceptIds(): number[] {
        return this.selectedConcepts.map(c => c.concept.id);
    }

    deleteConcept(conceptWrapper: ScoredConceptDto) {
        const idx = this.selectedConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            this.selectedConcepts.splice(idx, 1);
            
            const selIdx = this.initialSelectedConceptIds.indexOf(conceptWrapper.concept.id);
            if (selIdx !== -1) {
                this.initialSelectedConceptIds.splice(selIdx, 1);
            }
        }
    }

    // --- UI HELPERS ---
    get selectedByCategory(): { category: string; concepts: ScoredConceptDto[] }[] {
        const groups = new Map<string, ScoredConceptDto[]>();
        
        this.selectedConcepts.forEach(c => {
            const path = this.getTraceabilityPath(c);
            if (!groups.has(path)) {
                groups.set(path, []);
            }
            groups.get(path)!.push(c);
        });

        return Array.from(groups.entries())
            .map(([category, concepts]) => ({ category, concepts }))
            .sort((a, b) => a.category.localeCompare(b.category));
    }
}
