export interface ConceptTemplate {
    id: number;
    name: string;
    description: string | null;
    technicalComplexity: number;
    tacticalComplexity: number;
    conceptCategoryId: number | null;
    conceptCategoryName?: string | null;
    sportId: number;
    sportName?: string | null;
    isActive: boolean;
}

export interface ConceptTemplateCreate {
    name: string;
    description?: string;
    technicalComplexity: number;
    tacticalComplexity: number;
    conceptCategoryId?: number;
    sportId: number;
}

export interface ConceptTemplateUpdate {
    name?: string;
    description?: string;
    technicalComplexity?: number;
    tacticalComplexity?: number;
    conceptCategoryId?: number;
    isActive?: boolean;
}
