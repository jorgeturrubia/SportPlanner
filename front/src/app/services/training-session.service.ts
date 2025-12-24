import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrainingSession, CreateTrainingSessionDto } from '../core/models/training-session.model';

@Injectable({ providedIn: 'root' })
export class TrainingSessionService {
    private apiUrl = `${environment.apiUrl}/trainingSessions`;

    constructor(private http: HttpClient) { }

    getByTeam(teamId: number): Observable<TrainingSession[]> {
        return this.http.get<TrainingSession[]>(`${this.apiUrl}/team/${teamId}`);
    }

    getSchedule(teamId: number, start: string, end: string): Observable<TrainingSession[]> {
        return this.http.get<TrainingSession[]>(`${this.apiUrl}/schedule`, { params: { teamId, start, end } });
    }

    getById(id: number): Observable<TrainingSession> {
        return this.http.get<TrainingSession>(`${this.apiUrl}/${id}`);
    }

    create(dto: CreateTrainingSessionDto): Observable<TrainingSession> {
        return this.http.post<TrainingSession>(this.apiUrl, dto);
    }

    update(id: number, dto: CreateTrainingSessionDto): Observable<TrainingSession> {
        return this.http.put<TrainingSession>(`${this.apiUrl}/${id}`, dto);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
