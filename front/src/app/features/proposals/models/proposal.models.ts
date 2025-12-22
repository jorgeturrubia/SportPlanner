export interface ConceptProposalRequestDto {
    teamId: number;
    durationDays?: number;
    maxConcepts?: number;
    excludeCategoryIds?: number[];
    sectionFocus?: 'Ataque' | 'Defensa';
    levelOffset?: number;
    itineraryId?: number;
}

export interface MethodologicalItineraryDto {
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

export interface ScoredConceptDto {
    concept: any; // Using any for now, ideally SportConceptDto
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
