import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PlanningService } from '../../../../services/planning.service';
import { NotificationService } from '../../../../services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Planning } from '../../../../core/models/planning.model';

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

    constructor(
        private planningService: PlanningService,
        private router: Router,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.loadPlannings();
    }

    loadPlannings() {
        this.isLoading.set(true);
        this.planningService.getPlannings().subscribe({
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
