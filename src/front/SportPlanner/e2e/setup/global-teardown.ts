import { TestDataManager } from '../utils/test-data-manager';

async function globalTeardown() {
  console.log('🧹 Starting PlanSport E2E Test Global Teardown...');
  
  try {
    const testDataManager = new TestDataManager();
    
    // Clean up all test data
    await testDataManager.cleanupTestData();
    
    console.log('✅ Global teardown completed successfully');
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error to avoid failing the test run
  }
}

export default globalTeardown;