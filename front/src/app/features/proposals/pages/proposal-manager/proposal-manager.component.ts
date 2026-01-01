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

    /**
     * SIMPLIFIED: Process backend response into two flat lists
     * - selectedConcepts (LEFT): Template concepts / manually selected
     * - availableConcepts (RIGHT): The rest
     */
    private processResponseIntoFlatLists() {
        if (!this.response) return;

        // Flatten all concepts from suggested groups (LEFT)
        const suggested = this.response.suggestedGroups.flatMap(g => g.concepts);
        
        // Flatten all concepts from optional groups (RIGHT)
        const optional = this.response.optionalGroups.flatMap(g => g.concepts);

        // Sort by category name for easier browsing
        this.selectedConcepts = suggested.sort((a, b) => 
            (a.concept.conceptCategory?.name || '').localeCompare(b.concept.conceptCategory?.name || '')
        );
        
        this.availableConcepts = optional.sort((a, b) => 
            (a.concept.conceptCategory?.name || '').localeCompare(b.concept.conceptCategory?.name || '')
        );
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
    }

    // --- MOVEMENT ACTIONS ---
    moveToSelected(conceptWrapper: ScoredConceptDto) {
        const idx = this.availableConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            this.availableConcepts.splice(idx, 1);
            conceptWrapper.tag = ConceptTag.Own;
            this.selectedConcepts.push(conceptWrapper);
            
            if (!this.initialSelectedConceptIds.includes(conceptWrapper.concept.id)) {
                this.initialSelectedConceptIds.push(conceptWrapper.concept.id);
            }
        }
    }

    moveToAvailable(conceptWrapper: ScoredConceptDto) {
        const idx = this.selectedConcepts.indexOf(conceptWrapper);
        if (idx !== -1) {
            this.selectedConcepts.splice(idx, 1);
            conceptWrapper.tag = ConceptTag.Inherited;
            this.availableConcepts.push(conceptWrapper);
            
            const selIdx = this.initialSelectedConceptIds.indexOf(conceptWrapper.concept.id);
            if (selIdx !== -1) {
                this.initialSelectedConceptIds.splice(selIdx, 1);
            }
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

    // Helper to group selected concepts by category for display
    get selectedByCategory(): { category: string; concepts: ScoredConceptDto[] }[] {
        const groups = new Map<string, ScoredConceptDto[]>();
        
        this.selectedConcepts.forEach(c => {
            const catName = c.concept.conceptCategory?.name || 'Sin Categoría';
            if (!groups.has(catName)) {
                groups.set(catName, []);
            }
            groups.get(catName)!.push(c);
        });

        return Array.from(groups.entries())
            .map(([category, concepts]) => ({ category, concepts }))
            .sort((a, b) => a.category.localeCompare(b.category));
    }

    // Helper to group available concepts by category for display
    get availableByCategory(): { category: string; concepts: ScoredConceptDto[] }[] {
        const groups = new Map<string, ScoredConceptDto[]>();
        
        this.availableConcepts.forEach(c => {
            const catName = c.concept.conceptCategory?.name || 'Sin Categoría';
            if (!groups.has(catName)) {
                groups.set(catName, []);
            }
            groups.get(catName)!.push(c);
        });

        return Array.from(groups.entries())
            .map(([category, concepts]) => ({ category, concepts }))
            .sort((a, b) => a.category.localeCompare(b.category));
    }
}
