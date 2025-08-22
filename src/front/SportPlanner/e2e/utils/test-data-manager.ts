import axios, { AxiosInstance } from 'axios';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { testConfig } from './test-config';

/**
 * Manages test data creation, cleanup, and database operations for E2E tests
 */
export class TestDataManager {
  private apiClient: AxiosInstance;
  private supabaseClient: SupabaseClient;
  private testDataIds: {
    users: string[];
    teams: string[];
    exercises: string[];
    objectives: string[];
  } = {
    users: [],
    teams: [],
    exercises: [],
    objectives: [],
  };

  constructor() {
    this.apiClient = axios.create({
      baseURL: testConfig.api.baseUrl + '/api',
      timeout: testConfig.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.supabaseClient = createClient(
      testConfig.supabase.url,
      testConfig.supabase.serviceRoleKey
    );
  }

  /**
   * Sets up the test environment
   */
  async setupTestEnvironment(): Promise<void> {
    console.log('Setting up test environment...');
    
    // Check API health
    try {
      await this.apiClient.get('/health');
    } catch (error) {
      throw new Error('API is not available for testing');
    }
  }

  /**
   * Creates test users with different roles
   */
  async createTestUsers(): Promise<void> {
    console.log('Creating test users...');
    
    const users = Object.values(testConfig.auth.testUsers);
    
    for (const user of users) {
      try {
        // Create user in Supabase Auth
        const { data, error } = await this.supabaseClient.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        });
        
        if (error) {
          console.warn(`User ${user.email} might already exist:`, error.message);
        } else if (data.user) {
          this.testDataIds.users.push(data.user.id);
          console.log(`Created test user: ${user.email}`);
        }
      } catch (error) {
        console.warn(`Failed to create user ${user.email}:`, error);
      }
    }
  }

  /**
   * Creates a test team
   */
  async createTestTeam(overrides: Partial<any> = {}): Promise<any> {
    const testTeam = {
      id: uuidv4(),
      name: `${testConfig.database.testDataPrefix}Team-${Date.now()}`,
      sportId: uuidv4(),
      category: 'Sub-16',
      gender: 'Masculino',
      level: 'A',
      description: 'Test team for E2E testing',
      maxPlayers: 20,
      createdByUserId: uuidv4(),
      ...overrides,
    };

    try {
      const response = await this.apiClient.post('/teams', testTeam);
      const createdTeam = response.data;
      this.testDataIds.teams.push(createdTeam.id);
      return createdTeam;
    } catch (error) {
      console.error('Failed to create test team:', error);
      throw error;
    }
  }

  /**
   * Creates a test exercise
   */
  async createTestExercise(overrides: Partial<any> = {}): Promise<any> {
    const testExercise = {
      id: uuidv4(),
      name: `${testConfig.database.testDataPrefix}Exercise-${Date.now()}`,
      description: 'Test exercise for E2E testing',
      category: 1, // WarmUp
      difficulty: 2, // Easy
      duration: 30,
      minParticipants: 5,
      maxParticipants: 20,
      targetAgeGroup: 'Sub-16',
      sport: 'Football',
      spaceRequired: 'Half field',
      isPublic: true,
      createdByUserId: uuidv4(),
      ...overrides,
    };

    try {
      const response = await this.apiClient.post('/exercises', testExercise);
      const createdExercise = response.data;
      this.testDataIds.exercises.push(createdExercise.id);
      return createdExercise;
    } catch (error) {
      console.error('Failed to create test exercise:', error);
      throw error;
    }
  }

  /**
   * Creates a test objective
   */
  async createTestObjective(overrides: Partial<any> = {}): Promise<any> {
    const testObjective = {
      id: uuidv4(),
      title: `${testConfig.database.testDataPrefix}Objective-${Date.now()}`,
      description: 'Test objective for E2E testing',
      category: 1, // Technical
      difficulty: 2, // Intermediate
      estimatedDuration: 60,
      targetAgeGroup: 'Sub-16',
      sport: 'Football',
      maxParticipants: 20,
      minParticipants: 5,
      isPublic: true,
      createdByUserId: uuidv4(),
      ...overrides,
    };

    try {
      const response = await this.apiClient.post('/objectives', testObjective);
      const createdObjective = response.data;
      this.testDataIds.objectives.push(createdObjective.id);
      return createdObjective;
    } catch (error) {
      console.error('Failed to create test objective:', error);
      throw error;
    }
  }

  /**
   * Authenticates a test user and returns auth token
   */
  async authenticateUser(email: string, password: string): Promise<string> {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(`Authentication failed: ${error.message}`);
      }

      if (!data.session?.access_token) {
        throw new Error('No access token received');
      }

      return data.session.access_token;
    } catch (error) {
      console.error('Failed to authenticate user:', error);
      throw error;
    }
  }

  /**
   * Sets authorization header for API requests
   */
  setAuthToken(token: string): void {
    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clears authorization header
   */
  clearAuthToken(): void {
    delete this.apiClient.defaults.headers.common['Authorization'];
  }

  /**
   * Verifies data exists in database
   */
  async verifyDataInDatabase(entityType: string, id: string): Promise<boolean> {
    try {
      const response = await this.apiClient.get(`/${entityType}/${id}`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleans up all test data
   */
  async cleanupTestData(): Promise<void> {
    console.log('Cleaning up test data...');

    // Clean up entities via API
    await this.cleanupEntities('objectives', this.testDataIds.objectives);
    await this.cleanupEntities('exercises', this.testDataIds.exercises);
    await this.cleanupEntities('teams', this.testDataIds.teams);

    // Clean up users
    for (const userId of this.testDataIds.users) {
      try {
        await this.supabaseClient.auth.admin.deleteUser(userId);
      } catch (error) {
        console.warn(`Failed to delete user ${userId}:`, error);
      }
    }

    // Clean up any remaining test data by prefix
    await this.cleanupTestDataByPrefix();

    // Reset tracking arrays
    this.testDataIds = {
      users: [],
      teams: [],
      exercises: [],
      objectives: [],
    };
  }

  /**
   * Cleans up entities of a specific type
   */
  private async cleanupEntities(entityType: string, ids: string[]): Promise<void> {
    for (const id of ids) {
      try {
        await this.apiClient.delete(`/${entityType}/${id}`);
      } catch (error) {
        console.warn(`Failed to delete ${entityType} ${id}:`, error);
      }
    }
  }

  /**
   * Cleans up test data by prefix (fallback cleanup)
   */
  private async cleanupTestDataByPrefix(): Promise<void> {
    const tables = ['teams', 'exercises', 'objectives'];
    const prefix = testConfig.database.testDataPrefix;

    for (const table of tables) {
      try {
        await this.supabaseClient
          .from(table)
          .delete()
          .like('name', `${prefix}%`);
      } catch (error) {
        console.warn(`Failed to cleanup ${table} by prefix:`, error);
      }
    }
  }

  /**
   * Measures operation performance
   */
  async measurePerformance<T>(
    operation: () => Promise<T>,
    operationType: string
  ): Promise<{ result: T; duration: number }> {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;

    console.log(`${operationType} took ${duration}ms`);

    return { result, duration };
  }

  /**
   * Gets test user credentials
   */
  getTestUser(role: 'free' | 'coach' | 'admin') {
    const userMap = {
      free: testConfig.auth.testUsers.freeUser,
      coach: testConfig.auth.testUsers.coachUser,
      admin: testConfig.auth.testUsers.clubAdmin,
    };

    return userMap[role];
  }
}