import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, map } from 'rxjs';
import { 
  Exercise, 
  CreateExerciseRequest, 
  UpdateExerciseRequest,
  ExercisesListResponse,
  ExerciseCategory,
  ExerciseDifficulty,
  ExerciseStatus,
  ExerciseFilter
} from '../models/exercise.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/exercises`;

  // State management
  private readonly exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Public observables
  readonly exercises$ = this.exercisesSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  // Signals for reactive state
  readonly exercises = signal<Exercise[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all exercises with optional filters
   */
  getExercises(filters?: ExerciseFilter & {
    page?: number;
    limit?: number;
    search?: string;
  }): Observable<ExercisesListResponse> {
    this.setLoading(true);
    this.clearError();

    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object' && !Array.isArray(value)) {
            // Handle object filters like duration, participants
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue !== undefined && subValue !== null) {
                params = params.append(`${key}.${subKey}`, subValue.toString());
              }
            });
          } else if (Array.isArray(value)) {
            // Handle array filters
            value.forEach(item => {
              params = params.append(key, item.toString());
            });
          } else {
            params = params.append(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ExercisesListResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        this.exercisesSubject.next(response.exercises);
        this.exercises.set(response.exercises);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al cargar ejercicios', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get exercise by ID
   */
  getExerciseById(id: string): Observable<Exercise> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<Exercise>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.setLoading(false)),
      catchError(error => {
        this.handleError('Error al cargar ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create new exercise
   */
  createExercise(exerciseData: CreateExerciseRequest): Observable<Exercise> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Exercise>(this.apiUrl, exerciseData).pipe(
      tap(newExercise => {
        const currentExercises = this.exercisesSubject.value;
        this.exercisesSubject.next([newExercise, ...currentExercises]);
        this.exercises.set([newExercise, ...currentExercises]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al crear ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update existing exercise
   */
  updateExercise(id: string, exerciseData: UpdateExerciseRequest): Observable<Exercise> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exerciseData).pipe(
      tap(updatedExercise => {
        const currentExercises = this.exercisesSubject.value;
        const index = currentExercises.findIndex(ex => ex.id === id);
        if (index !== -1) {
          currentExercises[index] = updatedExercise;
          this.exercisesSubject.next([...currentExercises]);
          this.exercises.set([...currentExercises]);
        }
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al actualizar ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete exercise
   */
  deleteExercise(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentExercises = this.exercisesSubject.value.filter(ex => ex.id !== id);
        this.exercisesSubject.next(currentExercises);
        this.exercises.set(currentExercises);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al eliminar ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get exercises by category
   */
  getExercisesByCategory(category: ExerciseCategory): Observable<Exercise[]> {
    return this.getExercises({ category, isPublic: true }).pipe(
      map(response => response.exercises)
    );
  }

  /**
   * Get exercises by sport
   */
  getExercisesBySport(sport: string): Observable<Exercise[]> {
    return this.getExercises({ sport, isPublic: true }).pipe(
      map(response => response.exercises)
    );
  }

  /**
   * Search exercises
   */
  searchExercises(query: string, filters?: Partial<ExerciseFilter>): Observable<Exercise[]> {
    return this.getExercises({ 
      search: query,
      ...filters 
    }).pipe(
      map(response => response.exercises)
    );
  }

  /**
   * Get exercise categories for dropdown
   */
  getCategories(): ExerciseCategory[] {
    return Object.values(ExerciseCategory);
  }

  /**
   * Get exercise difficulties for dropdown
   */
  getDifficulties(): ExerciseDifficulty[] {
    return Object.values(ExerciseDifficulty);
  }

  /**
   * Get exercise statuses for dropdown
   */
  getStatuses(): ExerciseStatus[] {
    return Object.values(ExerciseStatus);
  }

  /**
   * Clone exercise (create a copy)
   */
  cloneExercise(id: string): Observable<Exercise> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<Exercise>(`${this.apiUrl}/${id}/clone`, {}).pipe(
      tap(clonedExercise => {
        const currentExercises = this.exercisesSubject.value;
        this.exercisesSubject.next([clonedExercise, ...currentExercises]);
        this.exercises.set([clonedExercise, ...currentExercises]);
        this.setLoading(false);
      }),
      catchError(error => {
        this.handleError('Error al clonar ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Rate exercise
   */
  rateExercise(id: string, rating: number): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/${id}/rate`, { rating }).pipe(
      tap(updatedExercise => {
        const currentExercises = this.exercisesSubject.value;
        const index = currentExercises.findIndex(ex => ex.id === id);
        if (index !== -1) {
          currentExercises[index] = updatedExercise;
          this.exercisesSubject.next([...currentExercises]);
          this.exercises.set([...currentExercises]);
        }
      }),
      catchError(error => {
        this.handleError('Error al calificar ejercicio', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add review to exercise
   */
  addReview(id: string, review: { rating: number; comment: string }): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/${id}/reviews`, review).pipe(
      tap(updatedExercise => {
        const currentExercises = this.exercisesSubject.value;
        const index = currentExercises.findIndex(ex => ex.id === id);
        if (index !== -1) {
          currentExercises[index] = updatedExercise;
          this.exercisesSubject.next([...currentExercises]);
          this.exercises.set([...currentExercises]);
        }
      }),
      catchError(error => {
        this.handleError('Error al agregar reseña', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get recommended exercises based on objectives
   */
  getRecommendedExercises(objectiveIds: string[]): Observable<Exercise[]> {
    const params = new HttpParams().set('objectives', objectiveIds.join(','));
    
    return this.http.get<Exercise[]>(`${this.apiUrl}/recommended`, { params }).pipe(
      catchError(error => {
        this.handleError('Error al obtener ejercicios recomendados', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get popular exercises
   */
  getPopularExercises(limit: number = 10): Observable<Exercise[]> {
    const params = new HttpParams()
      .set('sort', 'usage_count')
      .set('order', 'desc')
      .set('limit', limit.toString());
    
    return this.http.get<Exercise[]>(`${this.apiUrl}/popular`, { params }).pipe(
      catchError(error => {
        this.handleError('Error al obtener ejercicios populares', error);
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
    this.exercisesSubject.next([]);
    this.exercises.set([]);
    this.clearError();
    this.setLoading(false);
  }
}