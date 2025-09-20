export interface MarketplacePlanningDto {
  id: string;
  name: string;
  description: string;
  sport: string;
  averageRating: number;
  totalRatings: number;
  createdByName: string;
  createdByEmail: string;
  tags: string[];
  importCount: number;
  createdAt: Date;
  updatedAt: Date;
  sessionsPerWeek: number;
  totalSessions: number;
  durationMinutes: number;
  trainingDays: string[];
  startTime: string;
  conceptNames: string[];
  totalConcepts: number;
}

export interface ConceptSummaryDto {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  difficulty: DifficultyLevel;
}

export interface MarketplaceSearchDto {
  searchTerm?: string;
  sport?: string;
  minRating?: number;
  tags?: string[];
  category?: string;
  page: number;
  pageSize: number;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
}

export interface MarketplaceSearchResultDto {
  plannings: MarketplacePlanningDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PlanningDetailDto extends MarketplacePlanningDto {
  concepts: ConceptSummaryDto[];
  recentRatings: PlanningReviewDto[];
  canRate: boolean;
  hasUserRated: boolean;
  userRating?: number;
}

export interface PlanningReviewDto {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  createdAt: Date;
}

export interface ImportPlanningDto {
  planningId: string;
  teamId: number;
  customName?: string;
  startDate: Date;
  endDate: Date;
  adjustTrainingDays?: boolean;
  trainingDays?: string[];
}

export interface RatePlanningDto {
  planningId: string;
  rating: number;
  comment?: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  newPlanningId?: number;
}

export interface RatingResult {
  success: boolean;
  message: string;
  newAverageRating?: number;
}

export enum DifficultyLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4
}

export enum SortOption {
  Rating = 'Rating',
  Name = 'Name',
  CreatedAt = 'CreatedAt',
  ImportCount = 'ImportCount',
  TotalRatings = 'TotalRatings'
}

export enum SortDirection {
  Ascending = 'Ascending',
  Descending = 'Descending'
}

export interface MarketplaceFilters {
  searchTerm: string;
  sport: string;
  minRating: number;
  createdByName: string;
  tags: string[];
  sortBy: SortOption;
  sortDirection: SortDirection;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Available sports list
export const AVAILABLE_SPORTS = [
  'Basketball',
  'Football',
  'Tennis',
  'Volleyball',
  'Handball',
  'Soccer',
  'Baseball',
  'Hockey',
  'Swimming',
  'Athletics'
] as const;

export type SportType = typeof AVAILABLE_SPORTS[number];

// Default filter values
export const DEFAULT_FILTERS: MarketplaceFilters = {
  searchTerm: '',
  sport: '',
  minRating: 0,
  createdByName: '',
  tags: [],
  sortBy: SortOption.Rating,
  sortDirection: SortDirection.Descending
};

export const DEFAULT_PAGE_SIZE = 12;