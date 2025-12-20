export interface ConceptCategory {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  parent: ConceptCategory | null;
  subCategories: ConceptCategory[];
}

export interface SportConcept {
  id: number;
  name: string;
  description: string | null;
  technicalDifficulty: number;
  tacticalComplexity: number;
  conceptTemplateId?: number | null;
  conceptCategory: ConceptCategory | null;
  isSuggested?: boolean;
}

