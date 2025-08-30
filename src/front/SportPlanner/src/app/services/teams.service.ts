import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Team, CreateTeamRequest, UpdateTeamRequest, TeamFilters } from '../models/team.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  // For now, we'll use mock data until backend is connected
  private readonly _teams = signal<Team[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  readonly teams = computed(() => this._teams());
  readonly isLoading = computed(() => this._isLoading());

  constructor() {
    // Initialize with mock data for demo
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Juvenil A',
        description: 'Equipo juvenil masculino categoría A',
        sport: 'Fútbol',
        category: 'Juvenil',
        season: '2023-2024',
        coachId: 'coach1',
        playersCount: 22,
        isActive: true,
        createdAt: new Date('2023-09-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Cadete B',
        description: 'Equipo cadete femenino',
        sport: 'Básquet',
        category: 'Cadete',
        season: '2023-2024',
        coachId: 'coach1',
        playersCount: 15,
        isActive: true,
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        name: 'Infantil',
        description: 'Equipo infantil mixto',
        sport: 'Vóleibol',
        category: 'Infantil',
        season: '2023-2024',
        coachId: 'coach1',
        playersCount: 18,
        isActive: false,
        createdAt: new Date('2023-10-01'),
        updatedAt: new Date('2024-01-20')
      }
    ];

    this._teams.set(mockTeams);
  }

  getAllTeams(): Observable<Team[]> {
    this._isLoading.set(true);
    
    // Simulate API call delay
    return new Observable<Team[]>(observer => {
      setTimeout(() => {
        this._isLoading.set(false);
        observer.next(this._teams());
        observer.complete();
      }, 500);
    });
  }

  getTeamById(id: string): Observable<Team | undefined> {
    const team = this._teams().find(t => t.id === id);
    return of(team);
  }

  createTeam(teamData: CreateTeamRequest): Observable<Team> {
    this._isLoading.set(true);

    return new Observable<Team>(observer => {
      // Simulate API call
      setTimeout(() => {
        const currentUser = this.authService.currentUser();
        if (!currentUser) {
          observer.error(new Error('Usuario no autenticado'));
          return;
        }

        const newTeam: Team = {
          id: Date.now().toString(),
          name: teamData.name,
          description: teamData.description,
          sport: teamData.sport,
          category: teamData.category,
          season: teamData.season,
          coachId: currentUser.id,
          playersCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const currentTeams = this._teams();
        this._teams.set([...currentTeams, newTeam]);
        this._isLoading.set(false);

        this.notificationService.showSuccess(`Equipo "${newTeam.name}" creado exitosamente`);
        observer.next(newTeam);
        observer.complete();
      }, 800);
    });
  }

  updateTeam(id: string, teamData: UpdateTeamRequest): Observable<Team> {
    this._isLoading.set(true);

    return new Observable<Team>(observer => {
      // Simulate API call
      setTimeout(() => {
        const currentTeams = this._teams();
        const teamIndex = currentTeams.findIndex(t => t.id === id);
        
        if (teamIndex === -1) {
          observer.error(new Error('Equipo no encontrado'));
          return;
        }

        const updatedTeam: Team = {
          ...currentTeams[teamIndex],
          ...teamData,
          updatedAt: new Date()
        };

        const updatedTeams = [...currentTeams];
        updatedTeams[teamIndex] = updatedTeam;
        this._teams.set(updatedTeams);
        this._isLoading.set(false);

        this.notificationService.showSuccess(`Equipo "${updatedTeam.name}" actualizado exitosamente`);
        observer.next(updatedTeam);
        observer.complete();
      }, 600);
    });
  }

  deleteTeam(id: string): Observable<void> {
    this._isLoading.set(true);

    return new Observable<void>(observer => {
      // Simulate API call
      setTimeout(() => {
        const currentTeams = this._teams();
        const team = currentTeams.find(t => t.id === id);
        
        if (!team) {
          observer.error(new Error('Equipo no encontrado'));
          return;
        }

        const filteredTeams = currentTeams.filter(t => t.id !== id);
        this._teams.set(filteredTeams);
        this._isLoading.set(false);

        this.notificationService.showSuccess(`Equipo "${team.name}" eliminado exitosamente`);
        observer.next();
        observer.complete();
      }, 400);
    });
  }

  filterTeams(filters: TeamFilters): Team[] {
    let filteredTeams = this._teams();

    if (filters.sport) {
      filteredTeams = filteredTeams.filter(team => 
        team.sport.toLowerCase().includes(filters.sport!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredTeams = filteredTeams.filter(team => 
        team.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.season) {
      filteredTeams = filteredTeams.filter(team => 
        team.season?.toLowerCase().includes(filters.season!.toLowerCase())
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