import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../../../services/teams.service';
import { NotificationService } from '../../../../services/notification.service';
import { SubscriptionsService, Subscription } from '../../../../services/subscriptions.service';
import { LookupService, TeamCategory, TeamLevel } from '../../../../services/lookup.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SeasonService } from '../../../../services/season.service';
import { SportsService, Sport } from '../../../../services/sports.service';

@Component({
    selector: 'app-teams',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
    templateUrl: './teams.component.html',
})
export class TeamsComponent implements OnInit {
    teams = signal<any[]>([]);
    showForm = signal(false);
    teamForm: FormGroup;
    isLoading = signal(false);
    activeSubscriptions = signal<Subscription[]>([]);
    hasActiveSubscription = signal(false);
    teamCategories = signal<TeamCategory[]>([]);
    teamLevels = signal<TeamLevel[]>([]);
    sports = signal<Sport[]>([]);

    private seasonService = inject(SeasonService);

    // Confirm dialog properties
    showDeleteDialog = signal(false);
    isDeletingTeam = signal(false);
    teamToDelete = signal<any>(null);

    constructor(
        private teamsService: TeamsService,
        private fb: FormBuilder,
        private router: Router,
        private notificationService: NotificationService,
        private subscriptionsService: SubscriptionsService,
        private lookupService: LookupService,
        private sportsService: SportsService
    ) {
        this.teamForm = this.fb.group({
            name: ['', Validators.required],
            sportId: [1, Validators.required], // Default to 1 (Football) for now
            teamCategoryId: [null],
            teamLevelId: [null],
            currentTechnicalLevel: [5, [Validators.min(0), Validators.max(10)]],
            currentTacticalLevel: [5, [Validators.min(0), Validators.max(10)]]
        });

        // Effect to reload teams when season changes
        effect(() => {
            const season = this.seasonService.currentSeason();
            this.loadTeams();
        });
    }

    ngOnInit() {
        this.loadSubscriptions();
        this.loadLookups();
        this.loadSports();
    }

    loadSports() {
        this.sportsService.getAll().subscribe({
            next: (sports) => this.sports.set(sports),
            error: (err) => console.error('Error loading sports', err)
        });
    }

    getSportName(team: any): string {
        // 1. If the team object already has the sport name populated
        if (team.sport?.name) return team.sport.name;

        // 2. Try to find by ID in our loaded sports list
        const sportId = team.sportId || team.teamCategory?.sportId;
        if (sportId) {
            const sport = this.sports().find(s => s.id == sportId);
            if (sport) return sport.name;
        }

        // 3. Fallback to active subscriptions
        const activeSubs = this.activeSubscriptions();
        if (activeSubs.length > 0) {
            // If we have a sportId but it's not in the 'sports' list, it might be in the subscriptions
            if (sportId) {
                const subMatch = activeSubs.find(s => s.sportId == sportId);
                if (subMatch?.sport?.name) return subMatch.sport.name;
            }

            // If we can't find a match but have active subscriptions, use the first one's sport name
            if (activeSubs[0].sport?.name) return activeSubs[0].sport.name;
        }

        return this.sports().length > 0 ? 'DEPORTE' : 'CARGANDO...';
    }

    loadLookups() {
        this.lookupService.getTeamCategories().subscribe({
            next: (categories) => this.teamCategories.set(categories),
            error: (err) => console.error('Error loading team categories', err)
        });

        this.lookupService.getTeamLevels().subscribe({
            next: (levels) => this.teamLevels.set(levels),
            error: (err) => console.error('Error loading team levels', err)
        });
    }

    loadSubscriptions() {
        this.subscriptionsService.getMySubscriptions().subscribe({
            next: (subscriptions) => {
                const active = subscriptions.filter(s => s.isActive);
                this.activeSubscriptions.set(active);
                this.hasActiveSubscription.set(active.length > 0);

                if (active.length > 0) {
                    // Set the first active subscription's sport as default
                    this.teamForm.patchValue({ sportId: active[0].sportId });
                } else {
                    this.notificationService.warning(
                        'No Active Subscription',
                        'You need an active subscription to create teams. Please subscribe to a sport first.'
                    );
                }
            },
            error: (err) => {
                console.error('Error loading subscriptions', err);
                this.notificationService.error(
                    'Error',
                    'Failed to load your subscriptions. Please try again.'
                );
            }
        });
    }

    loadTeams() {
        this.isLoading.set(true);
        const seasonId = this.seasonService.currentSeason()?.id;
        this.teamsService.getMyTeams(seasonId).subscribe({
            next: (data) => {
                console.log('Teams loaded:', data);
                this.teams.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading teams', err);
                this.isLoading.set(false);
            }
        });
    }

    activeMenuId = signal<number | null>(null);
    editingTeamId = signal<number | null>(null);

