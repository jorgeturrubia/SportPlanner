import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
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
  DEFAULT_FILTERS,
  DEFAULT_PAGE_SIZE
} from '../models/marketplace.models';
import { NotificationService } from '../../../../../services/notification.service';
import { AuthService } from '../../../../../services/auth.service';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  private readonly apiUrl = `${environment.apiUrl}/api/marketplace`;
  private readonly _plannings = signal<MarketplacePlanningDto[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _totalCount = signal<number>(0);
  private readonly _currentPage = signal<number>(1);
  private readonly _totalPages = signal<number>(0);

  readonly plannings = computed(() => this._plannings());
  readonly isLoading = computed(() => this._isLoading());
  readonly totalCount = computed(() => this._totalCount());
  readonly currentPage = computed(() => this._currentPage());
  readonly totalPages = computed(() => this._totalPages());

  searchPlannings(searchDto: MarketplaceSearchDto): Observable<MarketplaceSearchResultDto> {
    this._isLoading.set(true);

    const params = new URLSearchParams();
    if (searchDto.searchTerm) params.set('searchTerm', searchDto.searchTerm);
    if (searchDto.sport) params.set('sport', searchDto.sport);
    if (searchDto.minRating) params.set('minRating', searchDto.minRating.toString());
    if (searchDto.tags?.length) params.set('tags', searchDto.tags.join(','));
    if (searchDto.category) params.set('category', searchDto.category);
    if (searchDto.sortBy) params.set('sortBy', searchDto.sortBy);
    if (searchDto.sortDirection) params.set('sortDirection', searchDto.sortDirection);
    params.set('page', searchDto.page.toString());
    params.set('pageSize', searchDto.pageSize.toString());

    const url = `${this.apiUrl}/plannings?${params.toString()}`;

    return this.http.get<MarketplaceSearchResultDto>(url).pipe(
      tap(result => {
        // Convert backend date strings to Date objects
        const processedPlannings = result.plannings.map(planning => ({
          ...planning,
          createdAt: new Date(planning.createdAt),
          updatedAt: new Date(planning.updatedAt)
        }));

        this._plannings.set(processedPlannings);
        this._totalCount.set(result.totalCount);
        this._currentPage.set(result.page);
        this._totalPages.set(result.totalPages);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);

        // Handle specific auth errors
        if (error.status === 401) {
          console.error('❌ Marketplace service: Authentication error, user will be logged out by interceptor');
          return of({ plannings: [], totalCount: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0, hasNextPage: false, hasPreviousPage: false });
        } else {
          this.notificationService.showError('Error al cargar las planificaciones del marketplace');
        }

        return of({ plannings: [], totalCount: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, totalPages: 0, hasNextPage: false, hasPreviousPage: false });
      })
    );
  }

  getPlanningDetails(id: string): Observable<PlanningDetailDto> {
    return this.http.get<PlanningDetailDto>(`${this.apiUrl}/plannings/${id}`).pipe(
      map(planning => ({
        ...planning,
        createdAt: new Date(planning.createdAt),
        updatedAt: new Date(planning.updatedAt),
        recentRatings: planning.recentRatings.map((review: any) => ({
          ...review,
          createdAt: new Date(review.createdAt)
        }))
      })),
      catchError(error => {
        this.notificationService.showError('Error al cargar los detalles de la planificación');
        throw error;
      })
    );
  }

  importPlanning(importDto: ImportPlanningDto): Observable<ImportResult> {
    this._isLoading.set(true);

    return this.http.post<ImportResult>(`${this.apiUrl}/plannings/${importDto.planningId}/import`, importDto).pipe(
      tap(result => {
        this._isLoading.set(false);
        if (result.success) {
          this.notificationService.showSuccess(result.message || 'Planificación importada exitosamente');

          // Update import count in the local state
          const currentPlannings = this._plannings();
          const planningIndex = currentPlannings.findIndex(p => p.id === importDto.planningId.toString());
          if (planningIndex !== -1) {
            const updatedPlannings = [...currentPlannings];
            updatedPlannings[planningIndex] = {
              ...updatedPlannings[planningIndex],
              importCount: updatedPlannings[planningIndex].importCount + 1
            };
            this._plannings.set(updatedPlannings);
          }
        } else {
          this.notificationService.showError(result.message || 'Error al importar la planificación');
        }
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.notificationService.showError('Error al importar la planificación');
        throw error;
      })
    );
  }

  ratePlanning(ratingDto: RatePlanningDto): Observable<RatingResult> {
    return this.http.post<RatingResult>(`${this.apiUrl}/plannings/${ratingDto.planningId}/rate`, ratingDto).pipe(
      tap(result => {
        if (result.success) {
          this.notificationService.showSuccess(result.message || 'Valoración guardada exitosamente');

          // Update the rating in the local state if we have the planning
          const currentPlannings = this._plannings();
          const planningIndex = currentPlannings.findIndex(p => p.id === ratingDto.planningId.toString());

          if (planningIndex !== -1 && result.newAverageRating) {
            const updatedPlannings = [...currentPlannings];
            updatedPlannings[planningIndex] = {
              ...updatedPlannings[planningIndex],
              averageRating: result.newAverageRating,
              totalRatings: updatedPlannings[planningIndex].totalRatings + 1
            };
            this._plannings.set(updatedPlannings);
          }
        } else {
          this.notificationService.showError(result.message || 'Error al guardar la valoración');
        }
      }),
      catchError(error => {
        this.notificationService.showError('Error al guardar la valoración');
        throw error;
      })
    );
  }

  refreshPlannings(filters: MarketplaceFilters = DEFAULT_FILTERS, page: number = 1): void {
    const searchDto: MarketplaceSearchDto = {
      searchTerm: filters.searchTerm || undefined,
      sport: filters.sport || undefined,
      minRating: filters.minRating || undefined,
      tags: filters.tags?.length ? filters.tags : undefined,
      sortBy: filters.sortBy,
      sortDirection: filters.sortDirection,
      page: page,
      pageSize: DEFAULT_PAGE_SIZE
    };

    this.searchPlannings(searchDto).subscribe();
  }
}