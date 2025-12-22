export interface Exercise {
    id: number;
    name: string;
    description?: string;
    mediaUrl?: string;
    conceptIds: number[];
}

export interface CreateExerciseDto {
    name: string;
    description?: string;
    mediaUrl?: string;
    conceptIds?: number[];
}
