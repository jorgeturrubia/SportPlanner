import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrainingSession, TrainingSessionExercise } from '../core/models/training-session.model';

@Injectable({
    providedIn: 'root'
})
export class TrainingExecutionService {
    private apiUrl = `${environment.apiUrl}/trainingExecution`;

    constructor(private http: HttpClient) { }

    startSession(sessionId: number): Observable<TrainingSession> {
        return this.http.post<TrainingSession>(`${this.apiUrl}/start/${sessionId}`, {});
    }

    finishSession(sessionId: number, rating?: number, notes?: string): Observable<TrainingSession> {
        return this.http.post<TrainingSession>(`${this.apiUrl}/finish/${sessionId}`, { rating, notes });
    }

    completeExercise(sessionExerciseId: number, durationMinutes: number, notes?: string): Observable<TrainingSessionExercise> {
        return this.http.post<TrainingSessionExercise>(`${this.apiUrl}/exercise/${sessionExerciseId}/complete`, { durationMinutes, notes });
    }
}
