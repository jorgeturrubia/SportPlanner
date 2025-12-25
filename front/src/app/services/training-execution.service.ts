import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TrainingSession, TrainingSessionExercise } from '../core/models/training-session.model';
import { TimerLogic } from './timer-logic';

export enum SessionExecutionState {
  Idle = 'Idle',
  Running = 'Running',
  Paused = 'Paused',
  Completed = 'Completed'
}

@Injectable({
    providedIn: 'root'
})
export class TrainingExecutionService {
    private apiUrl = `${environment.apiUrl}/trainingExecution`;
    private timerLogic = new TimerLogic();

    // State Signals
    readonly state: WritableSignal<SessionExecutionState> = signal(SessionExecutionState.Idle);
    readonly session: WritableSignal<TrainingSession | null> = signal(null);
    readonly currentExerciseIndex: WritableSignal<number> = signal(0);
    
    // Timer Signals (Exposed for UI, but managed via tick)
    readonly generalTime: WritableSignal<number> = signal(0);
    readonly exerciseTime: WritableSignal<number> = signal(0);

    // Derived Signals
    readonly activeExercise = computed(() => {
        const s = this.session();
        if (!s || !s.sessionExercises) return null;
        return s.sessionExercises[this.currentExerciseIndex()] || null;
    });

    readonly nextExercise = computed(() => {
        const s = this.session();
        if (!s || !s.sessionExercises) return null;
        return s.sessionExercises[this.currentExerciseIndex() + 1] || null;
    });

    private timerInterval: any;

    constructor(private http: HttpClient) {
        // Effect to manage the heartbeat timer
        effect((onCleanup) => {
            if (this.state() === SessionExecutionState.Running) {
                this.timerInterval = setInterval(() => {
                    this.tick();
                }, 1000);
            } else {
                this.stopHeartbeat();
            }

            onCleanup(() => {
                this.stopHeartbeat();
            });
        });
    }

    private stopHeartbeat() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Heartbeat function called every second.
     * Delegates logic to TimerLogic and updates signals.
     */
    public tick() {
        // Sync logic state
        this.timerLogic.generalTime = this.generalTime();
        this.timerLogic.exerciseTime = this.exerciseTime();

        const result = this.timerLogic.tick();

        // Update signals
        this.generalTime.set(this.timerLogic.generalTime);
        this.exerciseTime.set(this.timerLogic.exerciseTime);

        if (result.autoTransition) {
            this.handleExerciseEnd();
        }
    }

    private handleExerciseEnd() {
        if (this.nextExercise()) {
            this.goToNextExercise();
        } else {
            this.pauseSession();
            // Finalization logic can be triggered here
        }
    }

    private updateState(newState: SessionExecutionState) {
        this.state.set(newState);
    }

    loadSession(sessionId: number): Observable<TrainingSession> {
        return this.http.get<TrainingSession>(`${environment.apiUrl}/trainingSessions/${sessionId}`).pipe(
            tap(session => {
                this.session.set(session);
                this.initializeSession(session);
            })
        );
    }

    private initializeSession(session: TrainingSession) {
        const firstIncomplete = session.sessionExercises.findIndex(e => !e.isCompleted);
        this.currentExerciseIndex.set(firstIncomplete >= 0 ? firstIncomplete : 0);
        this.resetExerciseTimer();
        this.generalTime.set(0);
        this.timerLogic.resetGeneralTime();
    }

    private resetExerciseTimer() {
        const active = this.activeExercise();
        const mins = (active && active.durationMinutes) ? active.durationMinutes : 0;
        this.timerLogic.setExerciseTime(mins);
        this.exerciseTime.set(this.timerLogic.exerciseTime);
    }

    startSession(sessionId: number): Observable<TrainingSession> {
        return this.http.post<TrainingSession>(`${this.apiUrl}/start/${sessionId}`, {}).pipe(
            tap(updatedSession => {
                this.session.set(updatedSession);
                this.initializeSession(updatedSession);
                this.updateState(SessionExecutionState.Running);
            })
        );
    }

    pauseSession() {
        if (this.state() === SessionExecutionState.Running) {
            this.updateState(SessionExecutionState.Paused);
        }
    }

    resumeSession() {
        if (this.state() === SessionExecutionState.Paused) {
            this.updateState(SessionExecutionState.Running);
        }
    }

    goToNextExercise() {
        if (this.nextExercise()) {
            this.currentExerciseIndex.update(i => i + 1);
            this.resetExerciseTimer();
        }
    }

    goToPreviousExercise() {
        if (this.currentExerciseIndex() > 0) {
            this.currentExerciseIndex.update(i => i - 1);
            this.resetExerciseTimer();
        }
    }

    finishSession(sessionId: number, rating?: number, notes?: string): Observable<TrainingSession> {
        return this.http.post<TrainingSession>(`${this.apiUrl}/finish/${sessionId}`, { rating, notes }).pipe(
             tap(() => this.updateState(SessionExecutionState.Completed))
        );
    }

    completeExercise(sessionExerciseId: number, durationMinutes: number, notes?: string): Observable<TrainingSessionExercise> {
        return this.http.post<TrainingSessionExercise>(`${this.apiUrl}/exercise/${sessionExerciseId}/complete`, { durationMinutes, notes }).pipe(
            tap(updatedEx => {
                const s = this.session();
                if (s) {
                    const idx = s.sessionExercises.findIndex(e => e.id === updatedEx.id);
                    if (idx >= 0) {
                        s.sessionExercises[idx] = updatedEx;
                        this.session.set({...s});
                    }
                }
            })
        );
    }

    formatTime(seconds: number): string {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}