// Sport interfaces
export interface Sport {
  id: string;
  name: string;
  category: string;
  defaultMaxPlayers: number;
}

// Team status enum
export enum TeamStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Archived = 4
}

// Team member role enum
export enum TeamMemberRole {
  Player = 1,
  Coach = 2,
  AssistantCoach = 3,
  Manager = 4
}

// Team member status enum
export enum TeamMemberStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Removed = 4
}

// Team member interface
export interface TeamMember {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamMemberRole;
  jerseyNumber?: string;
  position?: string;
  status: TeamMemberStatus;
  joinedAt: Date;
  notes?: string;
}

// Team interface
// Team interface
export interface Team {
  id: string;
  name: string;
  sport: Sport;
  category: string;
  gender: string;
  level: string;
  description?: string;
  maxPlayers: number;
  status: TeamStatus;
  playersCount: number;
  coachesCount: number;
  totalMembersCount: number;
  createdAt: Date;
  updatedAt: Date;
  members: TeamMember[];
}

// Create team request
export interface CreateTeamRequest {
  name: string;
  sportId: string;
  category: string;
  gender: string;
  level: string;
  description?: string;
  maxPlayers: number;
}

// Update team request
export interface UpdateTeamRequest {
  name?: string;
  category?: string;
  gender?: string;
  level?: string;
  description?: string;
  maxPlayers?: number;
  status?: TeamStatus;
}

// Add team member request
export interface AddTeamMemberRequest {
  userId: string;
  userName: string;
  userEmail: string;
  role: TeamMemberRole;
  jerseyNumber?: string;
  position?: string;
  notes?: string;
}

// Update team member request
export interface UpdateTeamMemberRequest {
  role?: TeamMemberRole;
  jerseyNumber?: string;
  position?: string;
  status?: TeamMemberStatus;
  notes?: string;
}

// Teams list response
export interface TeamsListResponse {
  teams: Team[];
  totalCount: number;
  page: number;
}

// Can create team response
export interface CanCreateTeamResponse {
  canCreate: boolean;
}