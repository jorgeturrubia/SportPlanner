import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingSessionService } from '../../../../services/training-session.service';
import { PlanningService } from '../../../../services/planning.service';
import { TrainingSession } from '../../../../core/models/training-session.model';
import { TranslateModule } from '@ngx-translate/core';

interface CalendarDay {
    date: Date;
    isPlanned: boolean;
    sessions: TrainingSession[];
    planningId?: number;
}

import { merge } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    private trainingService = inject(TrainingSessionService);
    private planningService = inject(PlanningService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    currentDate = new Date();
    weekStart!: Date;
    weekEnd!: Date;
    days: CalendarDay[] = [];
    teamId!: number;

    ngOnInit() {
        merge(
            this.route.parent?.params || [],
            this.route.queryParams
        ).pipe(
            map(params => params['id'] || params['teamId']),
            filter(id => !!id),
            map(id => +id),
            distinctUntilChanged()
        ).subscribe(id => {
            this.teamId = id;
            this.loadWeek();
        });
    }

    loadWeek() {
        this.weekStart = this.getStartOfWeek(this.currentDate);
        this.weekEnd = this.addDays(this.weekStart, 6);

        // Initialize days
        this.days = [];
        for (let i = 0; i < 7; i++) {
            const d = this.addDays(this.weekStart, i);
            this.days.push({
                date: d,
                isPlanned: false,
                sessions: []
            });
        }

        if (this.teamId) {
            this.checkPlanning();
            this.loadTrainings();
        }
    }

    checkPlanning() {
        this.planningService.getPlannings(this.teamId).subscribe(plannings => {
            const activePlanning = plannings.find(p => {
                const pStart = new Date(p.startDate);
                const pEnd = new Date(p.endDate);
                // Check simple intersection or coverage
                // Allow if planning overlaps with ANY part of the week, or at least if startDate <= weekEnd AND endDate >= weekStart
                return pStart <= this.weekEnd && pEnd >= this.weekStart;
            });

            if (activePlanning && activePlanning.scheduleDays) {
                this.days.forEach(day => {
                    const dayOfWeek = day.date.getDay();
                    // C# DayOfWeek enum: Sunday=0, Monday=1... match JS
                    const scheduledDay = activePlanning.scheduleDays.find(sd => (sd.dayOfWeek as any) === dayOfWeek);

                    // Check if date is within planning range
                    // We use start of day comparison
                    const dTime = day.date.getTime();
                    const pStartTime = new Date(activePlanning.startDate).getTime();
                    const pEndTime = new Date(activePlanning.endDate).getTime();

                    // Allow sloppy comparison (ignore time) if needed, but dates usually come with 00:00 or similar from simple input
                    const inRange = dTime >= pStartTime - 86400000 && dTime <= pEndTime + 86400000; // rough buffer for time zones

                    if (inRange && scheduledDay) {
                        day.isPlanned = true;
                        day.planningId = activePlanning.id;
                    } else if (inRange) {
                        day.planningId = activePlanning.id;
                    }
                });
            }
        });
    }

    loadTrainings() {
        if (!this.teamId) return;

        // Ensure we cover the full end day
        const endOfWeek = new Date(this.weekEnd);
        endOfWeek.setHours(23, 59, 59, 999);

        this.trainingService.getSchedule(this.teamId, this.weekStart.toISOString(), endOfWeek.toISOString())
            .subscribe(sessions => {
                sessions.forEach(session => {
                    const sDate = new Date(session.date);
                    const day = this.days.find(d => this.isSameDay(d.date, sDate));
                    if (day) {
                        day.sessions.push(session);
                    }
                });
            });
    }

    prevWeek() {
        this.currentDate = this.addDays(this.currentDate, -7);
        this.loadWeek();
    }

    nextWeek() {
        this.currentDate = this.addDays(this.currentDate, 7);
        this.loadWeek();
    }

    isToday(date: Date): boolean {
        return this.isSameDay(date, new Date());
    }

    viewSession(session: TrainingSession) {
        // Navigate to edit/view session
        this.router.navigate(['/dashboard/trainings/edit', session.id], { queryParams: { teamId: this.teamId } });
    }

    addTraining(day: CalendarDay) {
        const queryParams: any = {
            teamId: this.teamId,
            date: day.date.toISOString(),
            returnUrl: this.router.url
        };
        if (day.planningId) {
            queryParams.planningId = day.planningId;
        }
        this.router.navigate(['/dashboard/trainings/new'], { queryParams });
    }

    // --- Date Helpers (replacing date-fns) ---

    private getStartOfWeek(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        d.setDate(diff);
        d.setHours(0, 0, 0, 0); // reset time
        return d;
    }

    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    private isSameDay(d1: Date, d2: Date): boolean {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
}
