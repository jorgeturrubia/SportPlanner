import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Team, CreateTeamRequest, UpdateTeamRequest, TeamFilters } from '../models/team.model';
import { MastersService } from './masters.service';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private mastersService = inject(MastersService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/api/teams`;
  private readonly _teams = signal<Team[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  readonly teams = computed(() => this._teams());
  readonly isLoading = computed(() => this._isLoading());

  getAllTeams(): Observable<Team[]> {
    this._isLoading.set(true);

    // First load masters data, then teams
    return this.mastersService.loadAllMasters().pipe(
      switchMap(() => this.http.get<Team[]>(this.apiUrl)),
      tap(teams => {
        // Convert backend date strings to Date objects
        const processedTeams = teams.map(team => ({
          ...team,
          id: team.id.toString(),
          createdAt: new Date(team.createdAt),
          updatedAt: new Date(team.updatedAt)
        }));
        this._teams.set(processedTeams);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);

        // Handle specific auth errors
        if (error.status === 401) {
          console.error('❌ Teams service: Authentication error, user will be logged out by interceptor');
          // Don't show notification for auth errors - interceptor will handle logout
          return of([]); // Return empty array to prevent component errors
        } else {
          this.notificationService.showError('Error al cargar los equipos');
        }

        throw error;
      })
    );
  }

  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`).pipe(
      map(team => ({
        ...team,
        id: team.id.toString(),
        createdAt: new Date(team.createdAt),
        updatedAt: new Date(team.updatedAt)
      })),
      catchError(error => {
        this.notificationService.showError('Error al cargar el equipo');
        throw error;
      })
    );
  }

  createTeam(teamData: CreateTeamRequest): Observable<Team> {
    this._isLoading.set(true);

    return this.http.post<Team>(this.apiUrl, teamData).pipe(
      tap(newTeam => {
        const processedTeam = {
          ...newTeam,
          id: newTeam.id.toString(),
          createdAt: new Date(newTeam.createdAt),
          updatedAt: new Date(newTeam.updatedAt)
        };
        
        const currentTeams = this._teams();
        this._teams.set([...currentTeams, processedTeam]);
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Equipo "${newTeam.name}" creado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        // It's better to let the component handle the notification
        // this.notificationService.showError('Error al crear el equipo');
        throw error;
      })
    );
  }

  updateTeam(id: string, teamData: UpdateTeamRequest): Observable<Team> {
    this._isLoading.set(true);

    return this.http.put<Team>(`${this.apiUrl}/${id}`, teamData).pipe(
      tap(updatedTeam => {
        const processedTeam = {
          ...updatedTeam,
          id: updatedTeam.id.toString(),
          createdAt: new Date(updatedTeam.createdAt),
          updatedAt: new Date(updatedTeam.updatedAt)
        };

        const currentTeams = this._teams();
        const teamIndex = currentTeams.findIndex(t => t.id === id);
        
        if (teamIndex !== -1) {
          const updatedTeams = [...currentTeams];
          updatedTeams[teamIndex] = processedTeam;
          this._teams.set(updatedTeams);
        }
        
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Equipo "${updatedTeam.name}" actualizado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al actualizar el equipo');
        throw error;
      })
    );
  }

  deleteTeam(id: string): Observable<void> {
    this._isLoading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentTeams = this._teams();
        const team = currentTeams.find(t => t.id === id);
        const filteredTeams = currentTeams.filter(t => t.id !== id);
        
        this._teams.set(filteredTeams);
        this._isLoading.set(false);
        
        if (team) {
          this.notificationService.showSuccess(`Equipo "${team.name}" eliminado exitosamente`);
        }
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al eliminar el equipo');
        throw error;
      })
    );
  }

  filterTeams(filters: TeamFilters): Team[] {
    let filteredTeams = this._teams();

    if (filters.sport) {
      filteredTeams = filteredTeams.filter(team =>
        team.sportName.toLowerCase().includes(filters.sport!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredTeams = filteredTeams.filter(team =>
        team.categoryName?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.isActive !== undefined) {
      filteredTeams = filteredTeams.filter(team => team.isActive === filters.isActive);
    }

    return filteredTeams;
  }

  refreshTeams(): void {
    this.getAllTeams().subscribe();
  }
}