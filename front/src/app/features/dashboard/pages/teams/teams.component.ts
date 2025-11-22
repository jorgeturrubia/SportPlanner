import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamsService } from '../../../../services/teams.service';
import { NotificationService } from '../../../../services/notification.service';
import { SubscriptionsService, Subscription } from '../../../../services/subscriptions.service';

@Component({
    selector: 'app-teams',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './teams.component.html',
})
export class TeamsComponent implements OnInit {
    teams = signal<any[]>([]);
    showForm = signal(false);
    teamForm: FormGroup;
    isLoading = signal(false);
    activeSubscriptions = signal<Subscription[]>([]);
    hasActiveSubscription = signal(false);

    constructor(
        private teamsService: TeamsService,
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private subscriptionsService: SubscriptionsService
    ) {
        this.teamForm = this.fb.group({
            name: ['', Validators.required],
            sportId: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.loadSubscriptions();
        this.loadTeams();
    }

    loadSubscriptions() {
        this.subscriptionsService.getMySubscriptions().subscribe({
            next: (subscriptions) => {
                const active = subscriptions.filter(s => s.isActive);
                this.activeSubscriptions.set(active);
                this.hasActiveSubscription.set(active.length > 0);

                if (active.length > 0) {
                    // Set the first active subscription's sport as default
                    this.teamForm.patchValue({ sportId: active[0].sportId });
                } else {
                    this.notificationService.warning(
                        'No Active Subscription',
                        'You need an active subscription to create teams. Please subscribe to a sport first.'
                    );
                }
            },
            error: (err) => {
                console.error('Error loading subscriptions', err);
                this.notificationService.error(
                    'Error',
                    'Failed to load your subscriptions. Please try again.'
                );
            }
        });
    }

    loadTeams() {
        this.isLoading.set(true);
        this.teamsService.getMyTeams().subscribe({
            next: (data) => {
                this.teams.set(data);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Error loading teams', err);
                this.isLoading.set(false);
            }
        });
    }

    toggleForm() {
        if (!this.hasActiveSubscription()) {
            this.notificationService.warning(
                'No Active Subscription',
                'You need an active subscription to create teams. Please subscribe to a sport first.'
            );
            return;
        }
        this.showForm.update(v => !v);
    }

    onSubmit() {
        if (this.teamForm.valid) {
            this.isLoading.set(true);
            this.teamsService.createTeam(this.teamForm.value).subscribe({
                next: (res) => {
                    // ✅ El interceptor muestra automáticamente: "Registro creado exitosamente"
                    this.loadTeams();
                    this.showForm.set(false);
                    // Reset with the current sport ID from active subscription
                    const currentSportId = this.activeSubscriptions()[0]?.sportId || null;
                    this.teamForm.reset({ sportId: currentSportId });
                    this.isLoading.set(false);
                },
                error: (err) => {
                    // ❌ El interceptor maneja automáticamente el error
                    console.error('Error creating team', err);
                    this.isLoading.set(false);
                }
            });
        } else {
            // Notificación manual para formulario inválido
            this.notificationService.warning(
                'Formulario incompleto',
                'Por favor completa todos los campos requeridos antes de continuar.'
            );
        }
    }
}
