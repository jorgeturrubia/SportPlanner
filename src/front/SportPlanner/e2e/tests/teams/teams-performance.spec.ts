import { test, expect } from '@playwright/test';
import { TestDataManager } from '../../utils/test-data-manager';
import { TeamsPage, TeamFormPage, LoginPage } from '../../utils/page-objects';
import { testTeams, testUsers, performanceThresholds, generateUniqueTestData, networkScenarios } from '../../fixtures/test-data';

test.describe('Teams Performance Tests', () => {
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

    await loginPage.goto('/login');
    await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
  });

  test.afterEach(async () => {
    await testDataManager.cleanupTestData();
  });

  test('should create team within performance threshold', async () => {
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    
    await teamsPage.goto();
    
    // Measure team creation performance
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.createTeam();
      await teamFormPage.fillTeamForm(uniqueTeamData);
      await teamFormPage.saveTeam();
      await teamsPage.verifyToastMessage('Equipo creado exitosamente');
    }, 'Team Creation');
    
    expect(duration).toBeLessThan(performanceThresholds.create);
    console.log(`Team creation took ${duration}ms (threshold: ${performanceThresholds.create}ms)`);
  });

  test('should load teams list within performance threshold', async () => {
    // Create multiple teams for testing
    const testTeams = await Promise.all([
      testDataManager.createTestTeam({ name: 'Performance Test Team 1' }),
      testDataManager.createTestTeam({ name: 'Performance Test Team 2' }),
      testDataManager.createTestTeam({ name: 'Performance Test Team 3' }),
      testDataManager.createTestTeam({ name: 'Performance Test Team 4' }),
      testDataManager.createTestTeam({ name: 'Performance Test Team 5' }),
    ]);
    
    // Measure teams list loading performance
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.goto();
      await teamsPage.waitForElement(teamsPage.teamsList);
    }, 'Teams List Loading');
    
    expect(duration).toBeLessThan(performanceThresholds.read);
    console.log(`Teams list loading took ${duration}ms (threshold: ${performanceThresholds.read}ms)`);
    
    // Verify all teams are displayed
    for (const team of testTeams) {
      await teamsPage.verifyTeamExists(team.name);
    }
  });

  test('should update team within performance threshold', async () => {
    const testTeam = await testDataManager.createTestTeam({
      name: 'Performance Update Team',
    });
    
    await teamsPage.goto();
    await teamsPage.clickTeam(testTeam.name);
    
    // Measure team update performance
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamFormPage.fillTeamForm(testTeams.updateTeam);
      await teamFormPage.saveTeam();
      await teamsPage.verifyToastMessage('Equipo actualizado exitosamente');
    }, 'Team Update');
    
    expect(duration).toBeLessThan(performanceThresholds.update);
    console.log(`Team update took ${duration}ms (threshold: ${performanceThresholds.update}ms)`);
  });

  test('should delete team within performance threshold', async () => {
    const testTeam = await testDataManager.createTestTeam({
      name: 'Performance Delete Team',
    });
    
    await teamsPage.goto();
    await teamsPage.clickTeam(testTeam.name);
    
    // Measure team deletion performance
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamFormPage.deleteTeam();
      await teamsPage.verifyToastMessage('Equipo eliminado exitosamente');
    }, 'Team Deletion');
    
    expect(duration).toBeLessThan(performanceThresholds.delete);
    console.log(`Team deletion took ${duration}ms (threshold: ${performanceThresholds.delete}ms)`);
  });

  test('should handle large teams list efficiently', async () => {
    // Create 50 teams to test pagination/virtualization
    const teamPromises = Array.from({ length: 50 }, (_, i) => 
      testDataManager.createTestTeam({ 
        name: `Bulk Team ${i + 1}`,
      })
    );
    
    await Promise.all(teamPromises);
    
    // Measure performance with large dataset
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.goto();
      await teamsPage.waitForElement(teamsPage.teamsList);
    }, 'Large Teams List Loading');
    
    // Performance should still be reasonable even with many teams
    expect(duration).toBeLessThan(performanceThresholds.read * 2); // Allow 2x threshold for large dataset
    
    // Test search performance with large dataset
    const searchStartTime = Date.now();
    await teamsPage.searchTeam('Bulk Team 25');
    await teamsPage.verifyTeamExists('Bulk Team 25');
    const searchDuration = Date.now() - searchStartTime;
    
    expect(searchDuration).toBeLessThan(1000); // Search should be fast
    console.log(`Search in large dataset took ${searchDuration}ms`);
  });

  test('should perform well under slow network conditions', async ({ context }) => {
    // Simulate slow 3G connection
    await context.route('**/*', async (route) => {
      // Add delay to simulate slow network
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    
    await teamsPage.goto();
    
    // Performance should degrade gracefully under slow network
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.createTeam();
      await teamFormPage.fillTeamForm(uniqueTeamData);
      await teamFormPage.saveTeam();
    }, 'Team Creation (Slow Network)');
    
    // Allow higher threshold for slow network conditions
    expect(duration).toBeLessThan(performanceThresholds.create * 3);
    console.log(`Team creation under slow network took ${duration}ms`);
  });

  test('should handle concurrent team operations efficiently', async ({ context }) => {
    const concurrentTeams = 5;
    const teamPromises: Promise<void>[] = [];
    
    for (let i = 0; i < concurrentTeams; i++) {
      const promise = (async () => {
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        const teamsPage = new TeamsPage(page);
        const teamFormPage = new TeamFormPage(page);
        
        await loginPage.goto('/login');
        await loginPage.login(testUsers.coachUser.email, testUsers.coachUser.password);
        
        const uniqueTeamData = generateUniqueTestData(testTeams.validTeam, `concurrent${i}`);
        
        await teamsPage.goto();
        await teamsPage.createTeam();
        await teamFormPage.fillTeamForm(uniqueTeamData);
        await teamFormPage.saveTeam();
        
        await page.close();
      })();
      
      teamPromises.push(promise);
    }
    
    // Measure concurrent operations performance
    const { duration } = await testDataManager.measurePerformance(async () => {
      await Promise.all(teamPromises);
    }, 'Concurrent Team Creation');
    
    // All operations should complete within reasonable time
    expect(duration).toBeLessThan(performanceThresholds.create * 2);
    console.log(`${concurrentTeams} concurrent team creations took ${duration}ms`);
    
    // Verify all teams were created
    await teamsPage.goto();
    const teamCount = await teamsPage.getTeamCount();
    expect(teamCount).toBeGreaterThanOrEqual(concurrentTeams);
  });

  test('should maintain performance with form validation errors', async () => {
    await teamsPage.goto();
    
    // Test performance when validation errors occur
    const { duration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.createTeam();
      await teamFormPage.fillTeamForm(testTeams.invalidTeam);
      await teamFormPage.saveTeam();
      await teamFormPage.verifyFormErrors();
    }, 'Form Validation Performance');
    
    // Validation should be fast
    expect(duration).toBeLessThan(1000);
    console.log(`Form validation took ${duration}ms`);
  });

  test('should optimize API calls for team operations', async ({ page }) => {
    const apiCalls: string[] = [];
    
    // Monitor API calls
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiCalls.push(`${request.method()} ${request.url()}`);
      }
    });
    
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    
    await teamsPage.goto();
    
    // Clear previous API calls
    apiCalls.length = 0;
    
    await teamsPage.createTeam();
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();
    
    // Verify minimal API calls were made
    console.log('API calls made:', apiCalls);
    
    // Should not make excessive API calls
    expect(apiCalls.length).toBeLessThanOrEqual(5);
    
    // Should have POST call for team creation
    const hasCreateCall = apiCalls.some(call => call.includes('POST') && call.includes('/teams'));
    expect(hasCreateCall).toBeTruthy();
  });

  test('should handle memory efficiently with multiple operations', async () => {
    const initialMemory = await teamsPage.page.evaluate(() => 
      (performance as any).memory?.usedJSHeapSize || 0
    );
    
    // Perform multiple team operations
    for (let i = 0; i < 10; i++) {
      const uniqueTeamData = generateUniqueTestData(testTeams.validTeam, `memory${i}`);
      
      await teamsPage.goto();
      await teamsPage.createTeam();
      await teamFormPage.fillTeamForm(uniqueTeamData);
      await teamFormPage.saveTeam();
      await teamsPage.goto(); // Go back to list
    }
    
    const finalMemory = await teamsPage.page.evaluate(() => 
      (performance as any).memory?.usedJSHeapSize || 0
    );
    
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;
      
      console.log(`Memory usage increased by ${memoryIncreasePercent.toFixed(2)}%`);
      
      // Memory increase should not be excessive
      expect(memoryIncreasePercent).toBeLessThan(200); // Less than 200% increase
    }
  });
});