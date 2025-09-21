import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, computed, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../../../../../../models/team.model';
import { MastersService, Sport, Category, SportGender, Level } from '../../../../../../services/masters.service';
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
  private mastersService = inject(MastersService);
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

  // Options from masters service
  readonly sportOptions = this.mastersService.sports;
  readonly categoryOptions = this.mastersService.categories;
  readonly sportGenderOptions = this.mastersService.sportGenders;
  readonly levelOptions = this.mastersService.levels;

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      sportId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      sportGenderId: [null, [Validators.required]],
      levelId: [null, [Validators.required]]
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
    // Ensure masters data is loaded
    if (this.mastersService.sports().length === 0) {
      this.mastersService.loadAllMasters().subscribe();
    }

    if (this.team && this.mode === 'edit') {
      this.populateForm(this.team);
    }
  }

  private populateForm(team: Team): void {
    this.form.patchValue({
      name: team.name,
      description: team.description || '',
      sportId: team.sportId,
      categoryId: team.categoryId,
      sportGenderId: team.sportGenderId,
      levelId: team.levelId
    });
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      description: '',
      sportId: null,
      categoryId: null,
      sportGenderId: null,
      levelId: null
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
      sportId: formValue.sportId,
      categoryId: formValue.categoryId,
      sportGenderId: formValue.sportGenderId,
      levelId: formValue.levelId,
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
      sportId: formValue.sportId,
      categoryId: formValue.categoryId,
      sportGenderId: formValue.sportGenderId,
      levelId: formValue.levelId
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
