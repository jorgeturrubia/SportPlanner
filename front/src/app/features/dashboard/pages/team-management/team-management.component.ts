import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../../../services/teams.service';
import { Team } from '../../../../core/models/team.model';
import { TeamLevel } from '../../../../services/lookup.service';

@Component({
    selector: 'app-team-management',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './team-management.component.html'
})
export class TeamManagementComponent implements OnInit {
    private route = inject(ActivatedRoute);
    public router = inject(Router);
    private teamsService = inject(TeamsService);

    teamId = signal<number | null>(null);
    team = signal<Team | null>(null);
    isLoading = signal(false);

    // For active tab styling
    activeTab = signal<string>('plannings');

    constructor() {
        // Optional: Watch route changes if needed deeply, 
        // but route params subscription in ngOnInit is usually enough.
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.teamId.set(+id);
                this.loadTeam(+id);
            }
        });

        // Determine active tab based on URL
        this.router.events.subscribe(() => {
            this.updateActiveTab();
        });
        this.updateActiveTab();
    }

    updateActiveTab() {
        const url = this.router.url;
        if (url.includes('/plannings')) this.activeTab.set('plannings');
        else if (url.includes('/sessions')) this.activeTab.set('sessions');
        else if (url.includes('/calendar')) this.activeTab.set('calendar');
        else if (url.includes('/players')) this.activeTab.set('players');
    }

    loadTeam(id: number) {
        this.isLoading.set(true);
        this.teamsService.getTeam(id).subscribe({
            next: (data) => {
                this.team.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading team', err);
                this.isLoading.set(false);
            }
        });
    }

    // Pre-calculate query params for strict preservation
    get queryParams() {
        return { teamId: this.teamId() };
    }
}
