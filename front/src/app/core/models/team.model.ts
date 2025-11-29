export interface TeamCategory {
    id: number;
    name: string;
    description: string | null;
}

export interface TeamLevel {
    id: number;
    name: string;
    description: string | null;
}

export interface Team {
    id: number;
    name: string;
    teamCategoryId: number | null;
    teamCategory: TeamCategory | null;
    teamLevelId: number | null;
    teamLevel: TeamLevel | null;
    currentTechnicalLevel: number;
    currentTacticalLevel: number;
    isActive: boolean;
}

export interface CreateTeamDto {
    name: string;
    ownerUserSupabaseId?: string;
    organizationId?: number;
    sportId: number;
    subscriptionId?: number;
    teamCategoryId?: number;
    teamLevelId?: number;
    currentTechnicalLevel: number;
    currentTacticalLevel: number;
}

export interface UpdateTeamDto {
    name: string;
    teamCategoryId?: number;
    teamLevelId?: number;
    currentTechnicalLevel: number;
    currentTacticalLevel: number;
}
