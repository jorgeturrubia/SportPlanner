import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { Planning, PlanConcept, PlaningScheduleDay } from '../../../../core/models/planning.model';
import { SportConcept } from '../../../../core/models/sport-concept.model';
import { SportConceptService } from '../../../../services/sport-concept.service';

@Component({
    selector: 'app-team-planning',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './team-planning.component.html'
})
export class TeamPlanningComponent implements OnInit {
    teamId: number = 0;
    planningId: number | null = null;
    step = signal(1);
    planForm: FormGroup;
    isLoading = signal(false);
    isLoadingConcepts = signal(false);
    concepts = signal<SportConcept[]>([]);
    selectedConceptIds = signal<number[]>([]);

    // Collapse/Expand state
    collapsedCategories = signal<Set<number>>(new Set());
    collapsedSubcategories = signal<Set<string>>(new Set()); // Use "categoryId-subcategoryId" as key

    // Filter state
    selectedCategoryFilter = signal<number | null>(null);
    selectedSubcategoryFilter = signal<number | null>(null);

    // Raw grouped data (before filters)
    private rawGroupedConcepts = signal<{
        category: string;
        categoryId: number;
        subcategories: {
            name: string;
            id: number;
            concepts: SportConcept[];
        }[];
    }[]>([]);

    // Computed: Available categories for filter
    availableCategories = computed(() => {
        return this.rawGroupedConcepts().map(g => ({
            id: g.categoryId,
            name: g.category
        }));
    });

    // Computed: Available subcategories for filter (based on selected category)
    availableSubcategories = computed(() => {
        const selectedCat = this.selectedCategoryFilter();
        if (!selectedCat) {
            // Return all subcategories from all categories
            return this.rawGroupedConcepts().flatMap(g =>
                g.subcategories.map(s => ({ id: s.id, name: s.name }))
            );
        }
        const category = this.rawGroupedConcepts().find(g => g.categoryId === selectedCat);
        return category ? category.subcategories.map(s => ({ id: s.id, name: s.name })) : [];
    });

    // Computed: Filtered grouped concepts
    groupedConcepts = computed(() => {
        let groups = this.rawGroupedConcepts();
        const catFilter = this.selectedCategoryFilter();
        const subFilter = this.selectedSubcategoryFilter();

        // Apply category filter
        if (catFilter !== null) {
            groups = groups.filter(g => g.categoryId === catFilter);
        }

        // Apply subcategory filter
        if (subFilter !== null) {
            groups = groups.map(g => ({
                ...g,
                subcategories: g.subcategories.filter(s => s.id === subFilter)
            })).filter(g => g.subcategories.length > 0);
        }

        return groups;
    });

    weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService,
        private sportConceptService: SportConceptService,
        private notificationService: NotificationService
    ) {
        this.planForm = this.fb.group({
            name: [''],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            days: this.fb.array([])
        });

        // Initialize days
        this.weekDays.forEach(() => {
            this.daysFormArray.push(this.fb.group({
                selected: [false],
                startTime: ['18:00'],
                endTime: ['20:00']
            }));
        });
    }

    get daysFormArray() {
        return this.planForm.get('days') as FormArray;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['teamId']) {
                this.teamId = +params['teamId'];
            }
            if (params['planningId']) {
                this.planningId = +params['planningId'];
                this.loadPlanning(this.planningId);
            }
        });
    }

    loadPlanning(id: number) {
        this.isLoading.set(true);
        this.planningService.getPlanning(id).subscribe({
            next: (planning) => {
                // Populate form
                this.planForm.patchValue({
                    name: planning.name,
                    startDate: planning.startDate.split('T')[0],
                    endDate: planning.endDate.split('T')[0]
                });

                // Populate days
                if (planning.scheduleDays) {
                    planning.scheduleDays.forEach((day: PlaningScheduleDay) => {
                        const index = day.dayOfWeek;
                        if (index !== -1) {
                            const dayGroup = this.daysFormArray.at(index);
                            dayGroup.patchValue({
                                selected: true,
                                startTime: day.startTime.substring(0, 5),
                                endTime: day.endTime ? day.endTime.substring(0, 5) : '20:00'
                            });
                        }
                    });
                }

                // Populate concepts
                if (planning.planConcepts) {
                    this.selectedConceptIds.set(planning.planConcepts.map((pc: PlanConcept) => pc.sportConcept.id));
                }

                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading planning', err);
                this.notificationService.error('Error', 'No se pudo cargar la planificación.');
                this.isLoading.set(false);
            }
        });
    }

    isStep1Valid(): boolean {
        const datesValid = this.planForm.get('startDate')?.valid && this.planForm.get('endDate')?.valid;
        const daysSelected = this.daysFormArray.controls.some(c => c.get('selected')?.value);
        return !!(datesValid && daysSelected);
    }

    nextStep() {
        if (this.step() === 1 && this.isStep1Valid()) {
            this.step.set(2);
            this.loadConcepts();
        }
    }

    prevStep() {
        this.step.set(1);
    }

    loadConcepts() {
        this.isLoadingConcepts.set(true);
        // TODO: This should be replaced with a proper method to get concepts for a team
        this.sportConceptService.getConcepts().subscribe({
            next: (data) => {
                this.concepts.set(data);
                this.groupConcepts(data);
                if (this.selectedConceptIds().length === 0 && !this.planningId) {
                    //const suggestedIds = data.filter(p => p.isSuggested).map(p => p.concept.id);
                    //this.selectedConceptIds.set(suggestedIds);
                }
                this.isLoadingConcepts.set(false);
            },
            error: (err) => {
                console.error('Error loading concepts', err);
                this.notificationService.error('Error', 'No se pudieron cargar los conceptos propuestos.');
                this.isLoadingConcepts.set(false);
            }
        });
    }

    groupConcepts(concepts: SportConcept[]) {
        // Group concepts by parent category and subcategory
        const grouped = new Map<number, {
            category: string;
            categoryId: number;
            subcategories: Map<number, {
                name: string;
                id: number;
                concepts: SportConcept[];
            }>;
        }>();

        concepts.forEach(concept => {
            if (!concept.conceptCategory) return;

            // Determine parent category (if it has a parent, use that; otherwise it's a top-level category)
            const parentCategory = concept.conceptCategory.parent || concept.conceptCategory;
            const subcategory = concept.conceptCategory.parent ? concept.conceptCategory : null;

            if (!grouped.has(parentCategory.id)) {
                grouped.set(parentCategory.id, {
                    category: parentCategory.name,
                    categoryId: parentCategory.id,
                    subcategories: new Map()
                });
            }

            const categoryGroup = grouped.get(parentCategory.id)!;

            if (subcategory) {
                // Has subcategory
                if (!categoryGroup.subcategories.has(subcategory.id)) {
                    categoryGroup.subcategories.set(subcategory.id, {
                        name: subcategory.name,
                        id: subcategory.id,
                        concepts: []
                    });
                }
                categoryGroup.subcategories.get(subcategory.id)!.concepts.push(concept);
            } else {
                // No subcategory, create a default one
                const defaultSubcatId = -parentCategory.id; // Use negative ID to avoid conflicts
                if (!categoryGroup.subcategories.has(defaultSubcatId)) {
                    categoryGroup.subcategories.set(defaultSubcatId, {
                        name: 'General',
                        id: defaultSubcatId,
                        concepts: []
                    });
                }
                categoryGroup.subcategories.get(defaultSubcatId)!.concepts.push(concept);
            }
        });

        // Convert to array format
        const result = Array.from(grouped.values()).map(cat => ({
            category: cat.category,
            categoryId: cat.categoryId,
            subcategories: Array.from(cat.subcategories.values())
        }));

        this.rawGroupedConcepts.set(result);
    }

    // Collapse/Expand methods
    toggleCategory(categoryId: number) {
        const collapsed = new Set(this.collapsedCategories());
        if (collapsed.has(categoryId)) {
            collapsed.delete(categoryId);
        } else {
            collapsed.add(categoryId);
        }
        this.collapsedCategories.set(collapsed);
    }

    isCategoryCollapsed(categoryId: number): boolean {
        return this.collapsedCategories().has(categoryId);
    }

    toggleSubcategory(categoryId: number, subcategoryId: number) {
        const key = `${categoryId}-${subcategoryId}`;
        const collapsed = new Set(this.collapsedSubcategories());
        if (collapsed.has(key)) {
            collapsed.delete(key);
        } else {
            collapsed.add(key);
        }
        this.collapsedSubcategories.set(collapsed);
    }

    isSubcategoryCollapsed(categoryId: number, subcategoryId: number): boolean {
        const key = `${categoryId}-${subcategoryId}`;
        return this.collapsedSubcategories().has(key);
    }

    // Filter methods
    setCategoryFilter(categoryId: number | null) {
        this.selectedCategoryFilter.set(categoryId);
        // Reset subcategory filter when category changes
        if (categoryId === null) {
            this.selectedSubcategoryFilter.set(null);
        }
    }

    setSubcategoryFilter(subcategoryId: number | null) {
        this.selectedSubcategoryFilter.set(subcategoryId);
    }

    isConceptSelected(id: number): boolean {
        return this.selectedConceptIds().includes(id);
    }

    toggleConcept(id: number) {
        const current = this.selectedConceptIds();
        if (current.includes(id)) {
            this.selectedConceptIds.set(current.filter(c => c !== id));
        } else {
            this.selectedConceptIds.set([...current, id]);
        }
    }

    toggleDay(index: number) {
        const dayControl = this.daysFormArray.at(index);
        if (dayControl) {
            const currentVal = dayControl.get('selected')?.value;
            dayControl.get('selected')?.setValue(!currentVal);
        }
    }

    isDaySelected(index: number): boolean {
        return this.daysFormArray.at(index)?.get('selected')?.value;
    }

    get selectedDaysIndices(): number[] {
        return this.daysFormArray.controls
            .map((control, index) => ({ selected: control.get('selected')?.value, index }))
            .filter(item => item.selected)
            .map(item => item.index);
    }

    onSubmit() {
        if (this.step() === 2) {
            this.isLoading.set(true);

            const formVal = this.planForm.value;
            const scheduleDays = formVal.days
                .map((d: any, i: number) => ({ ...d, dayOfWeek: i }))
                .filter((d: any) => d.selected)
                .map((d: any) => ({
                    dayOfWeek: d.dayOfWeek,
                    startTime: d.startTime,
                    endTime: d.endTime
                }));

            const planConcepts: PlanConcept[] = this.selectedConceptIds().map((id, index) => ({
                id: 0,
                planningId: 0,
                sportConcept: null,
                sportConceptId: id,
                order: index
            }));

            if (this.planningId) {
                const payload = {
                    name: formVal.name,
                    startDate: formVal.startDate,
                    endDate: formVal.endDate,
                    scheduleDays: scheduleDays,
                    planConcepts: planConcepts
                };
                this.planningService.updatePlanning(this.planningId, payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación actualizada', 'Se ha actualizado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error updating planning', err);
                        this.notificationService.error('Error', 'No se pudo actualizar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            } else {
                const payload = {
                    name: formVal.name,
                    teamId: this.teamId,
                    startDate: formVal.startDate,
                    endDate: formVal.endDate,
                    scheduleDays: scheduleDays,
                    planConcepts: planConcepts
                };
                this.planningService.createPlanning(payload).subscribe({
                    next: () => {
                        this.notificationService.success('Planificación creada', 'Se ha generado la planificación correctamente.');
                        this.router.navigate(['/dashboard/plannings']);
                    },
                    error: (err) => {
                        console.error('Error creating planning', err);
                        this.notificationService.error('Error', 'No se pudo guardar la planificación.');
                        this.isLoading.set(false);
                    }
                });
            }
        }
    }
}
