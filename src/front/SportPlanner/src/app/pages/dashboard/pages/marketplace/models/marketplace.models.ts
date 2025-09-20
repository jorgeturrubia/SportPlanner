export interface MarketplacePlanningDto {
  id: number;
  name: string;
  description: string;
  sport: string;
  rating: number;
  ratingCount: number;
  creatorName: string;
  tags: string[];
  importCount: number;
  createdAt: Date;
  concepts: ConceptSummaryDto[];
  durationMinutes: number;
  trainingDays: string[];
  isActive: boolean;
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
  sortBy?: SortOption;
  sortDirection?: SortDirection;
  pageNumber: number;
  pageSize: number;
}

export interface MarketplaceSearchResultDto {
  plannings: MarketplacePlanningDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PlanningDetailDto extends MarketplacePlanningDto {
  fullDescription: string;
  reviews: PlanningReviewDto[];
  canRate: boolean;
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
  planningId: number;
  teamId: number;
  customName?: string;
  startDate: Date;
  endDate: Date;
  adjustTrainingDays?: boolean;
  trainingDays?: string[];
}

export interface RatePlanningDto {
  planningId: number;
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
  Rating = 'rating',
  Name = 'name',
  CreatedAt = 'createdAt',
  ImportCount = 'importCount'
}

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export interface MarketplaceFilters {
  searchTerm: string;
  sport: string;
  minRating: number;
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
  tags: [],
  sortBy: SortOption.Rating,
  sortDirection: SortDirection.Desc
};

export const DEFAULT_PAGE_SIZE = 12;