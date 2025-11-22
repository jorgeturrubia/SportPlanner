import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrainingScheduleService } from '../../../../services/training-schedule.service';
import { NotificationService } from '../../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-plannings',
    standalone: true,
    imports: [CommonModule, ConfirmDialogComponent],
    templateUrl: './plannings.component.html'
})
export class PlanningsComponent implements OnInit {
    schedules = signal<any[]>([]);
    isLoading = signal(false);

    // Delete dialog
    showDeleteDialog = signal(false);
    isDeleting = signal(false);
    scheduleToDelete = signal<any>(null);

    constructor(
        private planningService: TrainingScheduleService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.loadSchedules();
    }

    loadSchedules() {
        this.isLoading.set(true);
        this.planningService.getMySchedules().subscribe({
            next: (data) => {
                this.schedules.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading schedules', err);
                this.isLoading.set(false);
            }
        });
    }

    editSchedule(schedule: any) {
        this.router.navigate(['/dashboard/teams/planning', schedule.teamId, 'edit', schedule.id]);
    }

    deleteSchedule(schedule: any) {
        this.scheduleToDelete.set(schedule);
        this.showDeleteDialog.set(true);
    }

    confirmDelete() {
        const schedule = this.scheduleToDelete();
        if (!schedule) return;

        this.isDeleting.set(true);
        this.planningService.deleteSchedule(schedule.id).subscribe({
            next: () => {
                this.loadSchedules();
                this.isDeleting.set(false);
                this.cancelDelete();
                this.notificationService.success('Planificación eliminada', 'La planificación ha sido eliminada correctamente.');
            },
            error: (err) => {
                console.error('Error deleting schedule', err);
                this.isDeleting.set(false);
                this.notificationService.error('Error', 'No se pudo eliminar la planificación.');
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog.set(false);
        this.scheduleToDelete.set(null);
        this.isDeleting.set(false);
    }

    viewSchedule(schedule: any) {
        this.router.navigate(['/dashboard/plannings/view', schedule.id]);
    }
}
