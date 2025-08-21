// Exercise Category enum
export enum ExerciseCategory {
  WARM_UP = 'warm_up',
  TECHNICAL = 'technical',
  TACTICAL = 'tactical',
  PHYSICAL = 'physical',
  COORDINATION = 'coordination',
  FLEXIBILITY = 'flexibility',
  STRENGTH = 'strength',
  ENDURANCE = 'endurance',
  SPEED = 'speed',
  AGILITY = 'agility',
  COOL_DOWN = 'cool_down',
  GAME = 'game'
}

// Exercise Difficulty enum
export enum ExerciseDifficulty {
  VERY_EASY = 'very_easy',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard'
}

// Exercise Status enum
export enum ExerciseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Equipment interface
export interface Equipment {
  id: string;
  name: string;
  quantity: number;
  isRequired: boolean;
}

// Exercise Variation interface
export interface ExerciseVariation {
  id: string;
  name: string;
  description: string;
  difficulty: ExerciseDifficulty;
  duration: number;
  notes?: string;
}

// Exercise interface
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  status: ExerciseStatus;
  duration: number; // in minutes
  minParticipants: number;
  maxParticipants: number;
  targetAgeGroup: string[];
  sport: string;
  objectives: string[]; // IDs of objectives this exercise helps achieve
  instructions: string[];
  safetyNotes: string[];
  equipment: Equipment[];
  variations: ExerciseVariation[];
  tags: string[];
  spaceRequired: string; // e.g., "Half court", "Full field", "Small area"
  isPublic: boolean;
  isVerified: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  rating: number;
  reviews?: ExerciseReview[];
  media?: ExerciseMedia[];
}

// Exercise Review interface
export interface ExerciseReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Exercise Media interface
export interface ExerciseMedia {
  id: string;
  type: 'image' | 'video' | 'diagram';
  url: string;
  caption?: string;
  order: number;
}

// Create Exercise Request
export interface CreateExerciseRequest {
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  duration: number;
  minParticipants: number;
  maxParticipants: number;
  targetAgeGroup: string[];
  sport: string;
  objectives: string[];
  instructions: string[];
  safetyNotes: string[];
  equipment: Equipment[];
  variations: ExerciseVariation[];
  tags: string[];
  spaceRequired: string;
  isPublic: boolean;
}

// Update Exercise Request
export interface UpdateExerciseRequest extends Partial<CreateExerciseRequest> {
  status?: ExerciseStatus;
}

// Exercise Filter interface
export interface ExerciseFilter {
  category?: ExerciseCategory;
  difficulty?: ExerciseDifficulty;
  sport?: string;
  duration?: {
    min: number;
    max: number;
  };
  participants?: {
    min: number;
    max: number;
  };
  targetAgeGroup?: string;
  equipment?: string[];
  tags?: string[];
  isPublic?: boolean;
  isVerified?: boolean;
}

// Exercises List Response
export interface ExercisesListResponse {
  exercises: Exercise[];
  totalCount: number;
  page: number;
  limit: number;
  filters?: ExerciseFilter;
}