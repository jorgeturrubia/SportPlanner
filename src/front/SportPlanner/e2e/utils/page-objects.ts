import { Page, Locator, expect } from '@playwright/test';

/**
 * Base page object with common functionality
 */
export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForElement(locator: Locator, timeout = 5000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[data-testid="${field}"]`, value);
    }
  }

  async clickButton(buttonText: string) {
    await this.page.click(`button:has-text("${buttonText}")`);
  }

  async verifyToastMessage(message: string) {
    const toast = this.page.locator('[role="alert"], .toast, .notification');
    await expect(toast).toContainText(message);
  }

  async verifyPageTitle(title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title, 'i'));
  }
}

/**
 * Login page object
 */
export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('[data-testid="email"]');
  readonly passwordInput = this.page.locator('[data-testid="password"]');
  readonly loginButton = this.page.locator('[data-testid="login-button"]');
  readonly errorMessage = this.page.locator('[data-testid="error-message"]');

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoginError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }
}

/**
 * Teams management page object
 */
export class TeamsPage extends BasePage {
  readonly createTeamButton = this.page.locator('[data-testid="create-team-button"]');
  readonly teamsList = this.page.locator('[data-testid="teams-list"]');
  readonly teamCard = this.page.locator('[data-testid="team-card"]');
  readonly searchInput = this.page.locator('[data-testid="teams-search"]');
  readonly noTeamsMessage = this.page.locator('[data-testid="no-teams-message"]');

  async goto() {
    await super.goto('/teams');
  }

  async createTeam() {
    await this.createTeamButton.click();
  }

  async searchTeam(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Debounce
  }

  async getTeamCount() {
    return await this.teamCard.count();
  }

  async clickTeam(teamName: string) {
    await this.page.click(`[data-testid="team-card"]:has-text("${teamName}")`);
  }

  async verifyTeamExists(teamName: string) {
    const teamCard = this.page.locator(`[data-testid="team-card"]:has-text("${teamName}")`);
    await expect(teamCard).toBeVisible();
  }

  async verifyTeamNotExists(teamName: string) {
    const teamCard = this.page.locator(`[data-testid="team-card"]:has-text("${teamName}")`);
    await expect(teamCard).not.toBeVisible();
  }
}

/**
 * Team form page object (create/edit)
 */
export class TeamFormPage extends BasePage {
  readonly nameInput = this.page.locator('[data-testid="team-name"]');
  readonly sportSelect = this.page.locator('[data-testid="team-sport"]');
  readonly categorySelect = this.page.locator('[data-testid="team-category"]');
  readonly genderSelect = this.page.locator('[data-testid="team-gender"]');
  readonly levelSelect = this.page.locator('[data-testid="team-level"]');
  readonly descriptionInput = this.page.locator('[data-testid="team-description"]');
  readonly maxPlayersInput = this.page.locator('[data-testid="team-max-players"]');
  readonly saveButton = this.page.locator('[data-testid="save-button"]');
  readonly cancelButton = this.page.locator('[data-testid="cancel-button"]');
  readonly deleteButton = this.page.locator('[data-testid="delete-button"]');

  async fillTeamForm(teamData: {
    name: string;
    sport?: string;
    category?: string;
    gender?: string;
    level?: string;
    description?: string;
    maxPlayers?: string;
  }) {
    await this.nameInput.fill(teamData.name);
    
    if (teamData.sport) {
      await this.sportSelect.selectOption(teamData.sport);
    }
    
    if (teamData.category) {
      await this.categorySelect.selectOption(teamData.category);
    }
    
    if (teamData.gender) {
      await this.genderSelect.selectOption(teamData.gender);
    }
    
    if (teamData.level) {
      await this.levelSelect.selectOption(teamData.level);
    }
    
    if (teamData.description) {
      await this.descriptionInput.fill(teamData.description);
    }
    
    if (teamData.maxPlayers) {
      await this.maxPlayersInput.fill(teamData.maxPlayers);
    }
  }

  async saveTeam() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteTeam() {
    await this.deleteButton.click();
    // Handle confirmation dialog
    await this.page.click('button:has-text("Confirmar")');
    await this.page.waitForLoadState('networkidle');
  }

  async verifyFormErrors() {
    const errorElements = this.page.locator('.error-message, .field-error');
    await expect(errorElements.first()).toBeVisible();
  }
}

/**
 * Exercises page object
 */
export class ExercisesPage extends BasePage {
  readonly createExerciseButton = this.page.locator('[data-testid="create-exercise-button"]');
  readonly exercisesList = this.page.locator('[data-testid="exercises-list"]');
  readonly exerciseCard = this.page.locator('[data-testid="exercise-card"]');
  readonly searchInput = this.page.locator('[data-testid="exercises-search"]');
  readonly categoryFilter = this.page.locator('[data-testid="category-filter"]');
  readonly difficultyFilter = this.page.locator('[data-testid="difficulty-filter"]');

  async goto() {
    await super.goto('/exercises');
  }

  async createExercise() {
    await this.createExerciseButton.click();
  }

  async searchExercise(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async filterByDifficulty(difficulty: string) {
    await this.difficultyFilter.selectOption(difficulty);
  }

  async verifyExerciseExists(exerciseName: string) {
    const exerciseCard = this.page.locator(`[data-testid="exercise-card"]:has-text("${exerciseName}")`);
    await expect(exerciseCard).toBeVisible();
  }
}

/**
 * Exercise form page object
 */
export class ExerciseFormPage extends BasePage {
  readonly nameInput = this.page.locator('[data-testid="exercise-name"]');
  readonly descriptionInput = this.page.locator('[data-testid="exercise-description"]');
  readonly categorySelect = this.page.locator('[data-testid="exercise-category"]');
  readonly difficultySelect = this.page.locator('[data-testid="exercise-difficulty"]');
  readonly durationInput = this.page.locator('[data-testid="exercise-duration"]');
  readonly minParticipantsInput = this.page.locator('[data-testid="min-participants"]');
  readonly maxParticipantsInput = this.page.locator('[data-testid="max-participants"]');
  readonly saveButton = this.page.locator('[data-testid="save-button"]');
  readonly deleteButton = this.page.locator('[data-testid="delete-button"]');

  async fillExerciseForm(exerciseData: {
    name: string;
    description: string;
    category?: string;
    difficulty?: string;
    duration?: string;
    minParticipants?: string;
    maxParticipants?: string;
  }) {
    await this.nameInput.fill(exerciseData.name);
    await this.descriptionInput.fill(exerciseData.description);
    
    if (exerciseData.category) {
      await this.categorySelect.selectOption(exerciseData.category);
    }
    
    if (exerciseData.difficulty) {
      await this.difficultySelect.selectOption(exerciseData.difficulty);
    }
    
    if (exerciseData.duration) {
      await this.durationInput.fill(exerciseData.duration);
    }
    
    if (exerciseData.minParticipants) {
      await this.minParticipantsInput.fill(exerciseData.minParticipants);
    }
    
    if (exerciseData.maxParticipants) {
      await this.maxParticipantsInput.fill(exerciseData.maxParticipants);
    }
  }

  async saveExercise() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteExercise() {
    await this.deleteButton.click();
    await this.page.click('button:has-text("Confirmar")');
    await this.page.waitForLoadState('networkidle');
  }
}

/**
 * Objectives page object
 */
export class ObjectivesPage extends BasePage {
  readonly createObjectiveButton = this.page.locator('[data-testid="create-objective-button"]');
  readonly objectivesList = this.page.locator('[data-testid="objectives-list"]');
  readonly objectiveCard = this.page.locator('[data-testid="objective-card"]');
  readonly searchInput = this.page.locator('[data-testid="objectives-search"]');

  async goto() {
    await super.goto('/objectives');
  }

  async createObjective() {
    await this.createObjectiveButton.click();
  }

  async verifyObjectiveExists(objectiveTitle: string) {
    const objectiveCard = this.page.locator(`[data-testid="objective-card"]:has-text("${objectiveTitle}")`);
    await expect(objectiveCard).toBeVisible();
  }
}

/**
 * Objective form page object
 */
export class ObjectiveFormPage extends BasePage {
  readonly titleInput = this.page.locator('[data-testid="objective-title"]');
  readonly descriptionInput = this.page.locator('[data-testid="objective-description"]');
  readonly categorySelect = this.page.locator('[data-testid="objective-category"]');
  readonly difficultySelect = this.page.locator('[data-testid="objective-difficulty"]');
  readonly durationInput = this.page.locator('[data-testid="objective-duration"]');
  readonly saveButton = this.page.locator('[data-testid="save-button"]');
  readonly deleteButton = this.page.locator('[data-testid="delete-button"]');

  async fillObjectiveForm(objectiveData: {
    title: string;
    description: string;
    category?: string;
    difficulty?: string;
    duration?: string;
  }) {
    await this.titleInput.fill(objectiveData.title);
    await this.descriptionInput.fill(objectiveData.description);
    
    if (objectiveData.category) {
      await this.categorySelect.selectOption(objectiveData.category);
    }
    
    if (objectiveData.difficulty) {
      await this.difficultySelect.selectOption(objectiveData.difficulty);
    }
    
    if (objectiveData.duration) {
      await this.durationInput.fill(objectiveData.duration);
    }
  }

  async saveObjective() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async deleteObjective() {
    await this.deleteButton.click();
    await this.page.click('button:has-text("Confirmar")');
    await this.page.waitForLoadState('networkidle');
  }
}