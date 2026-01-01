export interface Season {
    id: number;
    name: string;
    startDate: string; // ISO Date
    endDate: string;   // ISO Date
    isActive: boolean;
    organizationId?: number;
    ownerId?: string;
    isSystem?: boolean;
}

export interface CreateSeasonDto {
    name: string;
    startDate: string;
    endDate: string;
    organizationId?: number;
}

export interface UpdateSeasonDto {
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}
