import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

import { FiltersSidebarComponent } from './components/filters-sidebar/filters-sidebar.component';
import { PlanningCardComponent } from './components/planning-card/planning-card.component';
import { PlanningModalComponent } from './components/planning-modal/planning-modal.component';
import { MarketplaceService } from './services/marketplace.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

import {
  MarketplacePlanningDto,
  PlanningDetailDto,
  MarketplaceFilters,
  ImportPlanningDto,
  RatePlanningDto,
  DEFAULT_FILTERS,
  DEFAULT_PAGE_SIZE
} from './models/marketplace.models';

interface Team {
  id: number;
  name: string;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FiltersSidebarComponent,
    PlanningCardComponent,
    PlanningModalComponent
  ],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.scss'
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  private readonly marketplaceService = inject(MarketplaceService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Search control
  readonly searchControl = new FormControl('');

  // Component signals
  private readonly _isFiltersOpen = signal<boolean>(true);
  private readonly _selectedPlanningId = signal<number | null>(null);
  private readonly _userTeams = signal<Team[]>([]);
  private readonly _currentPage = signal<number>(1);

  // Computed properties from service
  readonly plannings = computed(() => this.marketplaceService.plannings());
  readonly pagination = computed(() => this.marketplaceService.pagination());
  readonly filters = computed(() => this.marketplaceService.filters());
  readonly selectedPlanning = computed(() => this.marketplaceService.selectedPlanning());
  readonly isLoading = computed(() => this.marketplaceService.isLoading());
  readonly isImporting = computed(() => this.marketplaceService.isImporting());
  readonly hasResults = computed(() => this.marketplaceService.hasResults());
  readonly showEmptyState = computed(() => this.marketplaceService.showEmptyState());

  // Local computed properties
  readonly isFiltersOpen = computed(() => this._isFiltersOpen());
  readonly selectedPlanningId = computed(() => this._selectedPlanningId());
  readonly userTeams = computed(() => this._userTeams());
  readonly currentPage = computed(() => this._currentPage());
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly currentUser = computed(() => this.authService.currentUser());

  readonly availableTags = computed(() => this.marketplaceService.getAvailableTags());
  readonly totalPages = computed(() => this.pagination().totalPages);
  readonly hasNextPage = computed(() => this.currentPage() < this.totalPages());
  readonly hasPreviousPage = computed(() => this.currentPage() > 1);

  readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total);
    } else if (total > 1) {
      rangeWithDots.push(total);
    }

    return rangeWithDots;
  });

  readonly gridColumns = computed(() => {
    if (this.isFiltersOpen()) {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    } else {
      return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
    }
  });

  ngOnInit(): void {
    this.setupSEO();
    this.setupSearchControl();
    this.setupUrlParams();
    this.loadInitialData();
    this.loadUserTeams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.marketplaceService.clearSelectedPlanning();
  }

  /**
   * Setup SEO metadata
   */
  private setupSEO(): void {
    this.title.setTitle('Marketplace - SportPlanner | Descubre y Comparte Planificaciones');
    this.meta.updateTag({
      name: 'description',
      content: 'Explora el marketplace de SportPlanner. Descubre planificaciones deportivas valoradas por la comunidad, importa las que más te gusten y comparte las tuyas.'
    });
    this.meta.updateTag({ property: 'og:title', content: 'Marketplace - SportPlanner' });
    this.meta.updateTag({
      property: 'og:description',
      content: 'Descubre y comparte planificaciones deportivas en el marketplace de SportPlanner.'
    });
  }

  /**
   * Setup search control with debouncing
   */
  private setupSearchControl(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.marketplaceService.updateSearchTerm(searchTerm || '');
        this._currentPage.set(1);
        this.updateUrlParams();
      });
  }

  /**
   * Setup URL parameters handling
   */
  private setupUrlParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // Apply filters from URL
        const filters: Partial<MarketplaceFilters> = {
          searchTerm: params['search'] || '',
          sport: params['sport'] || '',
          minRating: params['minRating'] ? parseInt(params['minRating']) : 0,
          tags: params['tags'] ? params['tags'].split(',') : [],
          sortBy: params['sortBy'] || DEFAULT_FILTERS.sortBy,
          sortDirection: params['sortDirection'] || DEFAULT_FILTERS.sortDirection
        };

        // Update search control
        this.searchControl.setValue(filters.searchTerm || '', { emitEvent: false });

        // Apply filters
        this.marketplaceService.updateFilters(filters);

        // Set page
        const page = params['page'] ? parseInt(params['page']) : 1;
        this._currentPage.set(page);
      });
  }

  /**
   * Update URL parameters
   */
  private updateUrlParams(): void {
    const currentFilters = this.filters();
    const queryParams: any = {};

    if (currentFilters.searchTerm) queryParams.search = currentFilters.searchTerm;
    if (currentFilters.sport) queryParams.sport = currentFilters.sport;
    if (currentFilters.minRating > 0) queryParams.minRating = currentFilters.minRating;
    if (currentFilters.tags && currentFilters.tags.length > 0) {
      queryParams.tags = currentFilters.tags.join(',');
    }
    if (currentFilters.sortBy !== DEFAULT_FILTERS.sortBy) {
      queryParams.sortBy = currentFilters.sortBy;
    }
    if (currentFilters.sortDirection !== DEFAULT_FILTERS.sortDirection) {
      queryParams.sortDirection = currentFilters.sortDirection;
    }
    if (this.currentPage() > 1) queryParams.page = this.currentPage();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace'
    });
  }

  /**
   * Load initial marketplace data
   */
  private async loadInitialData(): Promise<void> {
    try {
      await this.marketplaceService.searchPlannings({}, 1, DEFAULT_PAGE_SIZE);
    } catch (error) {
      console.error('Error loading initial marketplace data:', error);
      this.notificationService.showError('Error al cargar el marketplace');
    }
  }

  /**
   * Load user teams if authenticated
   */
  private async loadUserTeams(): Promise<void> {
    if (this.isAuthenticated()) {
      try {
        // Mock teams for now - replace with actual API call
        this._userTeams.set([
          { id: 1, name: 'Equipo Senior A' },
          { id: 2, name: 'Equipo Junior B' },
          { id: 3, name: 'Equipo Infantil' }
        ]);
      } catch (error) {
        console.error('Error loading user teams:', error);
      }
    }
  }

  /**
   * Handle filters change
   */
  onFiltersChange(filters: Partial<MarketplaceFilters>): void {
    this.marketplaceService.updateFilters(filters);
    this._currentPage.set(1);
    this.updateUrlParams();
  }

  /**
   * Handle filters reset
   */
  onResetFilters(): void {
    this.marketplaceService.resetFilters();
    this.searchControl.setValue('', { emitEvent: false });
    this._currentPage.set(1);
    this.updateUrlParams();
  }

  /**
   * Toggle filters sidebar
   */
  toggleFilters(): void {
    this._isFiltersOpen.set(!this._isFiltersOpen());
  }

  /**
   * Handle planning card click
   */
  async onViewPlanningDetails(planningId: number): Promise<void> {
    try {
      await this.marketplaceService.getPlanningDetails(planningId);
      this._selectedPlanningId.set(planningId);
    } catch (error) {
      console.error('Error loading planning details:', error);
      this.notificationService.showError('Error al cargar detalles de la planificación');
    }
  }

  /**
   * Handle planning import
   */
  async onImportPlanning(planningId: number): Promise<void> {
    if (!this.marketplaceService.requireAuthentication()) {
      return;
    }

    try {
      await this.marketplaceService.getPlanningDetails(planningId);
      this._selectedPlanningId.set(planningId);
    } catch (error) {
      console.error('Error loading planning for import:', error);
      this.notificationService.showError('Error al cargar detalles de la planificación');
    }
  }

  /**
   * Handle modal import submission
   */
  async onModalImport(importData: ImportPlanningDto): Promise<void> {
    try {
      const result = await this.marketplaceService.importPlanning(importData);
      if (result?.success) {
        this.closeModal();
      }
    } catch (error) {
      console.error('Error importing planning:', error);
    }
  }

  /**
   * Handle planning rating
   */
  async onRatePlanning(ratingData: RatePlanningDto): Promise<void> {
    try {
      await this.marketplaceService.ratePlanning(ratingData);
    } catch (error) {
      console.error('Error rating planning:', error);
    }
  }

  /**
   * Close planning modal
   */
  closeModal(): void {
    this._selectedPlanningId.set(null);
    this.marketplaceService.clearSelectedPlanning();
  }

  /**
   * Navigate to specific page
   */
  async goToPage(page: number): Promise<void> {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this._currentPage.set(page);
      this.updateUrlParams();
      await this.marketplaceService.loadPage(page);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Go to previous page
   */
  async goToPreviousPage(): Promise<void> {
    if (this.hasPreviousPage()) {
      await this.goToPage(this.currentPage() - 1);
    }
  }

  /**
   * Go to next page
   */
  async goToNextPage(): Promise<void> {
    if (this.hasNextPage()) {
      await this.goToPage(this.currentPage() + 1);
    }
  }

  /**
   * Handle search form submission
   */
  onSearchSubmit(): void {
    // Search is handled by the reactive control, this prevents form submission
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }

  /**
   * Get results summary text
   */
  getResultsSummary(): string {
    const pagination = this.pagination();
    const total = pagination.totalItems;
    
    if (total === 0) {
      return 'No se encontraron planificaciones';
    }
    
    const start = (pagination.currentPage - 1) * pagination.pageSize + 1;
    const end = Math.min(pagination.currentPage * pagination.pageSize, total);
    
    return `Mostrando ${start}-${end} de ${total} planificaciones`;
  }

  /**
   * Navigate to login
   */
  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }
}