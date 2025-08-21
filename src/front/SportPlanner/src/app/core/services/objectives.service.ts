import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { 
  Objective, 
  CreateObjectiveRequest, 
  UpdateObjectiveRequest,
  ObjectivesListResponse,
  ObjectiveCategory,
  ObjectiveDifficulty,
  ObjectiveStatus
} from '../models/objective.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/objectives`;

  // State management
  private readonly objectivesSubject = new BehaviorSubject<Objective[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  readonly objectives$ = this.objectivesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // Signals for reactive state
  readonly objectives = signal<Objective[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all objectives with optional filters
   */
  getObjectives(filters?: {
    category?: ObjectiveCategory;
    difficulty?: ObjectiveDifficulty;
    sport?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<ObjectivesListResponse> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }

    return this.http.get<ObjectivesListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.objectivesSubject.next(response.objectives);
        this.objectives.set(response.objectives);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al cargar objetivos', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get objective by ID
   */
  getObjectiveById(id: string): Observable<Objective> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<Objective>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.handleError('Error al cargar objetivo', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new objective
   */
  createObjective(objectiveData: CreateObjectiveRequest): Observable<Objective> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Objective>(this.apiUrl, objectiveData).pipe(
      tap(newObjective => {
        const currentObjectives = this.objectivesSubject.value;
        this.objectivesSubject.next([newObjective, ...currentObjectives]);
        this.objectives.set([newObjective, ...currentObjectives]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al crear objetivo', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing objective
   */
  updateObjective(id: string, objectiveData: UpdateObjectiveRequest): Observable<Objective> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<Objective>(`${this.apiUrl}/${id}`, objectiveData).pipe(
      tap(updatedObjective => {
        const currentObjectives = this.objectivesSubject.value;
        const index = currentObjectives.findIndex(obj => obj.id === id);
        if (index !== -1) {
          currentObjectives[index] = updatedObjective;
          this.objectivesSubject.next([...currentObjectives]);
          this.objectives.set([...currentObjectives]);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al actualizar objetivo', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete objective
   */
  deleteObjective(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentObjectives = this.objectivesSubject.value.filter(obj => obj.id !== id);
        this.objectivesSubject.next(currentObjectives);
        this.objectives.set(currentObjectives);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al eliminar objetivo', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get objectives by sport
   */
  getObjectivesBySport(sport: string): Observable<Objective[]> {
    return this.getObjectives({ sport, isPublic: true }).pipe(
      tap(response => response.objectives)
    );
  }

  /**
   * Search objectives
   */
  searchObjectives(query: string, filters?: {
    category?: ObjectiveCategory;
    difficulty?: ObjectiveDifficulty;
    sport?: string;
  }): Observable<Objective[]> {
    return this.getObjectives({ 
      search: query,
      ...filters 
    }).pipe(
      tap(response => response.objectives)
    );
  }

  /**
   * Get objective categories for dropdown
   */
  getCategories(): ObjectiveCategory[] {
    return Object.values(ObjectiveCategory);
  }

  /**
   * Get objective difficulties for dropdown
   */
  getDifficulties(): ObjectiveDifficulty[] {
    return Object.values(ObjectiveDifficulty);
  }

  /**
   * Get objective statuses for dropdown
   */
  getStatuses(): ObjectiveStatus[] {
    return Object.values(ObjectiveStatus);
  }

  /**
   * Clone objective (create a copy)
   */
  cloneObjective(id: string): Observable<Objective> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Objective>(`${this.apiUrl}/${id}/clone`, {}).pipe(
      tap(clonedObjective => {
        const currentObjectives = this.objectivesSubject.value;
        this.objectivesSubject.next([clonedObjective, ...currentObjectives]);
        this.objectives.set([clonedObjective, ...currentObjectives]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al clonar objetivo', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Rate objective
   */
  rateObjective(id: string, rating: number): Observable<Objective> {
    return this.http.post<Objective>(`${this.apiUrl}/${id}/rate`, { rating }).pipe(
      tap(updatedObjective => {
        const currentObjectives = this.objectivesSubject.value;
        const index = currentObjectives.findIndex(obj => obj.id === id);
        if (index !== -1) {
          currentObjectives[index] = updatedObjective;
          this.objectivesSubject.next([...currentObjectives]);
          this.objectives.set([...currentObjectives]);
        }
      }),
      catchError(error => {
        this.handleError('Error al calificar objetivo', error);
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
    this.objectivesSubject.next([]);
    this.objectives.set([]);
    this.clearError();
    this.setLoading(false);
  }
}