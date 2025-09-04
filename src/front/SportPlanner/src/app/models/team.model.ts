export enum Gender {
  Male = 0,
  Female = 1,
  Mixed = 2
}

export enum TeamLevel {
  A = 0,
  B = 1,
  C = 2
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
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
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
  organizationId?: string;
}

export interface UpdateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
}

export interface TeamFilters {
  sport?: string;
  category?: string;
  season?: string;
  isActive?: boolean;
}