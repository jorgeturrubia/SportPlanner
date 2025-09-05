import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Objective, CreateObjectiveRequest, UpdateObjectiveRequest, ObjectivePriority, ObjectiveStatus } from '../../../../../../models/objective.model';
import { ObjectivesService } from '../../../../../../services/objectives.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AuthService } from '../../../../../../services/auth.service';
import { TeamsService } from '../../../../../../services/teams.service';

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
  private teamsService = inject(TeamsService);

  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) mode!: 'create' | 'edit';
  @Input() objective: Objective | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() objectiveSaved = new EventEmitter<Objective>();

  readonly isSubmitting = signal<boolean>(false);
  readonly form: FormGroup;
  readonly teams = this.teamsService.teams;

  readonly modalTitle = computed(() => {
    return this.mode === 'create' ? 'Crear Nuevo Objetivo' : 'Editar Objetivo';
  });

  readonly submitButtonText = computed(() => {
    if (this.isSubmitting()) {
      return this.mode === 'create' ? 'Creando...' : 'Guardando...';
    }
    return this.mode === 'create' ? 'Crear Objetivo' : 'Guardar Cambios';
  });

  // Predefined options
  readonly priorityOptions = [
    { value: ObjectivePriority.Low, label: 'Baja' },
    { value: ObjectivePriority.Medium, label: 'Media' },
    { value: ObjectivePriority.High, label: 'Alta' },
    { value: ObjectivePriority.Critical, label: 'Crítica' }
  ];

  readonly statusOptions = [
    { value: ObjectiveStatus.NotStarted, label: 'No iniciado' },
    { value: ObjectiveStatus.InProgress, label: 'En progreso' },
    { value: ObjectiveStatus.OnHold, label: 'En pausa' },
    { value: ObjectiveStatus.Completed, label: 'Completado' }
  ];

  constructor() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      priority: [ObjectivePriority.Medium, [Validators.required]],
      status: [ObjectiveStatus.NotStarted, [Validators.required]],
      targetDate: [''],
      progress: [0, [Validators.min(0), Validators.max(100)]],
      teamId: [''],
      tags: ['']
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
    // Load teams if not already loaded
    if (this.teams().length === 0) {
      this.teamsService.getAllTeams().subscribe();
    }

    if (this.objective && this.mode === 'edit') {
      this.populateForm(this.objective);
    }
  }

  private populateForm(objective: Objective): void {
    this.form.patchValue({
      title: objective.title,
      description: objective.description || '',
      priority: objective.priority,
      status: objective.status,
      targetDate: objective.targetDate ? objective.targetDate.toISOString().split('T')[0] : '',
      progress: objective.progress,
      teamId: objective.teamId || '',
      tags: objective.tags?.join(', ') || ''
    });
  }

  private resetForm(): void {
    this.form.reset({
      title: '',
      description: '',
      priority: ObjectivePriority.Medium,
      status: ObjectiveStatus.NotStarted,
      targetDate: '',
      progress: 0,
      teamId: '',
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
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      priority: Number(formValue.priority),
      targetDate: formValue.targetDate ? new Date(formValue.targetDate) : undefined,
      teamId: formValue.teamId || undefined,
      tags: this.parseTags(formValue.tags)
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
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      priority: Number(formValue.priority),
      status: Number(formValue.status),
      targetDate: formValue.targetDate ? new Date(formValue.targetDate) : undefined,
      progress: Number(formValue.progress),
      tags: this.parseTags(formValue.tags)
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

    return 'Valor inválido';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting()) {
      this.onClose();
    }
  }
}