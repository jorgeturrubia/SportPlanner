export interface TrainingSessionConcept {
    id: number;
    sportConceptId: number;
    conceptName?: string;
    conceptDescription?: string;
    order: number;
    durationMinutes?: number;
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
    // Execution Logic
    isCompleted?: boolean;
    actualDurationMinutes?: number;
    feedbackNotes?: string;
}

export type TrainingSessionStatus = 'Planned' | 'InProgress' | 'Completed' | 'Canceled';

export interface TrainingSession {
    id: number;
    name?: string;
    teamId: number;
    date: string;
    startTime?: string;
    duration?: string;
    courtId?: number;
    planningId?: number;
    planningName?: string;
    sessionConcepts: TrainingSessionConcept[];

    sessionExercises: TrainingSessionExercise[];

    // Live Execution Tracking
    status: TrainingSessionStatus;
    startedAt?: string;
    finishedAt?: string;

    // Feedback
    feedbackRating?: number;
    feedbackNotes?: string;
}

export interface CreateTrainingSessionDto {
    name?: string;
    teamId: number;
    date: string;
    startTime?: string;
    duration?: string;
    courtId?: number;
    planningId?: number;
    sessionConcepts: CreateTrainingSessionConceptDto[];
    sessionExercises: CreateTrainingSessionExerciseDto[];
}

export interface CreateTrainingSessionConceptDto {
    sportConceptId: number;
    order: number;
    durationMinutes?: number;
    overrideDescription?: string;
}

export interface CreateTrainingSessionExerciseDto {
    exerciseId?: number;
    customText?: string;
    sportConceptId?: number;
    order: number;
    durationMinutes?: number;
}
