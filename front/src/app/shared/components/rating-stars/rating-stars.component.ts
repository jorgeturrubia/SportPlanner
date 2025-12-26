import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css'
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() totalVotes?: number;
  @Input() readonly: boolean = false;
  @Output() rate = new EventEmitter<number>();

  hoveredRating = signal<number | null>(null);

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  onStarEnter(star: number): void {
    if (!this.readonly) {
      this.hoveredRating.set(star);
    }
  }

  onStarLeave(): void {
    if (!this.readonly) {
      this.hoveredRating.set(null);
    }
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rate.emit(star);
    }
  }

  isStarActive(star: number): boolean {
    const current = this.hoveredRating() ?? this.rating;
    return star <= Math.round(current);
  }
}
