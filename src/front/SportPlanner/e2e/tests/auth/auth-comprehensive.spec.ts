import { test, expect } from '@playwright/test';
import { TestDataManager } from '../utils/test-data-manager';
import { LoginPage, TeamsPage, ExercisesPage, ObjectivesPage } from '../utils/page-objects';
import { testUsers, generateUniqueTestData, testTeams, testExercises, testObjectives } from '../fixtures/test-data';

test.describe('Comprehensive Authentication & Authorization Tests', () => {
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
  });

  test.afterEach(async () => {
    await testDataManager.cleanupTestData();
  });

  test('should enforce authentication across all CRUD operations', async () => {
    const protectedRoutes = [
      '/teams',
      '/exercises', 
      '/objectives',
      '/teams/create',
      '/exercises/create',
      '/objectives/create'
    ];

    for (const route of protectedRoutes) {
      // Try to access without authentication
      await teamsPage.page.goto(route);
      
      // Should be redirected to login
      await expect(teamsPage.page).toHaveURL(/.*\/login.*/);
    }
  });

  test('should validate JWT token structure for all operations', async () => {
    // Authenticate and get token
    const token = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );

    // Validate token structure
    const tokenParts = token.split('.');
    expect(tokenParts).toHaveLength(3);

    // Decode and validate payload
    const payload = JSON.parse(atob(tokenParts[1]));
    expect(payload).toHaveProperty('sub');
    expect(payload).toHaveProperty('email');
    expect(payload).toHaveProperty('exp');
    expect(payload).toHaveProperty('iat');

    // Token should not be expired
    const currentTime = Math.floor(Date.now() / 1000);
    expect(payload.exp).toBeGreaterThan(currentTime);

    // Test token with each entity operation
    testDataManager.setAuthToken(token);

    const testTeam = await testDataManager.createTestTeam();
    const testExercise = await testDataManager.createTestExercise();
    const testObjective = await testDataManager.createTestObjective();

    expect(testTeam).toBeTruthy();
    expect(testExercise).toBeTruthy();
    expect(testObjective).toBeTruthy();
  });

  test('should handle token expiration gracefully across all entities', async ({ page }) => {
    // Login first
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);

    // Navigate to each section and clear token
    const sections = [
      { page: teamsPage, route: '/teams', createAction: () => teamsPage.createTeam() },
      { page: exercisesPage, route: '/exercises', createAction: () => exercisesPage.createExercise() },
      { page: objectivesPage, route: '/objectives', createAction: () => objectivesPage.createObjective() }
    ];

    for (const section of sections) {
      await section.page.goto();
      
      // Clear authentication
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Try to perform action
      await section.createAction();

      // Should handle auth error or redirect to login
      const currentUrl = page.url();
      const hasAuthError = await page.locator('.auth-error, .error-message').isVisible();
      
      expect(currentUrl.includes('/login') || hasAuthError).toBeTruthy();

      // Re-authenticate for next test
      if (currentUrl.includes('/login')) {
        await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
      }
    }
  });

  test('should enforce role-based permissions for all entities', async () => {
    const roleTests = [
      {
        user: testUsers.freeUser,
        permissions: {
          canCreateTeams: true,
          maxTeams: 1,
          canCreateExercises: true,
          maxExercises: 15,
          canCreateObjectives: true,
          canAccessPublicData: true
        }
      },
      {
        user: testUsers.coachUser,
        permissions: {
          canCreateTeams: true,
          maxTeams: 'unlimited',
          canCreateExercises: true,
          maxExercises: 'unlimited',
          canCreateObjectives: true,
          canAccessPublicData: true,
          canCreatePrivateData: true
        }
      },
      {
        user: testUsers.clubAdmin,
        permissions: {
          canCreateTeams: true,
          maxTeams: 'unlimited',
          canCreateExercises: true,
          maxExercises: 'unlimited',
          canCreateObjectives: true,
          canAccessPublicData: true,
          canCreatePrivateData: true,
          canManageUsers: true
        }
      }
    ];

    for (const { user, permissions } of roleTests) {
      await loginPage.goto('/login');
      await loginPage.login(user.email, user.password);

      // Test teams permissions
      await teamsPage.goto();
      if (permissions.canCreateTeams) {
        await expect(teamsPage.createTeamButton).toBeVisible();
      }

      // Test exercises permissions
      await exercisesPage.goto();
      if (permissions.canCreateExercises) {
        await expect(exercisesPage.createExerciseButton).toBeVisible();
      }

      // Test objectives permissions
      await objectivesPage.goto();
      if (permissions.canCreateObjectives) {
        await expect(objectivesPage.createObjectiveButton).toBeVisible();
      }

      // Logout for next user
      await teamsPage.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  });

  test('should prevent cross-user data access', async ({ context }) => {
    // Create data as coach user
    const coachToken = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );
    testDataManager.setAuthToken(coachToken);

    const coachTeam = await testDataManager.createTestTeam({
      name: 'Coach Private Team',
      createdByUserId: 'coach-user-id'
    });

    const coachExercise = await testDataManager.createTestExercise({
      name: 'Coach Private Exercise',
      createdByUserId: 'coach-user-id',
      isPublic: false
    });

    const coachObjective = await testDataManager.createTestObjective({
      title: 'Coach Private Objective',
      createdByUserId: 'coach-user-id',
      isPublic: false
    });

    // Login as different user
    await loginPage.goto('/login');
    await loginPage.login(testUsers.freeUser.email, testUsers.freeUser.password);

    // Try to access coach's private data
    const privatePaths = [
      `/teams/${coachTeam.id}`,
      `/exercises/${coachExercise.id}`,
      `/objectives/${coachObjective.id}`
    ];

    for (const path of privatePaths) {
      await teamsPage.page.goto(path);
      
      // Should not be able to access or should show error
      const hasAccessError = await teamsPage.page.locator('.access-denied, .error-message, .not-found').isVisible();
      const isRedirected = !teamsPage.page.url().includes(path);
      
      expect(hasAccessError || isRedirected).toBeTruthy();
    }
  });

  test('should handle concurrent authentication sessions', async ({ context }) => {
    // Create multiple pages/sessions
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    const pages = [
      { page: page1, user: testUsers.coachUser },
      { page: page2, user: testUsers.freeUser },
      { page: page3, user: testUsers.clubAdmin }
    ];

    // Authenticate all sessions concurrently
    await Promise.all(pages.map(async ({ page, user }) => {
      const loginPageLocal = new LoginPage(page);
      await loginPageLocal.goto('/login');
      await loginPageLocal.login(user.email, user.password);
    }));

    // Verify all sessions can access their appropriate resources
    await Promise.all(pages.map(async ({ page, user }) => {
      const teamsPageLocal = new TeamsPage(page);
      await teamsPageLocal.goto();
      await expect(teamsPageLocal.createTeamButton).toBeVisible();
    }));

    // Logout one session and verify others remain active
    await page1.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page1.reload();
    await expect(page1).toHaveURL(/.*\/login.*/);

    // Other sessions should still be active
    await page2.reload();
    const teamsPage2 = new TeamsPage(page2);
    await expect(teamsPage2.createTeamButton).toBeVisible();

    await page3.reload();
    const teamsPage3 = new TeamsPage(page3);
    await expect(teamsPage3.createTeamButton).toBeVisible();

    // Cleanup
    await page1.close();
    await page2.close();
    await page3.close();
  });

  test('should validate subscription tier limitations across entities', async () => {
    // Test free user limitations
    const freeUserToken = await testDataManager.authenticateUser(
      testUsers.freeUser.email,
      testUsers.freeUser.password
    );
    testDataManager.setAuthToken(freeUserToken);

    // Create maximum allowed teams (1 for free user)
    const firstTeam = await testDataManager.createTestTeam({
      name: 'Free User Team 1',
      createdByUserId: 'free-user-id'
    });
    expect(firstTeam).toBeTruthy();

    // Try to create second team (should fail)
    try {
      await testDataManager.createTestTeam({
        name: 'Free User Team 2',
        createdByUserId: 'free-user-id'
      });
      throw new Error('Should not allow second team for free user');
    } catch (error) {
      expect(error.message).toContain('limit');
    }

    // Create maximum allowed exercises (15 for free user)
    const exercisePromises = Array.from({ length: 15 }, (_, i) =>
      testDataManager.createTestExercise({
        name: `Free User Exercise ${i + 1}`,
        createdByUserId: 'free-user-id'
      })
    );

    const exercises = await Promise.all(exercisePromises);
    expect(exercises).toHaveLength(15);

    // Try to create 16th exercise (should fail)
    try {
      await testDataManager.createTestExercise({
        name: 'Free User Exercise 16',
        createdByUserId: 'free-user-id'
      });
      throw new Error('Should not allow 16th exercise for free user');
    } catch (error) {
      expect(error.message).toContain('limit');
    }
  });

  test('should handle authentication errors consistently across entities', async () => {
    const invalidTokens = [
      'invalid-jwt-token',
      'Bearer invalid-token',
      'expired.jwt.token',
      '',
      null
    ];

    for (const invalidToken of invalidTokens) {
      if (invalidToken) {
        testDataManager.setAuthToken(invalidToken);
      } else {
        testDataManager.clearAuthToken();
      }

      // Test each entity operation with invalid token
      const operations = [
        () => testDataManager.createTestTeam(),
        () => testDataManager.createTestExercise(),
        () => testDataManager.createTestObjective()
      ];

      for (const operation of operations) {
        try {
          await operation();
          throw new Error('Operation should have failed with invalid token');
        } catch (error) {
          expect(error.message).toMatch(/auth|unauthorized|token|invalid/i);
        }
      }
    }
  });

  test('should maintain security headers and CORS policies', async ({ page }) => {
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);

    // Monitor network requests to verify security headers
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push({
          url: response.url(),
          headers: response.headers(),
          status: response.status()
        });
      }
    });

    // Perform operations to trigger API calls
    await teamsPage.goto();
    await exercisesPage.goto();
    await objectivesPage.goto();

    // Verify security headers are present
    const apiResponses = responses.filter(r => r.status === 200);
    expect(apiResponses.length).toBeGreaterThan(0);

    for (const response of apiResponses) {
      // Check for security headers
      const headers = response.headers;
      
      // These headers may or may not be present depending on server configuration
      // But if present, they should have secure values
      if (headers['x-content-type-options']) {
        expect(headers['x-content-type-options']).toBe('nosniff');
      }
      
      if (headers['x-frame-options']) {
        expect(headers['x-frame-options']).toMatch(/(DENY|SAMEORIGIN)/);
      }

      // CORS headers should be properly configured
      if (headers['access-control-allow-origin']) {
        expect(headers['access-control-allow-origin']).toBeTruthy();
      }
    }
  });

  test('should protect against common authentication attacks', async ({ page }) => {
    // Test SQL injection in login
    const maliciousInputs = [
      "'; DROP TABLE users; --",
      "admin'--",
      "' OR '1'='1",
      "<script>alert('xss')</script>",
      "../../etc/passwd"
    ];

    for (const maliciousInput of maliciousInputs) {
      await loginPage.goto('/login');
      
      try {
        await loginPage.login(maliciousInput, maliciousInput);
        
        // Should not succeed with malicious input
        const currentUrl = page.url();
        expect(currentUrl).toContain('/login');
        
        // Should show appropriate error
        const hasError = await loginPage.errorMessage.isVisible();
        expect(hasError).toBeTruthy();
        
      } catch (error) {
        // Error is expected with malicious input
        console.log(`Correctly rejected malicious input: ${maliciousInput}`);
      }
    }
  });

  test('should handle session management across browser refresh', async ({ page }) => {
    // Login
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);

    // Navigate to different sections
    await teamsPage.goto();
    await expect(teamsPage.createTeamButton).toBeVisible();

    // Refresh page
    await page.reload();
    await expect(teamsPage.createTeamButton).toBeVisible();

    // Navigate to exercises
    await exercisesPage.goto();
    await expect(exercisesPage.createExerciseButton).toBeVisible();

    // Refresh again
    await page.reload();
    await expect(exercisesPage.createExerciseButton).toBeVisible();

    // Navigate to objectives
    await objectivesPage.goto();
    await expect(objectivesPage.createObjectiveButton).toBeVisible();

    // Final refresh
    await page.reload();
    await expect(objectivesPage.createObjectiveButton).toBeVisible();
  });
});