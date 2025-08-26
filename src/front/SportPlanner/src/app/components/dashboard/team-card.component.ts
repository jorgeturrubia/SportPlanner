import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Team, Gender, TeamLevel } from '../../models/team.model';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-secondary-200 hover:shadow-md transition-shadow duration-200 group">
      <!-- Card Header -->
      <div class="p-6 pb-4">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">
              {{ team.name }}
            </h3>
            <p class="text-sm text-secondary-600 mt-1">{{ team.sport }} • {{ team.category }}</p>
          </div>
          
          <!-- Status Indicator -->
          <div class="flex items-center space-x-2 ml-4">
            @if (team.isActive) {
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                <span class="w-1.5 h-1.5 bg-success-400 rounded-full mr-1.5"></span>
                Activo
              </span>
            } @else {
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                <span class="w-1.5 h-1.5 bg-secondary-400 rounded-full mr-1.5"></span>
                Inactivo
              </span>
            }
          </div>
        </div>

        <!-- Description -->
        @if (team.description) {
          <p class="text-sm text-secondary-600 mt-3 line-clamp-2">{{ team.description }}</p>
        }
      </div>

      <!-- Card Body -->
      <div class="px-6 pb-4">
        <!-- Team Details -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex items-center text-sm text-secondary-600">
            <ng-icon name="heroUser" class="h-4 w-4 mr-2 text-secondary-400"></ng-icon>
            <span>{{ getGenderLabel(team.gender) }}</span>
          </div>
          <div class="flex items-center text-sm text-secondary-600">
            <ng-icon name="heroAcademicCap" class="h-4 w-4 mr-2 text-secondary-400"></ng-icon>
            <span>Nivel {{ team.level }}</span>
          </div>
        </div>

        <!-- Member Count -->
        @if (team.memberCount !== undefined) {
          <div class="flex items-center text-sm text-secondary-600 mb-4">
            <ng-icon name="heroUsers" class="h-4 w-4 mr-2 text-secondary-400"></ng-icon>
            <span>{{ team.memberCount }} {{ team.memberCount === 1 ? 'miembro' : 'miembros' }}</span>
          </div>
        }

        <!-- Created Date -->
        <div class="flex items-center text-xs text-secondary-500">
          <ng-icon name="heroCalendarDays" class="h-3 w-3 mr-1.5"></ng-icon>
          <span>Creado {{ formatDate(team.createdAt) }}</span>
        </div>
      </div>

      <!-- Card Actions -->
      <div class="px-6 py-4 bg-secondary-50 rounded-b-xl border-t border-secondary-100">
        <div class="flex items-center justify-between">
          <!-- Action Buttons -->
          <div class="flex items-center space-x-2">
            <button
              (click)="onView()"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors duration-200"
              [attr.aria-label]="'Ver detalles de ' + team.name"
            >
              <ng-icon name="heroEye" class="h-3 w-3 mr-1"></ng-icon>
              Ver
            </button>
            
            <button
              (click)="onEdit()"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-secondary-700 bg-white hover:bg-secondary-50 border border-secondary-200 rounded-md transition-colors duration-200"
              [attr.aria-label]="'Editar ' + team.name"
            >
              <ng-icon name="heroPencil" class="h-3 w-3 mr-1"></ng-icon>
              Editar
            </button>
          </div>

          <!-- Delete Button -->
          <div class="relative">
            <button
              (click)="toggleDeleteConfirmation()"
              class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-error-700 bg-error-50 hover:bg-error-100 rounded-md transition-colors duration-200"
              [class.bg-error-100]="showDeleteConfirmation()"
              [attr.aria-label]="'Eliminar ' + team.name"
            >
              <ng-icon name="heroTrash" class="h-3 w-3 mr-1"></ng-icon>
              Eliminar
            </button>

            <!-- Delete Confirmation Dropdown -->
            @if (showDeleteConfirmation()) {
              <div class="absolute right-0 bottom-full mb-2 w-64 bg-white rounded-lg shadow-lg border border-secondary-200 p-4 z-10">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <ng-icon name="heroExclamationTriangle" class="h-5 w-5 text-error-500"></ng-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-secondary-900 mb-1">¿Eliminar equipo?</h4>
                    <p class="text-xs text-secondary-600 mb-3">
                      Esta acción no se puede deshacer. Se eliminará permanentemente "{{ team.name }}".
                    </p>
                    <div class="flex items-center space-x-2">
                      <button
                        (click)="onDelete()"
                        class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-white bg-error-600 hover:bg-error-700 rounded-md transition-colors duration-200"
                      >
                        Eliminar
                      </button>
                      <button
                        (click)="toggleDeleteConfirmation()"
                        class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-secondary-700 bg-white hover:bg-secondary-50 border border-secondary-200 rounded-md transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TeamCardComponent {
  @Input({ required: true }) team!: Team;
  @Input() loading = false;

  @Output() view = new EventEmitter<Team>();
  @Output() edit = new EventEmitter<Team>();
  @Output() delete = new EventEmitter<Team>();

  showDeleteConfirmation = signal(false);

  onView(): void {
    this.view.emit(this.team);
  }

  onEdit(): void {
    this.edit.emit(this.team);
  }

  onDelete(): void {
    this.delete.emit(this.team);
    this.showDeleteConfirmation.set(false);
  }

  toggleDeleteConfirmation(): void {
    this.showDeleteConfirmation.set(!this.showDeleteConfirmation());
  }

  getGenderLabel(gender: Gender): string {
    const labels = {
      [Gender.MALE]: 'Masculino',
      [Gender.FEMALE]: 'Femenino',
      [Gender.MIXED]: 'Mixto'
    };
    return labels[gender] || gender;
  }

  getLevelLabel(level: TeamLevel): string {
    const labels = {
      [TeamLevel.A]: 'Avanzado',
      [TeamLevel.B]: 'Intermedio',
      [TeamLevel.C]: 'Principiante'
    };
    return labels[level] || level;
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'ayer';
    } else if (diffDays < 7) {
      return `hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
    } else {
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}