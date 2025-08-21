import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError, map } from 'rxjs';
import { 
  Team, 
  CreateTeamRequest, 
  UpdateTeamRequest, 
  Sport, 
  TeamMember, 
  AddTeamMemberRequest, 
  UpdateTeamMemberRequest,
  TeamsListResponse,
  CanCreateTeamResponse,
  TeamStatus 
} from '../models/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/teams';

  // Signals for state management
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  /**
   * Get all teams with pagination and filters
   */
  getTeams(
    page: number = 1, 
    pageSize: number = 10,
    search?: string,
    sportId?: string,
    status?: TeamStatus
  ): Observable<TeamsListResponse> {
    this._loading.set(true);
    this._error.set(null);

    let params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString()
    });

    if (search) params.set('search', search);
    if (sportId) params.set('sportId', sportId);
    if (status !== undefined) params.set('status', status.toString());

    return this.http.get<Team[]>(`${this.baseUrl}?${params.toString()}`, { observe: 'response' }).pipe(
      map(response => {
        const teams = response.body || [];
        const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
        const pageNumber = parseInt(response.headers.get('X-Page-Number') || '1', 10);
        
        return {
          teams,
          totalCount,
          page: pageNumber
        };
      }),
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Get team by ID
   */
  getTeam(id: string): Observable<Team> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Team>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Create new team
   */
  createTeam(team: CreateTeamRequest): Observable<Team> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Team>(this.baseUrl, team).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Update existing team
   */
  updateTeam(id: string, team: UpdateTeamRequest): Observable<Team> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<Team>(`${this.baseUrl}/${id}`, team).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Delete team
   */
  deleteTeam(id: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Check if user can create more teams
   */
  canCreateTeam(): Observable<CanCreateTeamResponse> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<CanCreateTeamResponse>(`${this.baseUrl}/can-create`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Get all available sports
   */
  getSports(): Observable<Sport[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Sport[]>(`${this.baseUrl}/sports`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Get team members
   */
  getTeamMembers(teamId: string): Observable<TeamMember[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<TeamMember[]>(`${this.baseUrl}/${teamId}/members`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Add team member
   */
  addTeamMember(teamId: string, member: AddTeamMemberRequest): Observable<TeamMember> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<TeamMember>(`${this.baseUrl}/${teamId}/members`, member).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Update team member
   */
  updateTeamMember(teamId: string, memberId: string, member: UpdateTeamMemberRequest): Observable<TeamMember> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<TeamMember>(`${this.baseUrl}/${teamId}/members/${memberId}`, member).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Remove team member
   */
  removeTeamMember(teamId: string, memberId: string): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.baseUrl}/${teamId}/members/${memberId}`).pipe(
      tap(() => this._error.set(null)),
      catchError(this.handleError.bind(this)),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos. Por favor, verifica la información.';
          break;
        case 401:
          errorMessage = 'No tienes autorización para realizar esta acción.';
          break;
        case 403:
          errorMessage = 'Acceso denegado.';
          break;
        case 404:
          errorMessage = 'El equipo solicitado no fue encontrado.';
          break;
        case 409:
          errorMessage = 'Ya existe un equipo con ese nombre.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    this._error.set(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}