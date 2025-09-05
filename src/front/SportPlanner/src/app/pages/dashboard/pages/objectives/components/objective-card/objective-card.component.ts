import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Objective, ObjectivePriority, ObjectiveStatus } from '../../../../../../models/objective.model';

@Component({
  selector: 'app-objective-card',
  standalone: true,
  imports: [NgIcon, DatePipe],
  templateUrl: './objective-card.component.html',
  styleUrl: './objective-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class ObjectiveCardComponent {
  @Input({ required: true }) objective!: Objective;
  
  @Output() edit = new EventEmitter<Objective>();
  @Output() delete = new EventEmitter<Objective>();

  readonly isMenuOpen = signal<boolean>(false);

  readonly objectiveInitials = computed(() => {
    if (!this.objective) return '';
    
    const words = this.objective.title.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
  });

  readonly priorityColor = computed(() => {
    if (!this.objective) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    
    switch (this.objective.priority) {
      case ObjectivePriority.Critical:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case ObjectivePriority.High:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case ObjectivePriority.Medium:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case ObjectivePriority.Low:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  });

  readonly priorityText = computed(() => {
    if (!this.objective) return 'Sin prioridad';
    
    switch (this.objective.priority) {
      case ObjectivePriority.Critical:
        return 'Crítica';
      case ObjectivePriority.High:
        return 'Alta';
      case ObjectivePriority.Medium:
        return 'Media';
      case ObjectivePriority.Low:
        return 'Baja';
      default:
        return 'Sin prioridad';
    }
  });

  readonly statusColor = computed(() => {
    if (!this.objective) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    
    switch (this.objective.status) {
      case ObjectiveStatus.Completed:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case ObjectiveStatus.InProgress:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case ObjectiveStatus.OnHold:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case ObjectiveStatus.NotStarted:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  });

  readonly statusText = computed(() => {
    if (!this.objective) return 'Sin estado';
    
    switch (this.objective.status) {
      case ObjectiveStatus.Completed:
        return 'Completado';
      case ObjectiveStatus.InProgress:
        return 'En progreso';
      case ObjectiveStatus.OnHold:
        return 'En pausa';
      case ObjectiveStatus.NotStarted:
        return 'No iniciado';
      default:
        return 'Sin estado';
    }
  });

  readonly formattedTargetDate = computed(() => {
    if (!this.objective || !this.objective.targetDate) return '';
    
    const date = new Date(this.objective.targetDate);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  readonly progressWidth = computed(() => {
    if (!this.objective) return 0;
    return Math.min(100, Math.max(0, this.objective.progress));
  });

  readonly progressColor = computed(() => {
    const progress = this.progressWidth();
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  });

  onEdit(): void {
    this.edit.emit(this.objective);
    this.isMenuOpen.set(false);
  }

  onDelete(): void {
    this.delete.emit(this.objective);
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