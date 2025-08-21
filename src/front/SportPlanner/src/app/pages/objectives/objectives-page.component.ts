import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObjectivesService } from '../../core/services/objectives.service';
import { 
  Objective, 
  CreateObjectiveRequest, 
  ObjectiveCategory, 
  ObjectiveDifficulty,
  ObjectiveStatus 
} from '../../core/models/objective.interface';

@Component({
  selector: 'app-objectives-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './objectives-page.component.html',
  styleUrls: ['./objectives-page.component.css']
})
export class ObjectivesPageComponent implements OnInit {
  private readonly objectivesService = inject(ObjectivesService);
  private readonly fb = inject(FormBuilder);

  // State signals
  readonly objectives = signal<Objective[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly selectedCategory = signal<ObjectiveCategory | ''>('');
  readonly selectedDifficulty = signal<ObjectiveDifficulty | ''>('');
  readonly selectedSport = signal('');

  // Modal state
  readonly showCreateModal = signal(false);
  readonly showEditModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly showViewModal = signal(false);
  readonly selectedObjective = signal<Objective | null>(null);

  // Form state
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  // Form
  objectiveForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    difficulty: ['', Validators.required],
    estimatedDuration: [30, [Validators.required, Validators.min(5), Validators.max(300)]],
    targetAgeGroup: ['', Validators.required],
    sport: ['', Validators.required],
    tags: [''],
    prerequisites: [''],
    equipmentNeeded: [''],
    maxParticipants: [25, [Validators.required, Validators.min(1), Validators.max(100)]],
    minParticipants: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
    isPublic: [true]
  });

  // Computed filtered objectives
  readonly filteredObjectives = computed(() => {
    const objectives = this.objectives();
    const searchTerm = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();
    const difficulty = this.selectedDifficulty();
    const sport = this.selectedSport().toLowerCase();

    return objectives.filter(objective => {
      const matchesSearch = !searchTerm || 
        objective.title.toLowerCase().includes(searchTerm) ||
        objective.description.toLowerCase().includes(searchTerm) ||
        objective.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchesCategory = !category || objective.category === category;
      const matchesDifficulty = !difficulty || objective.difficulty === difficulty;
      const matchesSport = !sport || objective.sport.toLowerCase().includes(sport);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesSport;
    });
  });

  // Options for forms
  readonly categories = Object.values(ObjectiveCategory);
  readonly difficulties = Object.values(ObjectiveDifficulty);
  readonly statuses = Object.values(ObjectiveStatus);
  
  readonly sports = [
    'Fútbol', 'Baloncesto', 'Voleibol', 'Balonmano', 'Tenis', 
    'Pádel', 'Hockey', 'Rugby', 'Atletismo', 'Natación'
  ];

  readonly ageGroups = [
    'Prebenjamín (6-7 años)', 'Benjamín (8-9 años)', 'Alevín (10-11 años)',
    'Infantil (12-13 años)', 'Cadete (14-15 años)', 'Juvenil (16-17 años)',
    'Junior (18-19 años)', 'Senior (20+ años)', 'Veterano (35+ años)'
  ];

  ngOnInit(): void {
    this.loadObjectives();
  }

  // CRUD Operations
  loadObjectives(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.objectivesService.getObjectives().subscribe({
      next: (response) => {
        this.objectives.set(response.objectives);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Error al cargar objetivos');
        this.isLoading.set(false);
      }
    });
  }

  onCreateObjective(): void {
    if (this.objectiveForm.invalid) {
      this.objectiveForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);

    const formValue = this.objectiveForm.value;
    
    const objectiveData: CreateObjectiveRequest = {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      difficulty: formValue.difficulty,
      estimatedDuration: formValue.estimatedDuration,
      targetAgeGroup: formValue.targetAgeGroup,
      sport: formValue.sport,
      tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
      prerequisites: formValue.prerequisites ? formValue.prerequisites.split(',').map((req: string) => req.trim()) : [],
      equipmentNeeded: formValue.equipmentNeeded ? formValue.equipmentNeeded.split(',').map((eq: string) => eq.trim()) : [],
      maxParticipants: formValue.maxParticipants,
      minParticipants: formValue.minParticipants,
      isPublic: formValue.isPublic
    };

    this.objectivesService.createObjective(objectiveData).subscribe({
      next: () => {
        this.loadObjectives();
        this.closeModals();
        this.isCreating.set(false);
      },
      error: (error) => {
        this.createError.set(error.message || 'Error al crear objetivo');
        this.isCreating.set(false);
      }
    });
  }

  onDeleteObjective(): void {
    const objective = this.selectedObjective();
    if (!objective) return;

    this.objectivesService.deleteObjective(objective.id).subscribe({
      next: () => {
        this.loadObjectives();
        this.closeModals();
      },
      error: (error) => {
        this.error.set(error.message || 'Error al eliminar objetivo');
      }
    });
  }

  // Modal management
  openCreateModal(): void {
    this.objectiveForm.reset({
      title: '',
      description: '',
      category: '',
      difficulty: '',
      estimatedDuration: 30,
      targetAgeGroup: '',
      sport: '',
      tags: '',
      prerequisites: '',
      equipmentNeeded: '',
      maxParticipants: 25,
      minParticipants: 5,
      isPublic: true
    });
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  openViewModal(objective: Objective): void {
    this.selectedObjective.set(objective);
    this.showViewModal.set(true);
  }

  openDeleteModal(objective: Objective): void {
    this.selectedObjective.set(objective);
    this.showDeleteModal.set(true);
  }

  closeModals(): void {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.showViewModal.set(false);
    this.selectedObjective.set(null);
  }

  // Filters and search
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory.set(target.value as ObjectiveCategory || '');
  }

  onDifficultyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDifficulty.set(target.value as ObjectiveDifficulty || '');
  }

  onSportChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSport.set(target.value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
    this.selectedDifficulty.set('');
    this.selectedSport.set('');
  }

  // Utility methods
  getCategoryLabel(category: ObjectiveCategory): string {
    const labels: Record<ObjectiveCategory, string> = {
      [ObjectiveCategory.TECHNICAL]: 'Técnico',
      [ObjectiveCategory.TACTICAL]: 'Táctico', 
      [ObjectiveCategory.PHYSICAL]: 'Físico',
      [ObjectiveCategory.PSYCHOLOGICAL]: 'Psicológico'
    };
    return labels[category];
  }

  getDifficultyLabel(difficulty: ObjectiveDifficulty): string {
    const labels: Record<ObjectiveDifficulty, string> = {
      [ObjectiveDifficulty.BEGINNER]: 'Principiante',
      [ObjectiveDifficulty.INTERMEDIATE]: 'Intermedio',
      [ObjectiveDifficulty.ADVANCED]: 'Avanzado',
      [ObjectiveDifficulty.EXPERT]: 'Experto'
    };
    return labels[difficulty];
  }

  getDifficultyColor(difficulty: ObjectiveDifficulty): string {
    const colors: Record<ObjectiveDifficulty, string> = {
      [ObjectiveDifficulty.BEGINNER]: 'bg-green-100 text-green-800',
      [ObjectiveDifficulty.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
      [ObjectiveDifficulty.ADVANCED]: 'bg-orange-100 text-orange-800',
      [ObjectiveDifficulty.EXPERT]: 'bg-red-100 text-red-800'
    };
    return colors[difficulty];
  }

  getCategoryColor(category: ObjectiveCategory): string {
    const colors: Record<ObjectiveCategory, string> = {
      [ObjectiveCategory.TECHNICAL]: 'bg-blue-100 text-blue-800',
      [ObjectiveCategory.TACTICAL]: 'bg-purple-100 text-purple-800',
      [ObjectiveCategory.PHYSICAL]: 'bg-green-100 text-green-800',
      [ObjectiveCategory.PSYCHOLOGICAL]: 'bg-pink-100 text-pink-800'
    };
    return colors[category];
  }

  // Error handling
  clearError(): void {
    this.error.set(null);
  }

  retryLoad(): void {
    this.clearError();
    this.loadObjectives();
  }
}