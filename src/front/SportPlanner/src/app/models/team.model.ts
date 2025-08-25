import { User } from './user.model';

export interface Team {
  id: string;
  name: string;
  description?: string;
  sport: string;
  members: TeamMember[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: Date;
}

export enum TeamRole {
  MEMBER = 'member',
  CAPTAIN = 'captain',
  COACH = 'coach'
}