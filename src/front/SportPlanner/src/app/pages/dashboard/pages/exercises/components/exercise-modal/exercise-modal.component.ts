import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Exercise, CreateExerciseRequest, UpdateExerciseRequest, DifficultyLevel, ExerciseCategory } from '../../../../../../models/exercise.model';
import { ExercisesService } from '../../../../../../services/exercises.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'app-exercise-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './exercise-modal.component.html',
  styleUrl: './exercise-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class ExerciseModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private exercisesService = inject(ExercisesService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) mode!: 'create' | 'edit';
  @Input() exercise: Exercise | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() exerciseSaved = new EventEmitter<Exercise>();

  readonly isSubmitting = signal<boolean>(false);
  readonly form: FormGroup;

  readonly modalTitle = computed(() => {
    return this.mode === 'create' ? 'Crear Nuevo Ejercicio' : 'Editar Ejercicio';
  });

  readonly submitButtonText = computed(() => {
    if (this.isSubmitting()) {
      return this.mode === 'create' ? 'Creando...' : 'Guardando...';
    }
    return this.mode === 'create' ? 'Crear Ejercicio' : 'Guardar Cambios';
  });

  // Predefined options
  readonly categoryOptions = [
    { value: ExerciseCategory.Technical, label: 'Técnico' },
    { value: ExerciseCategory.Tactical, label: 'Táctico' },
    { value: ExerciseCategory.Physical, label: 'Físico' },
    { value: ExerciseCategory.Psychological, label: 'Psicológico' },
    { value: ExerciseCategory.Coordination, label: 'Coordinación' }
  ];

  readonly difficultyOptions = [
    { value: DifficultyLevel.Beginner, label: 'Principiante' },
    { value: DifficultyLevel.Intermediate, label: 'Intermedio' },
    { value: DifficultyLevel.Advanced, label: 'Avanzado' },
    { value: DifficultyLevel.Expert, label: 'Experto' }
  ];

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      category: [ExerciseCategory.Technical, [Validators.required]],
      difficulty: [DifficultyLevel.Intermediate, [Validators.required]],
      durationMinutes: [30, [Validators.required, Validators.min(5), Validators.max(480)]],
      minPlayers: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      maxPlayers: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      equipment: [''],
      instructions: ['', [Validators.maxLength(2000)]],
      isPublic: [false],
      tags: ['']
    });

    // Effect to populate form when exercise changes
    effect(() => {
      if (this.exercise && this.mode === 'edit') {
        this.populateForm(this.exercise);
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    if (this.exercise && this.mode === 'edit') {
      this.populateForm(this.exercise);
    }
  }

  private populateForm(exercise: Exercise): void {
    this.form.patchValue({
      name: exercise.name,
      description: exercise.description || '',
      category: exercise.category,
      difficulty: exercise.difficulty,
      durationMinutes: exercise.durationMinutes,
      minPlayers: exercise.minPlayers,
      maxPlayers: exercise.maxPlayers,
      equipment: exercise.equipment || '',
      instructions: exercise.instructions || '',
      isPublic: exercise.isPublic,
      tags: exercise.tags?.join(', ') || ''
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      category: ExerciseCategory.Technical,
      difficulty: DifficultyLevel.Intermediate,
      durationMinutes: 30,
      minPlayers: 1,
      maxPlayers: 10,
      equipment: '',
      instructions: '',
      isPublic: false,
      tags: ''
    });
  }

  onClose(): void {
    if (!this.isSubmitting()) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.markFormGroupTouched();
      return;
    }

    // Validate min/max players
    const minPlayers = this.form.get('minPlayers')?.value;
    const maxPlayers = this.form.get('maxPlayers')?.value;
    
    if (minPlayers > maxPlayers) {
      this.form.get('maxPlayers')?.setErrors({ minGreaterThanMax: true });
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    
    if (this.mode === 'create') {
      this.createExercise(formValue);
    } else {
      this.updateExercise(formValue);
    }
  }

  private createExercise(formValue: any): void {
    const createRequest: CreateExerciseRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      category: Number(formValue.category),
      difficulty: Number(formValue.difficulty),
      durationMinutes: Number(formValue.durationMinutes),
      minPlayers: Number(formValue.minPlayers),
      maxPlayers: Number(formValue.maxPlayers),
      equipment: formValue.equipment?.trim() || undefined,
      instructions: formValue.instructions?.trim() || undefined,
      isPublic: Boolean(formValue.isPublic),
      tags: this.parseTags(formValue.tags)
    };

    this.exercisesService.createExercise(createRequest).subscribe({
      next: (exercise) => {
        this.exerciseSaved.emit(exercise);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating exercise:', error);
        this.notificationService.showError('Error al crear el ejercicio');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateExercise(formValue: any): void {
    if (!this.exercise) return;

    const updateRequest: UpdateExerciseRequest = {
      name: formValue.name.trim(),
      description: formValue.description.trim(),
      category: Number(formValue.category),
      difficulty: Number(formValue.difficulty),
      durationMinutes: Number(formValue.durationMinutes),
      minPlayers: Number(formValue.minPlayers),
      maxPlayers: Number(formValue.maxPlayers),
      equipment: formValue.equipment?.trim() || undefined,
      instructions: formValue.instructions?.trim() || undefined,
      isPublic: Boolean(formValue.isPublic),
      tags: this.parseTags(formValue.tags)
    };

    this.exercisesService.updateExercise(this.exercise.id, updateRequest).subscribe({
      next: (exercise) => {
        this.exerciseSaved.emit(exercise);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error updating exercise:', error);
        this.notificationService.showError('Error al actualizar el ejercicio');
        this.isSubmitting.set(false);
      }
    });
  }

  private parseTags(tagsString: string): string[] {
    if (!tagsString?.trim()) return [];
    return tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['minGreaterThanMax']) return 'El mínimo no puede ser mayor que el máximo';

    return 'Valor inválido';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting()) {
      this.onClose();
    }
  }
}