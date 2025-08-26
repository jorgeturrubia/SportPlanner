import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Subject, takeUntil } from 'rxjs';

import { TeamService } from '../../services/team.service';
import { ModalService } from '../../services/modal.service';
import { NotificationService } from '../../services/notification.service';
import { Team } from '../../models/team.model';
import { TeamCardComponent } from './team-card.component';
import { TeamModalComponent, TeamModalData } from './team-modal.component';
import { DeleteConfirmationDialogComponent, DeleteConfirmationData } from '../shared/delete-confirmation-dialog.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, NgIcon, TeamCardComponent],
  styleUrl: './teams.component.css',
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900">Equipos</h1>
          <p class="text-secondary-600 mt-1">Gestiona tus equipos deportivos</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search Input -->
          @if (teams().length > 0) {
            <div class="relative">
              <input
                type="text"
                placeholder="Buscar equipos..."
                class="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                [value]="searchQuery()"
                (input)="onSearchChange($event)"
              >
              <ng-icon name="heroMagnifyingGlass" class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400"></ng-icon>
            </div>
          }
          <button 
            (click)="openCreateModal()"
            class="btn-primary whitespace-nowrap"
            [disabled]="isLoading()"
          >
            <ng-icon name="heroUsers" class="h-4 w-4 mr-2"></ng-icon>
            Crear Equipo
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading() && teams().length === 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 animate-pulse">
              <div class="space-y-4">
                <div class="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div class="h-3 bg-secondary-200 rounded w-1/2"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-secondary-200 rounded"></div>
                  <div class="h-3 bg-secondary-200 rounded w-5/6"></div>
                </div>
                <div class="flex space-x-2">
                  <div class="h-6 bg-secondary-200 rounded w-16"></div>
                  <div class="h-6 bg-secondary-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Teams Grid -->
      @if (!isLoading() || teams().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <!-- Team Cards -->
          @for (team of filteredTeams(); track team.id) {
            <app-team-card
              [team]="team"
              [loading]="isLoading()"
              (view)="onViewTeam($event)"
              (edit)="onEditTeam($event)"
              (delete)="onDeleteTeam($event)"
            />
          }

          <!-- Empty State -->
          @if (filteredTeams().length === 0 && !isLoading()) {
            <div class="col-span-full">
              <div class="bg-white rounded-xl shadow-sm border border-secondary-200 p-12 text-center empty-state">
                @if (teams().length === 0) {
                  <!-- No teams at all -->
                  <ng-icon name="heroUsers" class="h-16 w-16 text-secondary-300 mx-auto mb-4"></ng-icon>
                  <h3 class="text-lg font-semibold text-secondary-900 mb-2">No tienes equipos aún</h3>
                  <p class="text-secondary-600 mb-6">Crea tu primer equipo para comenzar a organizar tus entrenamientos</p>
                  <button 
                    (click)="openCreateModal()"
                    class="btn-primary"
                  >
                    <ng-icon name="heroUsers" class="h-4 w-4 mr-2"></ng-icon>
                    Crear mi primer equipo
                  </button>
                } @else {
                  <!-- No search results -->
                  <ng-icon name="heroMagnifyingGlass" class="h-16 w-16 text-secondary-300 mx-auto mb-4"></ng-icon>
                  <h3 class="text-lg font-semibold text-secondary-900 mb-2">No se encontraron equipos</h3>
                  <p class="text-secondary-600 mb-6">No hay equipos que coincidan con tu búsqueda "{{ searchQuery() }}"</p>
                  <button 
                    (click)="clearSearch()"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
                  >
                    <ng-icon name="heroXMark" class="h-4 w-4 mr-2"></ng-icon>
                    Limpiar búsqueda
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center error-state">
          <ng-icon name="heroExclamationTriangle" class="h-12 w-12 text-red-400 mx-auto mb-4"></ng-icon>
          <h3 class="text-lg font-semibold text-secondary-900 mb-2">Error al cargar equipos</h3>
          <p class="text-secondary-600 mb-6">{{ error() }}</p>
          <button 
            (click)="loadTeams()"
            class="btn-primary"
          >
            <ng-icon name="heroArrowPath" class="h-4 w-4 mr-2"></ng-icon>
            Reintentar
          </button>
        </div>
      }
    </div>
  `
})
export class TeamsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly teamService = inject(TeamService);
  private readonly modalService = inject(ModalService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  teams = signal<Team[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  searchQuery = signal<string>('');

  // Computed signals
  filteredTeams = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) {
      return this.teams();
    }
    return this.teams().filter(team => 
      team.name.toLowerCase().includes(query) ||
      team.sport.toLowerCase().includes(query) ||
      team.category.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadTeams();
    this.subscribeToTeamUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeams(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.teamService.getTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams) => {
          this.teams.set(teams);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading teams:', error);
          this.error.set('No se pudieron cargar los equipos. Intenta nuevamente.');
          this.isLoading.set(false);
        }
      });
  }

  private subscribeToTeamUpdates(): void {
    this.teamService.getTeamsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(teams => {
        this.teams.set(teams);
      });
  }

  openCreateModal(): void {
    const modalData: TeamModalData = {
      mode: 'create'
    };

    const modalRef = this.modalService.open(TeamModalComponent, {
      title: 'Crear Nuevo Equipo',
      size: 'lg',
      data: modalData
    });

    // Pass modal reference and data to component
    if (modalRef.componentRef) {
      modalRef.componentRef.instance.modalRef = modalRef;
      modalRef.componentRef.instance.data = modalData;
    }

    // Handle modal result
    this.modalService.getModalResult(modalRef)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            console.log('Team created:', result);
            // Teams list will be updated automatically via service subscription
          }
        },
        error: (reason) => {
          console.log('Modal dismissed:', reason);
        }
      });
  }

  onViewTeam(team: Team): void {
    // TODO: Navigate to team details view
    console.log('View team:', team);
    this.notificationService.showInfo('Funcionalidad próximamente', 'La vista de detalles del equipo estará disponible pronto');
  }

  onEditTeam(team: Team): void {
    const modalData: TeamModalData = {
      mode: 'edit',
      team: team
    };

    const modalRef = this.modalService.open(TeamModalComponent, {
      title: 'Editar Equipo',
      size: 'lg',
      data: modalData
    });

    // Pass modal reference and data to component
    if (modalRef.componentRef) {
      modalRef.componentRef.instance.modalRef = modalRef;
      modalRef.componentRef.instance.data = modalData;
    }

    // Handle modal result
    this.modalService.getModalResult(modalRef)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            console.log('Team updated:', result);
            // Teams list will be updated automatically via service subscription
          }
        },
        error: (reason) => {
          console.log('Modal dismissed:', reason);
        }
      });
  }

  onDeleteTeam(team: Team): void {
    const confirmationData: DeleteConfirmationData = {
      title: '¿Eliminar equipo?',
      message: 'Esta acción eliminará permanentemente el equipo y todos sus datos asociados.',
      itemName: team.name,
      confirmText: 'Eliminar equipo',
      cancelText: 'Cancelar',
      destructive: true
    };

    const modalRef = this.modalService.open(DeleteConfirmationDialogComponent, {
      title: 'Confirmar eliminación',
      size: 'md',
      data: confirmationData,
      backdrop: true,
      keyboard: true
    });

    // Pass modal reference and data to component
    if (modalRef.componentRef) {
      modalRef.componentRef.instance.modalRef = modalRef;
      modalRef.componentRef.instance.data = confirmationData;
    }

    // Handle confirmation result
    this.modalService.getModalResult(modalRef)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (confirmed) => {
          if (confirmed) {
            this.performTeamDeletion(team);
          }
        },
        error: (reason) => {
          console.log('Delete confirmation dismissed:', reason);
        }
      });
  }

  private performTeamDeletion(team: Team): void {
    this.teamService.deleteTeam(team.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Success notification is handled by the service
          console.log('Team deleted successfully:', team);
        },
        error: (error) => {
          console.error('Error deleting team:', error);
          // Error notification is handled by the service
          // Show additional user-friendly error message
          this.notificationService.showError(
            'Error al eliminar equipo',
            `No se pudo eliminar el equipo "${team.name}". Intenta nuevamente.`
          );
        }
      });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}