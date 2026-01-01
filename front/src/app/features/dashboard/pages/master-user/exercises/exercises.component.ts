import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExerciseService } from '../../../../../services/exercise.service';
import { NotificationService } from '../../../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Exercise, CreateExerciseDto } from '../../../../../core/models/exercise.model';

@Component({
    selector: 'app-exercises',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
    templateUrl: './exercises.component.html'
})
export class ExercisesComponent implements OnInit {
    exercises = signal<Exercise[]>([]);
    isLoading = signal(false);
    showForm = signal(false);
    exerciseForm: FormGroup;
    editingExerciseId = signal<number | null>(null);

    // Delete dialog
    showDeleteDialog = signal(false);
    isDeleting = signal(false);
    exerciseToDelete = signal<Exercise | null>(null);

    // Expanded description
    activeDescriptionId = signal<number | null>(null);

    constructor(
        private fb: FormBuilder,
        private exerciseService: ExerciseService,
        private notificationService: NotificationService
    ) {
        this.exerciseForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            mediaUrl: ['']
        });
    }

    ngOnInit() {
        this.loadExercises();
    }

    loadExercises() {
        this.isLoading.set(true);
        this.exerciseService.getAll().subscribe({
            next: (data) => {
                this.exercises.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    toggleDescription(id: number) {
        if (this.activeDescriptionId() === id) {
            this.activeDescriptionId.set(null);
        } else {
            this.activeDescriptionId.set(id);
        }
    }

    toggleForm() {
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.resetForm();
            this.showForm.set(true);
        }
    }

    resetForm() {
        this.exerciseForm.reset({
            name: '',
            description: '',
            mediaUrl: ''
        });
        this.editingExerciseId.set(null);
        this.showForm.set(false);
    }

    editExercise(exercise: Exercise) {
        this.editingExerciseId.set(exercise.id);
        this.exerciseForm.patchValue({
            name: exercise.name,
            description: exercise.description,
            mediaUrl: exercise.mediaUrl
        });
        this.showForm.set(true);
    }

    deleteExercise(exercise: Exercise) {
        this.exerciseToDelete.set(exercise);
        this.showDeleteDialog.set(true);
    }

    confirmDelete() {
        const exercise = this.exerciseToDelete();
        if (!exercise) return;

        this.isDeleting.set(true);
        this.exerciseService.delete(exercise.id).subscribe({
            next: () => {
                this.loadExercises();
                this.isDeleting.set(false);
                this.cancelDelete();
                this.notificationService.success('Ejercicio eliminado', 'El ejercicio ha sido eliminado correctamente.');
            },
            error: (err) => {
                console.error('Error deleting exercise', err);
                this.isDeleting.set(false);
                this.notificationService.error('Error', 'No se pudo eliminar el ejercicio.');
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.exerciseToDelete.set(null);
        this.isDeleting.set(false);
    }

    onSubmit() {
        if (!this.exerciseForm.valid) return;

        this.isLoading.set(true);
        const formData: CreateExerciseDto = this.exerciseForm.value;

        if (this.editingExerciseId()) {
            this.exerciseService.update(this.editingExerciseId()!, formData).subscribe({
                next: () => {
                    this.loadExercises();
                    this.resetForm();
                    this.notificationService.success('Ejercicio actualizado', 'El ejercicio ha sido actualizado correctamente.');
                },
                error: (err) => {
                    console.error('Error updating exercise', err);
                    this.isLoading.set(false);
                }
            });
        } else {
            this.exerciseService.create(formData).subscribe({
                next: () => {
                    this.loadExercises();
                    this.resetForm();
                    this.notificationService.success('Ejercicio creado', 'El ejercicio ha sido creado correctamente.');
                },
                error: (err) => {
                    console.error('Error creating exercise', err);
                    this.isLoading.set(false);
                }
            });
        }
    }
}
