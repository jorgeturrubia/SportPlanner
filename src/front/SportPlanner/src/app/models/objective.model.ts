export interface ObjectivePriority {
  id: number;
  name: string;
  description?: string;
  level: number;
  isActive: boolean;
}

export interface ObjectiveStatus {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ObjectiveScope {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ObjectiveCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ObjectiveSubcategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  objectiveCategoryId: number;
}

export interface ObjectiveExercise {
  id: string;
  objectiveId: number;
  exerciseId: number;
  order: number;
  notes?: string;
}

export interface Objective {
  id: number;

  // Category information
  objectiveCategoryId: number;
  objectiveSubcategoryId: number;
  objectiveCategoryName: string;
  objectiveSubcategoryName: string;

  // Basic information
  title: string;
  description: string;
  tags: string;

  // Relations
  teamId?: string;

  // System fields
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: string;

  // Navigation properties
  exercises: ObjectiveExercise[];
}

export interface CreateObjectiveRequest {
  // Category information
  objectiveCategoryId: number;
  objectiveSubcategoryId: number;

  // Basic information
  title: string;
  description: string;
  tags: string;

  // Relations
  teamId?: string;
}

export interface UpdateObjectiveRequest {
  // Category information
  objectiveCategoryId: number;
  objectiveSubcategoryId: number;

  // Basic information
  title: string;
  description: string;
  tags: string;

  // Relations
  teamId?: string;
}

export interface ObjectiveFilters {
  teamId?: string;
  isActive?: boolean;
  tags?: string;
  objectiveCategoryId?: number;
  objectiveSubcategoryId?: number;
}