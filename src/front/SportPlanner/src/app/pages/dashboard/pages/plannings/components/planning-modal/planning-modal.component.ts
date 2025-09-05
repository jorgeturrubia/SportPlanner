import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest, PlanningType, PlanningStatus } from '../../../../../../models/planning.model';
import { PlanningsService } from '../../../../../../services/plannings.service';
import { TeamsService } from '../../../../../../services/teams.service';
import { NotificationService } from '../../../../../../services/notification.service';

@Component({
  selector: 'app-planning-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './planning-modal.component.html',
  styleUrl: './planning-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class PlanningModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private planningsService = inject(PlanningsService);
  private teamsService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  @Input({ required: true }) isOpen!: boolean;
  @Input() planning: Planning | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() planningCreated = new EventEmitter<Planning>();
  @Output() planningUpdated = new EventEmitter<Planning>();

  readonly isSubmitting = signal<boolean>(false);
  readonly form: FormGroup;
  readonly teams = computed(() => this.teamsService.teams());

  readonly isEditMode = computed(() => !!this.planning);
  
  readonly modalTitle = computed(() => {
    return this.isEditMode() ? 'Editar Planificación' : 'Crear Nueva Planificación';
  });

  readonly submitButtonText = computed(() => {
    if (this.isSubmitting()) {
      return this.isEditMode() ? 'Guardando...' : 'Creando...';
    }
    return this.isEditMode() ? 'Guardar Cambios' : 'Crear Planificación';
  });

  // Predefined options
  readonly typeOptions = [
    { value: PlanningType.Weekly, label: 'Semanal' },
    { value: PlanningType.Monthly, label: 'Mensual' },
    { value: PlanningType.Seasonal, label: 'Estacional' },
    { value: PlanningType.Tournament, label: 'Torneo' }
  ];

  readonly statusOptions = [
    { value: PlanningStatus.Draft, label: 'Borrador' },
    { value: PlanningStatus.Active, label: 'Activa' },
    { value: PlanningStatus.Completed, label: 'Completada' },
    { value: PlanningStatus.Archived, label: 'Archivada' }
  ];

  readonly daysOfWeek = [
    { value: 'monday', label: 'Lunes', checked: false },
    { value: 'tuesday', label: 'Martes', checked: false },
    { value: 'wednesday', label: 'Miércoles', checked: false },
    { value: 'thursday', label: 'Jueves', checked: false },
    { value: 'friday', label: 'Viernes', checked: false },
    { value: 'saturday', label: 'Sábado', checked: false },
    { value: 'sunday', label: 'Domingo', checked: false }
  ];

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      type: [PlanningType.Weekly, [Validators.required]],
      status: [PlanningStatus.Draft, [Validators.required]],
      teamId: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      trainingDays: this.formBuilder.array([
        this.formBuilder.control(false), // Monday
        this.formBuilder.control(false), // Tuesday
        this.formBuilder.control(false), // Wednesday
        this.formBuilder.control(false), // Thursday
        this.formBuilder.control(false), // Friday
        this.formBuilder.control(false), // Saturday
        this.formBuilder.control(false)  // Sunday
      ], [this.atLeastOneDayValidator]),
      startTime: ['09:00', [Validators.required]],
      durationMinutes: [60, [Validators.required, Validators.min(15), Validators.max(480)]],
      sessionsPerWeek: [2, [Validators.required, Validators.min(1), Validators.max(14)]],
      isTemplate: [false],
      isPublic: [false],
      tags: ['']
    });

    // Load teams when component initializes
    this.teamsService.getAllTeams().subscribe();

    // Effect to populate form when planning changes
    effect(() => {
      if (this.planning && this.isEditMode()) {
        this.populateForm(this.planning);
      } else if (!this.isEditMode()) {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    if (this.planning && this.isEditMode()) {
      this.populateForm(this.planning);
    }
  }

  private atLeastOneDayValidator(control: AbstractControl): { atLeastOneDay: true } | null {
    if (!control.value) return { atLeastOneDay: true };
    const hasAtLeastOneDay = control.value.some((day: boolean) => day === true);
    return hasAtLeastOneDay ? null : { atLeastOneDay: true };
  }

  private populateForm(planning: Planning): void {
    // Format dates for HTML input (YYYY-MM-DD)
    const startDate = new Date(planning.startDate);
    const endDate = new Date(planning.endDate);
    
    this.form.patchValue({
      name: planning.name,
      description: planning.description || '',
      type: planning.type,
      status: planning.status,
      teamId: planning.teamId || '',
      startDate: this.formatDateForInput(startDate),
      endDate: this.formatDateForInput(endDate),
      startTime: '09:00', // Default as we don't have this in the model yet
      durationMinutes: 60, // Default as we don't have this in the model yet
      sessionsPerWeek: 2, // Default as we don't have this in the model yet
      isTemplate: planning.isTemplate || false,
      isPublic: planning.isPublic || false,
      tags: planning.tags?.join(', ') || ''
    });

    // Reset training days checkboxes (would need additional data from backend)
    const trainingDaysArray = this.form.get('trainingDays') as FormArray;
    trainingDaysArray.controls.forEach((control: AbstractControl) => {
      control.setValue(false); // Default to false, would need backend data
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      type: PlanningType.Weekly,
      status: PlanningStatus.Draft,
      teamId: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      durationMinutes: 60,
      sessionsPerWeek: 2,
      isTemplate: false,
      isPublic: false,
      tags: ''
    });

    // Reset training days
    const trainingDaysArray = this.form.get('trainingDays') as FormArray;
    trainingDaysArray.controls.forEach((control: AbstractControl) => {
      control.setValue(false);
    });
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onClose(): void {
    if (!this.isSubmitting()) {
      this.closeModal.emit();
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.markFormGroupTouched();
      return;
    }

    // Validate date range
    const startDate = new Date(this.form.get('startDate')?.value);
    const endDate = new Date(this.form.get('endDate')?.value);
    
    if (startDate >= endDate) {
      this.form.get('endDate')?.setErrors({ dateRange: true });
      this.markFormGroupTouched();
      return;
    }

    // Validate team selection if needed
    const type = this.form.get('type')?.value;
    const teamId = this.form.get('teamId')?.value;
    
    if (type !== PlanningType.Tournament && !teamId) {
      this.form.get('teamId')?.setErrors({ required: true });
      this.markFormGroupTouched();
      this.notificationService.showError('Debe seleccionar un equipo para este tipo de planificación');
      return;
    }

    this.isSubmitting.set(true);

    const formValue = this.form.value;
    
    if (this.isEditMode()) {
      this.updatePlanning(formValue);
    } else {
      this.createPlanning(formValue);
    }
  }

  private createPlanning(formValue: Record<string, unknown>): void {
    const createRequest: CreatePlanningRequest = {
      name: (formValue['name'] as string).trim(),
      description: (formValue['description'] as string)?.trim() || '',
      type: Number(formValue['type']),
      startDate: new Date(formValue['startDate'] as string),
      endDate: new Date(formValue['endDate'] as string),
      teamId: (formValue['teamId'] as string) || '',
      isTemplate: Boolean(formValue['isTemplate']),
      isPublic: Boolean(formValue['isPublic']),
      objectives: [], // Could be added in future
      tags: this.parseTags(formValue['tags'] as string)
    };

    this.planningsService.createPlanning(createRequest).subscribe({
      next: (planning) => {
        this.planningCreated.emit(planning);
        this.isSubmitting.set(false);
        this.onClose();
      },
      error: (error) => {
        console.error('Error creating planning:', error);
        this.notificationService.showError('Error al crear la planificación');
        this.isSubmitting.set(false);
      }
    });
  }

  private updatePlanning(formValue: Record<string, unknown>): void {
    if (!this.planning) return;

    const updateRequest: UpdatePlanningRequest = {
      name: (formValue['name'] as string).trim(),
      description: (formValue['description'] as string)?.trim() || '',
      type: Number(formValue['type']),

      status: Number(formValue['status']),
      startDate: new Date(formValue['startDate'] as string),
      endDate: new Date(formValue['endDate'] as string),
      isTemplate: Boolean(formValue['isTemplate']),
      isPublic: Boolean(formValue['isPublic']),
      objectives: [], // Could be added in future
      tags: this.parseTags(formValue['tags'] as string)
    };

    this.planningsService.updatePlanning(this.planning.id, updateRequest).subscribe({
      next: (planning) => {
        this.planningUpdated.emit(planning);
        this.isSubmitting.set(false);
        this.onClose();
      },
      error: (error) => {
        console.error('Error updating planning:', error);
        this.notificationService.showError('Error al actualizar la planificación');
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
    if (errors['dateRange']) return 'La fecha de fin debe ser posterior a la fecha de inicio';
    if (errors['atLeastOneDay']) return 'Debe seleccionar al menos un día de entrenamiento';

    return 'Valor inválido';
  }

  onTrainingDayChange(dayIndex: number, checked: boolean): void {
    const trainingDaysArray = this.form.get('trainingDays') as FormArray;
    trainingDaysArray.at(dayIndex)?.setValue(checked);
  }

  isTrainingDaySelected(dayIndex: number): boolean {
    const trainingDaysArray = this.form.get('trainingDays') as FormArray;
    return trainingDaysArray.at(dayIndex)?.value as boolean;
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting()) {
      this.onClose();
    }
  }

  getTeamName(teamId: string): string {
    const team = this.teams().find(t => t.id === teamId);
    return team ? team.name : 'Seleccionar equipo';
  }
}