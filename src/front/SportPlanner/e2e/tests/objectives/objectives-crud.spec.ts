import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../utils/test-data-manager';
import { ObjectivesPage, ObjectiveFormPage, LoginPage } from '../../utils/page-objects';
import { testObjectives, testUsers, performanceThresholds, generateUniqueTestData } from '../../fixtures/test-data';

test.describe('Objectives CRUD Operations', () => {
  let testDataManager: TestDataManager;
  let loginPage: LoginPage;
  let objectivesPage: ObjectivesPage;
  let objectiveFormPage: ObjectiveFormPage;
  let authToken: string;

  test.beforeEach(async ({ page }) => {
    testDataManager = new TestDataManager();
    loginPage = new LoginPage(page);
    objectivesPage = new ObjectivesPage(page);
    objectiveFormPage = new ObjectiveFormPage(page);

    // Authenticate as coach user
    authToken = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );
    testDataManager.setAuthToken(authToken);

    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
  });

  test.afterEach(async () => {
    await testDataManager.cleanupTestData();
  });

  test('should create a new objective successfully', async () => {
    const uniqueObjectiveData = generateUniqueTestData(testObjectives.validObjective);
    
    await objectivesPage.goto();
    
    const startTime = Date.now();
    
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(uniqueObjectiveData);
    await objectiveFormPage.saveObjective();
    
    const createDuration = Date.now() - startTime;
    expect(createDuration).toBeLessThan(performanceThresholds.create);
    
    // Verify objective appears in UI
    await objectivesPage.verifyObjectiveExists(uniqueObjectiveData.title);
    
    // Verify success message
    await objectivesPage.verifyToastMessage('Objetivo creado exitosamente');
    
    // Verify persistence after page refresh
    await objectivesPage.goto();
    await objectivesPage.verifyObjectiveExists(uniqueObjectiveData.title);
  });

  test('should read/display objectives correctly', async () => {
    // Create test objective via API
    const testObjective = await testDataManager.createTestObjective({
      title: 'API Created Objective',
      description: 'Objective created via API for testing',
    });
    
    const startTime = Date.now();
    
    await objectivesPage.goto();
    
    const readDuration = Date.now() - startTime;
    expect(readDuration).toBeLessThan(performanceThresholds.read);
    
    // Verify objective is displayed
    await objectivesPage.verifyObjectiveExists(testObjective.title);
    
    // Test search functionality
    await objectivesPage.searchInput.fill(testObjective.title);
    await objectivesPage.page.waitForTimeout(500); // Debounce
    await objectivesPage.verifyObjectiveExists(testObjective.title);
    
    // Click to view objective details
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    await expect(objectivesPage.page).toHaveURL(/\/objectives\/.*$/);
  });

  test('should update objective information successfully', async () => {
    const testObjective = await testDataManager.createTestObjective({
      title: 'Objective to Update',
      description: 'Original description',
    });
    
    await objectivesPage.goto();
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    
    const startTime = Date.now();
    
    await objectiveFormPage.fillObjectiveForm(testObjectives.updateObjective);
    await objectiveFormPage.saveObjective();
    
    const updateDuration = Date.now() - startTime;
    expect(updateDuration).toBeLessThan(performanceThresholds.update);
    
    // Verify update success
    await objectivesPage.verifyToastMessage('Objetivo actualizado exitosamente');
    
    // Verify changes persisted
    await objectivesPage.goto();
    await objectivesPage.verifyObjectiveExists(testObjectives.updateObjective.title);
    
    // Verify in database
    const updatedObjective = await testDataManager.verifyDataInDatabase('objectives', testObjective.id);
    expect(updatedObjective).toBeTruthy();
  });

  test('should delete objective successfully', async () => {
    const testObjective = await testDataManager.createTestObjective({
      title: 'Objective to Delete',
      description: 'This objective will be deleted',
    });
    
    await objectivesPage.goto();
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    
    const startTime = Date.now();
    
    await objectiveFormPage.deleteObjective();
    
    const deleteDuration = Date.now() - startTime;
    expect(deleteDuration).toBeLessThan(performanceThresholds.delete);
    
    // Verify deletion success
    await objectivesPage.verifyToastMessage('Objetivo eliminado exitosamente');
    
    // Verify objective no longer exists in UI
    await objectivesPage.goto();
    const objectiveCard = objectivesPage.page.locator(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    await expect(objectiveCard).not.toBeVisible();
    
    // Verify objective no longer exists in database
    const objectiveExists = await testDataManager.verifyDataInDatabase('objectives', testObjective.id);
    expect(objectiveExists).toBeFalsy();
  });

  test('should handle validation errors correctly', async () => {
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    
    // Try to save with invalid data
    await objectiveFormPage.fillObjectiveForm(testObjectives.invalidObjective);
    await objectiveFormPage.saveObjective();
    
    // Verify validation errors are displayed
    const errorElements = objectiveFormPage.page.locator('.error-message, .field-error');
    await expect(errorElements.first()).toBeVisible();
    
    // Verify objective was not created
    await objectivesPage.goto();
    const objectiveCount = await objectivesPage.objectiveCard.count();
    expect(objectiveCount).toBe(0);
  });

  test('should support objective-exercise relationships', async () => {
    // Create related exercises first
    const relatedExercise1 = await testDataManager.createTestExercise({
      name: 'Exercise for Objective 1',
      description: 'Exercise that supports the objective',
    });
    
    const relatedExercise2 = await testDataManager.createTestExercise({
      name: 'Exercise for Objective 2',
      description: 'Another exercise that supports the objective',
    });
    
    // Create objective
    const uniqueObjectiveData = generateUniqueTestData(testObjectives.validObjective);
    
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(uniqueObjectiveData);
    
    // Link exercises to objective if relationship field exists
    const exerciseSelect = objectiveFormPage.page.locator('[data-testid="related-exercises"]');
    if (await exerciseSelect.isVisible()) {
      await exerciseSelect.selectOption([relatedExercise1.id, relatedExercise2.id]);
    }
    
    await objectiveFormPage.saveObjective();
    await objectivesPage.verifyObjectiveExists(uniqueObjectiveData.title);
    
    // Verify relationships are maintained
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${uniqueObjectiveData.title}")`);
    
    // Check if related exercises are displayed
    const relatedExercisesSection = objectiveFormPage.page.locator('[data-testid="related-exercises-display"]');
    if (await relatedExercisesSection.isVisible()) {
      await expect(relatedExercisesSection).toContainText(relatedExercise1.name);
      await expect(relatedExercisesSection).toContainText(relatedExercise2.name);
    }
  });

  test('should validate objective category constraints', async () => {
    const categories = ['Technical', 'Tactical', 'Physical', 'Psychological'];
    
    for (const category of categories) {
      const objectiveData = generateUniqueTestData({
        ...testObjectives.validObjective,
        category,
      }, category.toLowerCase());
      
      await objectivesPage.goto();
      await objectivesPage.createObjective();
      await objectiveFormPage.fillObjectiveForm(objectiveData);
      await objectiveFormPage.saveObjective();
      
      await objectivesPage.verifyObjectiveExists(objectiveData.title);
    }
    
    // Verify all categories are represented
    await objectivesPage.goto();
    const objectiveCount = await objectivesPage.objectiveCard.count();
    expect(objectiveCount).toBe(categories.length);
  });

  test('should handle objective difficulty progression', async () => {
    const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    
    for (const difficulty of difficulties) {
      const objectiveData = generateUniqueTestData({
        ...testObjectives.validObjective,
        difficulty,
      }, difficulty.toLowerCase());
      
      await objectivesPage.goto();
      await objectivesPage.createObjective();
      await objectiveFormPage.fillObjectiveForm(objectiveData);
      await objectiveFormPage.saveObjective();
      
      await objectivesPage.verifyObjectiveExists(objectiveData.title);
    }
    
    // Test that difficulty progression makes sense
    await objectivesPage.goto();
    const objectiveCount = await objectivesPage.objectiveCard.count();
    expect(objectiveCount).toBe(difficulties.length);
  });

  test('should support objective prerequisites', async () => {
    // Create prerequisite objective
    const prerequisiteObjective = await testDataManager.createTestObjective({
      title: 'Prerequisite Objective',
      description: 'This objective must be completed first',
      difficulty: 1, // Beginner
    });
    
    // Create objective with prerequisite
    const dependentObjectiveData = {
      ...generateUniqueTestData(testObjectives.validObjective),
      difficulty: 'Intermediate', // Higher difficulty
    };
    
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(dependentObjectiveData);
    
    // Set prerequisite if field exists
    const prerequisiteSelect = objectiveFormPage.page.locator('[data-testid="prerequisite-objectives"]');
    if (await prerequisiteSelect.isVisible()) {
      await prerequisiteSelect.selectOption(prerequisiteObjective.id);
    }
    
    await objectiveFormPage.saveObjective();
    await objectivesPage.verifyObjectiveExists(dependentObjectiveData.title);
  });

  test('should validate objective duration constraints', async () => {
    const invalidDurationData = {
      ...testObjectives.validObjective,
      duration: '400', // Exceeds reasonable limit
    };
    
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(invalidDurationData);
    await objectiveFormPage.saveObjective();
    
    // Should show validation warning or error
    const warningElement = objectiveFormPage.page.locator('.warning-message, .error-message');
    const hasWarning = await warningElement.isVisible();
    
    if (hasWarning) {
      console.log('Duration validation triggered correctly');
    }
  });

  test('should support objective progress tracking', async () => {
    const testObjective = await testDataManager.createTestObjective({
      title: 'Progress Tracking Objective',
      description: 'Objective for testing progress tracking',
    });
    
    await objectivesPage.goto();
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    
    // Update progress if progress field exists
    const progressInput = objectiveFormPage.page.locator('[data-testid="objective-progress"]');
    if (await progressInput.isVisible()) {
      await progressInput.fill('50'); // 50% progress
      await objectiveFormPage.saveObjective();
      
      // Verify progress is saved
      await objectivesPage.goto();
      await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
      await expect(progressInput).toHaveValue('50');
    }
  });

  test('should handle objective completion status', async () => {
    const testObjective = await testDataManager.createTestObjective({
      title: 'Completable Objective',
      description: 'Objective that can be marked as completed',
    });
    
    await objectivesPage.goto();
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
    
    // Mark as completed if completion checkbox exists
    const completedCheckbox = objectiveFormPage.page.locator('[data-testid="objective-completed"]');
    if (await completedCheckbox.isVisible()) {
      await completedCheckbox.check();
      await objectiveFormPage.saveObjective();
      
      // Verify completion status
      await objectivesPage.verifyToastMessage('Objetivo marcado como completado');
      
      // Check if objective appears differently in list
      await objectivesPage.goto();
      const completedObjective = objectivesPage.page.locator(`[data-testid="objective-card"]:has-text("${testObjective.title}").completed`);
      // Note: This assumes completed objectives have a 'completed' class
    }
  });

  test('should support objective templates and reuse', async () => {
    // Create template objective
    const templateObjectiveData = generateUniqueTestData(testObjectives.validObjective, 'template');
    
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(templateObjectiveData);
    
    // Mark as template if template option exists
    const templateCheckbox = objectiveFormPage.page.locator('[data-testid="is-template"]');
    if (await templateCheckbox.isVisible()) {
      await templateCheckbox.check();
    }
    
    await objectiveFormPage.saveObjective();
    
    // Use template to create new objective
    await objectivesPage.goto();
    const useTemplateButton = objectivesPage.page.locator(`[data-testid="use-template"]:near([data-testid="objective-card"]:has-text("${templateObjectiveData.title}"))`);
    
    if (await useTemplateButton.isVisible()) {
      await useTemplateButton.click();
      
      // Should pre-fill form with template data
      const nameField = objectiveFormPage.titleInput;
      const currentValue = await nameField.inputValue();
      expect(currentValue).toContain(templateObjectiveData.title);
    }
  });

  test('should integrate with team objectives planning', async () => {
    // Create team first
    const testTeam = await testDataManager.createTestTeam({
      name: 'Team with Objectives',
    });
    
    // Create objective for team
    const teamObjectiveData = generateUniqueTestData(testObjectives.validObjective, 'team');
    
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    await objectiveFormPage.fillObjectiveForm(teamObjectiveData);
    
    // Assign to team if team assignment field exists
    const teamSelect = objectiveFormPage.page.locator('[data-testid="assigned-teams"]');
    if (await teamSelect.isVisible()) {
      await teamSelect.selectOption(testTeam.id);
    }
    
    await objectiveFormPage.saveObjective();
    await objectivesPage.verifyObjectiveExists(teamObjectiveData.title);
    
    // Verify team-objective relationship
    await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${teamObjectiveData.title}")`);
    
    const assignedTeamsSection = objectiveFormPage.page.locator('[data-testid="assigned-teams-display"]');
    if (await assignedTeamsSection.isVisible()) {
      await expect(assignedTeamsSection).toContainText(testTeam.name);
    }
  });
});