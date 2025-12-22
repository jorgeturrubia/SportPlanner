export interface TrainingSessionConcept {
    id: number;
    sportConceptId: number;
    conceptName?: string;
    order: number;
}

export interface TrainingSessionExercise {
    id: number;
    exerciseId?: number;
    exerciseName?: string;
    customText?: string;
    sportConceptId?: number;
    sportConceptName?: string;
    order: number;
    durationMinutes?: number;
}

export interface TrainingSession {
    id: number;
    name?: string;
    teamId: number;
    date: string;
    startTime?: string;
    duration?: string;
    courtId?: number;
    sessionConcepts: TrainingSessionConcept[];
    sessionExercises: TrainingSessionExercise[];
}

export interface CreateTrainingSessionDto {
    name?: string;
    teamId: number;
    date: string;
    startTime?: string;
    duration?: string;
    courtId?: number;
    sessionConcepts: CreateTrainingSessionConceptDto[];
    sessionExercises: CreateTrainingSessionExerciseDto[];
}

export interface CreateTrainingSessionConceptDto {
    sportConceptId: number;
    order: number;
}

export interface CreateTrainingSessionExerciseDto {
    exerciseId?: number;
    customText?: string;
    sportConceptId?: number;
    order: number;
    durationMinutes?: number;
}
