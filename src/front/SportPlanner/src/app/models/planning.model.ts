export enum PlanningType {
  Weekly = 0,
  Monthly = 1,
  Seasonal = 2,
  Tournament = 3
}

export enum PlanningStatus {
  Draft = 0,
  Active = 1,
  Completed = 2,
  Archived = 3
}

export interface Planning {
  id: string;
  name: string;
  description: string;
  type: PlanningType;
  status: PlanningStatus;
  startDate: Date;
  endDate: Date;
  teamId: string;
  teamName: string;
  totalSessions: number;
  completedSessions: number;
  isTemplate: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  objectives?: string[];
  tags?: string[];
}

export interface CreatePlanningRequest {
  name: string;
  description: string;
  type: PlanningType;
  startDate: Date;
  endDate: Date;
  teamId: string;
  isTemplate: boolean;
  isPublic: boolean;
  objectives?: string[];
  tags?: string[];
}

export interface UpdatePlanningRequest {
  name: string;
  description: string;
  type: PlanningType;
  status: PlanningStatus;
  startDate: Date;
  endDate: Date;
  isTemplate: boolean;
  isPublic: boolean;
  objectives?: string[];
  tags?: string[];
}

export interface PlanningFilters {
  type?: PlanningType;
  status?: PlanningStatus;
  teamId?: string;
  isTemplate?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
}