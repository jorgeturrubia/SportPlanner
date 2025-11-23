import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SubscriptionsService, Sport, SubscriptionPlan } from '../../services/subscriptions.service';
import { AuthService } from '../../services/auth.service';
import { finalize, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
    sports = signal<Sport[]>([]);
    plans = signal<SubscriptionPlan[]>([]);
    selectedSport = signal<Sport | null>(null);
    selectedPlan = signal<SubscriptionPlan | null>(null);
    isLoading = signal(false);
    error = signal<string | null>(null);
    step = signal<'sport' | 'plan' | 'confirm'>('sport');

    constructor(
        private subscriptionsService: SubscriptionsService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading.set(true);
        this.subscriptionsService.getSports().pipe(
            switchMap(sports => {
                this.sports.set(sports);
                return this.subscriptionsService.getSubscriptionPlans();
            }),
            finalize(() => this.isLoading.set(false)),
            catchError(err => {
                this.error.set('Error loading data. Please try again.');
                console.error('Error loading data:', err);
                return of([]);
            })
        ).subscribe(plans => {
            this.plans.set(plans);
        });
    }

    selectSport(sport: Sport) {
        this.selectedSport.set(sport);
        this.step.set('plan');
    }

    selectPlan(plan: SubscriptionPlan) {
        this.selectedPlan.set(plan);
        this.step.set('confirm');
    }

    goBack() {
        if (this.step() === 'plan') {
            this.step.set('sport');
            this.selectedSport.set(null);
        } else if (this.step() === 'confirm') {
            this.step.set('plan');
            this.selectedPlan.set(null);
        }
    }

    confirmSubscription() {
        const sport = this.selectedSport();
        const plan = this.selectedPlan();

        if (!sport || !plan) {
            this.error.set('Please select both a sport and a plan');
            return;
        }

        this.isLoading.set(true);
        this.error.set(null);

        this.subscriptionsService.createSubscription({
            sportId: sport.id,
            planId: plan.id
        }).pipe(
            finalize(() => this.isLoading.set(false)),
            catchError(err => {
                this.error.set(err.error?.message || 'Error creating subscription. Please try again.');
                console.error('Error creating subscription:', err);
                return of(null);
            })
        ).subscribe(subscription => {
            if (subscription) {
                // Subscription created successfully, redirect to dashboard
                this.router.navigate(['/dashboard']);
            }
        });
    }

    async logout() {
        await this.authService.signOut();
        this.router.navigate(['/login']);
    }
}
