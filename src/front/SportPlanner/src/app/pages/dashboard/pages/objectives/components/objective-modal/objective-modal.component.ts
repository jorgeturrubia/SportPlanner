import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Objective, CreateObjectiveRequest, UpdateObjectiveRequest, ObjectiveCategory, ObjectiveSubcategory } from '../../../../../../models/objective.model';
import { ObjectivesService } from '../../../../../../services/objectives.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'app-objective-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './objective-modal.component.html',
  styleUrl: './objective-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class ObjectiveModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private objectivesService = inject(ObjectivesService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) mode!: 'create' | 'edit';
  @Input() objective: Objective | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() objectiveSaved = new EventEmitter<Objective>();

  readonly isSubmitting = signal<boolean>(false);
  readonly form: FormGroup;

  // Master data
  readonly objectiveCategories = this.objectivesService.objectiveCategories;

  readonly modalTitle = computed(() => {
    return this.mode === 'create' ? 'Crear Nuevo Objetivo' : 'Editar Objetivo';
  });

  // Computed subcategories based on selected category
  readonly availableSubcategories = computed(() => {
    const categoryId = this.form.get('objectiveCategoryId')?.value;
    return categoryId ? this.objectivesService.getSubcategoriesByCategory(categoryId) : [];
  });

  readonly submitButtonText = computed(() => {
    if (this.isSubmitting()) {
      return this.mode === 'create' ? 'Creando...' : 'Guardando...';
    }
    return this.mode === 'create' ? 'Crear Objetivo' : 'Guardar Cambios';
  });


  constructor() {
    this.form = this.formBuilder.group({
      // Category information
      objectiveCategoryId: [null, [Validators.required]],
      objectiveSubcategoryId: [null, [Validators.required]],

      // Basic information
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      tags: [''],

      // Relations
      teamId: ['']
    });

    // Effect to populate form when objective changes
    effect(() => {
      if (this.objective && this.mode === 'edit') {
        this.populateForm(this.objective);
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    if (this.objective && this.mode === 'edit') {
      this.populateForm(this.objective);
    }
  }

  private populateForm(objective: Objective): void {
    this.form.patchValue({
      // Category information
      objectiveCategoryId: objective.objectiveCategoryId,
      objectiveSubcategoryId: objective.objectiveSubcategoryId,

      // Basic information
      title: objective.title,
      description: objective.description || '',
      tags: objective.tags || '',

      // Relations
      teamId: objective.teamId || ''
    });
  }

  private resetForm(): void {
    this.form.reset({
      // Category information
      objectiveCategoryId: null,
      objectiveSubcategoryId: null,

      // Basic information
      title: '',
      description: '',
      tags: '',

      // Relations
      teamId: ''
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

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    
    if (this.mode === 'create') {
      this.createObjective(formValue);
    } else {
      this.updateObjective(formValue);
    }
  }

  private createObjective(formValue: any): void {
    const createRequest: CreateObjectiveRequest = {
      // Category information
      objectiveCategoryId: formValue.objectiveCategoryId,
      objectiveSubcategoryId: formValue.objectiveSubcategoryId,

      // Basic information
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      tags: formValue.tags.trim(),

      // Relations
      teamId: formValue.teamId || undefined
    };

    this.objectivesService.createObjective(createRequest).subscribe({
      next: (objective) => {
        this.objectiveSaved.emit(objective);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating objective:', error);
        this.notificationService.showError('Error al crear el objetivo');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateObjective(formValue: any): void {
    if (!this.objective) return;

    const updateRequest: UpdateObjectiveRequest = {
      // Category information
      objectiveCategoryId: formValue.objectiveCategoryId,
      objectiveSubcategoryId: formValue.objectiveSubcategoryId,

      // Basic information
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      tags: formValue.tags.trim(),

      // Relations
      teamId: formValue.teamId || undefined
    };

    this.objectivesService.updateObjective(this.objective.id, updateRequest).subscribe({
      next: (objective) => {
        this.objectiveSaved.emit(objective);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error updating objective:', error);
        this.notificationService.showError('Error al actualizar el objetivo');
        this.isSubmitting.set(false);
      }
    });
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

    return 'Valor inválido';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting()) {
      this.onClose();
    }
  }
}