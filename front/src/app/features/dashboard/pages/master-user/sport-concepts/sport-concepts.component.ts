import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SportConceptsService } from '../../../../../services/sport-concepts.service';
import { NotificationService } from '../../../../../services/notification.service';
import { SubscriptionsService, Subscription } from '../../../../../services/subscriptions.service';
import { LookupService } from '../../../../../services/lookup.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-sport-concepts',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
    templateUrl: './sport-concepts.component.html'
})
export class SportConceptsComponent implements OnInit {
    concepts = signal<any[]>([]);
    isLoading = signal(false);
    showForm = signal(false);
    conceptForm: FormGroup;
    editingConceptId = signal<number | null>(null);

    // Delete dialog
    showDeleteDialog = signal(false);
    isDeleting = signal(false);
    conceptToDelete = signal<any>(null);

    // Lookups
    activeSubscriptions = signal<Subscription[]>([]);
    selectedSportId = signal<number | null>(null);
    conceptCategories = signal<any[]>([]);

    groupedConcepts = computed(() => {
        const allConcepts = this.concepts();
        const categories = this.conceptCategories();
        
        if (categories.length === 0) {
            // If no categories, show all in one group or uncategorized
            return [{ category: { name: 'Todos los conceptos', displayName: 'Todos los conceptos' }, concepts: allConcepts }];
        }

        const groups: any[] = [];
        const processedConceptIds = new Set<number>();

        // Create groups for each category that has concepts
        categories.forEach(cat => {
            const catConcepts = allConcepts.filter(c => c.conceptCategoryId === cat.id);
            if (catConcepts.length > 0) {
                groups.push({
                    category: cat,
                    concepts: catConcepts
                });
                catConcepts.forEach(c => processedConceptIds.add(c.id));
            }
        });

        // Handle uncategorized concepts
        const uncategorized = allConcepts.filter(c => !processedConceptIds.has(c.id));
        if (uncategorized.length > 0) {
            groups.push({
                category: { name: 'Sin Categoría', displayName: 'Sin Categoría' },
                concepts: uncategorized
            });
        }

        return groups;
    });

    constructor(
        private fb: FormBuilder,
        private conceptsService: SportConceptsService,
        private notificationService: NotificationService,
        private subscriptionsService: SubscriptionsService,
        private lookupService: LookupService,
        private router: Router
    ) {
        this.conceptForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            sportId: [null, Validators.required],
            conceptCategoryId: [null],
            technicalDifficulty: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
            tacticalComplexity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
            progressWeight: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
            isProgressive: [true]
        });
    }

    ngOnInit() {
        this.loadSubscriptions();
        this.loadLookups();
        this.loadConcepts();
    }

    loadSubscriptions() {
        this.subscriptionsService.getMySubscriptions().subscribe({
            next: (subs) => {
                const active = subs.filter(s => s.isActive);
                this.activeSubscriptions.set(active);
                if (active.length > 0 && active[0].sportId) {
                    this.selectedSportId.set(active[0].sportId);
                    this.conceptForm.patchValue({ sportId: active[0].sportId });
                }
            },
            error: (err) => console.error('Error loading subscriptions', err)
        });
    }

    loadLookups() {
        this.lookupService.getConceptCategories().subscribe({
            next: (data) => {
                this.conceptCategories.set(this.organizeCategories(data));
            },
            error: (err) => console.error('Error loading categories', err)
        });


    }

    organizeCategories(categories: any[]): any[] {
        // Create a map for easy lookup
        const map = new Map();
        categories.forEach(c => map.set(c.id, { ...c, children: [] }));

        const roots: any[] = [];

        // Build the tree
        categories.forEach(c => {
            const node = map.get(c.id);
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId).children.push(node);
            } else {
                roots.push(node);
            }
        });

        // Flatten the tree with indentation and full path
        const flatten = (nodes: any[], level: number = 0, parentPath: string = ''): any[] => {
            let result: any[] = [];
            nodes.forEach(node => {
                // Add indentation to the name for display (dropdowns)
                node.displayName = (level > 0 ? '\u00A0\u00A0'.repeat(level) + '└─ ' : '') + node.name;
                
                // Add full path for headers
                const currentPath = parentPath ? `${parentPath} > ${node.name}` : node.name;
                node.fullPath = currentPath;

                result.push(node);
                if (node.children && node.children.length > 0) {
                    result = result.concat(flatten(node.children, level + 1, currentPath));
                }
            });
            return result;
        };

        return flatten(roots);
    }

    loadConcepts() {
        this.isLoading.set(true);
        const sportId = this.selectedSportId();
        this.conceptsService.getConcepts(sportId || undefined).subscribe({
            next: (data) => {
                this.concepts.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading concepts', err);
                this.isLoading.set(false);
            }
        });
    }

    filterBySport(sportId: number | null) {
        this.selectedSportId.set(sportId);
        this.loadConcepts();
    }

    toggleForm() {
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.showForm.set(true);
        }
    }

    resetForm() {
        this.conceptForm.reset({
            sportId: this.selectedSportId(),
            technicalDifficulty: 5,
            tacticalComplexity: 5,
            progressWeight: 50,
            isProgressive: true
        });
        this.editingConceptId.set(null);
        this.showForm.set(false);
    }

    editConcept(concept: any) {
        this.editingConceptId.set(concept.id);
        this.conceptForm.patchValue({
            name: concept.name,
            description: concept.description,
            sportId: concept.sportId,
            conceptCategoryId: concept.conceptCategoryId,
            technicalDifficulty: concept.technicalDifficulty || 5,
            tacticalComplexity: concept.tacticalComplexity || 5,
            progressWeight: concept.progressWeight,
            isProgressive: concept.isProgressive
        });
        this.showForm.set(true);
    }

    deleteConcept(concept: any) {
        this.conceptToDelete.set(concept);
        this.showDeleteDialog.set(true);
    }

    confirmDelete() {
        const concept = this.conceptToDelete();
        if (!concept) return;

        this.isDeleting.set(true);
        this.conceptsService.deleteConcept(concept.id).subscribe({
            next: () => {
                this.loadConcepts();
                this.isDeleting.set(false);
                this.cancelDelete();
                this.notificationService.success('Concepto eliminado', 'El concepto ha sido eliminado correctamente.');
            },
            error: (err) => {
                console.error('Error deleting concept', err);
                this.isDeleting.set(false);
                this.notificationService.error('Error', 'No se pudo eliminar el concepto.');
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.conceptToDelete.set(null);
        this.isDeleting.set(false);
    }

    onSubmit() {
        if (!this.conceptForm.valid) return;

        this.isLoading.set(true);
        const formData = this.conceptForm.value;

        if (this.editingConceptId()) {
            this.conceptsService.updateConcept(this.editingConceptId()!, formData).subscribe({
                next: () => {
                    this.loadConcepts();
                    this.resetForm();
                    this.notificationService.success('Concepto actualizado', 'El concepto ha sido actualizado correctamente.');
                },
                error: (err) => {
                    console.error('Error updating concept', err);
                    this.isLoading.set(false);
                }
            });
        } else {
            this.conceptsService.createConcept(formData).subscribe({
                next: () => {
                    this.loadConcepts();
                    this.resetForm();
                    this.notificationService.success('Concepto creado', 'El concepto ha sido creado correctamente.');
                },
                error: (err) => {
                    console.error('Error creating concept', err);
                    this.isLoading.set(false);
                }
            });
        }
    }
}
