import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ObjectivesService } from '../../../../services/objectives.service';
import { NotificationService } from '../../../../services/notification.service';
import { Objective, CreateObjectiveRequest, ObjectiveFilters } from '../../../../models/objective.model';
import { ObjectiveCardComponent } from './components/objective-card/objective-card.component';
import { ObjectiveModalComponent } from './components/objective-modal/objective-modal.component';

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [NgIcon, ObjectiveCardComponent, ObjectiveModalComponent],
  templateUrl: './objectives.component.html',
  styleUrl: './objectives.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class ObjectivesComponent implements OnInit {
  private objectivesService = inject(ObjectivesService);
  private notificationService = inject(NotificationService);

  readonly objectives = this.objectivesService.objectives;
  readonly isLoading = this.objectivesService.isLoading;
  
  readonly isModalOpen = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedObjective = signal<Objective | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<ObjectiveFilters>({});

  readonly filteredObjectives = computed(() => {
    let filtered = this.objectives();
    
    // Apply search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(objective => 
        objective.title.toLowerCase().includes(query) ||
        objective.description.toLowerCase().includes(query) ||
        objective.teamName?.toLowerCase().includes(query) ||
        objective.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    const filters = this.activeFilters();
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(objective => objective.isActive === filters.isActive);
    }

    if (filters.priority !== undefined) {
      filtered = filtered.filter(objective => objective.priority === filters.priority);
    }

    if (filters.status !== undefined) {
      filtered = filtered.filter(objective => objective.status === filters.status);
    }

    return filtered;
  });

  readonly objectivesCount = computed(() => this.filteredObjectives().length);
  readonly activeObjectivesCount = computed(() => 
    this.filteredObjectives().filter(objective => objective.isActive).length
  );

  ngOnInit(): void {
    this.loadObjectives();
  }

  private loadObjectives(): void {
    this.objectivesService.getAllObjectives().subscribe();
  }

  onCreateObjective(): void {
    this.modalMode.set('create');
    this.selectedObjective.set(null);
    this.isModalOpen.set(true);
  }

  onEditObjective(objective: Objective): void {
    this.modalMode.set('edit');
    this.selectedObjective.set(objective);
    this.isModalOpen.set(true);
  }

  onDeleteObjective(objective: Objective): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el objetivo "${objective.title}"?`)) {
      this.objectivesService.deleteObjective(objective.id).subscribe({
        next: () => {
          // Objectives list is automatically updated via signals
        },
        error: (error) => {
          console.error('Error deleting objective:', error);
        }
      });
    }
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedObjective.set(null);
  }

  onObjectiveSaved(savedObjective: Objective): void {
    this.onModalClose();
    // Objectives list is automatically updated via signals
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onRefresh(): void {
    this.objectivesService.refreshObjectives();
  }

  onToggleActiveFilter(): void {
    const currentFilters = this.activeFilters();
    const newFilters = { ...currentFilters };
    
    if (newFilters.isActive === undefined) {
      newFilters.isActive = true; // Show only active
    } else if (newFilters.isActive === true) {
      newFilters.isActive = false; // Show only inactive
    } else {
      delete newFilters.isActive; // Show all
    }
    
    this.activeFilters.set(newFilters);
  }

  getFilterButtonText(): string {
    const filters = this.activeFilters();
    if (filters.isActive === true) return 'Solo Activos';
    if (filters.isActive === false) return 'Solo Inactivos';
    return 'Todos';
  }
}