import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../utils/test-data-manager';
import { TeamsPage, TeamFormPage, LoginPage } from '../../utils/page-objects';
import { testTeams, testUsers, performanceThresholds, generateUniqueTestData } from '../../fixtures/test-data';

test.describe('Teams CRUD Operations', () => {
  let testDataManager: TestDataManager;
  let loginPage: LoginPage;
  let teamsPage: TeamsPage;
  let teamFormPage: TeamFormPage;
  let authToken: string;

  test.beforeEach(async ({ page }) => {
    testDataManager = new TestDataManager();
    loginPage = new LoginPage(page);
    teamsPage = new TeamsPage(page);
    teamFormPage = new TeamFormPage(page);

    // Authenticate as coach user
    authToken = await testDataManager.authenticateUser(
      testUsers.coachUser.email,
      testUsers.coachUser.password
    );
    testDataManager.setAuthToken(authToken);

    // Navigate to login and authenticate
    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
  });

  test.afterEach(async () => {
    // Clean up test data
    await testDataManager.cleanupTestData();
  });

  test('should create a new team successfully', async () => {
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    
    // Navigate to teams page
    await teamsPage.goto();
    
    // Start performance measurement
    const startTime = Date.now();
    
    // Create team
    await teamsPage.createTeam();
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Measure performance
    const createDuration = Date.now() - startTime;
    expect(createDuration).toBeLessThan(performanceThresholds.create);
    
    // Verify team appears in UI
    await teamsPage.verifyTeamExists(uniqueTeamData.name);
    
    // Verify team exists in database
    await teamsPage.goto(); // Refresh to ensure data persistence
    await teamsPage.verifyTeamExists(uniqueTeamData.name);
    
    // Verify success message
    await teamsPage.verifyToastMessage('Equipo creado exitosamente');
  });

  test('should read/display teams correctly', async () => {
    // Create test team via API
    const testTeam = await testDataManager.createTestTeam({
      name: 'API Created Team',
      createdByUserId: 'test-user-id',
    });
    
    const startTime = Date.now();
    
    // Navigate to teams page and verify team is displayed
    await teamsPage.goto();
    
    const readDuration = Date.now() - startTime;
    expect(readDuration).toBeLessThan(performanceThresholds.read);
    
    // Verify team is displayed
    await teamsPage.verifyTeamExists(testTeam.name);
    
    // Test search functionality
    await teamsPage.searchTeam(testTeam.name);
    await teamsPage.verifyTeamExists(testTeam.name);
    
    // Test team details
    await teamsPage.clickTeam(testTeam.name);
    await expect(teamsPage.page).toHaveURL(/\/teams\/.*$/);
  });

  test('should update team information successfully', async () => {
    // Create test team
    const testTeam = await testDataManager.createTestTeam({
      name: 'Team to Update',
      createdByUserId: 'test-user-id',
    });
    
    await teamsPage.goto();
    await teamsPage.clickTeam(testTeam.name);
    
    const startTime = Date.now();
    
    // Update team
    await teamFormPage.fillTeamForm(testTeams.updateTeam);
    await teamFormPage.saveTeam();
    
    const updateDuration = Date.now() - startTime;
    expect(updateDuration).toBeLessThan(performanceThresholds.update);
    
    // Verify update success
    await teamsPage.verifyToastMessage('Equipo actualizado exitosamente');
    
    // Verify changes persisted
    await teamsPage.goto();
    await teamsPage.verifyTeamExists(testTeams.updateTeam.name);
    
    // Verify in database
    const updatedTeam = await testDataManager.verifyDataInDatabase('teams', testTeam.id);
    expect(updatedTeam).toBeTruthy();
  });

  test('should delete team successfully', async () => {
    // Create test team
    const testTeam = await testDataManager.createTestTeam({
      name: 'Team to Delete',
      createdByUserId: 'test-user-id',
    });
    
    await teamsPage.goto();
    await teamsPage.clickTeam(testTeam.name);
    
    const startTime = Date.now();
    
    // Delete team
    await teamFormPage.deleteTeam();
    
    const deleteDuration = Date.now() - startTime;
    expect(deleteDuration).toBeLessThan(performanceThresholds.delete);
    
    // Verify deletion success
    await teamsPage.verifyToastMessage('Equipo eliminado exitosamente');
    
    // Verify team no longer exists in UI
    await teamsPage.verifyTeamNotExists(testTeam.name);
    
    // Verify team no longer exists in database
    const teamExists = await testDataManager.verifyDataInDatabase('teams', testTeam.id);
    expect(teamExists).toBeFalsy();
  });

  test('should handle validation errors correctly', async () => {
    await teamsPage.goto();
    await teamsPage.createTeam();
    
    // Try to save with invalid data
    await teamFormPage.fillTeamForm(testTeams.invalidTeam);
    await teamFormPage.saveTeam();
    
    // Verify validation errors are displayed
    await teamFormPage.verifyFormErrors();
    
    // Verify team was not created
    await teamsPage.goto();
    const teamCount = await teamsPage.getTeamCount();
    expect(teamCount).toBe(0);
  });

  test('should handle network errors gracefully', async ({ context }) => {
    // Simulate network failure
    await context.setOffline(true);
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Verify error message is displayed
    await teamsPage.verifyToastMessage('Error de conexión');
    
    // Restore connection
    await context.setOffline(false);
  });

  test('should validate business rules', async () => {
    // Test maximum players validation
    const invalidTeamData = {
      ...testTeams.validTeam,
      maxPlayers: '150', // Exceeds reasonable limit
    };
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    await teamFormPage.fillTeamForm(invalidTeamData);
    await teamFormPage.saveTeam();
    
    // Verify validation error
    await teamFormPage.verifyFormErrors();
  });

  test('should support concurrent operations', async ({ context }) => {
    const uniqueTeamData1 = generateUniqueTestData(testTeams.validTeam, 'concurrent1');
    const uniqueTeamData2 = generateUniqueTestData(testTeams.validTeam, 'concurrent2');
    
    // Create two teams simultaneously
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    
    const teamsPage1 = new TeamsPage(page1);
    const teamsPage2 = new TeamsPage(page2);
    const teamFormPage1 = new TeamFormPage(page1);
    const teamFormPage2 = new TeamFormPage(page2);
    
    // Authenticate both pages
    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);
    
    await loginPage1.goto('/login');
    await loginPage1.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    await loginPage2.goto('/login');
    await loginPage2.login(testUsers.coachUser.email, testUsers.coachUser.password);
    
    // Create teams concurrently
    const [result1, result2] = await Promise.all([
      (async () => {
        await teamsPage1.goto();
        await teamsPage1.createTeam();
        await teamFormPage1.fillTeamForm(uniqueTeamData1);
        await teamFormPage1.saveTeam();
        return uniqueTeamData1.name;
      })(),
      (async () => {
        await teamsPage2.goto();
        await teamsPage2.createTeam();
        await teamFormPage2.fillTeamForm(uniqueTeamData2);
        await teamFormPage2.saveTeam();
        return uniqueTeamData2.name;
      })(),
    ]);
    
    // Verify both teams were created
    await teamsPage.goto();
    await teamsPage.verifyTeamExists(result1);
    await teamsPage.verifyTeamExists(result2);
    
    await page1.close();
    await page2.close();
  });

  test('should maintain data consistency during page refresh', async () => {
    // Create team
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    
    await teamsPage.goto();
    await teamsPage.createTeam();
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Refresh page
    await teamsPage.page.reload();
    
    // Verify team still exists
    await teamsPage.verifyTeamExists(uniqueTeamData.name);
  });

  test('should respect subscription tier limitations', async () => {
    // Test with free user
    const freeUserToken = await testDataManager.authenticateUser(
      testUsers.freeUser.email,
      testUsers.freeUser.password
    );
    testDataManager.setAuthToken(freeUserToken);
    
    // Create first team (should succeed)
    const team1Data = generateUniqueTestData(testTeams.validTeam, 'free1');
    await testDataManager.createTestTeam({
      name: team1Data.name,
      createdByUserId: 'free-user-id',
    });
    
    // Try to create second team (should fail for free user)
    await teamsPage.goto();
    await teamsPage.createTeam();
    
    const team2Data = generateUniqueTestData(testTeams.validTeam, 'free2');
    await teamFormPage.fillTeamForm(team2Data);
    await teamFormPage.saveTeam();
    
    // Verify limit error message
    await teamsPage.verifyToastMessage('Los usuarios gratuitos solo pueden crear 1 equipo');
  });
});