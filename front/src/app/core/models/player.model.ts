export interface Player {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string | null;
    email: string | null;
    phone: string | null;
    teamId: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePlayerDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: string | null;
    email?: string | null;
    phone?: string | null;
    teamId: number;
}

export interface UpdatePlayerDto {
    firstName: string;
    lastName: string;
    dateOfBirth?: string | null;
    email?: string | null;
    phone?: string | null;
    isActive: boolean;
}
