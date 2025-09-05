import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Exercise, CreateExerciseRequest, UpdateExerciseRequest, ExerciseFilters } from '../models/exercise.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/api/customexercises`;
  private readonly _exercises = signal<Exercise[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  readonly exercises = computed(() => this._exercises());
  readonly isLoading = computed(() => this._isLoading());

  getAllExercises(): Observable<Exercise[]> {
    this._isLoading.set(true);
    
    // Debug logging
    console.log('🔥 ExercisesService.getAllExercises called');
    console.log('📍 API URL:', this.apiUrl);
    
    return this.http.get<Exercise[]>(this.apiUrl).pipe(
      tap(exercises => {
        // Convert backend date strings to Date objects
        const processedExercises = exercises.map(exercise => ({
          ...exercise,
          id: exercise.id.toString(),
          createdAt: new Date(exercise.createdAt),
          updatedAt: new Date(exercise.updatedAt)
        }));
        this._exercises.set(processedExercises);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        // Debug logging for errors
        console.error('❌ Error loading exercises:', error);
        console.error('📄 Error status:', error.status);
        console.error('📝 Error message:', error.message);
        
        if (error.status === 0) {
          this.notificationService.showError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } else {
          this.notificationService.showError('Error al cargar los ejercicios');
        }
        throw error;
      })
    );
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`).pipe(
      map(exercise => ({
        ...exercise,
        id: exercise.id.toString(),
        createdAt: new Date(exercise.createdAt),
        updatedAt: new Date(exercise.updatedAt)
      })),
      catchError(error => {
        this.notificationService.showError('Error al cargar el ejercicio');
        throw error;
      })
    );
  }

  createExercise(exerciseData: CreateExerciseRequest): Observable<Exercise> {
    this._isLoading.set(true);
    
    // Ensure all required fields are present with defaults if needed
    const requestData: CreateExerciseRequest = {
      name: exerciseData.name || '',
      description: exerciseData.description || '',
      instructions: exerciseData.instructions || '',
      category: exerciseData.category,
      difficulty: exerciseData.difficulty,
      durationMinutes: exerciseData.durationMinutes || 15,
      minPlayers: exerciseData.minPlayers || 1,
      maxPlayers: exerciseData.maxPlayers || 10,
      equipment: exerciseData.equipment || '',
      tags: exerciseData.tags || [],
      isPublic: exerciseData.isPublic || false
    };
    
    // Debug logging
    console.log('🔥 ExercisesService.createExercise called');
    console.log('📍 API URL:', this.apiUrl);
    console.log('📦 Original request data:', exerciseData);
    console.log('🔧 Processed request data:', requestData);
    console.log('🌐 Environment API URL:', environment.apiUrl);

    return this.http.post<Exercise>(this.apiUrl, requestData).pipe(
      tap(newExercise => {
        const processedExercise = {
          ...newExercise,
          id: newExercise.id.toString(),
          createdAt: new Date(newExercise.createdAt),
          updatedAt: new Date(newExercise.updatedAt)
        };
        
        const currentExercises = this._exercises();
        this._exercises.set([...currentExercises, processedExercise]);
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Ejercicio "${newExercise.name}" creado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        // Debug logging for errors
        console.error('❌ Error creating exercise:', error);
        console.error('📄 Error status:', error.status);
        console.error('📝 Error message:', error.message);
        console.error('🔍 Full error object:', error);
        
        // Show appropriate error message
        if (error.status === 404) {
          this.notificationService.showError('API endpoint no encontrado. Verifica la configuración del backend.');
        } else if (error.status === 401) {
          this.notificationService.showError('No autorizado. Verifica tu autenticación.');
        } else if (error.status === 0) {
          this.notificationService.showError('No se puede conectar con el servidor. Verifica que el backend esté ejecutándose.');
        } else {
          this.notificationService.showError(`Error al crear el ejercicio: ${error.status} - ${error.message}`);
        }
        
        throw error;
      })
    );
  }

  updateExercise(id: string, exerciseData: UpdateExerciseRequest): Observable<Exercise> {
    this._isLoading.set(true);

    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exerciseData).pipe(
      tap(updatedExercise => {
        const processedExercise = {
          ...updatedExercise,
          id: updatedExercise.id.toString(),
          createdAt: new Date(updatedExercise.createdAt),
          updatedAt: new Date(updatedExercise.updatedAt)
        };

        const currentExercises = this._exercises();
        const exerciseIndex = currentExercises.findIndex(e => e.id === id);
        
        if (exerciseIndex !== -1) {
          const updatedExercises = [...currentExercises];
          updatedExercises[exerciseIndex] = processedExercise;
          this._exercises.set(updatedExercises);
        }
        
        this._isLoading.set(false);
        this.notificationService.showSuccess(`Ejercicio "${updatedExercise.name}" actualizado exitosamente`);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al actualizar el ejercicio');
        throw error;
      })
    );
  }

  deleteExercise(id: string): Observable<void> {
    this._isLoading.set(true);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentExercises = this._exercises();
        const exercise = currentExercises.find(e => e.id === id);
        const filteredExercises = currentExercises.filter(e => e.id !== id);
        
        this._exercises.set(filteredExercises);
        this._isLoading.set(false);
        
        if (exercise) {
          this.notificationService.showSuccess(`Ejercicio "${exercise.name}" eliminado exitosamente`);
        }
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al eliminar el ejercicio');
        throw error;
      })
    );
  }

  filterExercises(filters: ExerciseFilters): Exercise[] {
    let filteredExercises = this._exercises();

    if (filters.category !== undefined) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.category === filters.category
      );
    }

    if (filters.difficulty !== undefined) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.difficulty === filters.difficulty
      );
    }

    if (filters.isCustom !== undefined) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.isCustom === filters.isCustom
      );
    }

    if (filters.isPublic !== undefined) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.isPublic === filters.isPublic
      );
    }

    if (filters.isActive !== undefined) {
      filteredExercises = filteredExercises.filter(exercise => 
        exercise.isActive === filters.isActive
      );
    }

    return filteredExercises;
  }

  refreshExercises(): void {
    this.getAllExercises().subscribe();
  }
}