import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConceptCategoriesService } from '../../../../../services/concept-categories.service';
import { NotificationService } from '../../../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-concept-categories',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
    templateUrl: './concept-categories.component.html'
})
export class ConceptCategoriesComponent implements OnInit {
    categories = signal<any[]>([]);
    flatCategories = signal<any[]>([]); // For parent selection dropdown
    isLoading = signal(true);
    showForm = signal(false);
    categoryForm: FormGroup;
    editingCategoryId = signal<number | null>(null);

    // Delete dialog
    showDeleteDialog = signal(false);
    isDeleting = signal(false);
    categoryToDelete = signal<any>(null);

    constructor(
        private fb: FormBuilder,
        private categoriesService: ConceptCategoriesService,
        private notificationService: NotificationService
    ) {
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            parentId: [null]
        });
    }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.isLoading.set(true);
        this.categoriesService.getAll().subscribe({
            next: (data) => {
                this.categories.set(this.organizeCategories(data));
                this.flatCategories.set(data); // Keep raw list for dropdown
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading categories', err);
                this.isLoading.set(false);
            }
        });
    }

    organizeCategories(categories: any[]): any[] {
        const map = new Map();
        categories.forEach(c => map.set(c.id, { ...c, children: [] }));
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

    toggleForm() {
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.showForm.set(true);
        }
    }

    resetForm() {
        this.categoryForm.reset();
        this.editingCategoryId.set(null);
        this.showForm.set(false);
    }

    editCategory(category: any) {
        this.editingCategoryId.set(category.id);
        this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
            parentId: category.parentId
        });
        this.showForm.set(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteCategory(category: any) {
        this.categoryToDelete.set(category);
        this.showDeleteDialog.set(true);
    }

    confirmDelete() {
        const category = this.categoryToDelete();
        if (!category) return;

        this.isDeleting.set(true);
        this.categoriesService.delete(category.id).subscribe({
            next: () => {
                this.loadCategories();
                this.isDeleting.set(false);
                this.cancelDelete();
                this.notificationService.success('Categoría eliminada', 'La categoría ha sido eliminada correctamente.');
            },
            error: (err) => {
                console.error('Error deleting category', err);
                this.isDeleting.set(false);
                this.notificationService.error('Error', 'No se pudo eliminar la categoría.');
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.categoryToDelete.set(null);
        this.isDeleting.set(false);
    }

    onSubmit() {
        if (!this.categoryForm.valid) return;

        this.isLoading.set(true);
        const formData = this.categoryForm.value;

        if (this.editingCategoryId()) {
            this.categoriesService.update(this.editingCategoryId()!, formData).subscribe({
                next: () => {
                    this.loadCategories();
                    this.resetForm();
                    this.notificationService.success('Categoría actualizada', 'La categoría ha sido actualizada correctamente.');
                },
                error: (err) => {
                    console.error('Error updating category', err);
                    this.isLoading.set(false);
                    this.notificationService.error('Error', 'No se pudo actualizar la categoría.');
                }
            });
        } else {
            this.categoriesService.create(formData).subscribe({
                next: () => {
                    this.loadCategories();
                    this.resetForm();
                    this.notificationService.success('Categoría creada', 'La categoría ha sido creada correctamente.');
                },
                error: (err) => {
                    console.error('Error creating category', err);
                    this.isLoading.set(false);
                    this.notificationService.error('Error', 'No se pudo crear la categoría.');
                }
            });
        }
    }
}
