import { Component, OnInit, signal, computed } from '@angular/core'; // Trigger rebuild
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SportConceptsService } from '../../../../../services/sport-concepts.service';
import { ConceptCategoriesService } from '../../../../../services/concept-categories.service';
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
    rootCategories = signal<any[]>([]);
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
    conceptCategories = signal<any[]>([]);
    activeDescriptionId = signal<number | null>(null);

    constructor(
        private fb: FormBuilder,
        private conceptsService: SportConceptsService,
        private categoriesService: ConceptCategoriesService,
        private notificationService: NotificationService,
        private subscriptionsService: SubscriptionsService,
        private lookupService: LookupService,
        private router: Router
    ) {
        this.conceptForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            conceptCategoryId: [null, Validators.required],
            sportId: [null, Validators.required],
            difficulty: [1],
            tacticalComplexity: [1],
            isDraft: [false]
        });
    }

    ngOnInit() {
        this.loadInitialData();
    }

    loadInitialData() {
        this.isLoading.set(true);
        this.subscriptionsService.getMySubscriptions().subscribe({
            next: (subs) => {
                this.activeSubscriptions.set(subs.filter(s => s.isActive));
                if (this.activeSubscriptions().length > 0) {
                    this.conceptForm.patchValue({ sportId: this.activeSubscriptions()[0].sportId });
                }
                this.loadCategories();
            },
            error: () => this.isLoading.set(false)
        });
    }

    loadCategories() {
        this.categoriesService.getAll(false).subscribe({
            next: (data) => {
                this.conceptCategories.set(data);
                this.rootCategories.set(this.organizeCategories(data));
                this.loadConcepts();
            },
            error: () => this.isLoading.set(false)
        });
    }

    loadConcepts() {
        this.isLoading.set(true);
        this.conceptsService.getConcepts().subscribe({
            next: (data) => {
                this.concepts.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    organizeCategories(categories: any[]): any[] {
        const map = new Map();
        categories.forEach(c => map.set(c.id, { ...c, children: [], expanded: true }));
        const roots: any[] = [];
        categories.forEach(c => {
            const node = map.get(c.id);
            if (c.parentId && map.has(c.parentId)) {
                map.get(c.parentId).children.push(node);
            } else {
                roots.push(node);
            }
        });
        return roots;
    }

    getConceptsByCategory(categoryId: number): any[] {
        return this.concepts().filter(c => c.conceptCategoryId === categoryId);
    }

    toggleDescription(id: number) {
        if (this.activeDescriptionId() === id) {
            this.activeDescriptionId.set(null);
        } else {
            this.activeDescriptionId.set(id);
        }
    }

    toggleNode(node: any) {
        node.expanded = !node.expanded;
    }

    toggleForm(categoryId?: number) {
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.resetForm();
            if (categoryId) {
                this.conceptForm.patchValue({ conceptCategoryId: categoryId });
            }
            this.showForm.set(true);
        }
    }

    resetForm() {
        const activeSportId = this.activeSubscriptions().length > 0 ? this.activeSubscriptions()[0].sportId : null;
        this.conceptForm.reset({
            name: '',
            description: '',
            conceptCategoryId: null,
            sportId: activeSportId,
            difficulty: 1,
            tacticalComplexity: 1,
            isDraft: false
        });
        this.editingConceptId.set(null);
        this.showForm.set(false);
    }

    editConcept(concept: any) {
        this.editingConceptId.set(concept.id);
        this.conceptForm.patchValue({
            name: concept.name,
            description: concept.description,
            conceptCategoryId: concept.conceptCategoryId,
            sportId: concept.sportId,
            difficulty: concept.difficulty,
            tacticalComplexity: concept.tacticalComplexity,
            isDraft: concept.isDraft
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
