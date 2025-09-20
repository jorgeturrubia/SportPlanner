import { Component, Input, Output, EventEmitter, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';
import {
  MarketplaceFilters,
  SortOption,
  SortDirection,
  AVAILABLE_SPORTS,
  DEFAULT_FILTERS
} from '../../models/marketplace.models';

@Component({
  selector: 'app-filters-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RatingStarsComponent],
  templateUrl: './filters-sidebar.component.html',
  styleUrl: './filters-sidebar.component.scss'
})
export class FiltersSidebarComponent implements OnInit, OnDestroy {
  @Input() filters: MarketplaceFilters = { ...DEFAULT_FILTERS };
  @Input() availableTags: string[] = [];
  @Input() isLoading: boolean = false;
  @Output() filtersChange = new EventEmitter<Partial<MarketplaceFilters>>();
  @Output() resetFilters = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Form group for filters
  filtersForm!: FormGroup;

  // Signals for UI state
  private readonly _isCollapsed = signal<boolean>(false);
  private readonly _showMoreTags = signal<boolean>(false);

  // Computed properties
  readonly isCollapsed = computed(() => this._isCollapsed());
  readonly showMoreTags = computed(() => this._showMoreTags());
  readonly availableSports = computed(() => AVAILABLE_SPORTS);
  
  readonly visibleTags = computed(() => {
    const maxVisible = 8;
    return this.showMoreTags() 
      ? this.availableTags 
      : this.availableTags.slice(0, maxVisible);
  });

  readonly hasMoreTags = computed(() => this.availableTags.length > 8);

  // Enum mappings for template
  readonly SortOption = SortOption;
  readonly SortDirection = SortDirection;

  readonly sortOptions = [
    { value: SortOption.Rating, label: 'Valoración' },
    { value: SortOption.Name, label: 'Nombre' },
    { value: SortOption.CreatedAt, label: 'Fecha de creación' },
    { value: SortOption.ImportCount, label: 'Más importadas' }
  ];

  readonly sortDirections = [
    { value: SortDirection.Desc, label: 'Descendente' },
    { value: SortDirection.Asc, label: 'Ascendente' }
  ];

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    if (this.filtersForm) {
      this.updateFormValues();
    }
  }

  /**
   * Initialize reactive form
   */
  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      sport: [this.filters.sport || ''],
      minRating: [this.filters.minRating || 0],
      tags: this.fb.array(this.createTagsArray()),
      sortBy: [this.filters.sortBy || SortOption.Rating],
      sortDirection: [this.filters.sortDirection || SortDirection.Desc]
    });
  }

  /**
   * Create FormArray for tags
   */
  private createTagsArray(): boolean[] {
    return this.availableTags.map(tag => 
      this.filters.tags?.includes(tag) || false
    );
  }

  /**
   * Setup form value change subscriptions
   */
  private setupFormSubscriptions(): void {
    // Subscribe to form changes with debounce
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe(formValue => {
        this.emitFiltersChange(formValue);
      });

    // Subscribe to sort changes immediately (no debounce)
    this.filtersForm.get('sortBy')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.emitFiltersChange(this.filtersForm.value);
      });

    this.filtersForm.get('sortDirection')?.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.emitFiltersChange(this.filtersForm.value);
      });
  }

  /**
   * Update form values when filters input changes
   */
  private updateFormValues(): void {
    this.filtersForm.patchValue({
      sport: this.filters.sport || '',
      minRating: this.filters.minRating || 0,
      sortBy: this.filters.sortBy || SortOption.Rating,
      sortDirection: this.filters.sortDirection || SortDirection.Desc
    }, { emitEvent: false });

    // Update tags array
    const tagsArray = this.filtersForm.get('tags') as FormArray;
    tagsArray.clear();
    this.availableTags.forEach(tag => {
      tagsArray.push(this.fb.control(this.filters.tags?.includes(tag) || false));
    });
  }

  /**
   * Emit filters change event
   */
  private emitFiltersChange(formValue: any): void {
    const selectedTags = this.availableTags.filter((_, index) => 
      formValue.tags && formValue.tags[index]
    );

    const newFilters: Partial<MarketplaceFilters> = {
      sport: formValue.sport || '',
      minRating: formValue.minRating || 0,
      tags: selectedTags,
      sortBy: formValue.sortBy,
      sortDirection: formValue.sortDirection
    };

    this.filtersChange.emit(newFilters);
  }

  /**
   * Get tags FormArray
   */
  get tagsArray(): FormArray {
    return this.filtersForm.get('tags') as FormArray;
  }

  /**
   * Handle rating change
   */
  onMinRatingChange(rating: number): void {
    this.filtersForm.patchValue({ minRating: rating });
  }

  /**
   * Toggle tag selection
   */
  onTagToggle(index: number): void {
    const control = this.tagsArray.at(index);
    if (control) {
      control.setValue(!control.value);
    }
  }

  /**
   * Clear all filters
   */
  onResetFilters(): void {
    this.filtersForm.reset({
      sport: '',
      minRating: 0,
      tags: this.availableTags.map(() => false),
      sortBy: SortOption.Rating,
      sortDirection: SortDirection.Desc
    });
    this.resetFilters.emit();
  }

  /**
   * Toggle sidebar collapsed state
   */
  toggleCollapsed(): void {
    this._isCollapsed.set(!this._isCollapsed());
  }

  /**
   * Toggle show more tags
   */
  toggleShowMoreTags(): void {
    this._showMoreTags.set(!this._showMoreTags());
  }

  /**
   * Clear specific filter
   */
  clearSport(): void {
    this.filtersForm.patchValue({ sport: '' });
  }

  clearMinRating(): void {
    this.filtersForm.patchValue({ minRating: 0 });
  }

  clearTags(): void {
    const tagsArray = this.filtersForm.get('tags') as FormArray;
    tagsArray.controls.forEach(control => control.setValue(false));
  }

  /**
   * Check if any filters are active
   */
  hasActiveFilters(): boolean {
    const formValue = this.filtersForm.value;
    return !!(
      formValue.sport ||
      formValue.minRating > 0 ||
      (formValue.tags && formValue.tags.some((tag: boolean) => tag))
    );
  }

  /**
   * Get active filters count
   */
  getActiveFiltersCount(): number {
    const formValue = this.filtersForm.value;
    let count = 0;
    
    if (formValue.sport) count++;
    if (formValue.minRating > 0) count++;
    if (formValue.tags && formValue.tags.some((tag: boolean) => tag)) {
      count += formValue.tags.filter((tag: boolean) => tag).length;
    }
    
    return count;
  }

  /**
   * Get selected tags
   */
  getSelectedTags(): string[] {
    const formValue = this.filtersForm.value;
    if (!formValue.tags) return [];
    
    return this.availableTags.filter((_, index) => formValue.tags[index]);
  }
}