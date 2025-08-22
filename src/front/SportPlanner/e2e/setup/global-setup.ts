import { chromium, FullConfig } from '@playwright/test';
import { TestDataManager } from '../utils/test-data-manager';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting PlanSport E2E Test Global Setup...');
  
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  
  try {
    // Initialize test data manager
    const testDataManager = new TestDataManager();
    
    // Clean any existing test data
    await testDataManager.cleanupTestData();
    
    // Setup test environment
    await testDataManager.setupTestEnvironment();
    
    // Create test users with different roles
    await testDataManager.createTestUsers();
    
    // Wait for services to be ready
    const page = await browser.newPage();
    console.log('⏳ Waiting for frontend to be ready...');
    await page.goto(baseURL || 'http://localhost:4200');
    await page.waitForLoadState('networkidle');
    
    console.log('⏳ Checking backend API health...');
    const response = await page.request.get('http://localhost:5000/api/health');
    if (!response.ok()) {
      throw new Error(`Backend API not ready: ${response.status()}`);
    }
    
    await page.close();
    console.log('✅ Global setup completed successfully');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;