import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
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
    @ViewChild('nameInput') nameInput!: ElementRef;
    categories = signal<any[]>([]);
    flatCategories = signal<any[]>([]); // For parent selection dropdown
    isLoading = signal(true);
    showForm = signal(false);
    categoryForm: FormGroup;
    editingCategoryId = signal<number | null>(null);
    showInactive = signal(false);

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
        this.categoriesService.getAll(this.showInactive()).subscribe({
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

    toggleShowInactive() {
        this.showInactive.update(v => !v);
        this.loadCategories();
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

    toggleNode(node: any) {
        node.expanded = !node.expanded;
    }

    toggleForm() {
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.resetForm();
            this.showForm.set(true);
            this.focusInput();
        }
    }

    focusInput() {
        setTimeout(() => {
            if (this.nameInput) {
                this.nameInput.nativeElement.focus();
            }
        }, 100);
    }

    resetForm() {
        this.categoryForm.reset({
            name: '',
            description: '',
            parentId: null
        });
        this.editingCategoryId.set(null);
        this.showForm.set(false);
    }

    addChildCategory(parent: any) {
        this.resetForm();
        this.categoryForm.patchValue({
            parentId: parent.id
        });
        this.showForm.set(true);
        this.focusInput();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    editCategory(category: any) {
        this.editingCategoryId.set(category.id);
        this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
            parentId: category.parentId
        });
        this.showForm.set(true);
        this.focusInput();
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

    getParentName(id: number | null): string {
        if (id === null) return 'Ninguna (Raíz)';
        const parent = this.flatCategories().find(c => c.id === id);
        return parent ? parent.name : 'Ninguna (Raíz)';
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
