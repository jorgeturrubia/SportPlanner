import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { TrainingSession } from '../../../../core/models/training-session.model';
import { TranslateModule } from '@ngx-translate/core';
import { TeamsService } from '../../../../services/teams.service';
import { Team } from '../../../../core/models/team.model';

@Component({
    selector: 'app-trainings',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './trainings.component.html'
})
export class TrainingsComponent implements OnInit {
    private trainingService = inject(TrainingSessionService);
    private teamsService = inject(TeamsService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    trainings = signal<TrainingSession[]>([]);
    teams = signal<Team[]>([]);
    selectedTeamId = signal<number | null>(null);
    selectedTeamName = signal<string>('');
    loading = signal(false);

    ngOnInit() {
        this.loading.set(true);
        this.teamsService.getMyTeams().subscribe({
            next: (teams) => {
                this.teams.set(teams);

                this.route.queryParams.subscribe(params => {
                    const queryTeamId = params['teamId'] ? +params['teamId'] : null;

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
        try {
            this.trainingService.getByTeam(teamId).subscribe(data => {
                this.trainings.set(data);
                this.loading.set(false);
            });
        } catch (e) {
            this.loading.set(false);
        }
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
