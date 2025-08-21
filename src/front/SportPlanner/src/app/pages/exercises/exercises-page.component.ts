import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ExercisesService } from '../../core/services/exercises.service';
import { 
  Exercise, 
  CreateExerciseRequest, 
  ExerciseCategory, 
  ExerciseDifficulty,
  ExerciseStatus,
  Equipment,
  ExerciseVariation
} from '../../core/models/exercise.interface';

@Component({
  selector: 'app-exercises-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exercises-page.component.html',
  styleUrls: ['./exercises-page.component.css']
})
export class ExercisesPageComponent implements OnInit {
  private readonly exercisesService = inject(ExercisesService);
  private readonly fb = inject(FormBuilder);

  // State signals
  readonly exercises = signal<Exercise[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal<ExerciseCategory | ''>('');
  readonly selectedDifficulty = signal<ExerciseDifficulty | ''>('');
  readonly selectedSport = signal('');
  readonly selectedMinDuration = signal<number | null>(null);
  readonly selectedMaxDuration = signal<number | null>(null);

  // Modal state
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly showViewModal = signal(false);
  readonly selectedExercise = signal<Exercise | null>(null);

  // Form state
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  // Form
  exerciseForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    difficulty: ['', Validators.required],
    duration: [15, [Validators.required, Validators.min(1), Validators.max(180)]],
    minParticipants: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
    maxParticipants: [25, [Validators.required, Validators.min(1), Validators.max(100)]],
    targetAgeGroup: this.fb.array([]),
    sport: ['', Validators.required],
    objectives: this.fb.array([]),
    instructions: this.fb.array([]),
    safetyNotes: this.fb.array([]),
    equipment: this.fb.array([]),
    variations: this.fb.array([]),
    tags: [''],
    spaceRequired: ['', Validators.required],
    isPublic: [true]
  });

  // Computed filtered exercises
  readonly filteredExercises = computed(() => {
    const exercises = this.exercises();
    const searchTerm = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const difficulty = this.selectedDifficulty();
    const sport = this.selectedSport().toLowerCase();
    const minDuration = this.selectedMinDuration();
    const maxDuration = this.selectedMaxDuration();

    return exercises.filter(exercise => {
      const matchesSearch = !searchTerm || 
        exercise.name.toLowerCase().includes(searchTerm) ||
        exercise.description.toLowerCase().includes(searchTerm) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesCategory = !category || exercise.category === category;
      const matchesDifficulty = !difficulty || exercise.difficulty === difficulty;
      const matchesSport = !sport || exercise.sport.toLowerCase().includes(sport);
      const matchesMinDuration = !minDuration || exercise.duration >= minDuration;
      const matchesMaxDuration = !maxDuration || exercise.duration <= maxDuration;

      return matchesSearch && matchesCategory && matchesDifficulty && 
             matchesSport && matchesMinDuration && matchesMaxDuration;
    });
  });

  // Options for forms
  readonly categories = Object.values(ExerciseCategory);
  readonly difficulties = Object.values(ExerciseDifficulty);
  readonly statuses = Object.values(ExerciseStatus);
  
  readonly sports = [
    'Fútbol', 'Baloncesto', 'Voleibol', 'Balonmano', 'Tenis', 
    'Pádel', 'Hockey', 'Rugby', 'Atletismo', 'Natación'
  ];

  readonly ageGroups = [
    'Prebenjamín (6-7 años)', 'Benjamín (8-9 años)', 'Alevín (10-11 años)',
    'Infantil (12-13 años)', 'Cadete (14-15 años)', 'Juvenil (16-17 años)',
    'Junior (18-19 años)', 'Senior (20+ años)', 'Veterano (35+ años)'
  ];

  readonly spaceOptions = [
    'Área pequeña (5x5m)', 'Cuarto de campo', 'Media pista', 'Pista completa',
    'Campo completo', 'Gimnasio', 'Piscina', 'Pista de atletismo', 'Exterior'
  ];

  ngOnInit(): void {
    this.loadExercises();
  }

  // CRUD Operations
  loadExercises(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.exercisesService.getExercises().subscribe({
      next: (response) => {
        this.exercises.set(response.exercises);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Error al cargar ejercicios');
        this.isLoading.set(false);
      }
    });
  }

  onCreateExercise(): void {
    if (this.exerciseForm.invalid) {
      this.exerciseForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);

    const formValue = this.exerciseForm.value;
    
    const exerciseData: CreateExerciseRequest = {
      name: formValue.name,
      description: formValue.description,
      category: formValue.category,
      difficulty: formValue.difficulty,
      duration: formValue.duration,
      minParticipants: formValue.minParticipants,
      maxParticipants: formValue.maxParticipants,
      targetAgeGroup: formValue.targetAgeGroup || [],
      sport: formValue.sport,
      objectives: formValue.objectives || [],
      instructions: formValue.instructions || [],
      safetyNotes: formValue.safetyNotes || [],
      equipment: formValue.equipment || [],
      variations: formValue.variations || [],
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
      spaceRequired: formValue.spaceRequired,
      isPublic: formValue.isPublic
    };

    this.exercisesService.createExercise(exerciseData).subscribe({
      next: () => {
        this.loadExercises();
        this.closeModals();
        this.isCreating.set(false);
      },
      error: (error) => {
        this.createError.set(error.message || 'Error al crear ejercicio');
        this.isCreating.set(false);
      }
    });
  }

  onDeleteExercise(): void {
    const exercise = this.selectedExercise();
    if (!exercise) return;

    this.exercisesService.deleteExercise(exercise.id).subscribe({
      next: () => {
        this.loadExercises();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message || 'Error al eliminar ejercicio');
      }
    });
  }

  // Modal management
  openCreateModal(): void {
    this.exerciseForm.reset({
      name: '',
      description: '',
      category: '',
      difficulty: '',
      duration: 15,
      minParticipants: 1,
      maxParticipants: 25,
      sport: '',
      spaceRequired: '',
      tags: '',
      isPublic: true
    });
    
    // Reset form arrays
    this.clearFormArray('targetAgeGroup');
    this.clearFormArray('objectives');
    this.clearFormArray('instructions');
    this.clearFormArray('safetyNotes');
    this.clearFormArray('equipment');
    this.clearFormArray('variations');
    
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  openViewModal(exercise: Exercise): void {
    this.selectedExercise.set(exercise);
    this.showViewModal.set(true);
  }

  openDeleteModal(exercise: Exercise): void {
    this.selectedExercise.set(exercise);
    this.showDeleteModal.set(true);
  }

  closeModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.showViewModal.set(false);
    this.selectedExercise.set(null);
  }

  // Form array helpers
  get targetAgeGroupArray(): FormArray {
    return this.exerciseForm.get('targetAgeGroup') as FormArray;
  }

  get objectivesArray(): FormArray {
    return this.exerciseForm.get('objectives') as FormArray;
  }

  get instructionsArray(): FormArray {
    return this.exerciseForm.get('instructions') as FormArray;
  }

  get safetyNotesArray(): FormArray {
    return this.exerciseForm.get('safetyNotes') as FormArray;
  }

  get equipmentArray(): FormArray {
    return this.exerciseForm.get('equipment') as FormArray;
  }

  get variationsArray(): FormArray {
    return this.exerciseForm.get('variations') as FormArray;
  }

  addToFormArray(arrayName: string, value: string = ''): void {
    const array = this.exerciseForm.get(arrayName) as FormArray;
    array.push(this.fb.control(value, Validators.required));
  }

  removeFromFormArray(arrayName: string, index: number): void {
    const array = this.exerciseForm.get(arrayName) as FormArray;
    array.removeAt(index);
  }

  clearFormArray(arrayName: string): void {
    const array = this.exerciseForm.get(arrayName) as FormArray;
    array.clear();
  }

  // Filters and search
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value as ExerciseCategory || '');
  }

  onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDifficulty.set(target.value as ExerciseDifficulty || '');
  }

  onSportChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSport.set(target.value);
  }

  onMinDurationChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : null;
    this.selectedMinDuration.set(value);
  }

  onMaxDurationChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value ? parseInt(target.value) : null;
    this.selectedMaxDuration.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedDifficulty.set('');
    this.selectedSport.set('');
    this.selectedMinDuration.set(null);
    this.selectedMaxDuration.set(null);
  }

  // Utility methods
  getCategoryLabel(category: ExerciseCategory): string {
    const labels: Record<ExerciseCategory, string> = {
      [ExerciseCategory.WARM_UP]: 'Calentamiento',
      [ExerciseCategory.TECHNICAL]: 'Técnico',
      [ExerciseCategory.TACTICAL]: 'Táctico',
      [ExerciseCategory.PHYSICAL]: 'Físico',
      [ExerciseCategory.COORDINATION]: 'Coordinación',
      [ExerciseCategory.FLEXIBILITY]: 'Flexibilidad',
      [ExerciseCategory.STRENGTH]: 'Fuerza',
      [ExerciseCategory.ENDURANCE]: 'Resistencia',
      [ExerciseCategory.SPEED]: 'Velocidad',
      [ExerciseCategory.AGILITY]: 'Agilidad',
      [ExerciseCategory.COOL_DOWN]: 'Vuelta a la calma',
      [ExerciseCategory.GAME]: 'Juego'
    };
    return labels[category];
  }

  getDifficultyLabel(difficulty: ExerciseDifficulty): string {
    const labels: Record<ExerciseDifficulty, string> = {
      [ExerciseDifficulty.VERY_EASY]: 'Muy fácil',
      [ExerciseDifficulty.EASY]: 'Fácil',
      [ExerciseDifficulty.MEDIUM]: 'Medio',
      [ExerciseDifficulty.HARD]: 'Difícil',
      [ExerciseDifficulty.VERY_HARD]: 'Muy difícil'
    };
    return labels[difficulty];
  }

  getDifficultyColor(difficulty: ExerciseDifficulty): string {
    const colors: Record<ExerciseDifficulty, string> = {
      [ExerciseDifficulty.VERY_EASY]: 'bg-green-100 text-green-800',
      [ExerciseDifficulty.EASY]: 'bg-blue-100 text-blue-800',
      [ExerciseDifficulty.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [ExerciseDifficulty.HARD]: 'bg-orange-100 text-orange-800',
      [ExerciseDifficulty.VERY_HARD]: 'bg-red-100 text-red-800'
    };
    return colors[difficulty];
  }

  getCategoryColor(category: ExerciseCategory): string {
    const colors: Record<ExerciseCategory, string> = {
      [ExerciseCategory.WARM_UP]: 'bg-green-100 text-green-800',
      [ExerciseCategory.TECHNICAL]: 'bg-blue-100 text-blue-800',
      [ExerciseCategory.TACTICAL]: 'bg-purple-100 text-purple-800',
      [ExerciseCategory.PHYSICAL]: 'bg-red-100 text-red-800',
      [ExerciseCategory.COORDINATION]: 'bg-indigo-100 text-indigo-800',
      [ExerciseCategory.FLEXIBILITY]: 'bg-pink-100 text-pink-800',
      [ExerciseCategory.STRENGTH]: 'bg-gray-100 text-gray-800',
      [ExerciseCategory.ENDURANCE]: 'bg-orange-100 text-orange-800',
      [ExerciseCategory.SPEED]: 'bg-yellow-100 text-yellow-800',
      [ExerciseCategory.AGILITY]: 'bg-cyan-100 text-cyan-800',
      [ExerciseCategory.COOL_DOWN]: 'bg-teal-100 text-teal-800',
      [ExerciseCategory.GAME]: 'bg-emerald-100 text-emerald-800'
    };
    return colors[category];
  }

  // Error handling
  clearError(): void {
    this.error.set(null);
  }

  retryLoad(): void {
    this.clearError();
    this.loadExercises();
  }

  // Rating helpers
  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
}