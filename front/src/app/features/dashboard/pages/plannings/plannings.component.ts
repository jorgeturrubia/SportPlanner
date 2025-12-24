import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Planning } from '../../../../core/models/planning.model';
import { TeamsService } from '../../../../services/teams.service';
import { ActivatedRoute } from '@angular/router';
import { SeasonService } from '../../../../services/season.service';

@Component({
    selector: 'app-plannings',
    standalone: true,
    imports: [CommonModule, ConfirmDialogComponent],
    templateUrl: './plannings.component.html'
})
export class PlanningsComponent implements OnInit {
    plannings = signal<Planning[]>([]);
    isLoading = signal(false);

    // Delete dialog
    showDeleteDialog = signal(false);
    isDeleting = signal(false);
    planningToDelete = signal<Planning | null>(null);
    isEmbedded = signal(false);

    currentTeamId = signal<number | null>(null);
    currentTeamName = signal<string>('');

    private seasonService = inject(SeasonService);

    constructor(
        private planningService: PlanningService,
        private router: Router,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private teamsService: TeamsService
    ) {
        effect(() => {
            const season = this.seasonService.currentSeason();
            // Trigger load when season changes
            this.loadPlannings();
        });
    }

    ngOnInit() {
        this.isEmbedded.set(this.router.url.includes('/management/'));
        this.route.queryParams.subscribe(params => {
            let tId = params['teamId'] ? +params['teamId'] : null;

            if (!tId && this.isEmbedded()) {
                // If embedded and no query param, check parent route (management/:id)
                // We use snapshot because the parent param is unlikely to change without a full reload or navigation
                const parentId = this.route.parent?.snapshot.paramMap.get('id');
                if (parentId) {
                    tId = +parentId;
                }
            }

            if (tId) {
                this.currentTeamId.set(tId);
                this.loadTeamDetails(tId);
            } else {
                this.currentTeamId.set(null);
                this.currentTeamName.set('');
            }
            this.loadPlannings();
        });
    }

    loadTeamDetails(teamId: number) {
        this.teamsService.getTeam(teamId).subscribe({
            next: (team) => this.currentTeamName.set(team.name),
            error: (err) => console.error('Error loading team details', err)
        });
    }

    loadPlannings() {
        this.isLoading.set(true);
        const currentSeason = this.seasonService.currentSeason();
        const teamId = this.currentTeamId() || undefined;
        const seasonId = currentSeason?.id || undefined;

        this.planningService.getPlannings(teamId, seasonId).subscribe({
            next: (data) => {
                this.plannings.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading plannings', err);
                this.isLoading.set(false);
            }
        });
    }

    createPlanning() {
        if (this.currentTeamId()) {
            this.router.navigate(['/dashboard/teams/planning', this.currentTeamId()], {
                queryParams: { returnUrl: this.router.url }
            });
        }
    }

    editPlanning(planning: Planning) {
        this.router.navigate(['/dashboard/teams/planning', planning.team.id, 'edit', planning.id], {
            queryParams: { returnUrl: this.router.url }
        });
    }

    deletePlanning(planning: Planning) {
        this.planningToDelete.set(planning);
        this.showDeleteDialog.set(true);
    }

    confirmDelete() {
        const planning = this.planningToDelete();
        if (!planning) return;

        this.isDeleting.set(true);
        this.planningService.deletePlanning(planning.id).subscribe({
            next: () => {
                this.loadPlannings();
                this.isDeleting.set(false);
                this.cancelDelete();
                this.notificationService.success('Planificación eliminada', 'La planificación ha sido eliminada correctamente.');
            },
            error: (err) => {
                console.error('Error deleting planning', err);
                this.isDeleting.set(false);
                this.notificationService.error('Error', 'No se pudo eliminar la planificación.');
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.planningToDelete.set(null);
        this.isDeleting.set(false);
    }

    viewPlanning(planning: Planning) {
        this.router.navigate(['/dashboard/plannings/view', planning.id]);
    }

    goToSessions(planning: Planning) {
        this.router.navigate(['/dashboard/trainings'], {
            queryParams: {
                teamId: planning.team.id,
                planningId: planning.id
            }
        });
    }


    getDayName(dayOfWeek: number): string {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return days[dayOfWeek] || '?';
    }
}
