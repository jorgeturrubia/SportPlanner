import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ConceptProposal { concept: any; score: number; isSuggested: boolean }

export interface TrainingScheduleDayCreateDto { dayOfWeek: string; startTime: string; endTime?: string | null; courtId?: number | null }
export interface TrainingScheduleCreateDto { name?: string | null; startDate: string; endDate: string; scheduleDays: TrainingScheduleDayCreateDto[]; planConceptIds: number[] }

@Injectable({ providedIn: 'root' })
export class TrainingService {
  constructor(private http: HttpClient) {}

  getPlanProposals(teamId: number) {
    return this.http.get<ConceptProposal[]>(`${environment.apiUrl}/teams/${teamId}/plan-proposals`);
  }

  createSchedule(teamId: number, dto: TrainingScheduleCreateDto) {
    return this.http.post(`${environment.apiUrl}/trainingSchedules/teams/${teamId}`, dto);
  }
}
