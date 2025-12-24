import { Component, OnInit, signal, inject, computed, effect, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { Overlay, OverlayRef, OverlayModule } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { TrainingSessionService } from '../../../../../services/training-session.service';
import { ExerciseService } from '../../../../../services/exercise.service';
import { PlanningService } from '../../../../../services/planning.service';
import { SportConceptsService } from '../../../../../services/sport-concepts.service';
import { TrainingSession, CreateTrainingSessionDto } from '../../../../../core/models/training-session.model';
import { Exercise } from '../../../../../core/models/exercise.model';
import { Planning, SportConcept, ConceptCategory } from '../../../../../core/models/planning.model';

interface TrainingConceptViewModel {
    id: number; // conceptId
    name: string;
    description?: string;
    categoryName?: string;
    exercises: TrainingExerciseViewModel[];
    isOpen: boolean; // For accordion
    isEditing?: boolean;
    editName?: string;
    editDescription?: string;
    durationMinutes?: number;
}

interface TrainingExerciseViewModel {
    id?: number; // trainingExerciseId
    exerciseId?: number;
    exerciseName?: string;
    customText?: string;
    durationMinutes: number;
}

@Component({
    selector: 'app-training-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, TranslateModule, DragDropModule, OverlayModule],
    templateUrl: './training-detail.component.html'
})
export class TrainingDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private sessionService = inject(TrainingSessionService);
    private exerciseService = inject(ExerciseService);
    private planningService = inject(PlanningService);
    private conceptService = inject(SportConceptsService);
    private overlay = inject(Overlay);
    private viewContainerRef = inject(ViewContainerRef);

    isEdit = signal(false);
    loading = signal(false);
    saving = signal(false);
    trainingId = signal<number | null>(null);
    teamId = signal<number | null>(null);
    planningId = signal<number | null>(null);

    // Form Data
    name = signal('');
    date = signal(new Date().toISOString().split('T')[0]);
    startTime = signal('18:00');
    quickConceptName = signal('');


    // Concept-Centric Data
    trainingConcepts = signal<TrainingConceptViewModel[]>([]);

    totalDuration = computed(() => {
        let minutes = 0;
        this.trainingConcepts().forEach(tc => {
            // If concept has explicit duration, use it. Otherwise use sum of exercises or default.
            // Requirement says sum well even if customized.
            // If user sets 8 mins for concept, that's what we count.
            minutes += (tc.durationMinutes || 0);
        });
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
    });

    // Planning Data for Modal
    activePlanning = signal<Planning | null>(null);
    availableConcepts = signal<SportConcept[]>([]);

    // Modal References
    @ViewChild('conceptModalTemplate') conceptModalTemplate!: TemplateRef<any>;
    @ViewChild('libraryModalTemplate') libraryModalTemplate!: TemplateRef<any>;
    private conceptOverlayRef?: OverlayRef;
    private libraryOverlayRef?: OverlayRef;

    // Library State
    currentConceptIdForLibrary = signal<number | null>(null);
    libraryExercises = signal<Exercise[]>([]);

    // Deep Hierarchical Filter Logic
    currentCategoryNode = signal<ConceptCategory | null>(null);
    categoryPath = signal<ConceptCategory[]>([]); // For breadcrumbs / back nav

    // Compute concepts that belong to the current category level (and its descendants)
    filteredConcepts = computed(() => {
        const currentNode = this.currentCategoryNode();
        const allConcepts = this.availableConcepts();

        if (!currentNode) {
            // Root level: Show all concepts? Or only when we drill down? 
            // User wants "Concepts of that choice" -> implies show concepts at leaf or intermediate
            // If at root (null), maybe show all or none. Let's show all for "Quick Add" search if needed, but UI implies category nav first.
            // For now, if root, show ALL concepts mixed (or maybe just those with NO category).
            return allConcepts;
        }

        // Recursive check: Concept matches if its category path includes currentNode
        const matches = allConcepts.filter(c => this.isConceptInDescendants(c, currentNode.id));

        // Sort by Category Name (Grouping) then by Concept Name
        return matches.sort((a, b) => {
            const catA = a.conceptCategory?.name || '';
            const catB = b.conceptCategory?.name || '';

            if (catA !== catB) {
                return catA.localeCompare(catB);
            }
            if (catA !== catB) {
                return catA.localeCompare(catB);
            }
            return a.name.localeCompare(b.name);
        });
    });

    // Compute grouped concepts for display
    groupedConcepts = computed(() => {
        const concepts = this.filteredConcepts();
        const groups = new Map<string, SportConcept[]>();

        concepts.forEach(c => {
            const catName = c.conceptCategory?.name || 'Otros';
            if (!groups.has(catName)) {
                groups.set(catName, []);
            }
            groups.get(catName)!.push(c);
        });

        // Convert to array and sort by category name
        return Array.from(groups.entries())
            .map(([name, items]) => ({ name, items }))
            .sort((a, b) => {
                if (a.name === 'Otros') return 1; // Otros at bottom
                if (b.name === 'Otros') return -1;
                return a.name.localeCompare(b.name);
            });
    });

    // Compute categories to display as "Buttons" (children of current node)
    visibleCategories = computed(() => {
        const currentNode = this.currentCategoryNode();
        const concepts = this.availableConcepts();

        // We need to build the tree from the concepts available (so we don't show empty categories)
        // Set of reachable categories from current level
        const relevantCategories = new Map<number, ConceptCategory>();

        console.log('Computing visible categories for node:', currentNode?.name);

        concepts.forEach(c => {
            if (!c.conceptCategory) return;

            // Logic to find immediate child...
            const immediateChild = this.findImmediateChildOf(c.conceptCategory, currentNode ? currentNode.id : null);
            if (immediateChild) {
                relevantCategories.set(immediateChild.id, immediateChild);
            }
        });

        return Array.from(relevantCategories.values()).sort((a, b) => a.name.localeCompare(b.name));
    });

    private isConceptInDescendants(concept: SportConcept, targetCatId: number): boolean {
        let cat = concept.conceptCategory;
        while (cat) {
            if (cat.id === targetCatId) return true;
            cat = cat.parent;
        }
        return false;
    }

    private findImmediateChildOf(leafCategory: ConceptCategory, parentId: number | null): ConceptCategory | null {
        // Traverse up until we find a category whose parent.id === parentId (or parent is null if parentId is null)
        let current: ConceptCategory | undefined = leafCategory;
        while (current) {
            if ((current.parentId || null) === parentId) return current;
            // Also handle object reference if ids missing? No, should rely on IDs.
            // If parentId is null (Root), we want the category with parentId == null.
            current = current.parent;
        }

        // Fallback: If traversing down from root? No, better traverse up.
        // Wait, if linked list goes up (child -> parent), we can map path.
        // Path: [Grandparent, Parent, Child]
        // If parentId is null, we return Grandparent.
        // If parentId is Grandparent.id, we return Parent.

        const path = this.getCategoryPath(leafCategory);

        if (parentId === null) {
            return path[0]; // Top level
        }

        const parentIndex = path.findIndex(c => c.id === parentId);
        if (parentIndex !== -1 && parentIndex + 1 < path.length) {
            return path[parentIndex + 1];
        }

        return null;
    }

    private getCategoryPath(category: ConceptCategory): ConceptCategory[] {
        const path: ConceptCategory[] = [];
        let curr: ConceptCategory | undefined = category;
        while (curr) {
            path.unshift(curr);
            curr = curr.parent;
        }
        return path;
    }

    constructor() {
        effect(() => {
            // Auto-calculate name if empty and we have team/date
            if (!this.isEdit() && !this.name() && this.teamId()) {
                // Logic to get team name would require team signal, skipping for now or fetching 
                // We can set a default "Entrenamiento - [Date]"
                this.name.set(`Sesión ${this.date()}`);
            }
        });
    }

    async ngOnInit() {
        const id = this.route.snapshot.params['id'];
        const teamIdParam = this.route.snapshot.queryParamMap.get('teamId');

        if (id && id !== 'new') {
            this.isEdit.set(true);
            this.trainingId.set(+id);
            this.loadTraining(+id);
        } else if (teamIdParam) {
            this.teamId.set(+teamIdParam);
            const dateParam = this.route.snapshot.queryParamMap.get('date');
            if (dateParam) {
                this.date.set(dateParam.split('T')[0]);
            }
            const planningIdParam = this.route.snapshot.queryParamMap.get('planningId');
            if (planningIdParam) {
                this.planningId.set(+planningIdParam);
            }
            this.loadTeamPlanning(+teamIdParam);
        }
    }

    // ... (rest of loadTraining and loadTeamPlanning remains same, check unchanged parts)

    async loadTraining(id: number) {
        this.loading.set(true);
        this.sessionService.getById(id).subscribe(data => {
            this.teamId.set(data.teamId);
            this.name.set(data.name || '');
            this.date.set(data.date.split('T')[0]);
            this.startTime.set(data.startTime?.toString().substring(0, 5) || '18:00');

            const viewModels: TrainingConceptViewModel[] = [];
            data.sessionConcepts.forEach(sc => {
                viewModels.push({
                    id: sc.sportConceptId,
                    name: sc.conceptName,
                    description: (sc as any).conceptDescription,
                    categoryName: (sc as any).conceptCategoryName,
                    exercises: [],
                    isOpen: true,
                    durationMinutes: (sc as any).durationMinutes || 8
                });
            });

            data.sessionExercises.forEach(se => {
                const concept = viewModels.find(vm => vm.id === se.sportConceptId);
                if (concept) {
                    concept.exercises.push({
                        id: se.id,
                        exerciseId: se.exerciseId,
                        exerciseName: se.exerciseName,
                        customText: se.customText,
                        durationMinutes: se.durationMinutes
                    });
                }
            });

            this.trainingConcepts.set(viewModels);
            this.loadTeamPlanning(data.teamId);
            this.loading.set(false);
        });
    }

    async loadTeamPlanning(teamId: number) {
        this.planningService.getPlannings().subscribe(all => {
            const teamPlannings = all.filter(p => p.team?.id === teamId);
            if (teamPlannings.length > 0) {
                const current = teamPlannings[0];
                this.activePlanning.set(current);
                // Map full concept structure for filtering
                this.availableConcepts.set(current.planConcepts.map(pc => pc.sportConcept).filter(c => c !== null) as SportConcept[]);
            }
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        const current = this.trainingConcepts();
        moveItemInArray(current, event.previousIndex, event.currentIndex);
        this.trainingConcepts.set([...current]);
    }

    // Modal Actions
    openConceptModal() {
        this.resetFilter();
        this.conceptOverlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-dark-backdrop',
            positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });

        const portal = new TemplatePortal(this.conceptModalTemplate, this.viewContainerRef);
        this.conceptOverlayRef.attach(portal);

        this.conceptOverlayRef.backdropClick().subscribe(() => this.closeConceptModal());
    }

    closeConceptModal() {
        this.conceptOverlayRef?.dispose();
    }

    // Filter Navigation Methods
    drillDown(category: ConceptCategory) {
        this.currentCategoryNode.set(category);
        this.categoryPath.update(path => [...path, category]);
    }

    goBack() {
        this.categoryPath.update(path => {
            const newPath = [...path];
            newPath.pop(); // Remove current
            const parent = newPath.length > 0 ? newPath[newPath.length - 1] : null;
            this.currentCategoryNode.set(parent);
            return newPath;
        });
    }

    resetFilter() {
        this.currentCategoryNode.set(null);
        this.categoryPath.set([]);
    }

    // Quick Add Concept Logic
    addQuickConcept() {
        const name = this.quickConceptName().trim();
        if (!name) return;

        const dto = {
            name: name,
            description: 'Edita la descripción para detallar el objetivo.',
            technicalDifficulty: 1,
            tacticalComplexity: 1,
            conceptCategoryId: null,
            progressWeight: 50,
            isProgressive: false,
            // Assuming current planning sport or default. 
            // We need sportId if required by backend, but let's try optional first or 1.
            // Actually DTO says sportId is optional?
            sportId: null
        };

        this.loading.set(true);
        this.conceptService.createConcept(dto as any).subscribe({
            next: (concept) => {
                this.trainingConcepts.update(prev => [...prev, {
                    id: concept.id,
                    name: concept.name,
                    description: concept.description || '',
                    categoryName: 'Personal',
                    exercises: [],
                    isOpen: true,
                    durationMinutes: 8
                }]);
                this.quickConceptName.set('');
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    // Concept Editing Logic
    toggleEdit(concept: TrainingConceptViewModel) {
        this.trainingConcepts.update(concepts => concepts.map(c => {
            if (c.id === concept.id) {
                return {
                    ...c,
                    isEditing: !c.isEditing,
                    editName: c.name,
                    editDescription: c.description
                };
            }
            return c;
        }));
    }

    saveConceptName(concept: TrainingConceptViewModel) {
        if (!concept.editName || !concept.editName.trim()) return;

        // Update local state only
        this.trainingConcepts.update(concepts => concepts.map(c => {
            if (c.id === concept.id) {
                return {
                    ...c,
                    name: concept.editName!.trim(),
                    description: concept.editDescription,
                    isEditing: false
                };
            }
            return c;
        }));
    }

    updateDuration() {
        this.trainingConcepts.update(prev => [...prev]);
    }

    addConcept(concept: any) {
        if (!this.trainingConcepts().find(c => c.id === concept.id)) {
            this.trainingConcepts.update(prev => [...prev, {
                id: concept.id,
                name: concept.name,
                description: concept.description,
                categoryName: concept.category, // Mapped in earlier step (see loadTeamPlanning)
                exercises: [],
                isOpen: true,
                durationMinutes: 8
            }]);
        }
        this.closeConceptModal();
    }

    // Exercise Actions
    openLibrary(conceptId: number) {
        this.currentConceptIdForLibrary.set(conceptId);
        this.exerciseService.getAll(conceptId).subscribe(exercises => {
            this.libraryExercises.set(exercises);

            this.libraryOverlayRef = this.overlay.create({
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-dark-backdrop',
                positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
                scrollStrategy: this.overlay.scrollStrategies.block()
            });

            const portal = new TemplatePortal(this.libraryModalTemplate, this.viewContainerRef);
            this.libraryOverlayRef.attach(portal);

            this.libraryOverlayRef.backdropClick().subscribe(() => this.closeLibraryModal());
        });
    }

    closeLibraryModal() {
        this.libraryOverlayRef?.dispose();
    }

    addExerciseFromLibrary(ex: Exercise) {
        const conceptId = this.currentConceptIdForLibrary();
        if (!conceptId) return;

        this.trainingConcepts.update(concepts => {
            return concepts.map(c => {
                if (c.id === conceptId) {
                    return {
                        ...c,
                        exercises: [...c.exercises, {
                            exerciseId: ex.id,
                            exerciseName: ex.name,
                            durationMinutes: 10
                        }]
                    };
                }
                return c;
            });
        });
        this.closeLibraryModal();
    }

    addCustomExercise(conceptId: number, text: string) {
        if (!text.trim()) return;
        this.trainingConcepts.update(concepts => {
            return concepts.map(c => {
                if (c.id === conceptId) {
                    return {
                        ...c,
                        exercises: [...c.exercises, {
                            customText: text,
                            durationMinutes: 10
                        }]
                    };
                }
                return c;
            });
        });
    }

    removeConcept(index: number) {
        this.trainingConcepts.update(current => current.filter((_, i) => i !== index));
    }

    removeExercise(conceptId: number, exerciseIndex: number) {
        this.trainingConcepts.update(concepts => {
            return concepts.map(c => {
                if (c.id === conceptId) {
                    return {
                        ...c,
                        exercises: c.exercises.filter((_, i) => i !== exerciseIndex)
                    };
                }
                return c;
            });
        });
    }



    save() {
        if (!this.teamId()) return;
        this.saving.set(true);

        const validConcepts = this.trainingConcepts();
        const sessionConcepts = validConcepts.map((c, i) => ({
            sportConceptId: c.id,
            order: i,
            durationMinutes: c.durationMinutes,
            overrideDescription: c.description
        }));

        const sessionExercises: any[] = [];
        validConcepts.forEach((c, cIdx) => {
            c.exercises.forEach((e, eIdx) => {
                sessionExercises.push({
                    exerciseId: e.exerciseId,
                    customText: e.customText,
                    sportConceptId: c.id,
                    order: eIdx,
                    durationMinutes: e.durationMinutes
                });
            });
        });

        const dto: CreateTrainingSessionDto = {
            name: this.name(),
            teamId: this.teamId()!,
            date: this.date(),
            startTime: this.startTime() + ':00',
            duration: this.totalDuration(), // Use computed duration
            planningId: this.planningId() || undefined,
            sessionConcepts: sessionConcepts,
            sessionExercises: sessionExercises
        };

        const action = this.isEdit()
            ? this.sessionService.update(this.trainingId()!, dto)
            : this.sessionService.create(dto);

        action.subscribe({
            next: () => {
                this.saving.set(false);
                this.navigateBack();
            },
            error: () => this.saving.set(false)
        });
    }

    cancel() {
        this.navigateBack();
    }

    private navigateBack() {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
        } else if (this.teamId()) {
            this.router.navigate(['/dashboard/teams/management', this.teamId(), 'trainings']);
        } else {
            this.router.navigate(['/dashboard/trainings']);
        }
    }

    startSession() {
        if (this.trainingId()) {
            this.router.navigate(['/dashboard/trainings/execution', this.trainingId()]);
        }
    }
}
