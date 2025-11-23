import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SportsService, Sport, CreateSportDto, UpdateSportDto } from '../../../../../services/sports.service';
import { NotificationService } from '../../../../../services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-subscription-sports',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './subscription-sports.component.html',
    styleUrls: ['./subscription-sports.component.css']
})
export class SubscriptionSportsComponent implements OnInit {
    sports = signal<Sport[]>([]);
    isLoading = signal(false);
    showModal = signal(false);
    editMode = signal(false);
    currentSportId = signal<number | null>(null);
    sportForm: FormGroup;

    constructor(
        private sportsService: SportsService,
        private fb: FormBuilder,
        private notificationService: NotificationService
    ) {
        this.sportForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', Validators.maxLength(500)],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.loadSports();
    }

    loadSports() {
        this.isLoading.set(true);
        this.sportsService.getAll().pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: (sports) => {
                this.sports.set(sports);
            },
            error: (err) => {
                this.notificationService.error('Error', 'No se pudieron cargar los deportes');
                console.error('Error loading sports:', err);
            }
        });
    }

    openCreateModal() {
        this.editMode.set(false);
        this.currentSportId.set(null);
        this.sportForm.reset({ isActive: true });
        this.showModal.set(true);
    }

    openEditModal(sport: Sport) {
        this.editMode.set(true);
        this.currentSportId.set(sport.id);
        this.sportForm.patchValue({
            name: sport.name,
            description: sport.description || '',
            isActive: sport.isActive
        });
        this.showModal.set(true);
    }

    closeModal() {
        this.showModal.set(false);
        this.sportForm.reset();
    }

    saveSport() {
        if (this.sportForm.invalid) {
            this.notificationService.warning('Formulario incompleto', 'Por favor, completa todos los campos requeridos');
            return;
        }

        this.isLoading.set(true);
        const formValue = this.sportForm.value;

        const dto: CreateSportDto | UpdateSportDto = {
            name: formValue.name,
            description: formValue.description || undefined,
            isActive: formValue.isActive
        };

        const operation = this.editMode()
            ? this.sportsService.update(this.currentSportId()!, dto as UpdateSportDto)
            : this.sportsService.create(dto as CreateSportDto);

        operation.pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: () => {
                this.notificationService.success(
                    'Operación exitosa',
                    this.editMode() ? 'Deporte actualizado correctamente' : 'Deporte creado correctamente'
                );
                this.closeModal();
                this.loadSports();
            },
            error: (err) => {
                const message = err.error?.message || err.error || 'Error al guardar el deporte';
                this.notificationService.error('Error', message);
                console.error('Error saving sport:', err);
            }
        });
    }

    deleteSport(sport: Sport) {
        if (!confirm(`¿Estás seguro de que quieres eliminar el deporte "${sport.name}"?`)) {
            return;
        }

        this.isLoading.set(true);
        this.sportsService.delete(sport.id).pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: () => {
                this.notificationService.success('Operación exitosa', 'Deporte eliminado correctamente');
                this.loadSports();
            },
            error: (err) => {
                const message = err.error?.message || err.error || 'Error al eliminar el deporte';
                this.notificationService.error('Error', message);
                console.error('Error deleting sport:', err);
            }
        });
    }

    toggleActive(sport: Sport) {
        const dto: UpdateSportDto = {
            name: sport.name,
            description: sport.description,
            isActive: !sport.isActive
        };

        this.isLoading.set(true);
        this.sportsService.update(sport.id, dto).pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: () => {
                this.notificationService.success(
                    'Operación exitosa',
                    sport.isActive ? 'Deporte desactivado' : 'Deporte activado'
                );
                this.loadSports();
            },
            error: (err) => {
                this.notificationService.error('Error', 'No se pudo cambiar el estado del deporte');
                console.error('Error toggling sport:', err);
            }
        });
    }
}
