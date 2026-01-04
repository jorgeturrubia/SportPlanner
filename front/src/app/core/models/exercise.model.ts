import { TacticalBoard } from './tactical-board.model';

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

    tacticalBoards?: TacticalBoard[];
}

export interface CreateExerciseDto {
    name: string;
    description?: string;
    mediaUrl?: string;
    conceptIds?: number[];
}
