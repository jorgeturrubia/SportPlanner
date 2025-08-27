import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Subject, takeUntil, finalize } from 'rxjs';

import { ModalRef } from '../../services/modal.service';
import { TeamService } from '../../services/team.service';
import { NotificationService } from '../../services/notification.service';
import { FormErrorHandlerService } from '../../services/form-error-handler.service';
import { ErrorBoundaryService } from '../../services/error-boundary.service';
import { Team, CreateTeamRequest, UpdateTeamRequest, Gender, TeamLevel } from '../../models/team.model';
import { FormErrorDisplayComponent } from '../shared/form-error-display.component';

export interface TeamModalData {
  team?: Team;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon, FormErrorDisplayComponent],
  styleUrl: './team-modal.component.css',
  template: `
    <div class="w-full max-w-md mx-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-secondary-900">
          {{ isEditMode() ? 'Editar Equipo' : 'Crear Nuevo Equipo' }}
        </h2>
        <button
          type="button"
          (click)="dismiss()"
          class="rounded-md p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
          [disabled]="isSubmitting()"
        >
          <ng-icon name="heroXMark" class="h-4 w-4"></ng-icon>
        </button>
      </div>

      <!-- Form -->
      <form [formGroup]="teamForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Team Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-secondary-700 mb-1">
            Nombre del Equipo *
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            [class]="formErrorHandler.getFieldClasses(teamForm.get('name'), 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2')"
            placeholder="Ingresa el nombre del equipo"
            [disabled]="isSubmitting()"
          />
          <app-form-error-display
            [control]="teamForm.get('name')"
            fieldName="name"
          />
        </div>

        <!-- Sport -->
        <div>
          <label for="sport" class="block text-sm font-medium text-secondary-700 mb-1">
            Deporte *
          </label>
          <select
            id="sport"
            formControlName="sport"
            [class]="formErrorHandler.getFieldClasses(teamForm.get('sport'), 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2')"
            [disabled]="isSubmitting()"
          >
            <option value="">Selecciona un deporte</option>
            @for (sport of sportOptions; track sport.value) {
              <option [value]="sport.value">{{ sport.label }}</option>
            }
          </select>
          <app-form-error-display
            [control]="teamForm.get('sport')"
            fieldName="sport"
          />
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-secondary-700 mb-1">
            Categoría *
          </label>
          <select
            id="category"
            formControlName="category"
            class="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            [class.border-error-500]="isFieldInvalid('category')"
            [disabled]="isSubmitting()"
          >
            <option value="">Selecciona una categoría</option>
            @for (category of categoryOptions; track category.value) {
              <option [value]="category.value">{{ category.label }}</option>
            }
          </select>
          @if (isFieldInvalid('category')) {
            <p class="mt-1 text-sm text-error-600">
              Debes seleccionar una categoría
            </p>
          }
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-sm font-medium text-secondary-700 mb-1">
            Género *
          </label>
          <select
            id="gender"
            formControlName="gender"
            class="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            [class.border-error-500]="isFieldInvalid('gender')"
            [disabled]="isSubmitting()"
          >
            <option value="">Selecciona el género</option>
            @for (gender of genderOptions; track gender.value) {
              <option [value]="gender.value">{{ gender.label }}</option>
            }
          </select>
          @if (isFieldInvalid('gender')) {
            <p class="mt-1 text-sm text-error-600">
              Debes seleccionar el género
            </p>
          }
        </div>

        <!-- Level -->
        <div>
          <label for="level" class="block text-sm font-medium text-secondary-700 mb-1">
            Nivel *
          </label>
          <select
            id="level"
            formControlName="level"
            class="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            [class.border-error-500]="isFieldInvalid('level')"
            [disabled]="isSubmitting()"
          >
            <option value="">Selecciona el nivel</option>
            @for (level of levelOptions; track level.value) {
              <option [value]="level.value">{{ level.label }}</option>
            }
          </select>
          @if (isFieldInvalid('level')) {
            <p class="mt-1 text-sm text-error-600">
              Debes seleccionar el nivel
            </p>
          }
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-secondary-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            formControlName="description"
            rows="3"
            class="w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            [class.border-error-500]="isFieldInvalid('description')"
            placeholder="Descripción opcional del equipo"
            [disabled]="isSubmitting()"
          ></textarea>
          @if (isFieldInvalid('description')) {
            <p class="mt-1 text-sm text-error-600">
              La descripción no puede exceder 500 caracteres
            </p>
          }
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-secondary-200">
          <button
            type="button"
            (click)="dismiss()"
            class="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-300 rounded-md hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 transition-colors duration-200"
            [disabled]="isSubmitting()"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            [disabled]="teamForm.invalid || isSubmitting()"
          >
            @if (isSubmitting()) {
              <div class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isEditMode() ? 'Actualizando...' : 'Creando...' }}
              </div>
            } @else {
              {{ isEditMode() ? 'Actualizar Equipo' : 'Crear Equipo' }}
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class TeamModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly fb = inject(FormBuilder);
  private readonly teamService = inject(TeamService);
  private readonly notificationService = inject(NotificationService);
  readonly formErrorHandler = inject(FormErrorHandlerService);
  private readonly errorBoundary = inject(ErrorBoundaryService);

  // Modal reference and data
  modalRef?: ModalRef<TeamModalComponent>;
  data?: TeamModalData;

  // Form and state
  teamForm!: FormGroup;
  isSubmitting = signal(false);
  
  // Computed properties
  isEditMode = computed(() => this.data?.mode === 'edit');
  currentTeam = computed(() => this.data?.team);

  // Dropdown options
  readonly sportOptions = [
    { value: 'basketball', label: 'Baloncesto' },
    { value: 'football', label: 'Fútbol' },
    { value: 'volleyball', label: 'Voleibol' },
    { value: 'tennis', label: 'Tenis' },
    { value: 'handball', label: 'Balonmano' },
    { value: 'swimming', label: 'Natación' },
    { value: 'athletics', label: 'Atletismo' },
    { value: 'other', label: 'Otro' }
  ];

  readonly categoryOptions = [
    { value: 'youth', label: 'Juvenil' },
    { value: 'senior', label: 'Senior' },
    { value: 'veteran', label: 'Veterano' },
    { value: 'junior', label: 'Junior' },
    { value: 'cadet', label: 'Cadete' },
    { value: 'infant', label: 'Infantil' },
    { value: 'benjamin', label: 'Benjamín' },
    { value: 'alevin', label: 'Alevín' }
  ];

  readonly genderOptions = [
    { value: Gender.MALE, label: 'Masculino' },
    { value: Gender.FEMALE, label: 'Femenino' },
    { value: Gender.MIXED, label: 'Mixto' }
  ];

  readonly levelOptions = [
    { value: TeamLevel.A, label: 'Nivel A (Avanzado)' },
    { value: TeamLevel.B, label: 'Nivel B (Intermedio)' },
    { value: TeamLevel.C, label: 'Nivel C (Principiante)' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    const team = this.currentTeam();
    
    this.teamForm = this.fb.group({
      name: [
        team?.name || '', 
        [
          Validators.required, 
          Validators.minLength(2), 
          Validators.maxLength(50)
        ]
      ],
      sport: [team?.sport || '', [Validators.required]],
      category: [team?.category || '', [Validators.required]],
      gender: [team?.gender || '', [Validators.required]],
      level: [team?.level || '', [Validators.required]],
      description: [
        team?.description || '', 
        [Validators.maxLength(500)]
      ]
    });
  }

  private setupFormValidation(): void {
    // Real-time validation feedback
    this.teamForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Mark fields as touched for immediate validation feedback
        Object.keys(this.teamForm.controls).forEach(key => {
          const control = this.teamForm.get(key);
          if (control && control.invalid && control.dirty) {
            control.markAsTouched();
          }
        });
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formErrorHandler.isFieldInvalid(this.teamForm.get(fieldName));
  }

  onSubmit(): void {
    if (this.teamForm.invalid || this.isSubmitting()) {
      this.formErrorHandler.markAllFieldsAsTouched(this.teamForm);
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.teamForm.value;

    const teamData: CreateTeamRequest | UpdateTeamRequest = {
      name: formValue.name.trim(),
      sport: formValue.sport,
      category: formValue.category,
      gender: formValue.gender,
      level: formValue.level,
      description: formValue.description?.trim() || undefined
    };

    const operation = () => this.isEditMode() 
      ? this.teamService.updateTeam(this.currentTeam()!.id, teamData as UpdateTeamRequest)
      : this.teamService.createTeam(teamData as CreateTeamRequest);

    this.errorBoundary.handleFormSubmission(operation, {
      form: this.teamForm,
      context: this.isEditMode() ? 'actualizar equipo' : 'crear equipo',
      successMessage: this.isEditMode() 
        ? `El equipo "${teamData.name}" ha sido actualizado exitosamente`
        : `El equipo "${teamData.name}" ha sido creado exitosamente`,
      retryConfig: {
        maxRetries: 1,
        delayMs: 1000,
        retryCondition: (error) => {
          // Don't retry validation errors or conflicts
          return ![400, 409, 422].includes(error.status);
        }
      },
      onSuccess: (team) => {
        this.close(team);
      },
      onError: (error) => {
        // Handle form-specific validation errors
        if (error.status === 422 && error.error?.errors) {
          this.formErrorHandler.handleServerValidationErrors(this.teamForm, error.error.errors);
        }
      }
    })
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe();
  }

  close(result?: any): void {
    if (this.modalRef) {
      this.modalRef.close(result);
    }
  }

  dismiss(reason?: any): void {
    if (this.modalRef) {
      this.modalRef.dismiss(reason);
    }
  }


}