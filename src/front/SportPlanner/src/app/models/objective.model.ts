export enum ObjectivePriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3
}

export enum ObjectiveStatus {
  NotStarted = 0,
  InProgress = 1,
  Completed = 2,
  OnHold = 3
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  priority: ObjectivePriority;
  status: ObjectiveStatus;
  targetDate?: Date;
  completedDate?: Date;
  teamId?: string;
  teamName?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  progress: number; // 0-100
  tags?: string[];
}

export interface CreateObjectiveRequest {
  title: string;
  description: string;
  priority: ObjectivePriority;
  targetDate?: Date;
  teamId?: string;
  tags?: string[];
}

export interface UpdateObjectiveRequest {
  title: string;
  description: string;
  priority: ObjectivePriority;
  status: ObjectiveStatus;
  targetDate?: Date;
  progress: number;
  tags?: string[];
}

export interface ObjectiveFilters {
  priority?: ObjectivePriority;
  status?: ObjectiveStatus;
  teamId?: string;
  isActive?: boolean;
}