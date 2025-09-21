export interface Team {
  id: string;
  name: string;
  sportId: number;
  categoryId: number;
  sportGenderId: number;
  levelId: number;
  // Display names from masters (matching backend DTOs)
  sportName: string;
  categoryName: string;
  sportGenderName: string;
  levelName: string;
  description: string;
  organizationId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  isActive: boolean;
  isVisible: boolean;
}

export interface CreateTeamRequest {
  name: string;
  sportId: number;
  categoryId: number;
  sportGenderId: number;
  levelId: number;
  description: string;
  organizationId?: string;
}

export interface UpdateTeamRequest {
  name: string;
  sportId: number;
  categoryId: number;
  sportGenderId: number;
  levelId: number;
  description: string;
}

export interface TeamFilters {
  sport?: string;
  category?: string;
  season?: string;
  isActive?: boolean;
}