import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Planning, CreatePlanningRequest, UpdatePlanningRequest, PlanningFilters } from '../models/planning.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanningsService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/api/plannings`;
  private readonly _plannings = signal<Planning[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  readonly plannings = computed(() => this._plannings());
  readonly isLoading = computed(() => this._isLoading());

  getAllPlannings(): Observable<Planning[]> {
    this._isLoading.set(true);
    
    return this.http.get<Planning[]>(this.apiUrl).pipe(
      tap(plannings => {
        // Convert backend date strings to Date objects
        const processedPlannings = plannings.map(planning => ({
          ...planning,
          id: planning.id.toString(),
          createdAt: new Date(planning.createdAt),
          updatedAt: new Date(planning.updatedAt),
          startDate: new Date(planning.startDate),
          endDate: new Date(planning.endDate)
        }));
        this._plannings.set(processedPlannings);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al cargar las planificaciones');
        throw error;
      })
    );
  }

  getPlanningById(id: string): Observable<Planning> {
    return this.http.get<Planning>(`${this.apiUrl}/${id}`).pipe(
      map(planning => ({
        ...planning,
        id: planning.id.toString(),
        createdAt: new Date(planning.createdAt),
        updatedAt: new Date(planning.updatedAt),
        startDate: new Date(planning.startDate),
        endDate: new Date(planning.endDate)
      })),
      catchError(error => {
        this.notificationService.showError('Error al cargar la planificación');
        throw error;
      })
    );
  }

  createPlanning(planningData: CreatePlanningRequest): Observable<Planning> {
    this._isLoading.set(true);

    return this.http.post<Planning>(this.apiUrl, planningData).pipe(
      tap(newPlanning => {
        const processedPlanning = {
          ...newPlanning,
          id: newPlanning.id.toString(),
          createdAt: new Date(newPlanning.createdAt),
          updatedAt: new Date(newPlanning.updatedAt),
          startDate: new Date(newPlanning.startDate),
          endDate: new Date(newPlanning.endDate)
        };
        
        const currentPlannings = this._plannings();
        this._plannings.set([...currentPlannings, processedPlanning]);
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Planificación "${newPlanning.name}" creada exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  updatePlanning(id: string, planningData: UpdatePlanningRequest): Observable<Planning> {
    this._isLoading.set(true);

    return this.http.put<Planning>(`${this.apiUrl}/${id}`, planningData).pipe(
      tap(updatedPlanning => {
        const processedPlanning = {
          ...updatedPlanning,
          id: updatedPlanning.id.toString(),
          createdAt: new Date(updatedPlanning.createdAt),
          updatedAt: new Date(updatedPlanning.updatedAt),
          startDate: new Date(updatedPlanning.startDate),
          endDate: new Date(updatedPlanning.endDate)
        };

        const currentPlannings = this._plannings();
        const planningIndex = currentPlannings.findIndex(p => p.id === id);
        
        if (planningIndex !== -1) {
          const updatedPlannings = [...currentPlannings];
          updatedPlannings[planningIndex] = processedPlanning;
          this._plannings.set(updatedPlannings);
        }
        
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Planificación "${updatedPlanning.name}" actualizada exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al actualizar la planificación');
        throw error;
      })
    );
  }

  deletePlanning(id: string): Observable<void> {
    this._isLoading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentPlannings = this._plannings();
        const planning = currentPlannings.find(p => p.id === id);
        const filteredPlannings = currentPlannings.filter(p => p.id !== id);
        
        this._plannings.set(filteredPlannings);
        this._isLoading.set(false);
        
        if (planning) {
          this.notificationService.showSuccess(`Planificación "${planning.name}" eliminada exitosamente`);
        }
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al eliminar la planificación');
        throw error;
      })
    );
  }

  filterPlannings(filters: PlanningFilters): Planning[] {
    let filteredPlannings = this._plannings();

    if (filters.type !== undefined) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.type === filters.type
      );
    }

    if (filters.status !== undefined) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.status === filters.status
      );
    }

    if (filters.teamId) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.teamId === filters.teamId
      );
    }

    if (filters.isTemplate !== undefined) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.isTemplate === filters.isTemplate
      );
    }

    if (filters.isPublic !== undefined) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.isPublic === filters.isPublic
      );
    }

    if (filters.isActive !== undefined) {
      filteredPlannings = filteredPlannings.filter(planning => 
        planning.isActive === filters.isActive
      );
    }

    return filteredPlannings;
  }

  refreshPlannings(): void {
    this.getAllPlannings().subscribe();
  }
}