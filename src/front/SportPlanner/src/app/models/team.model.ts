export interface Team {
  id: string;
  name: string;
  description?: string;
  sport: string;
  category?: string;
  season?: string;
  coachId: string;
  playersCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  sport: string;
  category?: string;
  season?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  sport?: string;
  category?: string;
  season?: string;
  isActive?: boolean;
}

export interface TeamFilters {
  sport?: string;
  category?: string;
  season?: string;
  isActive?: boolean;
}