export interface ConceptProposalRequestDto {
    teamId: number;
    durationDays?: number;
    maxConcepts?: number;
    includeConceptIds?: number[];
    excludeCategoryIds?: number[];
    sectionFocus?: 'Ataque' | 'Defensa';
    levelOffset?: number;
    planningTemplateId?: number;
    skipLevelFilter?: boolean;
}

export interface PlanningTemplateDto {
    id: number;
    name: string;
    code: string;
    level: number;
}

export interface ConceptProposalResponseDto {
    team: any; // Using any for now, ideally TeamDto
    suggestedGroups: ConceptProposalGroupDto[];
    optionalGroups: ConceptProposalGroupDto[];
    metadata: ProposalMetadataDto;
}

export interface ConceptProposalGroupDto {
    categoryName: string;
    categoryId: number;
    section: string;
    concepts: ScoredConceptDto[];
}

export interface ConceptItineraryContextDto {
    itineraryName: string;
    templateName: string;
    level: number;
    totalLevels: number;
}

export interface SportConceptDto {
    id: number;
    name: string;
    description: string;
    developmentLevel: number;
    itineraryContexts: ConceptItineraryContextDto[];
    // ... add other fields if needed or allow loose typing
    [key: string]: any; 
}

export interface ScoredConceptDto {
    concept: SportConceptDto;
    score: number;
    scoreReason: string;
    priority: ProposalPriority;
    tag: ConceptTag;
}

export interface ProposalMetadataDto {
    totalAvailableConcepts: number;
    suggestedCount: number;
    optionalCount: number;
    averageTeamMatchScore: number;
    expectedDevelopmentLevel: number;
    minLevelWindow: number;
    maxLevelWindow: number;
}

export enum ProposalPriority {
    Essential = 1,
    Recommended = 2,
    Progressive = 3,
    Optional = 4
}

export enum ConceptTag {
    Own = 1,
    Inherited = 2,
    Reinforcement = 3,
    Aspirational = 4
}