    toggleMenu(teamId: number, event: Event) {
        event.stopPropagation();
        if (this.activeMenuId() === teamId) {
            this.activeMenuId.set(null);
        } else {
            this.activeMenuId.set(teamId);
        }
    }

    closeMenu() {
        this.activeMenuId.set(null);
    }

    editTeam(team: any) {
        this.closeMenu();
        this.editingTeamId.set(team.id);
        this.teamForm.patchValue({
            name: team.name,
            sportId: team.sportId,
            teamCategoryId: team.teamCategoryId,
            teamLevelId: team.teamLevelId,
            currentTechnicalLevel: team.currentTechnicalLevel || 5,
            currentTacticalLevel: team.currentTacticalLevel || 5
        });
        this.showForm.set(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteTeam(team: any) {
        this.closeMenu();
        this.teamToDelete.set(team);
        this.showDeleteDialog.set(true);
    }

    confirmDeleteTeam() {
        const team = this.teamToDelete();
        if (!team) return;

        this.isDeletingTeam.set(true);
        this.teamsService.deleteTeam(team.id).subscribe({
            next: () => {
                this.loadTeams();
                this.isDeletingTeam.set(false);
                this.cancelDeleteTeam(); // Close dialog
                this.notificationService.success('Equipo eliminado', 'El equipo ha sido eliminado correctamente.');
            },
            error: (err) => {
                console.error('Error deleting team', err);
                this.isDeletingTeam.set(false);
                this.notificationService.error(
                    'Error',
                    'No se pudo eliminar el equipo. Inténtalo de nuevo.'
                );
            }
        });
    }

    cancelDeleteTeam() {
        this.showDeleteDialog.set(false);
        this.teamToDelete.set(null);
        this.isDeletingTeam.set(false);
    }

    toggleTeamActive(team: any) {
        this.closeMenu();
        this.isLoading.set(true);
        this.teamsService.toggleActive(team.id).subscribe({
            next: (res) => {
                // Update local state without reloading everything if possible, or just reload
                this.loadTeams();
                this.isLoading.set(false);
                this.notificationService.success(
                    'Estado actualizado',
                    `El equipo ha sido ${res.isActive ? 'activado' : 'desactivado'} correctamente.`
                );
            },
            error: (err) => {
                console.error('Error toggling team status', err);
                this.isLoading.set(false);
            }
        });
    }

    viewTeam(team: any) {
        this.closeMenu();
        this.editTeam(team);
    }

    viewTrainings(team: any) {
        this.closeMenu();
        this.router.navigate(['/dashboard/trainings'], { queryParams: { teamId: team.id } });
    }

    manageTeam(team: any) {
        this.closeMenu();
        this.router.navigate(['/dashboard/teams/management', team.id]);
    }

    managePlanning(team: any) {
        this.closeMenu();
        this.router.navigate(['/dashboard/plannings'], { queryParams: { teamId: team.id } });
    }

    onSubmit() {
        if (this.teamForm.valid) {
            this.isLoading.set(true);

            if (this.editingTeamId()) {
                this.teamsService.updateTeam(this.editingTeamId()!, this.teamForm.value).subscribe({
                    next: (res) => {
                        this.loadTeams();
                        this.resetForm();
                        this.isLoading.set(false);
                        this.notificationService.success('Equipo actualizado', 'Los cambios se han guardado correctamente.');
                    },
                    error: (err) => {
                        console.error('Error updating team', err);
                        this.isLoading.set(false);
                    }
                });
            } else {
                const formValue = this.teamForm.value;
                const currentSeason = this.seasonService.currentSeason();
                const payload = { ...formValue, seasonId: currentSeason?.id || null };

                this.teamsService.createTeam(payload).subscribe({
                    next: (res) => {
                        this.loadTeams();
                        this.resetForm();
                        this.isLoading.set(false);
                    },
                    error: (err) => {
                        console.error('Error creating team', err);
                        this.isLoading.set(false);
                    }
                });
            }
        } else {
            this.notificationService.warning(
                'Formulario incompleto',
                'Por favor completa todos los campos requeridos antes de continuar.'
            );
        }
    }

    resetForm() {
        this.showForm.set(false);
        this.editingTeamId.set(null);
        const currentSportId = this.activeSubscriptions()[0]?.sportId || null;
        this.teamForm.reset({
            sportId: currentSportId,
            teamCategoryId: null,
            teamLevelId: null,
            currentTechnicalLevel: 5,
            currentTacticalLevel: 5
        });
    }

    toggleForm() {
        if (!this.hasActiveSubscription()) {
            this.notificationService.warning(
                'No Active Subscription',
                'You need an active subscription to create teams. Please subscribe to a sport first.'
            );
            return;
        }
        if (this.showForm()) {
            this.resetForm();
        } else {
            this.showForm.set(true);
        }
    }
}
