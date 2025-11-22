import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ConceptProposal {
    concept: any; // SportConceptDto
    score: number;
    isSuggested: boolean;
}

export interface TrainingScheduleDayCreate {
    dayOfWeek: string; // "Monday", etc.
    startTime: string; // HH:mm
    endTime?: string; // HH:mm
    courtId?: number;
}

export interface TrainingScheduleCreate {
    name?: string;
    startDate: string; // ISO Date
    endDate: string; // ISO Date
    scheduleDays: TrainingScheduleDayCreate[];
    planConceptIds: number[];
}

@Injectable({ providedIn: 'root' })
export class TrainingScheduleService {
    constructor(private http: HttpClient) { }

    createSchedule(teamId: number, data: TrainingScheduleCreate): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/trainingSchedules/teams/${teamId}`, data);
    }

    getProposedConcepts(teamId: number): Observable<ConceptProposal[]> {
        return this.http.get<ConceptProposal[]>(`${environment.apiUrl}/trainingSchedules/teams/${teamId}/proposed-concepts`);
    }

    getMySchedules(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/trainingSchedules/my-schedules`);
    }

    deleteSchedule(id: number): Observable<any> {
        return this.http.delete<any>(`${environment.apiUrl}/trainingSchedules/${id}`);
    }

    updateSchedule(id: number, data: TrainingScheduleCreate): Observable<any> {
        return this.http.put<any>(`${environment.apiUrl}/trainingSchedules/${id}`, data);
    }

    getScheduleById(id: number): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/trainingSchedules/${id}`);
    }
}
