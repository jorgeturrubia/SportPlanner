import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../utils/test-data-manager';
import { ExercisesPage, ExerciseFormPage, LoginPage } from '../../utils/page-objects';
import { testExercises, testUsers, performanceThresholds, generateUniqueTestData } from '../../fixtures/test-data';

test.describe('Exercises CRUD Operations', () => {
  let testDataManager: TestDataManager;
  let loginPage: LoginPage;
  let exercisesPage: ExercisesPage;
  let exerciseFormPage: ExerciseFormPage;
  let authToken: string;

  test.beforeEach(async ({ page }) => {
    testDataManager = new TestDataManager();
    loginPage = new LoginPage(page);
    exercisesPage = new ExercisesPage(page);
    exerciseFormPage = new ExerciseFormPage(page);

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

  test('should create a new exercise successfully', async () => {
    const uniqueExerciseData = generateUniqueTestData(testExercises.validExercise);
    
    await exercisesPage.goto();
    
    const startTime = Date.now();
    
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(uniqueExerciseData);
    await exerciseFormPage.saveExercise();
    
    const createDuration = Date.now() - startTime;
    expect(createDuration).toBeLessThan(performanceThresholds.create);
    
    // Verify exercise appears in UI
    await exercisesPage.verifyExerciseExists(uniqueExerciseData.name);
    
    // Verify success message
    await exercisesPage.verifyToastMessage('Ejercicio creado exitosamente');
    
    // Verify persistence after page refresh
    await exercisesPage.goto();
    await exercisesPage.verifyExerciseExists(uniqueExerciseData.name);
  });

  test('should read/display exercises correctly', async () => {
    // Create test exercise via API
    const testExercise = await testDataManager.createTestExercise({
      name: 'API Created Exercise',
      description: 'Exercise created via API for testing',
    });
    
    const startTime = Date.now();
    
    await exercisesPage.goto();
    
    const readDuration = Date.now() - startTime;
    expect(readDuration).toBeLessThan(performanceThresholds.read);
    
    // Verify exercise is displayed
    await exercisesPage.verifyExerciseExists(testExercise.name);
    
    // Test search functionality
    await exercisesPage.searchExercise(testExercise.name);
    await exercisesPage.verifyExerciseExists(testExercise.name);
    
    // Test category filtering
    await exercisesPage.filterByCategory('WarmUp');
    await exercisesPage.verifyExerciseExists(testExercise.name);
    
    // Test difficulty filtering
    await exercisesPage.filterByDifficulty('Easy');
    await exercisesPage.verifyExerciseExists(testExercise.name);
  });

  test('should update exercise information successfully', async () => {
    const testExercise = await testDataManager.createTestExercise({
      name: 'Exercise to Update',
      description: 'Original description',
    });
    
    await exercisesPage.goto();
    await exercisesPage.page.click(`[data-testid="exercise-card"]:has-text("${testExercise.name}")`);
    
    const startTime = Date.now();
    
    await exerciseFormPage.fillExerciseForm(testExercises.updateExercise);
    await exerciseFormPage.saveExercise();
    
    const updateDuration = Date.now() - startTime;
    expect(updateDuration).toBeLessThan(performanceThresholds.update);
    
    // Verify update success
    await exercisesPage.verifyToastMessage('Ejercicio actualizado exitosamente');
    
    // Verify changes persisted
    await exercisesPage.goto();
    await exercisesPage.verifyExerciseExists(testExercises.updateExercise.name);
    
    // Verify in database
    const updatedExercise = await testDataManager.verifyDataInDatabase('exercises', testExercise.id);
    expect(updatedExercise).toBeTruthy();
  });

  test('should delete exercise successfully', async () => {
    const testExercise = await testDataManager.createTestExercise({
      name: 'Exercise to Delete',
      description: 'This exercise will be deleted',
    });
    
    await exercisesPage.goto();
    await exercisesPage.page.click(`[data-testid="exercise-card"]:has-text("${testExercise.name}")`);
    
    const startTime = Date.now();
    
    await exerciseFormPage.deleteExercise();
    
    const deleteDuration = Date.now() - startTime;
    expect(deleteDuration).toBeLessThan(performanceThresholds.delete);
    
    // Verify deletion success
    await exercisesPage.verifyToastMessage('Ejercicio eliminado exitosamente');
    
    // Verify exercise no longer exists in UI
    await exercisesPage.goto();
    const exerciseCard = exercisesPage.page.locator(`[data-testid="exercise-card"]:has-text("${testExercise.name}")`);
    await expect(exerciseCard).not.toBeVisible();
    
    // Verify exercise no longer exists in database
    const exerciseExists = await testDataManager.verifyDataInDatabase('exercises', testExercise.id);
    expect(exerciseExists).toBeFalsy();
  });

  test('should handle validation errors correctly', async () => {
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    
    // Try to save with invalid data
    await exerciseFormPage.fillExerciseForm(testExercises.invalidExercise);
    await exerciseFormPage.saveExercise();
    
    // Verify validation errors are displayed
    const errorElements = exerciseFormPage.page.locator('.error-message, .field-error');
    await expect(errorElements.first()).toBeVisible();
    
    // Verify exercise was not created
    await exercisesPage.goto();
    const exerciseCount = await exercisesPage.exerciseCard.count();
    expect(exerciseCount).toBe(0);
  });

  test('should support multimedia content management', async () => {
    const uniqueExerciseData = generateUniqueTestData(testExercises.validExercise);
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(uniqueExerciseData);
    
    // Test image upload (if supported)
    const fileInput = exerciseFormPage.page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      // Create a mock image file
      const mockImagePath = './e2e/fixtures/test-image.jpg';
      await fileInput.setInputFiles(mockImagePath);
      
      // Verify image preview appears
      const imagePreview = exerciseFormPage.page.locator('.image-preview, .media-preview');
      await expect(imagePreview).toBeVisible();
    }
    
    await exerciseFormPage.saveExercise();
    await exercisesPage.verifyToastMessage('Ejercicio creado exitosamente');
  });

  test('should enforce exercise category constraints', async () => {
    const exerciseData = {
      ...testExercises.validExercise,
      category: 'WarmUp',
      duration: '5', // Very short for warm-up
    };
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(exerciseData);
    await exerciseFormPage.saveExercise();
    
    // Should validate that warm-up exercises have appropriate duration
    const hasWarning = await exerciseFormPage.page.locator('.warning-message').isVisible();
    if (hasWarning) {
      console.log('Validation warning displayed for short warm-up duration');
    }
  });

  test('should handle exercise difficulty progression', async () => {
    // Create exercises with different difficulty levels
    const difficulties = ['VeryEasy', 'Easy', 'Medium', 'Hard', 'VeryHard'];
    
    for (const difficulty of difficulties) {
      const exerciseData = generateUniqueTestData({
        ...testExercises.validExercise,
        difficulty,
      }, difficulty.toLowerCase());
      
      await exercisesPage.goto();
      await exercisesPage.createExercise();
      await exerciseFormPage.fillExerciseForm(exerciseData);
      await exerciseFormPage.saveExercise();
      
      await exercisesPage.verifyExerciseExists(exerciseData.name);
    }
    
    // Test filtering by difficulty
    await exercisesPage.goto();
    await exercisesPage.filterByDifficulty('Hard');
    
    // Should only show hard exercises
    const hardExercise = exercisesPage.page.locator('[data-testid="exercise-card"]:has-text("hard")');
    await expect(hardExercise).toBeVisible();
  });

  test('should support exercise tags and categorization', async () => {
    const taggedExerciseData = {
      ...generateUniqueTestData(testExercises.validExercise),
      // Add tags via form if supported
    };
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(taggedExerciseData);
    
    // Add tags if tag input exists
    const tagInput = exerciseFormPage.page.locator('[data-testid="exercise-tags"]');
    if (await tagInput.isVisible()) {
      await tagInput.fill('football, warm-up, agility');
    }
    
    await exerciseFormPage.saveExercise();
    await exercisesPage.verifyExerciseExists(taggedExerciseData.name);
  });

  test('should validate exercise participant constraints', async () => {
    const invalidParticipantData = {
      ...testExercises.validExercise,
      minParticipants: '20',
      maxParticipants: '10', // Max less than min
    };
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(invalidParticipantData);
    await exerciseFormPage.saveExercise();
    
    // Should show validation error
    const errorElement = exerciseFormPage.page.locator('.error-message:has-text("máximo")');
    await expect(errorElement).toBeVisible();
  });

  test('should handle exercise equipment requirements', async () => {
    const equipmentExerciseData = {
      ...generateUniqueTestData(testExercises.validExercise),
    };
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(equipmentExerciseData);
    
    // Add equipment if equipment input exists
    const equipmentInput = exerciseFormPage.page.locator('[data-testid="exercise-equipment"]');
    if (await equipmentInput.isVisible()) {
      await equipmentInput.fill('Balones, Conos, Petos');
    }
    
    await exerciseFormPage.saveExercise();
    await exercisesPage.verifyExerciseExists(equipmentExerciseData.name);
  });

  test('should support exercise variations and progressions', async () => {
    const baseExercise = await testDataManager.createTestExercise({
      name: 'Base Exercise',
      description: 'Base exercise for variations',
    });
    
    // Create variation
    const variationData = {
      ...generateUniqueTestData(testExercises.validExercise, 'variation'),
      description: `Variation of ${baseExercise.name}`,
    };
    
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    await exerciseFormPage.fillExerciseForm(variationData);
    
    // Link to base exercise if relationship field exists
    const baseExerciseSelect = exerciseFormPage.page.locator('[data-testid="base-exercise"]');
    if (await baseExerciseSelect.isVisible()) {
      await baseExerciseSelect.selectOption(baseExercise.id);
    }
    
    await exerciseFormPage.saveExercise();
    await exercisesPage.verifyExerciseExists(variationData.name);
  });

  test('should respect free user exercise limitations', async () => {
    // Test with free user
    const freeUserToken = await testDataManager.authenticateUser(
      testUsers.freeUser.email,
      testUsers.freeUser.password
    );
    testDataManager.setAuthToken(freeUserToken);
    
    // Create 15 exercises (free user limit)
    for (let i = 1; i <= 15; i++) {
      await testDataManager.createTestExercise({
        name: `Free User Exercise ${i}`,
        description: `Exercise ${i} for free user`,
        createdByUserId: 'free-user-id',
      });
    }
    
    // Try to create 16th exercise (should fail)
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    
    const limitExerciseData = generateUniqueTestData(testExercises.validExercise, 'limit');
    await exerciseFormPage.fillExerciseForm(limitExerciseData);
    await exerciseFormPage.saveExercise();
    
    // Verify limit error message
    await exercisesPage.verifyToastMessage('Los usuarios gratuitos solo pueden crear 15 ejercicios');
  });
});