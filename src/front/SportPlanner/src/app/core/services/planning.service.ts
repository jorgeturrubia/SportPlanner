import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map } from 'rxjs';
import { 
  Planning, 
  CreatePlanningRequest, 
  UpdatePlanningRequest,
  PlanningsListResponse,
  PlanningType,
  PlanningStatus,
  PlanningFilter,
  TrainingSession,
  CreateSessionRequest,
  UpdateSessionRequest,
  PlanningTemplate,
  PlanningAnalytics
} from '../models/planning.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/plannings`;

  // State management
  private readonly planningsSubject = new BehaviorSubject<Planning[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  readonly plannings$ = this.planningsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // Signals for reactive state
  readonly plannings = signal<Planning[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all plannings with optional filters
   */
  getPlannings(filters?: PlanningFilter & {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<PlanningsListResponse> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'dateRange' && typeof value === 'object') {
            params = params.append('startDate', value.start.toISOString());
            params = params.append('endDate', value.end.toISOString());
          } else if (Array.isArray(value)) {
            value.forEach(item => {
              params = params.append(key, item.toString());
            });
          } else {
            params = params.append(key, value.toString());
          }
        }
      });
    }

    return this.http.get<PlanningsListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.planningsSubject.next(response.plannings);
        this.plannings.set(response.plannings);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al cargar planificaciones', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning by ID
   */
  getPlanningById(id: string): Observable<Planning> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<Planning>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.handleError('Error al cargar planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new planning
   */
  createPlanning(planningData: CreatePlanningRequest): Observable<Planning> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Planning>(this.apiUrl, planningData).pipe(
      tap(newPlanning => {
        const currentPlannings = this.planningsSubject.value;
        this.planningsSubject.next([newPlanning, ...currentPlannings]);
        this.plannings.set([newPlanning, ...currentPlannings]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al crear planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing planning
   */
  updatePlanning(id: string, planningData: UpdatePlanningRequest): Observable<Planning> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<Planning>(`${this.apiUrl}/${id}`, planningData).pipe(
      tap(updatedPlanning => {
        const currentPlannings = this.planningsSubject.value;
        const index = currentPlannings.findIndex(p => p.id === id);
        if (index !== -1) {
          currentPlannings[index] = updatedPlanning;
          this.planningsSubject.next([...currentPlannings]);
          this.plannings.set([...currentPlannings]);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al actualizar planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete planning
   */
  deletePlanning(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentPlannings = this.planningsSubject.value.filter(p => p.id !== id);
        this.planningsSubject.next(currentPlannings);
        this.plannings.set(currentPlannings);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al eliminar planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning sessions
   */
  getPlanningSessions(planningId: string): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/${planningId}/sessions`).pipe(
      catchError(error => {
        this.handleError('Error al cargar sesiones', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new session
   */
  createSession(planningId: string, sessionData: CreateSessionRequest): Observable<TrainingSession> {
    return this.http.post<TrainingSession>(`${this.apiUrl}/${planningId}/sessions`, sessionData).pipe(
      catchError(error => {
        this.handleError('Error al crear sesión', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update session
   */
  updateSession(planningId: string, sessionId: string, sessionData: UpdateSessionRequest): Observable<TrainingSession> {
    return this.http.put<TrainingSession>(`${this.apiUrl}/${planningId}/sessions/${sessionId}`, sessionData).pipe(
      catchError(error => {
        this.handleError('Error al actualizar sesión', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete session
   */
  deleteSession(planningId: string, sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${planningId}/sessions/${sessionId}`).pipe(
      catchError(error => {
        this.handleError('Error al eliminar sesión', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Complete session
   */
  completeSession(planningId: string, sessionId: string, completionData: {
    completionNotes?: string;
    attendance?: any[];
  }): Observable<TrainingSession> {
    return this.http.patch<TrainingSession>(`${this.apiUrl}/${planningId}/sessions/${sessionId}/complete`, completionData).pipe(
      catchError(error => {
        this.handleError('Error al completar sesión', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning templates
   */
  getTemplates(filters?: {
    type?: PlanningType;
    sport?: string;
    duration?: number;
    isPublic?: boolean;
  }): Observable<PlanningTemplate[]> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<PlanningTemplate[]>(`${this.apiUrl}/templates`, { params }).pipe(
      catchError(error => {
        this.handleError('Error al cargar plantillas', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create planning from template
   */
  createFromTemplate(templateId: string, planningData: {
    name: string;
    teamId: string;
    startDate: Date;
    endDate?: Date;
  }): Observable<Planning> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Planning>(`${this.apiUrl}/templates/${templateId}/create`, planningData).pipe(
      tap(newPlanning => {
        const currentPlannings = this.planningsSubject.value;
        this.planningsSubject.next([newPlanning, ...currentPlannings]);
        this.plannings.set([newPlanning, ...currentPlannings]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al crear planificación desde plantilla', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Duplicate planning
   */
  duplicatePlanning(id: string, newName: string): Observable<Planning> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Planning>(`${this.apiUrl}/${id}/duplicate`, { name: newName }).pipe(
      tap(duplicatedPlanning => {
        const currentPlannings = this.planningsSubject.value;
        this.planningsSubject.next([duplicatedPlanning, ...currentPlannings]);
        this.plannings.set([duplicatedPlanning, ...currentPlannings]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al duplicar planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning analytics
   */
  getPlanningAnalytics(id: string): Observable<PlanningAnalytics> {
    return this.http.get<PlanningAnalytics>(`${this.apiUrl}/${id}/analytics`).pipe(
      catchError(error => {
        this.handleError('Error al cargar analíticas', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Export planning
   */
  exportPlanning(id: string, format: 'pdf' | 'excel' | 'json' = 'pdf'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    
    return this.http.get(`${this.apiUrl}/${id}/export`, { 
      params, 
      responseType: 'blob' 
    }).pipe(
      catchError(error => {
        this.handleError('Error al exportar planificación', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning types for dropdown
   */
  getPlanningTypes(): PlanningType[] {
    return Object.values(PlanningType);
  }

  /**
   * Get planning statuses for dropdown
   */
  getPlanningStatuses(): PlanningStatus[] {
    return Object.values(PlanningStatus);
  }

  /**
   * Get planning by team
   */
  getPlanningsByTeam(teamId: string): Observable<Planning[]> {
    return this.getPlannings({ teamId }).pipe(
      map(response => response.plannings)
    );
  }

  /**
   * Search plannings
   */
  searchPlannings(query: string, filters?: Partial<PlanningFilter>): Observable<Planning[]> {
    return this.getPlannings({ 
      search: query,
      ...filters 
    }).pipe(
      map(response => response.plannings)
    );
  }

  /**
   * Generate automatic sessions
   */
  generateSessions(planningId: string, options: {
    frequency: number; // sessions per week
    duration: number; // session duration in minutes
    objectives: string[]; // objective IDs
    excludeDates?: Date[];
  }): Observable<TrainingSession[]> {
    return this.http.post<TrainingSession[]>(`${this.apiUrl}/${planningId}/generate-sessions`, options).pipe(
      catchError(error => {
        this.handleError('Error al generar sesiones automáticas', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get planning progress
   */
  getPlanningProgress(id: string): Observable<{
    percentage: number;
    completedSessions: number;
    totalSessions: number;
    completedObjectives: number;
    totalObjectives: number;
    averageAttendance: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}/${id}/progress`).pipe(
      catchError(error => {
        this.handleError('Error al calcular progreso', error);
        return throwError(() => error);
      })
    );
  }

  // Helper methods
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
    this.loading.set(loading);
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    const errorMessage = error.error?.message || error.message || message;
    this.errorSubject.next(errorMessage);
    this.error.set(errorMessage);
    this.setLoading(false);
  }

  clearError(): void {
    this.errorSubject.next(null);
    this.error.set(null);
  }

  // Reset state
  reset(): void {
    this.planningsSubject.next([]);
    this.plannings.set([]);
    this.clearError();
    this.setLoading(false);
  }

  // Utility methods for date calculations
  calculatePlanningDuration(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24 * 7)); // weeks
  }

  isDateInPlanningRange(date: Date, planning: Planning): boolean {
    return date >= planning.startDate && date <= planning.endDate;
  }

  getNextSessionDate(planning: Planning): Date | null {
    const now = new Date();
    const futureSessions = planning.sessions
      .filter(session => session.date > now && !session.isCompleted)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    return futureSessions.length > 0 ? futureSessions[0].date : null;
  }
}