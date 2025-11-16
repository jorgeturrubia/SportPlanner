import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { TrainingService } from './services/training.service';
import { LookupService } from './services/lookup.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf, NgFor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sportplanner-frontend');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly trainingService = inject(TrainingService);
  private readonly lookupService = inject(LookupService);

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

  // Proposal UI state
  protected readonly showPlanModal = signal(false);
  protected readonly proposalTeamId = signal(101);
  protected readonly overrideLevelId = signal<number | null>(null);
  protected readonly overrideCategoryId = signal<number | null>(null);
  protected readonly proposals = signal<any[]>([]);
  protected readonly selectedConceptIds = signal<number[]>([]);
  protected readonly teamLevels = signal<any[]>([]);
  protected readonly teamCategories = signal<any[]>([]);
  protected readonly planName = signal<string>('Auto Plan');
  protected readonly planStartDate = signal<string>('');
  protected readonly planEndDate = signal<string>('');
  protected readonly planStartTime = signal<string>('18:00');
  protected readonly planEndTime = signal<string>('19:30');

  openPlanModal() {
    this.showPlanModal.set(true);
    // set default date values
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 30);
    this.planStartDate.set(start.toISOString().slice(0, 10));
    this.planEndDate.set(end.toISOString().slice(0, 10));

    // Load team levels/categories from backend
    this.lookupService.getTeamLevels().subscribe((levels) => this.teamLevels.set(levels));
    this.lookupService.getTeamCategories().subscribe((cats) => this.teamCategories.set(cats));
  }

  closePlanModal() {
    this.showPlanModal.set(false);
    this.proposals.set([]);
    this.selectedConceptIds.set([]);
  }

  async proposeConcepts() {
    try {
      const teamId = +this.proposalTeamId();
      const overrideLevelId = this.overrideLevelId();
      const overrideCategoryId = this.overrideCategoryId();
      const proposals = await firstValueFrom(this.trainingService.getPlanProposals(teamId, overrideLevelId ?? undefined, overrideCategoryId ?? undefined));
      this.proposals.set(proposals);
      // auto select top suggested or top 4
      const suggested = proposals.filter((p) => p.isSuggested).map((p) => p.concept.id);
      if (suggested.length > 0) {
        this.selectedConceptIds.set(suggested);
      } else {
        this.selectedConceptIds.set(proposals.slice(0, 4).map((p) => p.concept.id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to get proposals: ' + String((err as any)?.message || err));
    }
  }

  toggleConceptSelection(conceptId: number) {
    const sel = [...this.selectedConceptIds()];
    const idx = sel.indexOf(conceptId);
    if (idx >= 0) sel.splice(idx, 1);
    else sel.push(conceptId);
    this.selectedConceptIds.set(sel);
  }

  async confirmProposals() {
    try {
      const teamId = +this.proposalTeamId();
      const dto = {
        name: this.planName() || 'Generated Plan',
        startDate: (this.planStartDate() || new Date().toISOString()).toString(),
        endDate: (this.planEndDate() || new Date().toISOString()).toString(),
        scheduleDays: [ { dayOfWeek: new Date(this.planStartDate() || new Date().toISOString()).toLocaleDateString('en-US', { weekday: 'long' }), startTime: this.planStartTime(), endTime: this.planEndTime(), courtId: null } ],
        planConceptIds: this.selectedConceptIds()
      } as any;
      const result = await firstValueFrom(this.trainingService.createSchedule(teamId, dto));
      console.debug('Created schedule', result);
      alert('Planificación creada con éxito');
      this.closePlanModal();
    } catch (err) {
      console.error(err);
      alert('Failed to create schedule: ' + String((err as any)?.message || err));
    }
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
