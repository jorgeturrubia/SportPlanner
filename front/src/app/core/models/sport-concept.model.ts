export interface DifficultyLevel {
  id: number;
  name: string;
}

export interface SportConcept {
  id: number;
  name: string;
  description: string | null;
  difficultyLevel: DifficultyLevel | null;
}
