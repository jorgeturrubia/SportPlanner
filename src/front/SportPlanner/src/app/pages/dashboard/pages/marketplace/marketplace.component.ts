import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MarketplaceService } from './services/marketplace.service';
import { NotificationService } from '../../../../services/notification.service';
import {
  MarketplacePlanningDto,
  PlanningDetailDto,
  MarketplaceFilters,
  DEFAULT_FILTERS,
  SortOption,
  SortDirection
} from './models/marketplace.models';
import { PlanningCardComponent } from './components/planning-card/planning-card.component';
import { PlanningDetailsModalComponent } from './components/planning-details-modal/planning-details-modal.component';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [NgIcon, PlanningCardComponent, PlanningDetailsModalComponent],
  templateUrl: './marketplace.component.html',
  styleUrl: './marketplace.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  }
})
export class MarketplaceComponent implements OnInit {
  private marketplaceService = inject(MarketplaceService);
  private notificationService = inject(NotificationService);

  // Expose DEFAULT_FILTERS for template
  readonly DEFAULT_FILTERS = DEFAULT_FILTERS;

  readonly plannings = this.marketplaceService.plannings;
  readonly isLoading = this.marketplaceService.isLoading;
  readonly totalCount = this.marketplaceService.totalCount;
  readonly currentPage = this.marketplaceService.currentPage;
  readonly totalPages = this.marketplaceService.totalPages;

  readonly isModalOpen = signal<boolean>(false);
  readonly selectedPlanning = signal<PlanningDetailDto | null>(null);
  readonly searchQuery = signal<string>('');
  readonly activeFilters = signal<MarketplaceFilters>(DEFAULT_FILTERS);

  readonly filteredPlannings = computed(() => {
    let filtered = this.plannings();

    // Apply search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(planning =>
        planning.name.toLowerCase().includes(query) ||
        planning.description.toLowerCase().includes(query) ||
        planning.sport.toLowerCase().includes(query) ||
        planning.createdByName.toLowerCase().includes(query) ||
        planning.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    const filters = this.activeFilters();
    if (filters.sport) {
      filtered = filtered.filter(planning => planning.sport === filters.sport);
    }
    if (filters.minRating && filters.minRating > 0) {
      filtered = filtered.filter(planning => planning.averageRating >= filters.minRating!);
    }
    if (filters.createdByName) {
      filtered = filtered.filter(planning =>
        planning.createdByName.toLowerCase().includes(filters.createdByName.toLowerCase())
      );
    }
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(planning =>
        filters.tags!.some(tag => planning.tags.includes(tag))
      );
    }

    return filtered;
  });

  readonly planningsCount = computed(() => this.filteredPlannings().length);
  readonly availableSports = computed(() => {
    const sports = [...new Set(this.plannings().map(p => p.sport))];
    return sports.sort();
  });
  readonly availableTags = computed(() => {
    const tags = [...new Set(this.plannings().flatMap(p => p.tags))];
    return tags.sort();
  });
  readonly availableCreators = computed(() => {
    const creators = [...new Set(this.plannings().map(p => p.createdByName))];
    return creators.sort();
  });

  ngOnInit(): void {
    console.log('🛒 MARKETPLACE COMPONENT INIT');
    this.loadPlannings();
  }

  private loadPlannings(): void {
    console.log('📋 LOADING MARKETPLACE PLANNINGS...');
    this.marketplaceService.refreshPlannings();
    console.log('✅ Marketplace plannings loaded successfully:', this.plannings().length, 'plannings');
  }

  async onViewDetails(planning: MarketplacePlanningDto): Promise<void> {
    try {
      const details = await this.marketplaceService.getPlanningDetails(planning.id).toPromise();
      if (details) {
        this.selectedPlanning.set(details);
        this.isModalOpen.set(true);
      }
    } catch (error) {
      console.error('Error loading planning details:', error);
      this.notificationService.showError('Error al cargar los detalles de la planificación');
    }
  }

  async onViewDetailsById(planningId: string): Promise<void> {
    try {
      const details = await this.marketplaceService.getPlanningDetails(planningId).toPromise();
      if (details) {
        this.selectedPlanning.set(details);
        this.isModalOpen.set(true);
      }
    } catch (error) {
      console.error('Error loading planning details:', error);
      this.notificationService.showError('Error al cargar los detalles de la planificación');
    }
  }

  onImportPlanning(planning: MarketplacePlanningDto): void {
    // TODO: Implement import functionality
    this.notificationService.showInfo('Funcionalidad de importación próximamente disponible');
  }

  onImportPlanningById(planningId: string): void {
    // TODO: Implement import functionality
    this.notificationService.showInfo('Funcionalidad de importación próximamente disponible');
  }

  onModalClose(): void {
    this.isModalOpen.set(false);
    this.selectedPlanning.set(null);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onRefresh(): void {
    this.loadPlannings();
  }

  onToggleSportFilter(): void {
    const currentFilters = this.activeFilters();
    const availableSports = this.availableSports();

    if (!currentFilters.sport) {
      // Show first sport
      if (availableSports.length > 0) {
        this.activeFilters.set({ ...currentFilters, sport: availableSports[0] });
      }
    } else {
      const currentIndex = availableSports.indexOf(currentFilters.sport);
      const nextIndex = (currentIndex + 1) % (availableSports.length + 1);

      if (nextIndex === availableSports.length) {
        // Reset to all sports
        this.activeFilters.set({ ...currentFilters, sport: '' });
      } else {
        // Next sport
        this.activeFilters.set({ ...currentFilters, sport: availableSports[nextIndex] });
      }
    }
  }

  onToggleRatingFilter(): void {
    const currentFilters = this.activeFilters();
    const ratings = [0, 1, 2, 3, 4, 5];

    const currentIndex = ratings.indexOf(currentFilters.minRating || 0);
    const nextIndex = (currentIndex + 1) % ratings.length;

    this.activeFilters.set({
      ...currentFilters,
      minRating: ratings[nextIndex]
    });
  }

  onToggleCreatorFilter(): void {
    const currentFilters = this.activeFilters();
    const availableCreators = this.availableCreators();

    if (!currentFilters.createdByName) {
      // Show first creator
      if (availableCreators.length > 0) {
        this.activeFilters.set({ ...currentFilters, createdByName: availableCreators[0] });
      }
    } else {
      const currentIndex = availableCreators.indexOf(currentFilters.createdByName);
      const nextIndex = (currentIndex + 1) % (availableCreators.length + 1);

      if (nextIndex === availableCreators.length) {
        // Reset to all creators
        this.activeFilters.set({ ...currentFilters, createdByName: '' });
      } else {
        // Next creator
        this.activeFilters.set({ ...currentFilters, createdByName: availableCreators[nextIndex] });
      }
    }
  }

  getSportFilterText(): string {
    const filters = this.activeFilters();
    return filters.sport || 'Todos los deportes';
  }

  getRatingFilterText(): string {
    const filters = this.activeFilters();
    if (!filters.minRating || filters.minRating === 0) {
      return 'Todas las valoraciones';
    }
    return `${filters.minRating}+ ⭐`;
  }

  getCreatorFilterText(): string {
    const filters = this.activeFilters();
    return filters.createdByName || 'Todos los entrenadores';
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getStarClass(star: number, rating: number): string {
    if (star <= Math.floor(rating)) {
      return 'text-yellow-400';
    } else if (star - 0.5 <= rating) {
      return 'text-yellow-300';
    } else {
      return 'text-gray-300';
    }
  }
}