import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TeamsService } from '../../../../services/teams.service';
import { NotificationService } from '../../../../services/notification.service';
import { Team, CreateTeamRequest, TeamFilters } from '../../../../models/team.model';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { TeamModalComponent } from './components/team-modal/team-modal.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [NgIcon, TeamCardComponent, TeamModalComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class TeamsComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private notificationService = inject(NotificationService);

  readonly teams = this.teamsService.teams;
  readonly isLoading = this.teamsService.isLoading;
  
  readonly isModalOpen = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedTeam = signal<Team | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<TeamFilters>({});

  readonly filteredTeams = computed(() => {
    let filtered = this.teams();
    
    // Apply search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(team => 
        team.name.toLowerCase().includes(query) ||
        team.sport.toLowerCase().includes(query) ||
        team.category?.toLowerCase().includes(query) ||
        team.description?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    const filters = this.activeFilters();
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(team => team.isActive === filters.isActive);
    }

    return filtered;
  });

  readonly teamsCount = computed(() => this.filteredTeams().length);
  readonly activeTeamsCount = computed(() => 
    this.filteredTeams().filter(team => team.isActive).length
  );

  ngOnInit(): void {
    this.loadTeams();
  }

  private loadTeams(): void {
    this.teamsService.getAllTeams().subscribe();
  }

  onCreateTeam(): void {
    this.modalMode.set('create');
    this.selectedTeam.set(null);
    this.isModalOpen.set(true);
  }

  onEditTeam(team: Team): void {
    this.modalMode.set('edit');
    this.selectedTeam.set(team);
    this.isModalOpen.set(true);
  }

  onDeleteTeam(team: Team): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el equipo "${team.name}"?`)) {
      this.teamsService.deleteTeam(team.id).subscribe({
        next: () => {
          // Teams list is automatically updated via signals
        },
        error: (error) => {
          console.error('Error deleting team:', error);
        }
      });
    }
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedTeam.set(null);
  }

  onTeamSaved(savedTeam: Team): void {
    this.onModalClose();
    // Teams list is automatically updated via signals
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onRefresh(): void {
    this.teamsService.refreshTeams();
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