import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DatePipe } from '@angular/common';
import { PlanningsService } from '../../services/plannings.service';
import { NotificationService } from '../../services/notification.service';
import { Planning, CreatePlanningRequest, PlanningFilters, PlanningType, PlanningStatus } from '../../models/planning.model';

@Component({
  selector: 'app-plannings',
  standalone: true,
  imports: [NgIcon, DatePipe],
  templateUrl: './plannings.html',
  styleUrl: './plannings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class Plannings implements OnInit {
  private planningsService = inject(PlanningsService);
  private notificationService = inject(NotificationService);

  readonly plannings = this.planningsService.plannings;
  readonly isLoading = this.planningsService.isLoading;
  
  readonly isModalOpen = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedPlanning = signal<Planning | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<PlanningFilters>({});

  readonly filteredPlannings = computed(() => {
    let filtered = this.plannings();
    
    // Apply search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(planning => 
        planning.name.toLowerCase().includes(query) ||
        planning.description.toLowerCase().includes(query) ||
        planning.teamName?.toLowerCase().includes(query) ||
        planning.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters using the service method
    const filters = this.activeFilters();
    if (Object.keys(filters).length > 0) {
      filtered = this.planningsService.filterPlannings(filters);
    }

    return filtered;
  });

  readonly planningsCount = computed(() => this.filteredPlannings().length);
  readonly activePlanningsCount = computed(() => 
    this.filteredPlannings().filter(planning => planning.status === PlanningStatus.Active).length
  );

  ngOnInit(): void {
    this.loadPlannings();
  }

  private loadPlannings(): void {
    this.planningsService.getAllPlannings().subscribe();
  }

  onCreatePlanning(): void {
    this.modalMode.set('create');
    this.selectedPlanning.set(null);
    this.isModalOpen.set(true);
  }

  onEditPlanning(planning: Planning): void {
    this.modalMode.set('edit');
    this.selectedPlanning.set(planning);
    this.isModalOpen.set(true);
  }

  onDeletePlanning(planning: Planning): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la planificación "${planning.name}"?`)) {
      this.planningsService.deletePlanning(planning.id).subscribe({
        next: () => {
          // Plannings list is automatically updated via signals
        },
        error: (error) => {
          console.error('Error deleting planning:', error);
        }
      });
    }
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedPlanning.set(null);
  }

  onPlanningSaved(savedPlanning: Planning): void {
    this.onModalClose();
    // Plannings list is automatically updated via signals
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onRefresh(): void {
    this.planningsService.refreshPlannings();
  }

  onToggleStatusFilter(): void {
    const currentFilters = this.activeFilters();
    const newFilters = { ...currentFilters };
    
    if (newFilters.status === undefined) {
      newFilters.status = PlanningStatus.Active; // Show only active
    } else if (newFilters.status === PlanningStatus.Active) {
      newFilters.status = PlanningStatus.Draft; // Show only drafts
    } else if (newFilters.status === PlanningStatus.Draft) {
      newFilters.status = PlanningStatus.Completed; // Show only completed
    } else {
      delete newFilters.status; // Show all
    }
    
    this.activeFilters.set(newFilters);
  }

  getFilterButtonText(): string {
    const filters = this.activeFilters();
    if (filters.status === PlanningStatus.Active) return 'Solo Activas';
    if (filters.status === PlanningStatus.Draft) return 'Solo Borradores';
    if (filters.status === PlanningStatus.Completed) return 'Solo Completadas';
    return 'Todas';
  }

  getStatusBadgeClass(status: PlanningStatus): string {
    switch (status) {
      case PlanningStatus.Draft:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case PlanningStatus.Active:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case PlanningStatus.Completed:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case PlanningStatus.Archived:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  }

  getStatusText(status: PlanningStatus): string {
    switch (status) {
      case PlanningStatus.Draft:
        return 'Borrador';
      case PlanningStatus.Active:
        return 'Activa';
      case PlanningStatus.Completed:
        return 'Completada';
      case PlanningStatus.Archived:
        return 'Archivada';
      default:
        return 'Desconocido';
    }
  }

  getTypeText(type: PlanningType): string {
    switch (type) {
      case PlanningType.Weekly:
        return 'Semanal';
      case PlanningType.Monthly:
        return 'Mensual';
      case PlanningType.Seasonal:
        return 'Temporada';
      case PlanningType.Tournament:
        return 'Torneo';
      default:
        return 'Otro';
    }
  }
}