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
            if (params['teamId']) {
                this.currentTeamId.set(+params['teamId']);
                this.loadTeamDetails(this.currentTeamId()!);
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
        this.planningService.getPlannings().subscribe({
            next: (data) => {
                let filteredData = data;

                // Filter by Team
                if (this.currentTeamId()) {
                    filteredData = filteredData.filter(p => p.team?.id === this.currentTeamId());
                }

                // Filter by Season (Date Range)
                const currentSeason = this.seasonService.currentSeason();
                if (currentSeason) {
                    const seasonStart = new Date(currentSeason.startDate).getTime();
                    const seasonEnd = new Date(currentSeason.endDate).getTime();

                    filteredData = filteredData.filter(p => {
                        const planningStart = new Date(p.startDate).getTime();
                        // Check if planning starts within the season
                        // (We use a lenient check: planning must start within the season or generally overlap. 
                        //  Strictly speaking, plannings are usually created FOR a season, so start date check is standard.)
                        return planningStart >= seasonStart && planningStart <= seasonEnd;
                    });
                }

                this.plannings.set(filteredData);
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
            this.router.navigate(['/dashboard/teams/planning', this.currentTeamId()]);
        }
    }

    editPlanning(planning: Planning) {
        this.router.navigate(['/dashboard/teams/planning', planning.team.id, 'edit', planning.id]);
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

    getDayName(dayOfWeek: number): string {
        const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        return days[dayOfWeek] || '?';
    }
}
