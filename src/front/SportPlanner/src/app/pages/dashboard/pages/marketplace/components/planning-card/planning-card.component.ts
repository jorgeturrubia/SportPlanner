import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { MarketplacePlanningDto } from '../../models/marketplace.models';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
  selector: 'app-planning-card',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent],
  templateUrl: './planning-card.component.html',
  styleUrl: './planning-card.component.scss'
})
export class PlanningCardComponent {
  @Input({ required: true }) planning!: MarketplacePlanningDto;
  @Input() isImporting: boolean = false;
  @Output() viewDetails = new EventEmitter<string>();
  @Output() importPlanning = new EventEmitter<string>();

  private readonly authService = inject(AuthService);

  // Signals for component state
  private readonly _isHovered = signal<boolean>(false);
  private readonly _imageLoaded = signal<boolean>(false);
  private readonly _imageError = signal<boolean>(false);

  // Computed properties
  readonly isHovered = computed(() => this._isHovered());
  readonly imageLoaded = computed(() => this._imageLoaded());
  readonly imageError = computed(() => this._imageError());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());

  readonly sportIcon = computed(() => this.getSportIcon(this.planning.sport));
  readonly formattedDuration = computed(() => this.formatDuration(this.planning.durationMinutes));
  readonly formattedTrainingDays = computed(() => this.formatTrainingDays(this.planning.trainingDays));
  readonly conceptsPreview = computed(() => this.getConceptsPreview());
  readonly truncatedDescription = computed(() => this.getTruncatedDescription());

  /**
   * Get sport icon based on sport type
   */
  private getSportIcon(sport: string): string {
    const sportIcons: { [key: string]: string } = {
      'Basketball': '🏀',
      'Football': '🏈',
      'Soccer': '⚽',
      'Tennis': '🎾',
      'Volleyball': '🏐',
      'Handball': '🤾',
      'Baseball': '⚾',
      'Hockey': '🏒',
      'Swimming': '🏊',
      'Athletics': '🏃',
      'default': '🏃'
    };
    
    return sportIcons[sport] || sportIcons['default'];
  }

  /**
   * Format duration in a readable way
   */
  private formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }

  /**
   * Format training days
   */
  private formatTrainingDays(days: string[]): string {
    if (!days || days.length === 0) {
      return 'Flexible';
    }

    const dayMap: { [key: string]: string } = {
      'Monday': 'L',
      'Tuesday': 'M',
      'Wednesday': 'X',
      'Thursday': 'J',
      'Friday': 'V',
      'Saturday': 'S',
      'Sunday': 'D'
    };

    const shortDays = days.map(day => dayMap[day] || day.charAt(0)).join(', ');
    
    if (days.length >= 5) {
      return `${days.length} días/semana`;
    }
    
    return shortDays;
  }

  /**
   * Get concepts preview (max 3)
   */
  private getConceptsPreview(): string[] {
    if (!this.planning.conceptNames || this.planning.conceptNames.length === 0) {
      return [];
    }

    return this.planning.conceptNames.slice(0, 3);
  }

  /**
   * Get truncated description
   */
  private getTruncatedDescription(): string {
    if (!this.planning.description) {
      return '';
    }
    
    const maxLength = 120;
    if (this.planning.description.length <= maxLength) {
      return this.planning.description;
    }
    
    return this.planning.description.substring(0, maxLength).trim() + '...';
  }

  /**
   * Handle mouse enter
   */
  onMouseEnter(): void {
    this._isHovered.set(true);
  }

  /**
   * Handle mouse leave
   */
  onMouseLeave(): void {
    this._isHovered.set(false);
  }

  /**
   * Handle image load success
   */
  onImageLoad(): void {
    this._imageLoaded.set(true);
  }

  /**
   * Handle image load error
   */
  onImageError(): void {
    this._imageError.set(true);
  }

  /**
   * Handle view details click
   */
  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.planning.id);
  }

  /**
   * Handle import click
   */
  onImport(event: Event): void {
    event.stopPropagation();
    this.importPlanning.emit(this.planning.id);
  }

  /**
   * Handle card click (same as view details)
   */
  onCardClick(): void {
    this.viewDetails.emit(this.planning.id);
  }

  /**
   * Get difficulty badge color
   */
  getDifficultyColor(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      case 4:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get difficulty label
   */
  getDifficultyLabel(difficulty: number): string {
    switch (difficulty) {
      case 1:
        return 'Principiante';
      case 2:
        return 'Intermedio';
      case 3:
        return 'Avanzado';
      case 4:
        return 'Experto';
      default:
        return 'No definido';
    }
  }

  /**
   * Get average difficulty of concepts (simplified since we don't have detailed concept data)
   */
  getAverageDifficulty(): number {
    // Since we don't have detailed concept data in the marketplace DTO,
    // we can estimate difficulty based on total concepts or return a default
    if (!this.planning.totalConcepts || this.planning.totalConcepts === 0) {
      return 0;
    }

    // Simple heuristic: more concepts might indicate higher complexity
    if (this.planning.totalConcepts <= 3) return 1; // Principiante
    if (this.planning.totalConcepts <= 6) return 2; // Intermedio
    if (this.planning.totalConcepts <= 10) return 3; // Avanzado
    return 4; // Experto
  }

  /**
   * Check if planning has specific tag
   */
  hasTag(tag: string): boolean {
    return this.planning.tags?.includes(tag) || false;
  }

  /**
   * Format created date
   */
  getFormattedDate(): string {
    return new Date(this.planning.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Get placeholder image for sport
   */
  getPlaceholderImage(): string {
    // Return a data URL for a simple sport-themed placeholder
    return "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='%23f3f4f6'%3e%3crect width='200' height='120' fill='%23f3f4f6'/%3e%3ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%236b7280' font-family='system-ui' font-size='24'%3e" + this.sportIcon() + "%3c/text%3e%3c/svg%3e";
  }
}