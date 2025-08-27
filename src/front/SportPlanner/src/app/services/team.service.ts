import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError, finalize } from 'rxjs';
import { environment } from '../../environments/environment';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../models/team.model';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';
import { ErrorBoundaryService } from './error-boundary.service';
import { RetryService } from './retry.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiUrl = environment.apiUrl;
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  private isLoading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Cache for teams data
  private teamsCache: Team[] = [];
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService,
    private errorBoundary: ErrorBoundaryService,
    private retryService: RetryService
  ) {}

  /**
   * Get all teams for the authenticated user
   */
  getTeams(forceRefresh: boolean = false): Observable<Team[]> {
    const now = Date.now();
    const isCacheValid = !forceRefresh && 
                        this.teamsCache.length > 0 && 
                        (now - this.lastFetchTime) < this.CACHE_DURATION;

    if (isCacheValid) {
      this.teamsSubject.next(this.teamsCache);
      return this.teamsSubject.asObservable();
    }

    this.setLoading(true);
    this.clearError();

    const operation = () => this.http.get<Team[]>(`${this.apiUrl}/api/teams`)
      .pipe(
        tap(teams => {
          // Convert date strings to Date objects
          const processedTeams = teams.map(team => ({
            ...team,
            createdAt: new Date(team.createdAt),
            updatedAt: new Date(team.updatedAt)
          }));
          
          this.teamsCache = processedTeams;
          this.lastFetchTime = now;
          this.teamsSubject.next(processedTeams);
        }),
        finalize(() => this.setLoading(false))
      );

    return this.errorBoundary.wrapObservable(operation(), {
      context: 'cargar equipos',
      retryConfig: {
        maxRetries: 2,
        delayMs: 1000,
        exponentialBackoff: true
      },
      onError: (error) => {
        this.handleError('Error al cargar los equipos', error);
      }
    });
  }

  /**
   * Get a specific team by ID
   */
  getTeam(id: string): Observable<Team> {
    this.setLoading(true);
    this.clearError();

    return this.http.get<Team>(`${this.apiUrl}/api/teams/${id}`)
      .pipe(
        tap(team => {
          // Convert date strings to Date objects
          team.createdAt = new Date(team.createdAt);
          team.updatedAt = new Date(team.updatedAt);
        }),
        catchError(error => {
          this.handleError('Error al cargar el equipo', error);
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Create a new team
   */
  createTeam(teamData: CreateTeamRequest): Observable<Team> {
    this.setLoading(true);
    this.clearError();

    const operation = () => this.http.post<Team>(`${this.apiUrl}/api/teams`, teamData)
      .pipe(
        tap(newTeam => {
          // Convert date strings to Date objects
          newTeam.createdAt = new Date(newTeam.createdAt);
          newTeam.updatedAt = new Date(newTeam.updatedAt);
          
          // Add to cache and update subject
          this.teamsCache.push(newTeam);
          this.teamsSubject.next([...this.teamsCache]);
        }),
        finalize(() => this.setLoading(false))
      );

    return this.errorBoundary.wrapObservable(operation(), {
      context: 'crear equipo',
      retryConfig: {
        maxRetries: 1,
        delayMs: 1000,
        retryCondition: (error) => {
          // Don't retry validation errors or conflicts
          return ![400, 409, 422].includes(error.status);
        }
      },
      onSuccess: (newTeam) => {
        this.notificationService.showSuccess(
          'Equipo creado',
          `El equipo "${newTeam.name}" ha sido creado exitosamente`
        );
      },
      onError: (error) => {
        this.handleError('Error al crear el equipo', error);
      }
    });
  }

  /**
   * Update an existing team
   */
  updateTeam(id: string, teamData: UpdateTeamRequest): Observable<Team> {
    this.setLoading(true);
    this.clearError();

    return this.http.put<Team>(`${this.apiUrl}/api/teams/${id}`, teamData)
      .pipe(
        tap(updatedTeam => {
          // Convert date strings to Date objects
          updatedTeam.createdAt = new Date(updatedTeam.createdAt);
          updatedTeam.updatedAt = new Date(updatedTeam.updatedAt);
          
          // Update cache
          const index = this.teamsCache.findIndex(team => team.id === id);
          if (index !== -1) {
            this.teamsCache[index] = updatedTeam;
            this.teamsSubject.next([...this.teamsCache]);
          }
          
          this.notificationService.showSuccess(
            'Equipo actualizado',
            `El equipo "${updatedTeam.name}" ha sido actualizado exitosamente`
          );
        }),
        catchError(error => {
          this.handleError('Error al actualizar el equipo', error);
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Delete a team
   */
  deleteTeam(id: string): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.http.delete<void>(`${this.apiUrl}/api/teams/${id}`)
      .pipe(
        tap(() => {
          // Remove from cache
          const teamToDelete = this.teamsCache.find(team => team.id === id);
          this.teamsCache = this.teamsCache.filter(team => team.id !== id);
          this.teamsSubject.next([...this.teamsCache]);
          
          this.notificationService.showSuccess(
            'Equipo eliminado',
            teamToDelete ? `El equipo "${teamToDelete.name}" ha sido eliminado` : 'El equipo ha sido eliminado'
          );
        }),
        catchError(error => {
          this.handleError('Error al eliminar el equipo', error);
          return throwError(() => error);
        }),
        finalize(() => this.setLoading(false))
      );
  }

  /**
   * Get teams as observable for reactive updates
   */
  getTeamsObservable(): Observable<Team[]> {
    return this.teamsSubject.asObservable();
  }

  /**
   * Get loading state
   */
  getLoadingState() {
    return this.isLoading.asReadonly();
  }

  /**
   * Get error state
   */
  getError() {
    return this.error.asReadonly();
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.error.set(null);
  }

  /**
   * Refresh teams cache
   */
  refreshTeams(): Observable<Team[]> {
    return this.getTeams(true);
  }

  /**
   * Search teams by name or sport
   */
  searchTeams(query: string): Team[] {
    if (!query.trim()) {
      return this.teamsCache;
    }

    const searchTerm = query.toLowerCase().trim();
    return this.teamsCache.filter(team => 
      team.name.toLowerCase().includes(searchTerm) ||
      team.sport.toLowerCase().includes(searchTerm) ||
      team.category.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filter teams by criteria
   */
  filterTeams(criteria: {
    sport?: string;
    category?: string;
    gender?: string;
    level?: string;
    isActive?: boolean;
  }): Team[] {
    return this.teamsCache.filter(team => {
      if (criteria.sport && team.sport !== criteria.sport) return false;
      if (criteria.category && team.category !== criteria.category) return false;
      if (criteria.gender && team.gender !== criteria.gender) return false;
      if (criteria.level && team.level !== criteria.level) return false;
      if (criteria.isActive !== undefined && team.isActive !== criteria.isActive) return false;
      return true;
    });
  }

  /**
   * Get team statistics
   */
  getTeamStats(): {
    total: number;
    active: number;
    inactive: number;
    bySport: { [sport: string]: number };
    byLevel: { [level: string]: number };
  } {
    const stats = {
      total: this.teamsCache.length,
      active: 0,
      inactive: 0,
      bySport: {} as { [sport: string]: number },
      byLevel: {} as { [level: string]: number }
    };

    this.teamsCache.forEach(team => {
      if (team.isActive) {
        stats.active++;
      } else {
        stats.inactive++;
      }

      stats.bySport[team.sport] = (stats.bySport[team.sport] || 0) + 1;
      stats.byLevel[team.level] = (stats.byLevel[team.level] || 0) + 1;
    });

    return stats;
  }

  /**
   * Optimistic update for better UX
   */
  optimisticUpdate(teamId: string, updates: Partial<Team>): void {
    const index = this.teamsCache.findIndex(team => team.id === teamId);
    if (index !== -1) {
      this.teamsCache[index] = { ...this.teamsCache[index], ...updates };
      this.teamsSubject.next([...this.teamsCache]);
    }
  }

  /**
   * Revert optimistic update in case of error
   */
  revertOptimisticUpdate(originalTeam: Team): void {
    const index = this.teamsCache.findIndex(team => team.id === originalTeam.id);
    if (index !== -1) {
      this.teamsCache[index] = originalTeam;
      this.teamsSubject.next([...this.teamsCache]);
    }
  }

  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
    if (loading) {
      this.loadingService.show();
    } else {
      this.loadingService.hide();
    }
  }

  private handleError(context: string, error: HttpErrorResponse): void {
    console.error(`${context}:`, error);
    
    let errorMessage = 'Ha ocurrido un error inesperado';
    
    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor';
    } else if (error.status === 401) {
      errorMessage = 'No tienes autorización para realizar esta acción';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para acceder a este recurso';
    } else if (error.status === 404) {
      errorMessage = 'El equipo solicitado no fue encontrado';
    } else if (error.status === 409) {
      errorMessage = error.error?.message || 'Ya existe un equipo con ese nombre';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intenta nuevamente más tarde';
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.error.set(errorMessage);
    this.errorHandler.handleHttpError(error, context);
  }
}