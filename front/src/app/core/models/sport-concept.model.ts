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
  conceptCategory: ConceptCategory | null;
  developmentLevel: number | null;
  technicalTacticalFocus: number | null;
  isSuggested?: boolean;
}

