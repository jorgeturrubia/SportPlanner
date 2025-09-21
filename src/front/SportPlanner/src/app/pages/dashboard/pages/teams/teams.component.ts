import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TeamsService } from '../../../../services/teams.service';
import { MastersService } from '../../../../services/masters.service';
import { SubscriptionService } from '../../../../services/subscription.service';
import { NotificationService } from '../../../../services/notification.service';
import { Team, CreateTeamRequest, TeamFilters } from '../../../../models/team.model';
import { SportType } from '../../../../models/subscription.model';
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
  private mastersService = inject(MastersService);
  private subscriptionService = inject(SubscriptionService);
  private notificationService = inject(NotificationService);

  readonly teams = this.teamsService.teams;
  readonly isLoading = this.teamsService.isLoading;
  
  readonly isModalOpen = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedTeam = signal<Team | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<TeamFilters>({});

  // Subscription data
  readonly subscriptionSport = signal<SportType | null>(null);
  readonly subscriptionSportId = computed(() => {
    const sport = this.subscriptionSport();
    if (sport === null) return null;

    // Map SportType enum to master sport ID
    // This mapping should match the seeded data
    const sportMapping: { [key in SportType]: number } = {
      [SportType.Football]: 1,    // Fútbol
      [SportType.Basketball]: 2,  // Baloncesto
      [SportType.Tennis]: 10,     // Pádel (closest match)
      [SportType.Volleyball]: 3,  // Voleibol
      [SportType.Rugby]: 9,       // Rugby
      [SportType.Handball]: 4,    // Balonmano
      [SportType.Hockey]: 8,      // Hockey
      [SportType.Baseball]: 1,    // Fútbol (fallback)
      [SportType.Swimming]: 6,    // Natación
      [SportType.Athletics]: 7,   // Atletismo
      [SportType.Other]: 1        // Fútbol (fallback)
    };

    return sportMapping[sport] || 1;
  });

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
    console.log('🏃 TEAMS COMPONENT INIT');
    console.log('  🔒 Is authenticated:', this.teamsService['authService'].isAuthenticated());
    console.log('  👤 Current user:', this.teamsService['authService'].currentUser()?.email);
    this.loadSubscriptionData();
    this.loadTeams();
  }

  private loadSubscriptionData(): void {
    console.log('📋 LOADING SUBSCRIPTION DATA...');
    this.subscriptionService.getSubscriptionStatus().subscribe({
      next: (status) => {
        if (status.hasActiveSubscription && status.activeSubscription) {
          console.log('✅ Active subscription found:', status.activeSubscription.sport);
          this.subscriptionSport.set(status.activeSubscription.sport);
        } else {
          console.log('⚠️ No active subscription found');
          this.subscriptionSport.set(null);
        }
      },
      error: (error) => {
        console.error('❌ Error loading subscription data:', error);
        this.subscriptionSport.set(null);
      }
    });
  }

  private loadTeams(): void {
    console.log('📋 LOADING TEAMS...');
    this.teamsService.getAllTeams().subscribe({
      next: (teams) => {
        console.log('✅ Teams loaded successfully:', teams.length, 'teams');
      },
      error: (error) => {
        console.error('❌ Error loading teams:', error);
      }
    });
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