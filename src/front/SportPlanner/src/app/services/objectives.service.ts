import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Objective, CreateObjectiveRequest, UpdateObjectiveRequest, ObjectiveFilters } from '../models/objective.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/api/objectives`;
  private readonly _objectives = signal<Objective[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  readonly objectives = computed(() => this._objectives());
  readonly isLoading = computed(() => this._isLoading());

  getAllObjectives(): Observable<Objective[]> {
    this._isLoading.set(true);
    
    return this.http.get<Objective[]>(this.apiUrl).pipe(
      tap(objectives => {
        // Convert backend date strings to Date objects
        const processedObjectives = objectives.map(objective => ({
          ...objective,
          id: objective.id.toString(),
          createdAt: new Date(objective.createdAt),
          updatedAt: new Date(objective.updatedAt),
          targetDate: objective.targetDate ? new Date(objective.targetDate) : undefined,
          completedDate: objective.completedDate ? new Date(objective.completedDate) : undefined
        }));
        this._objectives.set(processedObjectives);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al cargar los objetivos');
        throw error;
      })
    );
  }

  getObjectiveById(id: string): Observable<Objective> {
    return this.http.get<Objective>(`${this.apiUrl}/${id}`).pipe(
      map(objective => ({
        ...objective,
        id: objective.id.toString(),
        createdAt: new Date(objective.createdAt),
        updatedAt: new Date(objective.updatedAt),
        targetDate: objective.targetDate ? new Date(objective.targetDate) : undefined,
        completedDate: objective.completedDate ? new Date(objective.completedDate) : undefined
      })),
      catchError(error => {
        this.notificationService.showError('Error al cargar el objetivo');
        throw error;
      })
    );
  }

  createObjective(objectiveData: CreateObjectiveRequest): Observable<Objective> {
    this._isLoading.set(true);

    return this.http.post<Objective>(this.apiUrl, objectiveData).pipe(
      tap(newObjective => {
        const processedObjective = {
          ...newObjective,
          id: newObjective.id.toString(),
          createdAt: new Date(newObjective.createdAt),
          updatedAt: new Date(newObjective.updatedAt),
          targetDate: newObjective.targetDate ? new Date(newObjective.targetDate) : undefined,
          completedDate: newObjective.completedDate ? new Date(newObjective.completedDate) : undefined
        };
        
        const currentObjectives = this._objectives();
        this._objectives.set([...currentObjectives, processedObjective]);
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Objetivo "${newObjective.title}" creado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  updateObjective(id: string, objectiveData: UpdateObjectiveRequest): Observable<Objective> {
    this._isLoading.set(true);

    return this.http.put<Objective>(`${this.apiUrl}/${id}`, objectiveData).pipe(
      tap(updatedObjective => {
        const processedObjective = {
          ...updatedObjective,
          id: updatedObjective.id.toString(),
          createdAt: new Date(updatedObjective.createdAt),
          updatedAt: new Date(updatedObjective.updatedAt),
          targetDate: updatedObjective.targetDate ? new Date(updatedObjective.targetDate) : undefined,
          completedDate: updatedObjective.completedDate ? new Date(updatedObjective.completedDate) : undefined
        };

        const currentObjectives = this._objectives();
        const objectiveIndex = currentObjectives.findIndex(o => o.id === id);
        
        if (objectiveIndex !== -1) {
          const updatedObjectives = [...currentObjectives];
          updatedObjectives[objectiveIndex] = processedObjective;
          this._objectives.set(updatedObjectives);
        }
        
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Objetivo "${updatedObjective.title}" actualizado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al actualizar el objetivo');
        throw error;
      })
    );
  }

  deleteObjective(id: string): Observable<void> {
    this._isLoading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentObjectives = this._objectives();
        const objective = currentObjectives.find(o => o.id === id);
        const filteredObjectives = currentObjectives.filter(o => o.id !== id);
        
        this._objectives.set(filteredObjectives);
        this._isLoading.set(false);
        
        if (objective) {
          this.notificationService.showSuccess(`Objetivo "${objective.title}" eliminado exitosamente`);
        }
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al eliminar el objetivo');
        throw error;
      })
    );
  }

  filterObjectives(filters: ObjectiveFilters): Objective[] {
    let filteredObjectives = this._objectives();

    if (filters.priority !== undefined) {
      filteredObjectives = filteredObjectives.filter(objective => 
        objective.priority === filters.priority
      );
    }

    if (filters.status !== undefined) {
      filteredObjectives = filteredObjectives.filter(objective => 
        objective.status === filters.status
      );
    }

    if (filters.teamId) {
      filteredObjectives = filteredObjectives.filter(objective => 
        objective.teamId === filters.teamId
      );
    }

    if (filters.isActive !== undefined) {
      filteredObjectives = filteredObjectives.filter(objective => 
        objective.isActive === filters.isActive
      );
    }

    return filteredObjectives;
  }

  refreshObjectives(): void {
    this.getAllObjectives().subscribe();
  }
}