import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamsService } from '../../../../services/teams.service';
import { NotificationService } from '../../../../services/notification.service';
import { SubscriptionsService, Subscription } from '../../../../services/subscriptions.service';
import { LookupService, TeamCategory, TeamLevel } from '../../../../services/lookup.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

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
    
    // Confirm dialog properties
    showDeleteDialog = signal(false);
    isDeletingTeam = signal(false);
    teamToDelete = signal<any>(null);

    constructor(
        private teamsService: TeamsService,
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private subscriptionsService: SubscriptionsService,
        private lookupService: LookupService
    ) {
        this.teamForm = this.fb.group({
            name: ['', Validators.required],
            sportId: [null, Validators.required],
            teamCategoryId: [null],
            teamLevelId: [null]
        });
    }

    ngOnInit() {
        this.loadSubscriptions();
        this.loadTeams();
        this.loadLookups();
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
        this.teamsService.getMyTeams().subscribe({
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
            teamLevelId: team.teamLevelId
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

    managePlanning(team: any) {
        this.closeMenu();
        console.log('Manage planning for team', team);
        // Navigate to planning page when available
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
                this.teamsService.createTeam(this.teamForm.value).subscribe({
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
            teamLevelId: null
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
