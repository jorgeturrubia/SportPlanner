export enum DifficultyLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  Expert = 3
}

export enum ExerciseCategory {
  Technical = 0,
  Tactical = 1,
  Physical = 2,
  Psychological = 3,
  Coordination = 4
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  minPlayers: number;
  maxPlayers: number;
  equipment?: string;
  instructions?: string;
  isCustom: boolean;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  usageCount: number;
  tags?: string[];
}

export interface CreateExerciseRequest {
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  minPlayers: number;
  maxPlayers: number;
  equipment?: string;
  instructions?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface UpdateExerciseRequest {
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  minPlayers: number;
  maxPlayers: number;
  equipment?: string;
  instructions?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface ExerciseFilters {
  category?: ExerciseCategory;
  difficulty?: DifficultyLevel;
  isCustom?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
}