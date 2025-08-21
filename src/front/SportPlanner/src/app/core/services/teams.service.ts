import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Team, CreateTeamRequest, UpdateTeamRequest } from '../models/team.interface';

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
   * Get all teams
   */
  getTeams(): Observable<Team[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Team[]>(this.baseUrl).pipe(
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