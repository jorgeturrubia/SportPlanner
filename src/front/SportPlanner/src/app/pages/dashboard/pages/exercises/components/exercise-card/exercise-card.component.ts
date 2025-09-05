import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Exercise, DifficultyLevel, ExerciseCategory } from '../../../../../../models/exercise.model';

@Component({
  selector: 'app-exercise-card',
  standalone: true,
  imports: [NgIcon, DatePipe],
  templateUrl: './exercise-card.component.html',
  styleUrl: './exercise-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class ExerciseCardComponent {
  @Input({ required: true }) exercise!: Exercise;
  
  @Output() edit = new EventEmitter<Exercise>();
  @Output() delete = new EventEmitter<Exercise>();

  readonly isMenuOpen = signal<boolean>(false);

  readonly exerciseInitials = computed(() => {
    if (!this.exercise) return '';
    
    const words = this.exercise.name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
  });

  readonly categoryColor = computed(() => {
    if (!this.exercise) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    
    switch (this.exercise.category) {
      case ExerciseCategory.Technical:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case ExerciseCategory.Tactical:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case ExerciseCategory.Physical:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case ExerciseCategory.Psychological:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case ExerciseCategory.Coordination:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  });

  readonly categoryText = computed(() => {
    if (!this.exercise) return 'Sin categoría';
    
    switch (this.exercise.category) {
      case ExerciseCategory.Technical:
        return 'Técnico';
      case ExerciseCategory.Tactical:
        return 'Táctico';
      case ExerciseCategory.Physical:
        return 'Físico';
      case ExerciseCategory.Psychological:
        return 'Psicológico';
      case ExerciseCategory.Coordination:
        return 'Coordinación';
      default:
        return 'Sin categoría';
    }
  });

  readonly difficultyColor = computed(() => {
    if (!this.exercise) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    
    switch (this.exercise.difficulty) {
      case DifficultyLevel.Beginner:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case DifficultyLevel.Intermediate:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case DifficultyLevel.Advanced:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case DifficultyLevel.Expert:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  });

  readonly difficultyText = computed(() => {
    if (!this.exercise) return 'Sin nivel';
    
    switch (this.exercise.difficulty) {
      case DifficultyLevel.Beginner:
        return 'Principiante';
      case DifficultyLevel.Intermediate:
        return 'Intermedio';
      case DifficultyLevel.Advanced:
        return 'Avanzado';
      case DifficultyLevel.Expert:
        return 'Experto';
      default:
        return 'Sin nivel';
    }
  });

  readonly playersRange = computed(() => {
    if (!this.exercise) return '';
    
    if (this.exercise.minPlayers === this.exercise.maxPlayers) {
      return `${this.exercise.minPlayers} jugadores`;
    }
    return `${this.exercise.minPlayers}-${this.exercise.maxPlayers} jugadores`;
  });

  readonly durationText = computed(() => {
    if (!this.exercise) return '';
    
    const minutes = this.exercise.durationMinutes;
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  });

  onEdit(): void {
    this.edit.emit(this.exercise);
    this.isMenuOpen.set(false);
  }

  onDelete(): void {
    this.delete.emit(this.exercise);
    this.isMenuOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.update(current => !current);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onCardClick(event: Event): void {
    // Prevent menu toggle when clicking on action buttons
    if ((event.target as HTMLElement).closest('.actions-menu')) {
      return;
    }
    
    // For now, just show edit modal on card click
    this.onEdit();
  }
}