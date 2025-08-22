import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../utils/test-data-manager';
import { TeamsPage, TeamFormPage, LoginPage } from '../../utils/page-objects';
import { testTeams, testUsers, generateUniqueTestData } from '../../fixtures/test-data';

test.describe('Teams Authentication & Authorization', () => {
  let testDataManager: TestDataManager;
  let loginPage: LoginPage;
  let teamsPage: TeamsPage;
  let teamFormPage: TeamFormPage;

  test.beforeEach(async ({ page }) => {
    testDataManager = new TestDataManager();
    loginPage = new LoginPage(page);
    teamsPage = new TeamsPage(page);
    teamFormPage = new TeamFormPage(page);
  });

  test.afterEach(async () => {
    await testDataManager.cleanupTestData();
  });

  test('should redirect unauthenticated users to login', async () => {
    // Try to access teams page without authentication
    await teamsPage.goto();
    
    // Should be redirected to login
    await expect(teamsPage.page).toHaveURL(/.*\/login.*/);
  });

  test('should allow authenticated users to access teams', async () => {
    // Login as coach user
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    // Navigate to teams page
    await teamsPage.goto();
    
    // Should be able to access teams page
    await expect(teamsPage.page).toHaveURL(/.*\/teams.*/);
    await expect(teamsPage.createTeamButton).toBeVisible();
  });

  test('should handle token expiration gracefully', async ({ page }) => {
    // Login first
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await teamsPage.goto();
    
    // Simulate token expiration by clearing localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Try to create a team (should prompt for re-authentication)
    await teamsPage.createTeam();
    
    // Should be redirected to login or show auth error
    const currentUrl = page.url();
    const hasAuthError = await page.locator('.auth-error, .error-message').isVisible();
    
    expect(currentUrl.includes('/login') || hasAuthError).toBeTruthy();
  });

  test('should enforce role-based permissions for team creation', async () => {
    // Test with different user roles
    const userTests = [
      { user: testUsers.freeUser, canCreate: true, hasLimits: true },
      { user: testUsers.coachUser, canCreate: true, hasLimits: false },
      { user: testUsers.clubAdmin, canCreate: true, hasLimits: false },
    ];

    for (const { user, canCreate } of userTests) {
      await loginPage.goto('/login');
      await loginPage.login(user.email, user.password);
      
      await teamsPage.goto();
      
      if (canCreate) {
        await expect(teamsPage.createTeamButton).toBeVisible();
      } else {
        await expect(teamsPage.createTeamButton).not.toBeVisible();
      }
      
      // Logout
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  });

  test('should prevent users from accessing other users teams', async ({ context }) => {
    // Create team as coach user
    const coachToken = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );
    testDataManager.setAuthToken(coachToken);
    
    const coachTeam = await testDataManager.createTestTeam({
      name: 'Coach Private Team',
      createdByUserId: 'coach-user-id',
    });
    
    // Login as different user (free user)
    await loginPage.goto('/login');
    await loginPage.login(testUsers.freeUser.email, testUsers.freeUser.password);
    
    // Try to access coach's team directly
    await teamsPage.page.goto(`/teams/${coachTeam.id}`);
    
    // Should show access denied or redirect
    const hasAccessError = await teamsPage.page.locator('.access-denied, .error-message').isVisible();
    const isRedirected = !teamsPage.page.url().includes(`/teams/${coachTeam.id}`);
    
    expect(hasAccessError || isRedirected).toBeTruthy();
  });

  test('should handle invalid authentication tokens', async () => {
    // Set invalid token in API client
    testDataManager.setAuthToken('invalid-token-123');
    
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    // Try to create team with invalid API token
    await teamsPage.goto();
    await teamsPage.createTeam();
    
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Should show authentication error
    await teamsPage.verifyToastMessage('Error de autenticación');
  });

  test('should refresh token automatically when near expiration', async ({ page }) => {
    // Login
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await teamsPage.goto();
    
    // Mock token near expiration
    await page.evaluate(() => {
      const mockToken = {
        access_token: 'mock-token',
        expires_at: Date.now() / 1000 + 300, // Expires in 5 minutes
        refresh_token: 'mock-refresh-token'
      };
      localStorage.setItem('supabase.auth.token', JSON.stringify(mockToken));
    });
    
    // Perform operation that should trigger token refresh
    await teamsPage.createTeam();
    
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Operation should succeed (token refreshed automatically)
    await teamsPage.verifyToastMessage('Equipo creado exitosamente');
  });

  test('should maintain session across page reloads', async () => {
    // Login
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await teamsPage.goto();
    
    // Verify user is authenticated
    await expect(teamsPage.createTeamButton).toBeVisible();
    
    // Reload page
    await teamsPage.page.reload();
    
    // Should still be authenticated
    await expect(teamsPage.createTeamButton).toBeVisible();
    
    // Should not be redirected to login
    await expect(teamsPage.page).not.toHaveURL(/.*\/login.*/);
  });

  test('should handle concurrent authentication from multiple tabs', async ({ context }) => {
    // Create two pages (tabs)
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    const teamsPage1 = new TeamsPage(page1);
    const teamsPage2 = new TeamsPage(page2);
    
    // Login on both tabs
    await loginPage1.goto('/login');
    await loginPage1.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await loginPage2.goto('/login');
    await loginPage2.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    // Both should be able to access teams
    await teamsPage1.goto();
    await teamsPage2.goto();
    
    await expect(teamsPage1.createTeamButton).toBeVisible();
    await expect(teamsPage2.createTeamButton).toBeVisible();
    
    // Logout from one tab
    await page1.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page1.reload();
    
    // First tab should be logged out
    await expect(page1).toHaveURL(/.*\/login.*/);
    
    // Second tab should still be authenticated
    await page2.reload();
    await expect(teamsPage2.createTeamButton).toBeVisible();
    
    await page1.close();
    await page2.close();
  });

  test('should validate JWT token format and claims', async () => {
    // Login to get valid token
    const validToken = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );
    
    // Verify token has required claims
    const tokenParts = validToken.split('.');
    expect(tokenParts).toHaveLength(3);
    
    const payload = JSON.parse(atob(tokenParts[1]));
    expect(payload).toHaveProperty('sub'); // Subject (user ID)
    expect(payload).toHaveProperty('exp'); // Expiration
    expect(payload).toHaveProperty('iat'); // Issued at
    expect(payload).toHaveProperty('email');
    
    // Verify token is not expired
    const currentTime = Math.floor(Date.now() / 1000);
    expect(payload.exp).toBeGreaterThan(currentTime);
  });
});