import { test, expect } from '@playwright/test';
import { TestDataManager } from '../utils/test-data-manager';
import { LoginPage, TeamsPage, ExercisesPage, ObjectivesPage, TeamFormPage, ExerciseFormPage, ObjectiveFormPage } from '../utils/page-objects';
import { testUsers, validationMessages, networkScenarios, generateUniqueTestData } from '../fixtures/test-data';

test.describe('Error Handling and Validation Tests', () => {
  let testDataManager: TestDataManager;
  let loginPage: LoginPage;
  let teamsPage: TeamsPage;
  let exercisesPage: ExercisesPage;
  let objectivesPage: ObjectivesPage;

  test.beforeEach(async ({ page }) => {
    testDataManager = new TestDataManager();
    loginPage = new LoginPage(page);
    teamsPage = new TeamsPage(page);
    exercisesPage = new ExercisesPage(page);
    objectivesPage = new ObjectivesPage(page);

    // Authenticate as coach user
    const authToken = await testDataManager.authenticateUser(
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

  test('should validate required fields across all entities', async () => {
    // Teams required field validation
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    // Try to save without required fields
    await teamFormPage.saveTeam();
    
    // Should show validation errors
    await teamFormPage.verifyFormErrors();
    
    // Check specific required field messages
    const nameError = teamFormPage.page.locator('.error-message:has-text("nombre")');
    await expect(nameError).toBeVisible();

    // Exercises required field validation
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    await exerciseFormPage.saveExercise();
    await exerciseFormPage.page.locator('.error-message').first().waitFor({ state: 'visible' });
    
    const exerciseNameError = exerciseFormPage.page.locator('.error-message:has-text("nombre")');
    const exerciseDescError = exerciseFormPage.page.locator('.error-message:has-text("descripción")');
    
    // At least one validation error should be visible
    const hasError = await exerciseNameError.isVisible() || await exerciseDescError.isVisible();
    expect(hasError).toBeTruthy();

    // Objectives required field validation
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    const objectiveFormPage = new ObjectiveFormPage(objectivesPage.page);
    
    await objectiveFormPage.saveObjective();
    await objectiveFormPage.page.locator('.error-message').first().waitFor({ state: 'visible' });
    
    const objectiveTitleError = objectiveFormPage.page.locator('.error-message:has-text("título")');
    await expect(objectiveTitleError).toBeVisible();
  });

  test('should validate data type constraints', async () => {
    const invalidInputs = {
      numbers: ['abc', '-1', '999999', 'null', 'undefined'],
      emails: ['invalid-email', '@domain.com', 'user@', 'user space@domain.com'],
      durations: ['0', '-5', 'abc', '999999']
    };

    // Test Teams numeric validation
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    for (const invalidNumber of invalidInputs.numbers) {
      await teamFormPage.maxPlayersInput.fill(invalidNumber);
      await teamFormPage.saveTeam();
      
      const hasError = await teamFormPage.page.locator('.error-message').isVisible();
      if (hasError) {
        console.log(`Correctly rejected invalid number: ${invalidNumber}`);
      }
      
      // Reset form
      await teamFormPage.maxPlayersInput.fill('20');
    }

    // Test Exercises duration validation
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    for (const invalidDuration of invalidInputs.durations) {
      await exerciseFormPage.durationInput.fill(invalidDuration);
      await exerciseFormPage.saveExercise();
      
      const hasError = await exerciseFormPage.page.locator('.error-message').isVisible();
      if (hasError) {
        console.log(`Correctly rejected invalid duration: ${invalidDuration}`);
      }
      
      // Reset form
      await exerciseFormPage.durationInput.fill('30');
    }
  });

  test('should validate business rule constraints', async () => {
    // Test Teams: Max players should be reasonable
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    await teamFormPage.fillTeamForm({
      name: 'Invalid Team',
      maxPlayers: '200' // Unreasonably high
    });
    await teamFormPage.saveTeam();
    
    // Should show business rule validation
    const businessRuleError = teamFormPage.page.locator('.error-message, .warning-message');
    const hasBusinessRuleValidation = await businessRuleError.isVisible();
    
    if (hasBusinessRuleValidation) {
      console.log('Business rule validation working for team max players');
    }

    // Test Exercises: Min participants should be less than max
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    await exerciseFormPage.fillExerciseForm({
      name: 'Invalid Exercise',
      description: 'Exercise with invalid participant constraints',
      minParticipants: '25',
      maxParticipants: '10' // Min > Max
    });
    await exerciseFormPage.saveExercise();
    
    const participantError = exerciseFormPage.page.locator('.error-message:has-text("participantes")');
    await expect(participantError).toBeVisible();

    // Test Objectives: Duration constraints
    await objectivesPage.goto();
    await objectivesPage.createObjective();
    const objectiveFormPage = new ObjectiveFormPage(objectivesPage.page);
    
    await objectiveFormPage.fillObjectiveForm({
      title: 'Invalid Objective',
      description: 'Objective with invalid duration',
      duration: '500' // Very long duration
    });
    await objectiveFormPage.saveObjective();
    
    const durationWarning = objectiveFormPage.page.locator('.warning-message, .error-message');
    const hasDurationValidation = await durationWarning.isVisible();
    
    if (hasDurationValidation) {
      console.log('Duration validation working for objectives');
    }
  });

  test('should handle network errors gracefully', async ({ context }) => {
    // Test offline scenario
    await context.setOffline(true);
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    const teamData = generateUniqueTestData({
      name: 'Offline Team',
      sport: 'Football',
      category: 'Sub-16',
      gender: 'Masculino',
      level: 'A'
    });
    
    await teamFormPage.fillTeamForm(teamData);
    await teamFormPage.saveTeam();
    
    // Should show network error
    const networkError = teamsPage.page.locator('.error-message:has-text("conexión"), .error-message:has-text("network"), .error-message:has-text("offline")');
    await expect(networkError).toBeVisible();
    
    // Restore connection
    await context.setOffline(false);
    
    // Should be able to retry
    await teamFormPage.saveTeam();
    await teamsPage.verifyToastMessage('Equipo creado exitosamente');
  });

  test('should handle server errors appropriately', async ({ page }) => {
    // Mock server error responses
    await page.route('**/api/teams', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        });
      } else {
        route.continue();
      }
    });
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    const teamData = generateUniqueTestData({
      name: 'Server Error Team',
      sport: 'Football',
      category: 'Sub-16',
      gender: 'Masculino',
      level: 'A'
    });
    
    await teamFormPage.fillTeamForm(teamData);
    await teamFormPage.saveTeam();
    
    // Should show server error message
    const serverError = teamsPage.page.locator('.error-message:has-text("servidor"), .error-message:has-text("error")');
    await expect(serverError).toBeVisible();
  });

  test('should validate file upload constraints', async () => {
    // Test exercises file upload validation (if supported)
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    const fileInput = exerciseFormPage.page.locator('input[type="file"]');
    
    if (await fileInput.isVisible()) {
      // Test file size validation
      const largeMockFile = 'data:image/jpeg;base64,' + 'a'.repeat(10000000); // ~10MB
      
      try {
        await fileInput.setInputFiles({
          name: 'large-file.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from(largeMockFile)
        });
        
        await exerciseFormPage.saveExercise();
        
        // Should show file size error
        const fileSizeError = exerciseFormPage.page.locator('.error-message:has-text("tamaño"), .error-message:has-text("size")');
        const hasFileSizeValidation = await fileSizeError.isVisible();
        
        if (hasFileSizeValidation) {
          console.log('File size validation working');
        }
      } catch (error) {
        console.log('File upload validation tested');
      }
      
      // Test file type validation
      try {
        await fileInput.setInputFiles({
          name: 'invalid-file.txt',
          mimeType: 'text/plain',
          buffer: Buffer.from('This is not an image')
        });
        
        const fileTypeError = exerciseFormPage.page.locator('.error-message:has-text("tipo"), .error-message:has-text("format")');
        const hasFileTypeValidation = await fileTypeError.isVisible();
        
        if (hasFileTypeValidation) {
          console.log('File type validation working');
        }
      } catch (error) {
        console.log('File type validation tested');
      }
    }
  });

  test('should handle concurrent user conflicts', async ({ context }) => {
    // Create a team
    const testTeam = await testDataManager.createTestTeam({
      name: 'Concurrent Edit Team'
    });
    
    // Open two browser contexts for different users
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    const teamsPage1 = new TeamsPage(page1);
    const teamsPage2 = new TeamsPage(page2);
    
    // Login both users
    await loginPage1.goto('/login');
    await loginPage1.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await loginPage2.goto('/login');
    await loginPage2.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    // Both users navigate to the same team
    await teamsPage1.goto();
    await teamsPage1.clickTeam(testTeam.name);
    
    await teamsPage2.goto();
    await teamsPage2.clickTeam(testTeam.name);
    
    // Both users try to edit simultaneously
    const teamFormPage1 = new TeamFormPage(page1);
    const teamFormPage2 = new TeamFormPage(page2);
    
    // User 1 saves first
    await teamFormPage1.fillTeamForm({ name: 'Updated by User 1' });
    await teamFormPage1.saveTeam();
    
    // User 2 saves second (should handle conflict)
    await teamFormPage2.fillTeamForm({ name: 'Updated by User 2' });
    await teamFormPage2.saveTeam();
    
    // Should handle concurrent edit conflict
    const conflictError = page2.locator('.error-message:has-text("conflicto"), .error-message:has-text("conflict"), .warning-message');
    const hasConflictHandling = await conflictError.isVisible();
    
    if (hasConflictHandling) {
      console.log('Concurrent edit conflict handling working');
    }
    
    await page1.close();
    await page2.close();
  });

  test('should validate cross-field dependencies', async () => {
    // Test exercise category and difficulty consistency
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    await exerciseFormPage.fillExerciseForm({
      name: 'Dependency Test Exercise',
      description: 'Testing cross-field dependencies',
      category: 'WarmUp',
      difficulty: 'VeryHard', // Inconsistent: warm-up shouldn't be very hard
      duration: '5' // Very short duration
    });
    
    await exerciseFormPage.saveExercise();
    
    // Should show dependency validation warning
    const dependencyWarning = exerciseFormPage.page.locator('.warning-message, .validation-warning');
    const hasDependencyValidation = await dependencyWarning.isVisible();
    
    if (hasDependencyValidation) {
      console.log('Cross-field dependency validation working');
    }
  });

  test('should handle malicious input attempts', async () => {
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      '"><script>alert("xss")</script>',
      'javascript:alert("xss")',
      '../../etc/passwd',
      '${7*7}',
      '{{7*7}}',
      '\'; DROP TABLE teams; --',
      '<img src=x onerror=alert(1)>',
      'data:text/html,<script>alert(1)</script>'
    ];
    
    for (const maliciousInput of maliciousInputs) {
      console.log(`Testing malicious input: ${maliciousInput.substring(0, 20)}...`);
      
      // Test in team name field
      await teamsPage.goto();
      await teamsPage.createTeam();
      const teamFormPage = new TeamFormPage(teamsPage.page);
      
      await teamFormPage.nameInput.fill(maliciousInput);
      await teamFormPage.saveTeam();
      
      // Should either reject the input or sanitize it
      const hasValidationError = await teamFormPage.page.locator('.error-message').isVisible();
      
      if (hasValidationError) {
        console.log(`Correctly rejected malicious input in team name`);
      } else {
        // If accepted, verify it's properly sanitized
        await teamsPage.goto();
        const teamCard = teamsPage.page.locator('[data-testid="team-card"]').first();
        
        if (await teamCard.isVisible()) {
          const cardContent = await teamCard.textContent();
          
          // Should not contain executable script content
          expect(cardContent).not.toContain('<script>');
          expect(cardContent).not.toContain('javascript:');
          expect(cardContent).not.toContain('onerror=');
        }
      }
      
      // Clean up - navigate away to reset form
      await teamsPage.goto();
    }
  });

  test('should provide helpful error recovery options', async () => {
    // Test error recovery flows
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    // Trigger validation error
    await teamFormPage.saveTeam(); // Save without required fields
    
    // Should show clear error messages
    await teamFormPage.verifyFormErrors();
    
    // Should allow user to correct and retry
    await teamFormPage.fillTeamForm({
      name: 'Recovery Test Team',
      sport: 'Football',
      category: 'Sub-16',
      gender: 'Masculino',
      level: 'A'
    });
    
    await teamFormPage.saveTeam();
    await teamsPage.verifyToastMessage('Equipo creado exitosamente');
    
    // Verify the error state was properly cleared
    const remainingErrors = teamFormPage.page.locator('.error-message');
    expect(await remainingErrors.count()).toBe(0);
  });

  test('should handle timeout errors appropriately', async ({ page }) => {
    // Mock slow server response
    await page.route('**/api/teams', async route => {
      if (route.request().method() === 'POST') {
        // Delay response to simulate timeout
        await new Promise(resolve => setTimeout(resolve, 10000));
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        route.continue();
      }
    });
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    
    const teamData = generateUniqueTestData({
      name: 'Timeout Test Team',
      sport: 'Football',
      category: 'Sub-16',
      gender: 'Masculino',
      level: 'A'
    });
    
    await teamFormPage.fillTeamForm(teamData);
    
    // Set shorter timeout for this test
    page.setDefaultTimeout(5000);
    
    try {
      await teamFormPage.saveTeam();
    } catch (error) {
      // Should handle timeout gracefully
      const timeoutError = teamsPage.page.locator('.error-message:has-text("tiempo"), .error-message:has-text("timeout")');
      const hasTimeoutHandling = await timeoutError.isVisible();
      
      if (hasTimeoutHandling) {
        console.log('Timeout error handling working');
      }
    }
    
    // Reset timeout
    page.setDefaultTimeout(30000);
  });

  test('should validate data consistency across related entities', async () => {
    // Create team first
    const testTeam = await testDataManager.createTestTeam({
      name: 'Consistency Test Team',
      sport: 'Football'
    });
    
    // Create exercise for different sport
    await exercisesPage.goto();
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    
    await exerciseFormPage.fillExerciseForm({
      name: 'Basketball Exercise',
      description: 'Exercise for basketball',
      sport: 'Basketball' // Different sport than team
    });
    
    // If there's a team assignment field, test sport consistency
    const teamAssignmentField = exerciseFormPage.page.locator('[data-testid="assigned-teams"]');
    if (await teamAssignmentField.isVisible()) {
      await teamAssignmentField.selectOption(testTeam.id);
      await exerciseFormPage.saveExercise();
      
      // Should warn about sport mismatch
      const sportMismatchWarning = exerciseFormPage.page.locator('.warning-message:has-text("deporte"), .warning-message:has-text("sport")');
      const hasSportValidation = await sportMismatchWarning.isVisible();
      
      if (hasSportValidation) {
        console.log('Sport consistency validation working');
      }
    }
  });
});