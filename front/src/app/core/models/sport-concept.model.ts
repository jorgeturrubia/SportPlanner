export interface DifficultyLevel {
  id: number;
  name: string;
}

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
  difficultyLevel: DifficultyLevel | null;
  conceptCategory: ConceptCategory | null;
}
