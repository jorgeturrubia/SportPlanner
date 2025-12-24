import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { TrainingSession } from '../../../../core/models/training-session.model';
import { TranslateModule } from '@ngx-translate/core';
import { TeamsService } from '../../../../services/teams.service';
import { Team } from '../../../../core/models/team.model';
import { PlanningService } from '../../../../services/planning.service';
import { Planning } from '../../../../core/models/planning.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-trainings',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule, FormsModule],
    templateUrl: './trainings.component.html'
})
export class TrainingsComponent implements OnInit {
    private trainingService = inject(TrainingSessionService);
    private teamsService = inject(TeamsService);
    private planningService = inject(PlanningService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    trainings = signal<TrainingSession[]>([]);
    teams = signal<Team[]>([]);
    selectedTeamId = signal<number | null>(null);
    selectedTeamName = signal<string>('');
    loading = signal(false);
    isEmbedded = signal(false);

    // Filtering
    planningIdFilter = signal<number | null | 'none'>(null);
    allPlannings = signal<Planning[]>([]);
    allTrainings = signal<TrainingSession[]>([]);

    ngOnInit() {
        this.isEmbedded.set(this.router.url.includes('/management/'));
        this.loading.set(true);
        this.teamsService.getMyTeams().subscribe({
            next: (teams) => {
                this.teams.set(teams);

                this.route.queryParams.subscribe(params => {
                    let queryTeamId = params['teamId'] ? +params['teamId'] : null;
                    const queryPlanningId = params['planningId'] ? +params['planningId'] : null;

                    if (queryPlanningId) {
                        this.planningIdFilter.set(queryPlanningId);
                    }

                    if (!queryTeamId && this.isEmbedded()) {
                        const parentId = this.route.parent?.snapshot.paramMap.get('id');
                        if (parentId) {
                            queryTeamId = +parentId;
                        }
                    }

                    if (queryTeamId) {
                        const team = teams.find(t => t.id === queryTeamId);
                        if (team) {
                            this.selectedTeamId.set(team.id);
                            this.selectedTeamName.set(team.name);
                            this.loadTrainings(team.id);
                        } else {
                            // Team from URL not found in my teams, load default
                            this.loadDefaultTeam(teams);
                        }
                    } else {
                        this.loadDefaultTeam(teams);
                    }
                });
            },
            error: () => this.loading.set(false)
        });
    }

    loadDefaultTeam(teams: Team[]) {
        if (teams.length > 0) {
            this.selectedTeamId.set(teams[0].id);
            this.selectedTeamName.set(teams[0].name);
            this.loadTrainings(teams[0].id);
        } else {
            this.loading.set(false);
        }
    }

    async loadTrainings(teamId: number) {
        this.selectedTeamId.set(teamId);
        const team = this.teams().find(t => t.id === teamId);
        if (team) this.selectedTeamName.set(team.name);

        this.loading.set(true);

        // Load plannings for filter
        this.planningService.getPlannings(teamId).subscribe(plannings => {
            this.allPlannings.set(plannings);
        });

        try {
            this.trainingService.getByTeam(teamId).subscribe(data => {
                this.allTrainings.set(data);
                this.applyFilter();
                this.loading.set(false);
            });
        } catch (e) {
            this.loading.set(false);
        }
    }

    applyFilter() {
        const filter = this.planningIdFilter();
        const all = this.allTrainings();

        if (filter === null) {
            this.trainings.set(all);
        } else if (filter === 'none') {
            this.trainings.set(all.filter(t => !t.planningId));
        } else {
            this.trainings.set(all.filter(t => t.planningId === filter));
        }
    }

    onFilterChange(value: any) {
        const val = value === 'null' ? null : (value === 'none' ? 'none' : +value);
        this.planningIdFilter.set(val as any);
        this.applyFilter();
    }


    addTraining() {
        if (this.selectedTeamId()) {
            this.router.navigate(['/dashboard/trainings/new'], { queryParams: { teamId: this.selectedTeamId() } });
        }
    }

    editTraining(id: number) {
        this.router.navigate(['/dashboard/trainings/edit', id]);
    }
}
