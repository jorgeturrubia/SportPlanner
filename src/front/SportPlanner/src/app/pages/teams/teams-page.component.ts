import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamsService } from '../../core/services/teams.service';
import { Team, TeamsListResponse } from '../../core/models/team.interface';
import { TeamCardComponent } from '../../shared/components/team-card/team-card.component';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TeamCardComponent
  ],
  providers: [],
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.css']
})
export class TeamsPageComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly fb = inject(FormBuilder);

  // Page configuration
  readonly pageTitle = 'Gestión de Equipos';

  // Component state signals
  readonly teams = signal<Team[]>([]);
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

  // Form and options
  teamForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sport: ['', Validators.required],
    category: ['', Validators.required],
    gender: ['', Validators.required],
    level: ['', Validators.required],
    description: [''],
    maxPlayers: [22, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  // Form state
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  // Form options
  readonly sports = [
    { id: 'futbol', name: 'Fútbol', category: 'Colectivo' },
    { id: 'baloncesto', name: 'Baloncesto', category: 'Colectivo' },
    { id: 'voleibol', name: 'Voleibol', category: 'Colectivo' },
    { id: 'balonmano', name: 'Balonmano', category: 'Colectivo' },
    { id: 'tenis', name: 'Tenis', category: 'Individual' },
    { id: 'padel', name: 'Pádel', category: 'Individual' },
    { id: 'hockey', name: 'Hockey', category: 'Colectivo' },
    { id: 'rugby', name: 'Rugby', category: 'Colectivo' },
    { id: 'atletismo', name: 'Atletismo', category: 'Individual' },
    { id: 'natacion', name: 'Natación', category: 'Individual' }
  ];

  readonly categories = [
    'Prebenjamín',
    'Benjamín', 
    'Alevín',
    'Infantil',
    'Cadete',
    'Juvenil',
    'Junior',
    'Senior',
    'Veterano'
  ];

  readonly genders = [
    { id: 'masculino', name: 'Masculino' },
    { id: 'femenino', name: 'Femenino' },
    { id: 'mixto', name: 'Mixto' }
  ];

  readonly levels = [
    { id: 'A', name: 'Nivel A (Alto)' },
    { id: 'B', name: 'Nivel B (Medio)' },
    { id: 'C', name: 'Nivel C (Iniciación)' }
  ];

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
      next: (response: TeamsListResponse) => {
        this.teams.set(response.teams);
        this.updateFilteredTeams();
        this.hasTeams.set(response.teams.length > 0);
        this.showEmptyState.set(response.teams.length === 0);
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
      team.sport.name.toLowerCase().includes(searchTerm) ||
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
    this.teamForm.reset({
      name: '',
      sport: '',
      category: '',
      gender: '',
      level: '',
      description: '',
      maxPlayers: 22
    });
    this.createError.set(null);
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
   * Handle team creation form submission
   */
  onCreateTeam(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);

    const formValue = this.teamForm.value;
    const selectedSport = this.sports.find(sport => sport.id === formValue.sport);
    
    const teamData = {
      name: formValue.name,
      sportId: formValue.sport,
      category: formValue.category,
      gender: formValue.gender,
      level: formValue.level,
      description: formValue.description,
      maxPlayers: formValue.maxPlayers
    };

    this.teamsService.createTeam(teamData).subscribe({
      next: () => {
        this.loadTeams();
        this.closeModals();
        this.isCreating.set(false);
      },
      error: (error) => {
        this.createError.set(error.message || 'Error al crear el equipo');
        this.isCreating.set(false);
      }
    });
  }

  /**
   * Handle team update
   */
  onTeamUpdated(teamData: any): void {
    const team = this.selectedTeam();
    if (!team) return;
    
    this.teamsService.updateTeam(team.id, teamData).subscribe({
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