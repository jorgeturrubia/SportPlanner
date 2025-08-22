import { test, expect } from '@playwright/test';
import { TestDataManager } from '../utils/test-data-manager';
import { LoginPage, TeamsPage, ExercisesPage, ObjectivesPage, TeamFormPage, ExerciseFormPage, ObjectiveFormPage } from '../utils/page-objects';
import { testUsers, performanceThresholds, generateUniqueTestData, testTeams, testExercises, testObjectives } from '../fixtures/test-data';

test.describe('Performance Baseline Tests', () => {
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

  test('should establish CRUD operation performance baselines', async () => {
    const performanceResults = {
      teams: { create: 0, read: 0, update: 0, delete: 0 },
      exercises: { create: 0, read: 0, update: 0, delete: 0 },
      objectives: { create: 0, read: 0, update: 0, delete: 0 }
    };

    // Teams Performance Tests
    console.log('Testing Teams Performance...');
    
    // Teams Create
    const { duration: teamsCreateDuration } = await testDataManager.measurePerformance(async () => {
      const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
      await teamsPage.goto();
      await teamsPage.createTeam();
      const teamFormPage = new TeamFormPage(teamsPage.page);
      await teamFormPage.fillTeamForm(uniqueTeamData);
      await teamFormPage.saveTeam();
      await teamsPage.verifyToastMessage('Equipo creado exitosamente');
    }, 'Teams Create');
    performanceResults.teams.create = teamsCreateDuration;

    // Teams Read
    const testTeam = await testDataManager.createTestTeam({ name: 'Performance Read Team' });
    const { duration: teamsReadDuration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.goto();
      await teamsPage.verifyTeamExists(testTeam.name);
    }, 'Teams Read');
    performanceResults.teams.read = teamsReadDuration;

    // Teams Update
    const { duration: teamsUpdateDuration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.goto();
      await teamsPage.clickTeam(testTeam.name);
      const teamFormPage = new TeamFormPage(teamsPage.page);
      await teamFormPage.fillTeamForm({ name: 'Updated Performance Team' });
      await teamFormPage.saveTeam();
      await teamsPage.verifyToastMessage('Equipo actualizado exitosamente');
    }, 'Teams Update');
    performanceResults.teams.update = teamsUpdateDuration;

    // Teams Delete
    const teamToDelete = await testDataManager.createTestTeam({ name: 'Team to Delete' });
    const { duration: teamsDeleteDuration } = await testDataManager.measurePerformance(async () => {
      await teamsPage.goto();
      await teamsPage.clickTeam(teamToDelete.name);
      const teamFormPage = new TeamFormPage(teamsPage.page);
      await teamFormPage.deleteTeam();
      await teamsPage.verifyToastMessage('Equipo eliminado exitosamente');
    }, 'Teams Delete');
    performanceResults.teams.delete = teamsDeleteDuration;

    // Exercises Performance Tests
    console.log('Testing Exercises Performance...');

    // Exercises Create
    const { duration: exercisesCreateDuration } = await testDataManager.measurePerformance(async () => {
      const uniqueExerciseData = generateUniqueTestData(testExercises.validExercise);
      await exercisesPage.goto();
      await exercisesPage.createExercise();
      const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
      await exerciseFormPage.fillExerciseForm(uniqueExerciseData);
      await exerciseFormPage.saveExercise();
      await exercisesPage.verifyToastMessage('Ejercicio creado exitosamente');
    }, 'Exercises Create');
    performanceResults.exercises.create = exercisesCreateDuration;

    // Exercises Read
    const testExercise = await testDataManager.createTestExercise({ name: 'Performance Read Exercise' });
    const { duration: exercisesReadDuration } = await testDataManager.measurePerformance(async () => {
      await exercisesPage.goto();
      await exercisesPage.verifyExerciseExists(testExercise.name);
    }, 'Exercises Read');
    performanceResults.exercises.read = exercisesReadDuration;

    // Exercises Update
    const { duration: exercisesUpdateDuration } = await testDataManager.measurePerformance(async () => {
      await exercisesPage.goto();
      await exercisesPage.page.click(`[data-testid="exercise-card"]:has-text("${testExercise.name}")`);
      const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
      await exerciseFormPage.fillExerciseForm({ name: 'Updated Performance Exercise' });
      await exerciseFormPage.saveExercise();
      await exercisesPage.verifyToastMessage('Ejercicio actualizado exitosamente');
    }, 'Exercises Update');
    performanceResults.exercises.update = exercisesUpdateDuration;

    // Exercises Delete
    const exerciseToDelete = await testDataManager.createTestExercise({ name: 'Exercise to Delete' });
    const { duration: exercisesDeleteDuration } = await testDataManager.measurePerformance(async () => {
      await exercisesPage.goto();
      await exercisesPage.page.click(`[data-testid="exercise-card"]:has-text("${exerciseToDelete.name}")`);
      const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
      await exerciseFormPage.deleteExercise();
      await exercisesPage.verifyToastMessage('Ejercicio eliminado exitosamente');
    }, 'Exercises Delete');
    performanceResults.exercises.delete = exercisesDeleteDuration;

    // Objectives Performance Tests
    console.log('Testing Objectives Performance...');

    // Objectives Create
    const { duration: objectivesCreateDuration } = await testDataManager.measurePerformance(async () => {
      const uniqueObjectiveData = generateUniqueTestData(testObjectives.validObjective);
      await objectivesPage.goto();
      await objectivesPage.createObjective();
      const objectiveFormPage = new ObjectiveFormPage(objectivesPage.page);
      await objectiveFormPage.fillObjectiveForm(uniqueObjectiveData);
      await objectiveFormPage.saveObjective();
      await objectivesPage.verifyToastMessage('Objetivo creado exitosamente');
    }, 'Objectives Create');
    performanceResults.objectives.create = objectivesCreateDuration;

    // Objectives Read
    const testObjective = await testDataManager.createTestObjective({ title: 'Performance Read Objective' });
    const { duration: objectivesReadDuration } = await testDataManager.measurePerformance(async () => {
      await objectivesPage.goto();
      await objectivesPage.verifyObjectiveExists(testObjective.title);
    }, 'Objectives Read');
    performanceResults.objectives.read = objectivesReadDuration;

    // Objectives Update
    const { duration: objectivesUpdateDuration } = await testDataManager.measurePerformance(async () => {
      await objectivesPage.goto();
      await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${testObjective.title}")`);
      const objectiveFormPage = new ObjectiveFormPage(objectivesPage.page);
      await objectiveFormPage.fillObjectiveForm({ title: 'Updated Performance Objective' });
      await objectiveFormPage.saveObjective();
      await objectivesPage.verifyToastMessage('Objetivo actualizado exitosamente');
    }, 'Objectives Update');
    performanceResults.objectives.update = objectivesUpdateDuration;

    // Objectives Delete
    const objectiveToDelete = await testDataManager.createTestObjective({ title: 'Objective to Delete' });
    const { duration: objectivesDeleteDuration } = await testDataManager.measurePerformance(async () => {
      await objectivesPage.goto();
      await objectivesPage.page.click(`[data-testid="objective-card"]:has-text("${objectiveToDelete.title}")`);
      const objectiveFormPage = new ObjectiveFormPage(objectivesPage.page);
      await objectiveFormPage.deleteObjective();
      await objectivesPage.verifyToastMessage('Objetivo eliminado exitosamente');
    }, 'Objectives Delete');
    performanceResults.objectives.delete = objectivesDeleteDuration;

    // Validate against thresholds
    console.log('\n=== PERFORMANCE BASELINE RESULTS ===');
    console.log('Entity\t\tCreate\tRead\tUpdate\tDelete');
    console.log('Teams\t\t' + 
      `${performanceResults.teams.create}ms\t` +
      `${performanceResults.teams.read}ms\t` +
      `${performanceResults.teams.update}ms\t` +
      `${performanceResults.teams.delete}ms`
    );
    console.log('Exercises\t' + 
      `${performanceResults.exercises.create}ms\t` +
      `${performanceResults.exercises.read}ms\t` +
      `${performanceResults.exercises.update}ms\t` +
      `${performanceResults.exercises.delete}ms`
    );
    console.log('Objectives\t' + 
      `${performanceResults.objectives.create}ms\t` +
      `${performanceResults.objectives.read}ms\t` +
      `${performanceResults.objectives.update}ms\t` +
      `${performanceResults.objectives.delete}ms`
    );
    console.log('\n=== THRESHOLD VALIDATION ===');

    // Validate thresholds
    for (const [entity, results] of Object.entries(performanceResults)) {
      expect(results.create).toBeLessThan(performanceThresholds.create);
      expect(results.read).toBeLessThan(performanceThresholds.read);
      expect(results.update).toBeLessThan(performanceThresholds.update);
      expect(results.delete).toBeLessThan(performanceThresholds.delete);
      
      console.log(`${entity}: All operations within thresholds ✓`);
    }
  });

  test('should handle bulk operations efficiently', async () => {
    const bulkSizes = [10, 25, 50];
    
    for (const bulkSize of bulkSizes) {
      console.log(`Testing bulk operations with ${bulkSize} items...`);

      // Bulk Teams Creation
      const { duration: bulkTeamsDuration } = await testDataManager.measurePerformance(async () => {
        const teamPromises = Array.from({ length: bulkSize }, (_, i) =>
          testDataManager.createTestTeam({ name: `Bulk Team ${bulkSize}-${i + 1}` })
        );
        await Promise.all(teamPromises);
      }, `Bulk Teams Creation (${bulkSize})`);

      // Bulk Exercises Creation
      const { duration: bulkExercisesDuration } = await testDataManager.measurePerformance(async () => {
        const exercisePromises = Array.from({ length: bulkSize }, (_, i) =>
          testDataManager.createTestExercise({ name: `Bulk Exercise ${bulkSize}-${i + 1}` })
        );
        await Promise.all(exercisePromises);
      }, `Bulk Exercises Creation (${bulkSize})`);

      // Bulk Objectives Creation
      const { duration: bulkObjectivesDuration } = await testDataManager.measurePerformance(async () => {
        const objectivePromises = Array.from({ length: bulkSize }, (_, i) =>
          testDataManager.createTestObjective({ title: `Bulk Objective ${bulkSize}-${i + 1}` })
        );
        await Promise.all(objectivePromises);
      }, `Bulk Objectives Creation (${bulkSize})`);

      // Performance should scale reasonably
      const avgTeamTime = bulkTeamsDuration / bulkSize;
      const avgExerciseTime = bulkExercisesDuration / bulkSize;
      const avgObjectiveTime = bulkObjectivesDuration / bulkSize;

      expect(avgTeamTime).toBeLessThan(performanceThresholds.create * 2);
      expect(avgExerciseTime).toBeLessThan(performanceThresholds.create * 2);
      expect(avgObjectiveTime).toBeLessThan(performanceThresholds.create * 2);

      console.log(`Bulk ${bulkSize}: Teams avg ${avgTeamTime}ms, Exercises avg ${avgExerciseTime}ms, Objectives avg ${avgObjectiveTime}ms`);
    }
  });

  test('should maintain performance under different network conditions', async ({ context }) => {
    const networkConditions = [
      { name: 'Fast 3G', downloadThroughput: 1500 * 1024, uploadThroughput: 750 * 1024, latency: 150 },
      { name: 'Slow 3G', downloadThroughput: 500 * 1024, uploadThroughput: 500 * 1024, latency: 2000 },
      { name: 'Very Slow', downloadThroughput: 100 * 1024, uploadThroughput: 100 * 1024, latency: 3000 }
    ];

    for (const condition of networkConditions) {
      console.log(`Testing under ${condition.name} conditions...`);

      // Simulate network condition
      await context.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, condition.latency / 10));
        await route.continue();
      });

      // Test Teams operations
      const { duration: teamsDuration } = await testDataManager.measurePerformance(async () => {
        const uniqueTeamData = generateUniqueTestData(testTeams.validTeam, condition.name.toLowerCase().replace(' ', ''));
        await teamsPage.goto();
        await teamsPage.createTeam();
        const teamFormPage = new TeamFormPage(teamsPage.page);
        await teamFormPage.fillTeamForm(uniqueTeamData);
        await teamFormPage.saveTeam();
      }, `Teams under ${condition.name}`);

      // Allow higher thresholds for poor network conditions
      const networkMultiplier = condition.name === 'Very Slow' ? 5 : condition.name === 'Slow 3G' ? 3 : 2;
      expect(teamsDuration).toBeLessThan(performanceThresholds.create * networkMultiplier);

      console.log(`${condition.name}: Teams creation took ${teamsDuration}ms (threshold: ${performanceThresholds.create * networkMultiplier}ms)`);
    }
  });

  test('should monitor memory usage during operations', async ({ page }) => {
    // Check if performance.memory is available
    const hasMemoryAPI = await page.evaluate(() => 
      'memory' in performance && 'usedJSHeapSize' in (performance as any).memory
    );

    if (!hasMemoryAPI) {
      console.log('Performance Memory API not available, skipping memory test');
      return;
    }

    const initialMemory = await page.evaluate(() => (performance as any).memory.usedJSHeapSize);
    console.log(`Initial memory usage: ${Math.round(initialMemory / 1024 / 1024)}MB`);

    // Perform multiple operations
    const operations = 20;
    for (let i = 0; i < operations; i++) {
      const uniqueTeamData = generateUniqueTestData(testTeams.validTeam, `memory${i}`);
      
      await teamsPage.goto();
      await teamsPage.createTeam();
      const teamFormPage = new TeamFormPage(teamsPage.page);
      await teamFormPage.fillTeamForm(uniqueTeamData);
      await teamFormPage.saveTeam();
      await teamsPage.goto(); // Navigate back to list
    }

    const finalMemory = await page.evaluate(() => (performance as any).memory.usedJSHeapSize);
    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreasePercent = (memoryIncrease / initialMemory) * 100;

    console.log(`Final memory usage: ${Math.round(finalMemory / 1024 / 1024)}MB`);
    console.log(`Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB (${memoryIncreasePercent.toFixed(2)}%)`);

    // Memory increase should not be excessive
    expect(memoryIncreasePercent).toBeLessThan(200); // Less than 200% increase
  });

  test('should optimize API request patterns', async ({ page }) => {
    const apiRequests: string[] = [];
    
    // Monitor API requests
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    // Perform standard user workflow
    await teamsPage.goto();
    apiRequests.length = 0; // Clear initial requests

    // Create team
    const uniqueTeamData = generateUniqueTestData(testTeams.validTeam);
    await teamsPage.createTeam();
    const teamFormPage = new TeamFormPage(teamsPage.page);
    await teamFormPage.fillTeamForm(uniqueTeamData);
    await teamFormPage.saveTeam();

    // Navigate to exercises
    await exercisesPage.goto();

    // Create exercise
    const uniqueExerciseData = generateUniqueTestData(testExercises.validExercise);
    await exercisesPage.createExercise();
    const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
    await exerciseFormPage.fillExerciseForm(uniqueExerciseData);
    await exerciseFormPage.saveExercise();

    console.log('API Requests made:', apiRequests);

    // Verify reasonable number of API calls
    expect(apiRequests.length).toBeLessThanOrEqual(15); // Should not make excessive calls

    // Verify no duplicate identical requests
    const uniqueRequests = [...new Set(apiRequests)];
    const duplicateRatio = (apiRequests.length - uniqueRequests.length) / apiRequests.length;
    expect(duplicateRatio).toBeLessThan(0.3); // Less than 30% duplicate requests
  });

  test('should measure database query performance', async () => {
    // This test measures end-to-end performance which includes database queries
    const queryPerformanceTests = [
      {
        name: 'Simple Read',
        operation: async () => {
          await teamsPage.goto();
          await teamsPage.waitForElement(teamsPage.teamsList);
        }
      },
      {
        name: 'Search Query',
        operation: async () => {
          await testDataManager.createTestTeam({ name: 'Searchable Team' });
          await teamsPage.goto();
          await teamsPage.searchTeam('Searchable');
          await teamsPage.verifyTeamExists('Searchable Team');
        }
      },
      {
        name: 'Complex Create',
        operation: async () => {
          const uniqueExerciseData = generateUniqueTestData(testExercises.validExercise);
          await exercisesPage.goto();
          await exercisesPage.createExercise();
          const exerciseFormPage = new ExerciseFormPage(exercisesPage.page);
          await exerciseFormPage.fillExerciseForm(uniqueExerciseData);
          await exerciseFormPage.saveExercise();
        }
      }
    ];

    for (const test of queryPerformanceTests) {
      const { duration } = await testDataManager.measurePerformance(
        test.operation,
        `Database Query: ${test.name}`
      );

      // All database operations should be reasonably fast
      expect(duration).toBeLessThan(5000); // 5 seconds max for complex operations
      console.log(`${test.name}: ${duration}ms`);
    }
  });

  test('should establish performance regression baseline', async () => {
    // This test creates a comprehensive performance baseline that can be used
    // for regression testing in future versions
    
    const baseline = {
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: await teamsPage.page.evaluate(() => navigator.userAgent),
        url: teamsPage.page.url()
      },
      thresholds: performanceThresholds,
      results: {}
    };

    // Test each entity's performance
    const entities = ['teams', 'exercises', 'objectives'];
    
    for (const entity of entities) {
      console.log(`Establishing baseline for ${entity}...`);
      
      const entityBaseline = {
        singleOperations: {},
        bulkOperations: {},
        searchOperations: {}
      };

      // Single operations
      const { duration: createDuration } = await testDataManager.measurePerformance(async () => {
        if (entity === 'teams') {
          const data = generateUniqueTestData(testTeams.validTeam, 'baseline');
          await teamsPage.goto();
          await teamsPage.createTeam();
          const formPage = new TeamFormPage(teamsPage.page);
          await formPage.fillTeamForm(data);
          await formPage.saveTeam();
        } else if (entity === 'exercises') {
          const data = generateUniqueTestData(testExercises.validExercise, 'baseline');
          await exercisesPage.goto();
          await exercisesPage.createExercise();
          const formPage = new ExerciseFormPage(exercisesPage.page);
          await formPage.fillExerciseForm(data);
          await formPage.saveExercise();
        } else {
          const data = generateUniqueTestData(testObjectives.validObjective, 'baseline');
          await objectivesPage.goto();
          await objectivesPage.createObjective();
          const formPage = new ObjectiveFormPage(objectivesPage.page);
          await formPage.fillObjectiveForm(data);
          await formPage.saveObjective();
        }
      }, `${entity} baseline create`);

      entityBaseline.singleOperations = {
        create: createDuration,
        withinThreshold: createDuration < performanceThresholds.create
      };

      (baseline.results as any)[entity] = entityBaseline;
    }

    // Log baseline for future reference
    console.log('\n=== PERFORMANCE BASELINE ESTABLISHED ===');
    console.log(JSON.stringify(baseline, null, 2));

    // Verify all operations are within acceptable thresholds
    for (const entity of entities) {
      const entityResults = (baseline.results as any)[entity];
      expect(entityResults.singleOperations.withinThreshold).toBeTruthy();
    }
  });
});