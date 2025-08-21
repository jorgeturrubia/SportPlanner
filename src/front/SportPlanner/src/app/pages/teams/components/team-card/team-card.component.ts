import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroUsers, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';

import { Team } from '../../../../core/models/team.interface';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [
    CommonModule,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroUsers,
      heroPencilSquare,
      heroTrash
    })
  ],
  templateUrl: './team-card.component.html',
  styleUrls: ['./team-card.component.css']
})
export class TeamCardComponent {
  // Input signals
  readonly team = input<Team | null>(null);
  readonly showActions = input<boolean>(true);

  // Output events
  readonly edit = output<Team>();
  readonly delete = output<Team>();

  /**
   * Handle edit button click
   */
  onEdit(): void {
    const currentTeam = this.team();
    if (currentTeam) {
      this.edit.emit(currentTeam);
    }
  }

  /**
   * Handle delete button click
   */
  onDelete(): void {
    const currentTeam = this.team();
    if (currentTeam) {
      this.delete.emit(currentTeam);
    }
  }

  /**
   * Handle keyboard events for accessibility
   */
  onKeyDown(event: KeyboardEvent, action: 'edit' | 'delete'): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (action === 'edit') {
        this.onEdit();
      } else if (action === 'delete') {
        this.onDelete();
      }
    }
  }

  /**
   * Get status badge classes based on team active state
   */
  getStatusBadgeClasses(): string {
    const currentTeam = this.team();
    if (!currentTeam) return '';

    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    if (currentTeam.status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400`;
    } else {
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400`;
    }
  }

  /**
   * Get members count display text
   */
  getMembersText(): string {
    const currentTeam = this.team();
    if (!currentTeam) return '';

    const count = currentTeam.membersCount;
    return count === 1 ? '1 miembro' : `${count} miembros`;
  }

  /**
   * Get coach display text
   */
  getCoachText(): string {
    const currentTeam = this.team();
    if (!currentTeam) return '';

    return currentTeam.coachName || 'Sin entrenador';
  }

  /**
   * Format creation date for display
   */
  getFormattedDate(): string {
    const currentTeam = this.team();
    if (!currentTeam) return '';

    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(currentTeam.createdAt));
  }
}