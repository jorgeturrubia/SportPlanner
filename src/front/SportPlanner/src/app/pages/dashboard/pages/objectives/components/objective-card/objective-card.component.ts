import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Objective } from '../../../../../../models/objective.model';

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
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  });

  readonly priorityText = computed(() => {
    return 'Normal';
  });

  readonly statusColor = computed(() => {
    if (!this.objective) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    return this.objective.isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  });

  readonly statusText = computed(() => {
    if (!this.objective) return 'Sin estado';
    return this.objective.isActive ? 'Activo' : 'Inactivo';
  });

  readonly formattedCreatedDate = computed(() => {
    if (!this.objective) return '';

    const date = new Date(this.objective.createdAt);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  readonly exerciseCount = computed(() => {
    if (!this.objective) return 0;
    return this.objective.exercises?.length || 0;
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