export interface Planning {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  trainingDays: string; // JSON string con array de días
  startTime: string; // TimeSpan como string
  endTime: string; // TimeSpan como string
  isFullCourt: boolean;
  itineraryId?: string;
  createdByUserId: string;
  isPublic: boolean;
  averageRating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVisible: boolean;
  itinerary?: Itinerary;
  createdBy?: User;
  planningTeams?: PlanningTeam[];
  planningConcepts?: PlanningConcept[];
  trainingSessions?: TrainingSession[];
  ratings?: PlanningRating[];
}

export interface CreatePlanningRequest {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  trainingDays: number[]; // [1,3,5] para lunes, miércoles, viernes
  startTime: string;
  endTime: string;
  isFullCourt: boolean;
  itineraryId?: string;
  createdByUserId: string;
  teamIds?: string[];
}

export interface PlanningTeam {
  planningId: string;
  teamId: string;
  assignedAt: Date;
  planning?: Planning;
  team?: Team;
}

export interface PlanningConcept {
  id: string;
  planningId: string;
  conceptId: string;
  order: number;
  plannedSessions: number;
  completedSessions: number;
  planning?: Planning;
  concept?: Concept;
}

export interface PlanningRating {
  id: string;
  planningId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  planning?: Planning;
  user?: User;
}

// Interfaces auxiliares
export interface Itinerary {
  id: string;
  name: string;
  description: string;
  sport: string;
  category: string;
  // ... otros campos
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  // ... otros campos
}

export interface TrainingSession {
  id: string;
  name: string;
  description: string;
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  status: SessionStatus;
  planningId: string;
  // ... otros campos
}

export enum SessionStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  // ... otros campos
}

export interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  // ... otros campos
}