import { Component, Input, Output, EventEmitter, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.scss'
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() ratingCount: number = 0;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() interactive: boolean = false;
  @Input() showCount: boolean = true;
  @Input() disabled: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();

  private readonly _hoveredStar = signal<number>(0);
  private readonly _selectedStar = signal<number>(0);

  // Computed properties
  readonly hoveredStar = computed(() => this._hoveredStar());
  readonly selectedStar = computed(() => this._selectedStar());
  readonly stars = computed(() => Array.from({ length: 5 }, (_, i) => i + 1));

  readonly sizeClasses = computed(() => {
    switch (this.size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-xl';
      default:
        return 'text-base';
    }
  });

  readonly starSizeClasses = computed(() => {
    switch (this.size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-5 h-5';
    }
  });

  ngOnInit(): void {
    this._selectedStar.set(this.rating);
  }

  ngOnChanges(): void {
    this._selectedStar.set(this.rating);
  }

  /**
   * Check if a star should be filled
   */
  isStarFilled(starNumber: number): boolean {
    const currentRating = this.interactive && this.hoveredStar() > 0 
      ? this.hoveredStar() 
      : this.interactive && this.selectedStar() > 0
        ? this.selectedStar()
        : this.rating;
    
    return starNumber <= Math.floor(currentRating);
  }

  /**
   * Check if a star should be half-filled
   */
  isStarHalfFilled(starNumber: number): boolean {
    if (this.interactive) {
      return false; // Interactive mode uses whole stars only
    }
    
    const currentRating = this.rating;
    const decimalPart = currentRating - Math.floor(currentRating);
    
    return starNumber === Math.floor(currentRating) + 1 && decimalPart >= 0.5;
  }

  /**
   * Get star fill classes
   */
  getStarClasses(starNumber: number): string {
    const baseClasses = 'transition-colors duration-200';
    const sizeClasses = this.starSizeClasses();
    
    if (this.interactive && !this.disabled) {
      const hoverClasses = 'cursor-pointer hover:scale-110 transform transition-transform duration-150';
      
      if (this.isStarFilled(starNumber)) {
        return `${baseClasses} ${sizeClasses} ${hoverClasses} text-yellow-400 fill-current`;
      } else {
        return `${baseClasses} ${sizeClasses} ${hoverClasses} text-gray-300 hover:text-yellow-300`;
      }
    } else {
      if (this.isStarFilled(starNumber)) {
        return `${baseClasses} ${sizeClasses} text-yellow-400 fill-current`;
      } else if (this.isStarHalfFilled(starNumber)) {
        return `${baseClasses} ${sizeClasses} text-yellow-400 half-filled`;
      } else {
        return `${baseClasses} ${sizeClasses} text-gray-300`;
      }
    }
  }

  /**
   * Handle mouse enter on star (for interactive mode)
   */
  onStarHover(starNumber: number): void {
    if (this.interactive && !this.disabled) {
      this._hoveredStar.set(starNumber);
    }
  }

  /**
   * Handle mouse leave from stars container
   */
  onStarsLeave(): void {
    if (this.interactive && !this.disabled) {
      this._hoveredStar.set(0);
    }
  }

  /**
   * Handle star click (for interactive mode)
   */
  onStarClick(starNumber: number): void {
    if (this.interactive && !this.disabled) {
      this._selectedStar.set(starNumber);
      this.ratingChange.emit(starNumber);
    }
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (!this.interactive || this.disabled) return;

    const currentStar = this.selectedStar() || 1;
    let newStar = currentStar;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newStar = Math.max(1, currentStar - 1);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newStar = Math.min(5, currentStar + 1);
        break;
      case 'Home':
        newStar = 1;
        break;
      case 'End':
        newStar = 5;
        break;
      case 'Enter':
      case ' ':
        this.ratingChange.emit(currentStar);
        event.preventDefault();
        return;
      default:
        return;
    }

    if (newStar !== currentStar) {
      this._selectedStar.set(newStar);
      event.preventDefault();
    }
  }

  /**
   * Format rating text for display
   */
  getRatingText(): string {
    if (this.rating === 0) {
      return 'Sin valorar';
    }
    
    const formattedRating = this.rating.toFixed(1);
    const countText = this.showCount && this.ratingCount > 0 
      ? ` (${this.ratingCount} ${this.ratingCount === 1 ? 'valoración' : 'valoraciones'})`
      : '';
    
    return `${formattedRating}${countText}`;
  }

  /**
   * Get accessibility label
   */
  getAriaLabel(): string {
    if (this.interactive) {
      return `Valorar con ${this.selectedStar() || 0} ${this.selectedStar() === 1 ? 'estrella' : 'estrellas'}`;
    } else {
      return `Valoración: ${this.getRatingText()}`;
    }
  }
}