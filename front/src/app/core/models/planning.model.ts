export interface DifficultyLevel {
  id: number;
  name: string;
}

export interface SportConcept {
  id: number;
  name: string;
  description: string | null;
  difficultyLevel: DifficultyLevel | null;
}

export interface TeamCategory {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  teamCategory: TeamCategory | null;
}

export interface PlanConcept {
  id: number;
  planningId: number;
  sportConcept: SportConcept | null;
  sportConceptId: number;
  order: number;
}

export interface PlaningScheduleDay {
  id: number;
  planningId: number;
  dayOfWeek: number; // Sunday: 0, Monday: 1, ..., Saturday: 6
  startTime: string; // Format: "HH:mm:ss"
  endTime: string; // Format: "HH:mm:ss"
}

export interface Planning {
  id: number;
  name: string;
  team: Team | null;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  scheduleDays: PlaningScheduleDay[];
  planConcepts: PlanConcept[];
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

export interface CreatePlanning {
  name: string;
  teamId: number;
  startDate: string;
  endDate: string;
  scheduleDays?: PlaningScheduleDay[];
  planConcepts?: PlanConcept[];
}

export interface UpdatePlanning {
  name?: string;
  startDate?: string;
  endDate?: string;
  scheduleDays?: PlaningScheduleDay[];
  planConcepts?: PlanConcept[];
}
