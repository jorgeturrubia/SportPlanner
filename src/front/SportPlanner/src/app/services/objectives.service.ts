import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, tap, map, switchMap } from 'rxjs/operators';
import { Objective, CreateObjectiveRequest, UpdateObjectiveRequest, ObjectiveFilters, ObjectiveCategory, ObjectiveSubcategory } from '../models/objective.model';
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

  // Objective categories and subcategories
  readonly objectiveCategories = signal<ObjectiveCategory[]>([]);
  readonly objectiveSubcategories = signal<ObjectiveSubcategory[]>([]);

  readonly objectives = computed(() => this._objectives());
  readonly isLoading = computed(() => this._isLoading());

  // Load objective categories and subcategories
  loadObjectiveMasters(): Observable<void> {
    return forkJoin({
      categories: this.getObjectiveCategories(),
      subcategories: this.getObjectiveSubcategories()
    }).pipe(
      map(() => void 0)
    );
  }

  getObjectiveCategories(): Observable<ObjectiveCategory[]> {
    return this.http.get<ObjectiveCategory[]>(`${environment.apiUrl}/api/objectivecategories`).pipe(
      tap(categories => this.objectiveCategories.set(categories))
    );
  }

  getObjectiveSubcategories(): Observable<ObjectiveSubcategory[]> {
    return this.http.get<ObjectiveSubcategory[]>(`${environment.apiUrl}/api/objectivesubcategories`).pipe(
      tap(subcategories => this.objectiveSubcategories.set(subcategories))
    );
  }

  getSubcategoriesByCategory(categoryId: number): ObjectiveSubcategory[] {
    return this.objectiveSubcategories().filter(sub => sub.objectiveCategoryId === categoryId);
  }

  getAllObjectives(): Observable<Objective[]> {
    this._isLoading.set(true);

    // First load masters data, then objectives
    return this.loadObjectiveMasters().pipe(
      switchMap(() => this.http.get<Objective[]>(this.apiUrl)),
      tap(objectives => {
        // Convert backend date strings to Date objects
        const processedObjectives = objectives.map(objective => ({
          ...objective,
          createdAt: new Date(objective.createdAt),
          updatedAt: new Date(objective.updatedAt)
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

  getObjectiveById(id: number): Observable<Objective> {
    return this.http.get<Objective>(`${this.apiUrl}/${id}`).pipe(
      map(objective => ({
        ...objective,
        createdAt: new Date(objective.createdAt),
        updatedAt: new Date(objective.updatedAt)
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
          createdAt: new Date(newObjective.createdAt),
          updatedAt: new Date(newObjective.updatedAt)
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

  updateObjective(id: number, objectiveData: UpdateObjectiveRequest): Observable<Objective> {
    this._isLoading.set(true);

    return this.http.put<Objective>(`${this.apiUrl}/${id}`, objectiveData).pipe(
      tap(updatedObjective => {
        const processedObjective = {
          ...updatedObjective,
          createdAt: new Date(updatedObjective.createdAt),
          updatedAt: new Date(updatedObjective.updatedAt)
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

  deleteObjective(id: number): Observable<void> {
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

    if (filters.tags) {
      filteredObjectives = filteredObjectives.filter(objective =>
        objective.tags.toLowerCase().includes(filters.tags!.toLowerCase())
      );
    }

    if (filters.objectiveCategoryId !== undefined) {
      filteredObjectives = filteredObjectives.filter(objective =>
        objective.objectiveCategoryId === filters.objectiveCategoryId
      );
    }

    if (filters.objectiveSubcategoryId !== undefined) {
      filteredObjectives = filteredObjectives.filter(objective =>
        objective.objectiveSubcategoryId === filters.objectiveSubcategoryId
      );
    }

    return filteredObjectives;
  }

  refreshObjectives(): void {
    this.getAllObjectives().subscribe();
  }
}