import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Team, CreateTeamRequest, UpdateTeamRequest, Gender, TeamLevel } from '../../../../../../models/team.model';
import { TeamsService } from '../../../../../../services/teams.service';
import { NotificationService } from '../../../../../../services/notification.service';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './team-modal.component.html',
  styleUrl: './team-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class TeamModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private teamsService = inject(TeamsService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  @Input({ required: true }) isOpen!: boolean;
  @Input({ required: true }) mode!: 'create' | 'edit';
  @Input() team: Team | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() teamSaved = new EventEmitter<Team>();

  readonly isSubmitting = signal<boolean>(false);
  readonly form: FormGroup;

  readonly modalTitle = computed(() => {
    return this.mode === 'create' ? 'Crear Nuevo Equipo' : 'Editar Equipo';
  });

  readonly submitButtonText = computed(() => {
    if (this.isSubmitting()) {
      return this.mode === 'create' ? 'Creando...' : 'Guardando...';
    }
    return this.mode === 'create' ? 'Crear Equipo' : 'Guardar Cambios';
  });

  // Predefined options
  readonly sportOptions = [
    'Fútbol', 'Básquet', 'Vóleibol', 'Handball', 'Tenis', 'Natación', 'Atletismo', 'Hockey', 'Rugby'
  ];

  readonly categoryOptions = [
    'Infantil', 'Cadete', 'Juvenil', 'Senior', 'Veteranos'
  ];

  readonly genderOptions = [
    { value: Gender.Male, label: 'Masculino' },
    { value: Gender.Female, label: 'Femenino' },
    { value: Gender.Mixed, label: 'Mixto' }
  ];

  readonly levelOptions = [
    { value: TeamLevel.A, label: 'Nivel A' },
    { value: TeamLevel.B, label: 'Nivel B' },
    { value: TeamLevel.C, label: 'Nivel C' }
  ];

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      sport: ['', [Validators.required]],
      category: ['', [Validators.required]],
      gender: [Gender.Mixed, [Validators.required]],
      level: [TeamLevel.B, [Validators.required]]
    });

    // Effect to populate form when team changes
    effect(() => {
      if (this.team && this.mode === 'edit') {
        this.populateForm(this.team);
      } else if (this.mode === 'create') {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    if (this.team && this.mode === 'edit') {
      this.populateForm(this.team);
    }
  }

  private populateForm(team: Team): void {
    this.form.patchValue({
      name: team.name,
      description: team.description || '',
      sport: team.sport,
      category: team.category || '',
      gender: team.gender,
      level: team.level
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      sport: '',
      category: '',
      gender: Gender.Mixed,
      level: TeamLevel.B
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
      this.createTeam(formValue);
    } else {
      this.updateTeam(formValue);
    }
  }

  private createTeam(formValue: any): void {
    const organizationId = this.authService.currentUser()?.organizationId;

    if (!organizationId) {
      this.notificationService.showError('No se pudo determinar la organización del usuario.');
      this.isSubmitting.set(false);
      return;
    }

    const createRequest: CreateTeamRequest = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || '',
      sport: formValue.sport,
      category: formValue.category,
      gender: Number(formValue.gender),
      level: Number(formValue.level),
      organizationId: organizationId
    };

    this.teamsService.createTeam(createRequest).subscribe({
      next: (team) => {
        this.teamSaved.emit(team);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error creating team:', error);
        this.notificationService.showError('Error al crear el equipo');
        this.isSubmitting.set(false);
      }
    });
  }

  private updateTeam(formValue: any): void {
    if (!this.team) return;

    const updateRequest: UpdateTeamRequest = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || '',
      sport: formValue.sport,
      category: formValue.category,
      gender: formValue.gender,
      level: formValue.level
    };

    this.teamsService.updateTeam(this.team.id, updateRequest).subscribe({
      next: (team) => {
        this.teamSaved.emit(team);
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Error updating team:', error);
        this.notificationService.showError('Error al actualizar el equipo');
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
    if (errors['pattern'] && fieldName === 'season') return 'Formato esperado: YYYY-YYYY (ej: 2023-2024)';

    return 'Valor inválido';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isSubmitting()) {
      this.onClose();
    }
  }
}
