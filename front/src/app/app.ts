import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TrainingService } from './services/training.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sportplanner-frontend');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly trainingService = inject(TrainingService);

  constructor() {
    // Log auth state when auth changes. Avoid calling backend here to prevent duplicate
    // requests; individual components should fetch user data when needed.
    effect(() => {
      const v = this.auth.isAuthenticated();
      console.debug('[App] isAuthenticated', v);
      // NOTE: Kept for visibility but removed backend call to avoid duplicate HTTP requests
      // (ProfileComponent and other components should call userService.me() themselves).
    });
  }

  async createDemoPlan() {
    try {
      // Use demo seeded Team id = 101
      const teamId = 101;
      const proposals = await firstValueFrom(this.trainingService.getPlanProposals(teamId));
      const top = proposals.slice(0, 4).map((p) => p.concept.id);
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 30);

      const dto = {
        name: 'Demo Auto Plan',
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        scheduleDays: [ { dayOfWeek: start.toLocaleDateString('en-US', { weekday: 'long' }), startTime: '18:00', endTime: '19:30', courtId: null } ],
        planConceptIds: top
      };
      const result = await firstValueFrom(this.trainingService.createSchedule(teamId, dto));
      console.debug('Created demo schedule', result);
      alert('Demo planning created successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to create demo schedule: ' + (err as any)?.message || err);
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
    } finally {
      // Always navigate to login to clear protected UI
      await this.router.navigate(['/login']);
    }
  }
}
