import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ExercisesService } from '../../../../services/exercises.service';
import { NotificationService } from '../../../../services/notification.service';
import { Exercise, CreateExerciseRequest, ExerciseFilters } from '../../../../models/exercise.model';
import { ExerciseCardComponent } from './components/exercise-card/exercise-card.component';
import { ExerciseModalComponent } from './components/exercise-modal/exercise-modal.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [NgIcon, ExerciseCardComponent, ExerciseModalComponent],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class ExercisesComponent implements OnInit {
  private exercisesService = inject(ExercisesService);
  private notificationService = inject(NotificationService);

  readonly exercises = this.exercisesService.exercises;
  readonly isLoading = this.exercisesService.isLoading;
  
  readonly isModalOpen = signal<boolean>(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly selectedExercise = signal<Exercise | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<ExerciseFilters>({});

  readonly filteredExercises = computed(() => {
    let filtered = this.exercises();
    
    // Apply search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.equipment?.toLowerCase().includes(query) ||
        exercise.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    const filters = this.activeFilters();
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(exercise => exercise.isActive === filters.isActive);
    }

    if (filters.category !== undefined) {
      filtered = filtered.filter(exercise => exercise.category === filters.category);
    }

    if (filters.difficulty !== undefined) {
      filtered = filtered.filter(exercise => exercise.difficulty === filters.difficulty);
    }

    if (filters.isCustom !== undefined) {
      filtered = filtered.filter(exercise => exercise.isCustom === filters.isCustom);
    }

    return filtered;
  });

  readonly exercisesCount = computed(() => this.filteredExercises().length);
  readonly activeExercisesCount = computed(() => 
    this.filteredExercises().filter(exercise => exercise.isActive).length
  );

  ngOnInit(): void {
    this.loadExercises();
  }

  private loadExercises(): void {
    this.exercisesService.getAllExercises().subscribe();
  }

  onCreateExercise(): void {
    this.modalMode.set('create');
    this.selectedExercise.set(null);
    this.isModalOpen.set(true);
  }

  onEditExercise(exercise: Exercise): void {
    this.modalMode.set('edit');
    this.selectedExercise.set(exercise);
    this.isModalOpen.set(true);
  }

  onDeleteExercise(exercise: Exercise): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el ejercicio "${exercise.name}"?`)) {
      this.exercisesService.deleteExercise(exercise.id).subscribe({
        next: () => {
          // Exercises list is automatically updated via signals
        },
        error: (error) => {
          console.error('Error deleting exercise:', error);
        }
      });
    }
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedExercise.set(null);
  }

  onExerciseSaved(savedExercise: Exercise): void {
    this.onModalClose();
    // Exercises list is automatically updated via signals
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onRefresh(): void {
    this.exercisesService.refreshExercises();
  }

  onToggleActiveFilter(): void {
    const currentFilters = this.activeFilters();
    const newFilters = { ...currentFilters };
    
    if (newFilters.isActive === undefined) {
      newFilters.isActive = true; // Show only active
    } else if (newFilters.isActive === true) {
      newFilters.isActive = false; // Show only inactive
    } else {
      delete newFilters.isActive; // Show all
    }
    
    this.activeFilters.set(newFilters);
  }

  getFilterButtonText(): string {
    const filters = this.activeFilters();
    if (filters.isActive === true) return 'Solo Activos';
    if (filters.isActive === false) return 'Solo Inactivos';
    return 'Todos';
  }
}