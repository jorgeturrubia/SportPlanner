import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { Team, Gender, TeamLevel } from '../../../../../../models/team.model';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class TeamCardComponent {
  @Input({ required: true }) team!: Team;
  
  @Output() edit = new EventEmitter<Team>();
  @Output() delete = new EventEmitter<Team>();

  readonly isMenuOpen = signal<boolean>(false);

  readonly teamInitials = computed(() => {
    if (!this.team) return '';
    
    const words = this.team.name.split(' ').filter(word => word.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
  });

  readonly statusColor = computed(() => {
    if (!this.team) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    
    return this.team.isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  });

  readonly statusText = computed(() => {
    if (!this.team) return 'Desconocido';
    return this.team.isActive ? 'Activo' : 'Inactivo';
  });

  readonly formattedDate = computed(() => {
    if (!this.team) return '';
    
    const date = new Date(this.team.updatedAt);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  readonly genderText = computed(() => {
    if (!this.team) return '';
    
    switch (this.team.gender) {
      case Gender.Male:
        return 'Masculino';
      case Gender.Female:
        return 'Femenino';
      case Gender.Mixed:
        return 'Mixto';
      default:
        return 'No especificado';
    }
  });

  readonly levelText = computed(() => {
    if (!this.team) return '';
    
    switch (this.team.level) {
      case TeamLevel.A:
        return 'A';
      case TeamLevel.B:
        return 'B';
      case TeamLevel.C:
        return 'C';
      default:
        return 'No especificado';
    }
  });

  onEdit(): void {
    this.edit.emit(this.team);
    this.isMenuOpen.set(false);
  }

  onDelete(): void {
    this.delete.emit(this.team);
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