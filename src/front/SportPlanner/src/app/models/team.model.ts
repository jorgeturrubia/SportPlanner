import { User } from './user.model';

export interface Team {
  id: string;
  name: string;
  description?: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  organizationId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVisible: boolean;
  memberCount?: number;
}

export interface CreateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description?: string;
  organizationId?: string;
}

export interface UpdateTeamRequest extends CreateTeamRequest {}

export interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: Date;
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  MIXED = 'mixed'
}

export enum TeamLevel {
  A = 'A', // Advanced
  B = 'B', // Intermediate
  C = 'C'  // Beginner
}

export enum TeamRole {
  MEMBER = 'member',
  CAPTAIN = 'captain',
  COACH = 'coach'
}