import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingScheduleService } from '../../../../services/training-schedule.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
    selector: 'app-planning-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './planning-details.component.html'
})
export class PlanningDetailsComponent implements OnInit {
    scheduleId: number = 0;
    schedule = signal<any>(null);
    isLoading = signal(true);
    weekDaysEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    weekDaysEs = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private planningService: TrainingScheduleService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.scheduleId = +params['id'];
                this.loadSchedule();
            }
        });
    }

    loadSchedule() {
        this.isLoading.set(true);
        this.planningService.getScheduleById(this.scheduleId).subscribe({
            next: (data) => {
                this.schedule.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading schedule', err);
                this.notificationService.error('Error', 'No se pudo cargar la planificación.');
                this.isLoading.set(false);
                this.router.navigate(['/dashboard/plannings']);
            }
        });
    }

    getDayName(dayEn: string): string {
        const index = this.weekDaysEn.indexOf(dayEn);
        return index !== -1 ? this.weekDaysEs[index] : dayEn;
    }

    editSchedule() {
        const s = this.schedule();
        if (s) {
            this.router.navigate(['/dashboard/teams/planning', s.teamId, 'edit', s.id]);
        }
    }

    goBack() {
        this.router.navigate(['/dashboard/plannings']);
    }
}
