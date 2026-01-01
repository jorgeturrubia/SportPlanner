export interface Exercise {
    id: number;
    name: string;
    description?: string;
    mediaUrl?: string;
    conceptIds: number[];
    
    // Ownership & Marketplace Properties
    ownerId?: string;
    isSystem?: boolean;
    originSystemId?: number;
}

export interface CreateExerciseDto {
    name: string;
    description?: string;
    mediaUrl?: string;
    conceptIds?: number[];
}
