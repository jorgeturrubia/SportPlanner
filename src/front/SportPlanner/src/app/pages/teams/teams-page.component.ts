import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlus, heroMagnifyingGlass } from '@ng-icons/heroicons/outline';

import { TeamsService } from '../../core/services/teams.service';
import { Team } from '../../core/models/team.interface';
import { TeamCardComponent } from './components/team-card/team-card.component';
import { TeamModalComponent } from './components/team-modal/team-modal.component';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgIconComponent,
    TeamCardComponent,
    TeamModalComponent,
    ConfirmationModalComponent
  ],
  providers: [
    provideIcons({
      heroPlus,
      heroMagnifyingGlass
    })
  ],
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.css']
})
export class TeamsPageComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly fb = inject(FormBuilder);

  // Page configuration
  readonly pageTitle = 'Gestión de Equipos';

  // Form and loading state
  teamForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sport: ['', Validators.required],
    category: ['', Validators.required],
    gender: ['', Validators.required],
    level: ['', Validators.required],
    description: [''],
    maxPlayers: [25, [Validators.required, Validators.min(1), Validators.max(50)]]
  });
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  // Component state signals
  readonly teams = signal<Team[]>([]);
  
  // Form options
  readonly sports = [
    { id: 'football', name: 'Fútbol' },
    { id: 'basketball', name: 'Baloncesto' },
    { id: 'volleyball', name: 'Voleibol' },
    { id: 'tennis', name: 'Tenis' },
    { id: 'handball', name: 'Balonmano' }
  ];
  
  readonly categories = [
    'Juvenil', 'Senior', 'Veterano', 'Infantil', 'Cadete'
  ];
  
  readonly genders = [
    { id: 'male', name: 'Masculino' },
    { id: 'female', name: 'Femenino' },
    { id: 'mixed', name: 'Mixto' }
  ];
  
  readonly levels = [
    { id: 'beginner', name: 'Principiante' },
    { id: 'intermediate', name: 'Intermedio' },
    { id: 'advanced', name: 'Avanzado' },
    { id: 'professional', name: 'Profesional' }
  ];
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');

  // Modal state signals
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedTeam = signal<Team | null>(null);

  // Computed properties
  readonly filteredTeams = signal<Team[]>([]);
  readonly hasTeams = signal(false);
  readonly showEmptyState = signal(false);

  ngOnInit(): void {
    this.loadTeams();
  }

  /**
   * Load teams from service
   */
  loadTeams(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.teamsService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.updateFilteredTeams();
        this.hasTeams.set(teams.length > 0);
        this.showEmptyState.set(teams.length === 0);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Update filtered teams based on search term
   */
  private updateFilteredTeams(): void {
    const searchTerm = this.searchTerm().toLowerCase();
    const teams = this.teams();

    if (!searchTerm) {
      this.filteredTeams.set(teams);
      return;
    }

    const filtered = teams.filter(team =>
      team.name.toLowerCase().includes(searchTerm) ||
      team.sport.toLowerCase().includes(searchTerm) ||
      team.category.toLowerCase().includes(searchTerm)
    );

    this.filteredTeams.set(filtered);
  }

  /**
   * Handle search input
   */
  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.updateFilteredTeams();
  }

  /**
   * Open create team modal
   */
  openCreateModal(): void {
    this.selectedTeam.set(null);
    this.showCreateModal.set(true);
  }

  /**
   * Open edit team modal
   */
  openEditModal(team: Team): void {
    this.selectedTeam.set(team);
    this.showEditModal.set(true);
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(team: Team): void {
    this.selectedTeam.set(team);
    this.showDeleteModal.set(true);
  }

  /**
   * Close all modals
   */
  closeModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedTeam.set(null);
  }

  /**
   * Handle team creation from form
   */
  onCreateTeam(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    const teamData = this.teamForm.value;
    
    this.teamsService.createTeam(teamData).subscribe({
      next: () => {
        this.loadTeams();
        this.closeModals();
        this.teamForm.reset();
        this.isCreating.set(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.isCreating.set(false);
      }
    });
  }

  /**
   * Handle team creation from modal
   */
  onTeamCreated(team: Team): void {
    this.teamsService.createTeam(team).subscribe({
      next: () => {
        this.loadTeams();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message);
      }
    });
  }

  /**
   * Handle team update
   */
  onTeamUpdated(team: Team): void {
    this.teamsService.updateTeam(team.id, team).subscribe({
      next: () => {
        this.loadTeams();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message);
      }
    });
  }

  /**
   * Handle team deletion
   */
  onTeamDeleted(): void {
    const team = this.selectedTeam();
    if (!team) return;

    this.teamsService.deleteTeam(team.id).subscribe({
      next: () => {
        this.loadTeams();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message);
      }
    });
  }

  /**
   * Clear error message
   */
  clearError(): void {
    this.error.set(null);
    this.teamsService.clearError();
  }

  /**
   * Retry loading teams
   */
  retryLoad(): void {
    this.clearError();
    this.loadTeams();
  }
}