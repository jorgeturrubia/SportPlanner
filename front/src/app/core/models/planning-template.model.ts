import { TeamCategory } from './team.model';
import { SportConcept } from './sport-concept.model';

export interface PlanningTemplate {
    id: number;
    name: string;
    code: string;
    level: number;
    parentTemplateId?: number;
    parentTemplate?: PlanningTemplate;
    teamCategoryId?: number;
    teamCategory?: TeamCategory;
    description?: string;
    isActive: boolean;
    
    // Shadowing
    isSystem: boolean;
    ownerId?: string;
    version: number;
    systemSourceId?: number;
    systemSource?: PlanningTemplate;

    concepts?: PlanningTemplateConcept[];
}

export interface PlanningTemplateSimple {
    id: number;
    name: string;
    code: string;
    level: number;
    teamCategoryName?: string;
}

export interface MethodologicalItinerary {
    id: number;
    name: string;
    description?: string;
    sportId: number;
    sportName?: string;
    planningTemplates: PlanningTemplateSimple[];
    averageRating: number;
    ratingCount: number;
    isSystem: boolean;
    authorName?: string;
    ownerId?: string;
    version: number;
}

export interface PlanningTemplateConcept {
    id: number;
    planningTemplateId: number;
    sportConceptId: number;
    sportConcept: SportConcept;
    customDescription?: string;
    order: number;
}

export interface MarketplaceFilter {
    searchTerm?: string;
    minRating?: number;
    teamCategoryId?: number;
}

export interface RateItineraryRequest {
    itineraryId: number;
    rating: number;
}
