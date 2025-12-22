import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlanMonitor, PlanMonitorCategory, PlanMonitorConcept, PlanMonitorSession, Planning } from '../../../../core/models/planning.model';
import { PlanningService } from '../../../../services/planning.service';

@Component({
    selector: 'app-plan-info',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './plan-info.component.html',
    styleUrls: ['./plan-info.component.css']
})
export class PlanInfoComponent implements OnInit {
    planningId!: number;
    planMonitor: PlanMonitor | null = null;
    plannings: Planning[] = [];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('planningId') || params.get('id'); // Support both route params
            if (id) {
                this.planningId = +id;
                this.loadData();
            } else {
                this.planningId = NaN; // Reset ID if navigating back
                this.loadPlannings();
            }
        });
    }

    loadPlannings(): void {
        this.loading = true;
        this.planningService.getPlannings().subscribe({
            next: (data) => {
                this.plannings = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading plannings:', err);
                this.loading = false;
            }
        });
    }

    selectPlanning(id: number): void {
        this.router.navigate(['/dashboard/plannings/info', id]);
    }

    loadData(): void {
        this.loading = true;
        this.planningService.getPlanMonitor(this.planningId).subscribe({
            next: (data) => {
                this.planMonitor = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading plan monitor:', err);
                this.loading = false;
            }
        });
    }

    // Helper to get execution count for a specific cell
    getExecutionCount(concept: PlanMonitorConcept, sessionId: number): number {
        const exc = concept.executions.find(e => e.trainingSessionId === sessionId);
        return exc ? exc.count : 0;
    }

    // Helper to check if execution exists
    hasExecution(concept: PlanMonitorConcept, sessionId: number): boolean {
        return this.getExecutionCount(concept, sessionId) > 0;
    }
}
