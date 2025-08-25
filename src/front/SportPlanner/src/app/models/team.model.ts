export enum Gender {
  Male = 0,
  Female = 1,
  Mixed = 2
}

export enum TeamLevel {
  A = 0, // Nivel alto
  B = 1, // Nivel medio
  C = 2  // Nivel básico
}

export enum UserRole {
  Administrator = 0,
  Director = 1,
  Coach = 2,
  Assistant = 3
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
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVisible: boolean;
  organization?: Organization;
  createdBy?: User;
  userTeams?: UserTeam[];
  planningTeams?: PlanningTeam[];
}

export interface UserTeam {
  id: string;
  userId: string;
  teamId: string;
  role: UserRole;
  assignedAt: Date;
  isActive: boolean;
  user?: User;
  team?: Team;
}

export interface CreateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
  organizationId?: string;
  createdByUserId: string;
}

export interface UpdateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
}

// Interfaces auxiliares (se definirán en sus respectivos archivos)
export interface Organization {
  id: string;
  name: string;
  // ... otros campos
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // ... otros campos
}

export interface PlanningTeam {
  planningId: string;
  teamId: string;
  // ... otros campos
}