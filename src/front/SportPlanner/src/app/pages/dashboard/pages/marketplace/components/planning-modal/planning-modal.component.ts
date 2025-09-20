import { Component, Input, Output, EventEmitter, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import { 
  PlanningDetailDto, 
  ImportPlanningDto, 
  RatePlanningDto,
  DifficultyLevel 
} from '../../models/marketplace.models';
import { AuthService } from '../../../../../../services/auth.service';

interface Team {
  id: number;
  name: string;
}

@Component({
  selector: 'app-planning-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RatingStarsComponent],
  templateUrl: './planning-modal.component.html',
  styleUrl: './planning-modal.component.scss'
})
export class PlanningModalComponent implements OnInit, OnDestroy {
  @Input() planning: PlanningDetailDto | null = null;
  @Input() isOpen: boolean = false;
  @Input() isImporting: boolean = false;
  @Input() userTeams: Team[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() import = new EventEmitter<ImportPlanningDto>();
  @Output() rate = new EventEmitter<RatePlanningDto>();

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroy$ = new Subject<void>();

  // Signals for component state
  private readonly _activeTab = signal<'details' | 'concepts' | 'reviews' | 'import'>('details');
  private readonly _showImportForm = signal<boolean>(false);
  private readonly _showRatingForm = signal<boolean>(false);

  // Form groups
  importForm!: FormGroup;
  ratingForm!: FormGroup;

  // Computed properties
  readonly activeTab = computed(() => this._activeTab());
  readonly showImportForm = computed(() => this._showImportForm());
  readonly showRatingForm = computed(() => this._showRatingForm());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly canRate = computed(() => this.planning?.canRate || false);
  readonly hasUserRating = computed(() => (this.planning?.userRating || 0) > 0);

  readonly sportIcon = computed(() => {
    if (!this.planning) return '🏃';
    return this.getSportIcon(this.planning.sport);
  });

  readonly formattedDuration = computed(() => {
    if (!this.planning) return '';
    return this.formatDuration(this.planning.durationMinutes);
  });

  readonly formattedTrainingDays = computed(() => {
    if (!this.planning) return '';
    return this.formatTrainingDays(this.planning.trainingDays);
  });

  readonly conceptsByCategory = computed(() => {
    if (!this.planning?.concepts) return {};

    return this.planning.concepts.reduce((acc: any, concept: any) => {
      if (!acc[concept.category]) {
        acc[concept.category] = [];
      }
      acc[concept.category].push(concept);
      return acc;
    }, {});
  });

  readonly conceptCategoryKeys = computed(() => {
    return Object.keys(this.conceptsByCategory());
  });

  readonly averageRating = computed(() => {
    if (!this.planning?.recentRatings || this.planning.recentRatings.length === 0) {
      return 0;
    }
    
    const total = this.planning.recentRatings.reduce((sum, review) => sum + review.rating, 0);
    return total / this.planning.recentRatings.length;
  });

  readonly ratingDistribution = computed(() => {
    if (!this.planning?.recentRatings) return [];
    
    const distribution = [0, 0, 0, 0, 0]; // For 1-5 stars
    
    this.planning.recentRatings.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });
    
    const total = this.planning.recentRatings.length;
    
    return distribution.map((count, index) => ({
      stars: index + 1,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));
  });

  ngOnInit(): void {
    this.initializeForms();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    if (this.isOpen && this.planning) {
      this._activeTab.set('details');
      this._showImportForm.set(false);
      this._showRatingForm.set(false);
      
      // Update forms with planning data
      this.updateImportForm();
      this.updateRatingForm();
    }
  }

  /**
   * Initialize reactive forms
   */
  private initializeForms(): void {
    // Import form
    this.importForm = this.fb.group({
      teamId: ['', Validators.required],
      customName: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      adjustTrainingDays: [true],
      trainingDays: [['Monday', 'Wednesday', 'Friday']]
    });

    // Rating form
    this.ratingForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.maxLength(500)]
    });
  }

  /**
   * Setup form subscriptions
   */
  private setupFormSubscriptions(): void {
    // Set default dates when start date changes
    this.importForm.get('startDate')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(startDate => {
        if (startDate && !this.importForm.get('endDate')?.value) {
          const endDate = new Date(startDate);
          endDate.setMonth(endDate.getMonth() + 3); // Default 3 months duration
          this.importForm.patchValue({
            endDate: endDate.toISOString().split('T')[0]
          });
        }
      });
  }

  /**
   * Update import form with planning data
   */
  private updateImportForm(): void {
    if (!this.planning) return;

    const today = new Date();
    const defaultEndDate = new Date(today);
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 3);

    this.importForm.patchValue({
      customName: this.planning.name,
      startDate: today.toISOString().split('T')[0],
      endDate: defaultEndDate.toISOString().split('T')[0],
      trainingDays: this.planning.trainingDays || ['Monday', 'Wednesday', 'Friday']
    });
  }

  /**
   * Update rating form with current user rating
   */
  private updateRatingForm(): void {
    if (this.planning?.userRating) {
      this.ratingForm.patchValue({
        rating: this.planning.userRating
      });
    } else {
      this.ratingForm.reset({
        rating: 0,
        comment: ''
      });
    }
  }

  /**
   * Get sport icon
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
   * Format duration
   */
  private formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutos`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }

  /**
   * Format training days
   */
  private formatTrainingDays(days: string[]): string {
    if (!days || days.length === 0) {
      return 'Días flexibles';
    }

    const dayMap: { [key: string]: string } = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes',
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };

    return days.map(day => dayMap[day] || day).join(', ');
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: 'details' | 'concepts' | 'reviews' | 'import'): void {
    this._activeTab.set(tab);
  }

  /**
   * Close modal
   */
  onClose(): void {
    this.close.emit();
  }

  /**
   * Show import form
   */
  showImport(): void {
    if (this.isAuthenticated()) {
      this._showImportForm.set(true);
      this._activeTab.set('import');
    }
  }

  /**
   * Hide import form
   */
  hideImport(): void {
    this._showImportForm.set(false);
    this._activeTab.set('details');
  }

  /**
   * Submit import form
   */
  onImportSubmit(): void {
    if (this.importForm.valid && this.planning) {
      const formValue = this.importForm.value;
      
      const importData: ImportPlanningDto = {
        planningId: this.planning.id,
        teamId: parseInt(formValue.teamId),
        customName: formValue.customName || this.planning.name,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        adjustTrainingDays: formValue.adjustTrainingDays,
        trainingDays: formValue.adjustTrainingDays ? formValue.trainingDays : this.planning.trainingDays
      };

      this.import.emit(importData);
    }
  }

  /**
   * Show rating form
   */
  openRatingForm(): void {
    if (this.canRate()) {
      this._showRatingForm.set(true);
    }
  }

  /**
   * Hide rating form
   */
  hideRatingForm(): void {
    this._showRatingForm.set(false);
  }

  /**
   * Handle rating change
   */
  onRatingChange(rating: number): void {
    this.ratingForm.patchValue({ rating });
  }

  /**
   * Submit rating form
   */
  onRatingSubmit(): void {
    if (this.ratingForm.valid && this.planning) {
      const formValue = this.ratingForm.value;
      
      const ratingData: RatePlanningDto = {
        planningId: this.planning.id,
        rating: formValue.rating,
        comment: formValue.comment || undefined
      };

      this.rate.emit(ratingData);
      this._showRatingForm.set(false);
    }
  }

  /**
   * Get difficulty color
   */
  getDifficultyColor(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.Beginner:
        return 'text-green-600 bg-green-100';
      case DifficultyLevel.Intermediate:
        return 'text-yellow-600 bg-yellow-100';
      case DifficultyLevel.Advanced:
        return 'text-orange-600 bg-orange-100';
      case DifficultyLevel.Expert:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  /**
   * Get difficulty label
   */
  getDifficultyLabel(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.Beginner:
        return 'Principiante';
      case DifficultyLevel.Intermediate:
        return 'Intermedio';
      case DifficultyLevel.Advanced:
        return 'Avanzado';
      case DifficultyLevel.Expert:
        return 'Experto';
      default:
        return 'No definido';
    }
  }

  /**
   * Format date for display
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Handle backdrop click
   */
  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  /**
   * Handle escape key
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onClose();
    }
  }
}