import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from '../../../../../services/auth.service';
import { NotificationService } from '../../../../../services/notification.service';
import {
  MarketplacePlanningDto,
  MarketplaceSearchDto,
  MarketplaceSearchResultDto,
  PlanningDetailDto,
  ImportPlanningDto,
  RatePlanningDto,
  ImportResult,
  RatingResult,
  MarketplaceFilters,
  PaginationInfo,
  DEFAULT_FILTERS,
  DEFAULT_PAGE_SIZE,
  SortOption,
  SortDirection
} from '../models/marketplace.models';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  // Private signals for state management
  private readonly _isLoading = signal<boolean>(false);
  private readonly _plannings = signal<MarketplacePlanningDto[]>([]);
  private readonly _pagination = signal<PaginationInfo>({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
    totalPages: 0
  });
  private readonly _filters = signal<MarketplaceFilters>({ ...DEFAULT_FILTERS });
  private readonly _selectedPlanning = signal<PlanningDetailDto | null>(null);
  private readonly _isImporting = signal<boolean>(false);

  // Search subjects for reactive filtering
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly filtersSubject = new BehaviorSubject<MarketplaceFilters>({ ...DEFAULT_FILTERS });

  // Public computed signals
  public readonly isLoading = computed(() => this._isLoading());
  public readonly plannings = computed(() => this._plannings());
  public readonly pagination = computed(() => this._pagination());
  public readonly filters = computed(() => this._filters());
  public readonly selectedPlanning = computed(() => this._selectedPlanning());
  public readonly isImporting = computed(() => this._isImporting());
  public readonly hasResults = computed(() => this._plannings().length > 0);
  public readonly showEmptyState = computed(() => !this._isLoading() && this._plannings().length === 0);

  // API endpoints
  private readonly apiUrl = `${environment.apiUrl}/api/marketplace`;

  constructor() {
    this.setupReactiveSearch();
  }

  /**
   * Setup reactive search with debouncing
   */
  private setupReactiveSearch(): void {
    // Search term changes with debounce
    this.searchTermSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        const currentFilters = this._filters();
        const newFilters = { ...currentFilters, searchTerm };
        this._filters.set(newFilters);
        return this.performSearch(newFilters, 1);
      }),
      catchError(error => {
        console.error('Search error:', error);
        this.notificationService.showError('Error en la búsqueda');
        return of(null);
      })
    ).subscribe();

    // Filter changes (immediate)
    this.filtersSubject.pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(filters => {
        this._filters.set(filters);
        return this.performSearch(filters, 1);
      }),
      catchError(error => {
        console.error('Filter error:', error);
        this.notificationService.showError('Error aplicando filtros');
        return of(null);
      })
    ).subscribe();
  }

  /**
   * Search plannings with filters and pagination
   */
  async searchPlannings(
    filters: Partial<MarketplaceFilters> = {},
    page: number = 1,
    pageSize = DEFAULT_PAGE_SIZE
  ): Promise<MarketplaceSearchResultDto | null> {
    try {
      this._isLoading.set(true);

      const searchDto: MarketplaceSearchDto = {
        searchTerm: filters.searchTerm || '',
        sport: filters.sport || undefined,
        minRating: filters.minRating || undefined,
        tags: filters.tags && filters.tags.length > 0 ? filters.tags : undefined,
        sortBy: filters.sortBy || SortOption.Rating,
        sortDirection: filters.sortDirection || SortDirection.Desc,
        pageNumber: page,
        pageSize: pageSize
      };

      let params = new HttpParams();
      
      // Add search parameters
      if (searchDto.searchTerm) {
        params = params.set('searchTerm', searchDto.searchTerm);
      }
      if (searchDto.sport) {
        params = params.set('sport', searchDto.sport);
      }
      if (searchDto.minRating !== undefined) {
        params = params.set('minRating', searchDto.minRating.toString());
      }
      if (searchDto.tags && searchDto.tags.length > 0) {
        searchDto.tags.forEach(tag => {
          params = params.append('tags', tag);
        });
      }
      params = params.set('sortBy', searchDto.sortBy || 'rating');
      params = params.set('sortDirection', searchDto.sortDirection || 'desc');
      params = params.set('pageNumber', searchDto.pageNumber.toString());
      params = params.set('pageSize', searchDto.pageSize.toString());

      const result = await this.http.get<MarketplaceSearchResultDto>(
        `${this.apiUrl}/plannings`,
        { params }
      ).toPromise();

      if (result) {
        this._plannings.set(result.plannings);
        this._pagination.set({
          currentPage: result.pageNumber,
          pageSize: result.pageSize,
          totalItems: result.totalCount,
          totalPages: result.totalPages
        });
      }

      return result || null;
    } catch (error) {
      console.error('Error searching plannings:', error);
      this.notificationService.showError('Error al buscar planificaciones');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Perform search with current state management
   */
  private performSearch(filters: MarketplaceFilters, page: number): Observable<MarketplaceSearchResultDto | null> {
    return new Observable(observer => {
      this.searchPlannings(filters, page).then(result => {
        observer.next(result);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  /**
   * Update search term (triggers reactive search)
   */
  updateSearchTerm(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  /**
   * Update filters (triggers reactive search)
   */
  updateFilters(filters: Partial<MarketplaceFilters>): void {
    const currentFilters = this._filters();
    const newFilters = { ...currentFilters, ...filters };
    this.filtersSubject.next(newFilters);
  }

  /**
   * Reset filters to default values
   */
  resetFilters(): void {
    this._filters.set({ ...DEFAULT_FILTERS });
    this.filtersSubject.next({ ...DEFAULT_FILTERS });
    this.searchTermSubject.next('');
  }

  /**
   * Load specific page
   */
  async loadPage(page: number): Promise<void> {
    const currentFilters = this._filters();
    await this.searchPlannings(currentFilters, page);
  }

  /**
   * Get planning details by ID
   */
  async getPlanningDetails(planningId: number): Promise<PlanningDetailDto | null> {
    try {
      this._isLoading.set(true);

      const headers = this.getAuthHeaders();
      const result = await this.http.get<PlanningDetailDto>(
        `${this.apiUrl}/plannings/${planningId}`,
        { headers }
      ).toPromise();

      if (result) {
        this._selectedPlanning.set(result);
      }

      return result || null;
    } catch (error) {
      console.error('Error fetching planning details:', error);
      this.notificationService.showError('Error al cargar detalles de la planificación');
      return null;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Import planning to user's team
   */
  async importPlanning(importData: ImportPlanningDto): Promise<ImportResult | null> {
    try {
      if (!this.authService.isAuthenticated()) {
        this.notificationService.showWarning('Debes iniciar sesión para importar planificaciones');
        this.router.navigate(['/auth']);
        return null;
      }

      this._isImporting.set(true);

      const headers = this.getAuthHeaders();
      const result = await this.http.post<ImportResult>(
        `${this.apiUrl}/plannings/${importData.planningId}/import`,
        importData,
        { headers }
      ).toPromise();

      if (result && result.success) {
        this.notificationService.showSuccess(result.message || 'Planificación importada correctamente');
        
        // Update import count in current plannings list
        this.updateImportCount(importData.planningId);
        
        // Navigate to the new planning if ID provided
        if (result.newPlanningId) {
          // You might want to navigate to the planning details or teams page
          this.router.navigate(['/dashboard/teams']);
        }
      } else {
        this.notificationService.showError(result?.message || 'Error al importar planificación');
      }

      return result || null;
    } catch (error) {
      console.error('Error importing planning:', error);
      this.notificationService.showError('Error al importar planificación');
      return null;
    } finally {
      this._isImporting.set(false);
    }
  }

  /**
   * Rate a planning
   */
  async ratePlanning(ratingData: RatePlanningDto): Promise<RatingResult | null> {
    try {
      if (!this.authService.isAuthenticated()) {
        this.notificationService.showWarning('Debes iniciar sesión para valorar planificaciones');
        this.router.navigate(['/auth']);
        return null;
      }

      const headers = this.getAuthHeaders();
      const result = await this.http.post<RatingResult>(
        `${this.apiUrl}/plannings/${ratingData.planningId}/rate`,
        ratingData,
        { headers }
      ).toPromise();

      if (result && result.success) {
        this.notificationService.showSuccess(result.message || 'Valoración enviada correctamente');
        
        // Update rating in current plannings list and selected planning
        if (result.newAverageRating !== undefined) {
          this.updatePlanningRating(ratingData.planningId, result.newAverageRating);
        }

        // Refresh planning details if it's currently selected
        const selectedPlanning = this._selectedPlanning();
        if (selectedPlanning && selectedPlanning.id === ratingData.planningId) {
          await this.getPlanningDetails(ratingData.planningId);
        }
      } else {
        this.notificationService.showError(result?.message || 'Error al enviar valoración');
      }

      return result || null;
    } catch (error) {
      console.error('Error rating planning:', error);
      this.notificationService.showError('Error al valorar planificación');
      return null;
    }
  }

  /**
   * Clear selected planning
   */
  clearSelectedPlanning(): void {
    this._selectedPlanning.set(null);
  }

  /**
   * Get available sports for filtering
   */
  getAvailableSports(): string[] {
    const plannings = this._plannings();
    const sports = [...new Set(plannings.map(p => p.sport))];
    return sports.sort();
  }

  /**
   * Get available tags for filtering
   */
  getAvailableTags(): string[] {
    const plannings = this._plannings();
    const tags = [...new Set(plannings.flatMap(p => p.tags))];
    return tags.sort();
  }

  /**
   * Update import count for a specific planning
   */
  private updateImportCount(planningId: number): void {
    const currentPlannings = this._plannings();
    const updatedPlannings = currentPlannings.map(planning => 
      planning.id === planningId 
        ? { ...planning, importCount: planning.importCount + 1 }
        : planning
    );
    this._plannings.set(updatedPlannings);
  }

  /**
   * Update rating for a specific planning
   */
  private updatePlanningRating(planningId: number, newRating: number): void {
    const currentPlannings = this._plannings();
    const updatedPlannings = currentPlannings.map(planning => 
      planning.id === planningId 
        ? { ...planning, rating: newRating, ratingCount: planning.ratingCount + 1 }
        : planning
    );
    this._plannings.set(updatedPlannings);

    // Update selected planning if it's the same one
    const selectedPlanning = this._selectedPlanning();
    if (selectedPlanning && selectedPlanning.id === planningId) {
      this._selectedPlanning.set({
        ...selectedPlanning,
        rating: newRating,
        ratingCount: selectedPlanning.ratingCount + 1
      });
    }
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    const token = this.authService.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.authService.currentUser();
  }

  /**
   * Navigate to login if not authenticated
   */
  requireAuthentication(): boolean {
    if (!this.isAuthenticated()) {
      this.notificationService.showWarning('Debes iniciar sesión para realizar esta acción');
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}