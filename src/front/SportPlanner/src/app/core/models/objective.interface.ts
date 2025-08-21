// Objective Category enum
export enum ObjectiveCategory {
  TECHNICAL = 'technical',
  TACTICAL = 'tactical', 
  PHYSICAL = 'physical',
  PSYCHOLOGICAL = 'psychological'
}

// Objective Difficulty enum
export enum ObjectiveDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Objective Status enum
export enum ObjectiveStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Objective interface
export interface Objective {
  id: string;
  title: string;
  description: string;
  category: ObjectiveCategory;
  difficulty: ObjectiveDifficulty;
  status: ObjectiveStatus;
  estimatedDuration: number; // in minutes
  targetAgeGroup: string;
  sport: string;
  tags: string[];
  prerequisites?: string[];
  equipmentNeeded: string[];
  maxParticipants: number;
  minParticipants: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating: number;
  exercises?: Exercise[];
}

// Create Objective Request
export interface CreateObjectiveRequest {
  title: string;
  description: string;
  category: ObjectiveCategory;
  difficulty: ObjectiveDifficulty;
  estimatedDuration: number;
  targetAgeGroup: string;
  sport: string;
  tags: string[];
  prerequisites?: string[];
  equipmentNeeded: string[];
  maxParticipants: number;
  minParticipants: number;
  isPublic: boolean;
}

// Update Objective Request
export interface UpdateObjectiveRequest extends Partial<CreateObjectiveRequest> {
  status?: ObjectiveStatus;
}

// Objectives List Response
export interface ObjectivesListResponse {
  objectives: Objective[];
  totalCount: number;
  page: number;
  limit: number;
}

// Exercise reference for objectives
export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
}