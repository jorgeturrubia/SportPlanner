/**
 * Test environment configuration for E2E tests
 */
export const testConfig = {
  api: {
    baseUrl: process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000',
    timeout: 10000,
  },
  frontend: {
    baseUrl: process.env.PLAYWRIGHT_FRONTEND_URL || 'http://localhost:4200',
  },
  supabase: {
    url: process.env.PLAYWRIGHT_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.PLAYWRIGHT_SUPABASE_ANON_KEY || 'your-anon-key',
    serviceRoleKey: process.env.PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
  },
  database: {
    testUserPrefix: 'e2e-test-',
    testDataPrefix: 'e2e-',
  },
  performance: {
    createOperationTimeout: 2000, // 2 seconds
    readOperationTimeout: 1000,   // 1 second
    updateOperationTimeout: 2000, // 2 seconds
    deleteOperationTimeout: 1000, // 1 second
  },
  auth: {
    testUsers: {
      freeUser: {
        email: 'e2e-free-user@test.com',
        password: 'TestPassword123!',
        role: 'free',
      },
      coachUser: {
        email: 'e2e-coach-user@test.com',
        password: 'TestPassword123!',
        role: 'coach',
      },
      clubAdmin: {
        email: 'e2e-admin-user@test.com',
        password: 'TestPassword123!',
        role: 'admin',
      },
    },
  },
};