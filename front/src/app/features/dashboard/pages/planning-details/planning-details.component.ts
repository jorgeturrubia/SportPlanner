import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { Planning } from '../../../../core/models/planning.model';

@Component({
    selector: 'app-planning-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './planning-details.component.html'
})
export class PlanningDetailsComponent implements OnInit {
    planningId: number = 0;
    planning = signal<Planning | null>(null);
    isLoading = signal(true);
    weekDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private planningService: PlanningService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.planningId = +params['id'];
                this.loadPlanning();
            }
        });
    }

    loadPlanning() {
        this.isLoading.set(true);
        this.planningService.getPlanning(this.planningId).subscribe({
            next: (data) => {
                this.planning.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading planning', err);
                this.notificationService.error('Error', 'No se pudo cargar la planificación.');
                this.isLoading.set(false);
                this.router.navigate(['/dashboard/plannings']);
            }
        });
    }

    getDayName(day: number): string {
        return this.weekDays[day] || '';
    }

    editPlanning() {
        const p = this.planning();
        if (p && p.team) {
            this.router.navigate(['/dashboard/teams/planning', p.team.id, 'edit', p.id]);
        }
    }

    goBack() {
        this.router.navigate(['/dashboard/plannings']);
    }
}
