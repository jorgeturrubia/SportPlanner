import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, computed } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { PlanningDetailDto } from '../../models/marketplace.models';

@Component({
  selector: 'app-planning-details-modal',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './planning-details-modal.component.html',
  styleUrl: './planning-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  }
})
export class PlanningDetailsModalComponent {
  @Input({ required: true }) isOpen!: boolean;
  @Input() planning: PlanningDetailDto | null = null;

  @Output() close = new EventEmitter<void>();

  readonly modalTitle = computed(() => {
    return this.planning?.name || 'Detalles de la Planificación';
  });

  readonly ratingStars = computed(() => {
    if (!this.planning) return [];

    const rating = this.planning.averageRating;
    return Array.from({ length: 5 }, (_, i) => ({
      index: i + 1,
      filled: i + 1 <= Math.floor(rating),
      half: i + 1 === Math.ceil(rating) && rating % 1 !== 0
    }));
  });

  readonly formattedDuration = computed(() => {
    if (!this.planning) return '';

    const minutes = this.planning.durationMinutes;
    if (minutes < 60) {
      return `${minutes} minutos`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} hora${hours > 1 ? 's' : ''}`;
    }

    return `${hours} hora${hours > 1 ? 's' : ''} y ${remainingMinutes} minutos`;
  });

  readonly formattedDate = computed(() => {
    if (!this.planning) return '';

    const date = new Date(this.planning.createdAt);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getStarClass(star: any): string {
    if (star.filled) {
      return 'text-yellow-400';
    } else if (star.half) {
      return 'text-yellow-300';
    } else {
      return 'text-gray-300';
    }
  }

  formatReviewDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }
}