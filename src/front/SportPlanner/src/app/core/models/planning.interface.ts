import { Team } from './team.interface';
import { Objective } from './objective.interface';
import { Exercise } from './exercise.interface';

// Planning Type enum
export enum PlanningType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  SEASONAL = 'seasonal',
  TOURNAMENT_PREP = 'tournament_prep',
  CUSTOM = 'custom'
}

// Planning Status enum
export enum PlanningStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
  ARCHIVED = 'archived'
}

// Session Type enum
export enum SessionType {
  TRAINING = 'training',
  MATCH = 'match',
  RECOVERY = 'recovery',
  TACTICAL = 'tactical',
  PHYSICAL = 'physical',
  TECHNICAL = 'technical'
}

// Training Session interface
export interface TrainingSession {
  id: string;
  name: string;
  type: SessionType;
  date: Date;
  startTime: string;
  duration: number; // in minutes
  location?: string;
  objectives: string[]; // Objective IDs
  exercises: SessionExercise[];
  notes?: string;
  attendance?: SessionAttendance[];
  isCompleted: boolean;
  completionNotes?: string;
  weather?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Session Exercise interface
export interface SessionExercise {
  exerciseId: string;
  exercise: Exercise;
  order: number;
  plannedDuration: number;
  actualDuration?: number;
  intensity: 'low' | 'medium' | 'high' | 'maximum';
  notes?: string;
  equipment?: string[];
  participants: number;
  modifications?: string;
  isCompleted: boolean;
}

// Session Attendance interface
export interface SessionAttendance {
  playerId: string;
  playerName: string;
  attended: boolean;
  lateMinutes?: number;
  leftEarlyMinutes?: number;
  notes?: string;
  performance?: {
    rating: number;
    notes: string;
  };
}

// Planning interface
export interface Planning {
  id: string;
  name: string;
  description: string;
  type: PlanningType;
  status: PlanningStatus;
  teamId: string;
  team: Team;
  sport: string;
  startDate: Date;
  endDate: Date;
  totalSessions: number;
  completedSessions: number;
  objectives: string[]; // Objective IDs
  sessions: TrainingSession[];
  tags: string[];
  isTemplate: boolean;
  templateName?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  progress: {
    percentage: number;
    completedObjectives: number;
    totalObjectives: number;
    averageAttendance: number;
    lastSessionDate?: Date;
  };
}

// Planning Template interface
export interface PlanningTemplate {
  id: string;
  name: string;
  description: string;
  type: PlanningType;
  sport: string;
  duration: number; // in weeks
  sessionsPerWeek: number;
  targetLevel: string;
  objectives: string[];
  sessionTemplates: SessionTemplate[];
  isPublic: boolean;
  rating: number;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Session Template interface
export interface SessionTemplate {
  name: string;
  type: SessionType;
  duration: number;
  objectives: string[];
  exerciseTemplates: ExerciseTemplate[];
  notes?: string;
  recommendedDay: number; // Day of week (1-7)
}

// Exercise Template interface
export interface ExerciseTemplate {
  exerciseId: string;
  order: number;
  duration: number;
  intensity: 'low' | 'medium' | 'high' | 'maximum';
  notes?: string;
}

// Create Planning Request
export interface CreatePlanningRequest {
  name: string;
  description: string;
  type: PlanningType;
  teamId: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  templateId?: string;
  tags: string[];
  isTemplate: boolean;
  templateName?: string;
}

// Update Planning Request
export interface UpdatePlanningRequest extends Partial<CreatePlanningRequest> {
  status?: PlanningStatus;
}

// Create Session Request
export interface CreateSessionRequest {
  name: string;
  type: SessionType;
  date: Date;
  startTime: string;
  duration: number;
  location?: string;
  objectives: string[];
  exercises: Omit<SessionExercise, 'exercise'>[];
  notes?: string;
}

// Update Session Request
export interface UpdateSessionRequest extends Partial<CreateSessionRequest> {
  isCompleted?: boolean;
  completionNotes?: string;
  attendance?: SessionAttendance[];
}

// Planning Filter interface
export interface PlanningFilter {
  type?: PlanningType;
  status?: PlanningStatus;
  sport?: string;
  teamId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  isTemplate?: boolean;
}

// Plannings List Response
export interface PlanningsListResponse {
  plannings: Planning[];
  totalCount: number;
  page: number;
  limit: number;
  filters?: PlanningFilter;
}

// Planning Analytics interface
export interface PlanningAnalytics {
  totalSessions: number;
  completedSessions: number;
  averageAttendance: number;
  completionRate: number;
  objectiveProgress: {
    objectiveId: string;
    objectiveName: string;
    progress: number;
    sessionsPlanned: number;
    sessionsCompleted: number;
  }[];
  monthlyStats: {
    month: string;
    sessions: number;
    attendance: number;
    completed: number;
  }[];
  exerciseUsage: {
    exerciseId: string;
    exerciseName: string;
    timesUsed: number;
    averageDuration: number;
    averageRating: number;
  }[];
}