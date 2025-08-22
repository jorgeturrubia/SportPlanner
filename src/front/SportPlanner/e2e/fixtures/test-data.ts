import { v4 as uuidv4 } from 'uuid';

/**
 * Test data fixtures for E2E tests
 */

export const testTeams = {
  validTeam: {
    name: 'E2E Test Team',
    sport: 'Football',
    category: 'Sub-16',
    gender: 'Masculino',
    level: 'A',
    description: 'Test team for E2E testing',
    maxPlayers: '20',
  },
  
  invalidTeam: {
    name: '', // Empty name should trigger validation error
    sport: 'Football',
    category: 'Sub-16',
    gender: 'Masculino',
    level: 'A',
    maxPlayers: '-1', // Invalid number
  },
  
  updateTeam: {
    name: 'Updated E2E Test Team',
    description: 'Updated description for testing',
    maxPlayers: '25',
  },
};

export const testExercises = {
  validExercise: {
    name: 'E2E Test Exercise',
    description: 'This is a test exercise for E2E testing purposes',
    category: 'WarmUp',
    difficulty: 'Easy',
    duration: '30',
    minParticipants: '5',
    maxParticipants: '20',
  },
  
  invalidExercise: {
    name: '', // Empty name
    description: '', // Empty description
    duration: '0', // Invalid duration
    minParticipants: '0', // Invalid participants
    maxParticipants: '0',
  },
  
  updateExercise: {
    name: 'Updated E2E Test Exercise',
    description: 'Updated description for testing',
    duration: '45',
  },
};

export const testObjectives = {
  validObjective: {
    title: 'E2E Test Objective',
    description: 'This is a test objective for E2E testing purposes',
    category: 'Technical',
    difficulty: 'Intermediate',
    duration: '60',
  },
  
  invalidObjective: {
    title: '', // Empty title
    description: '', // Empty description
    duration: '0', // Invalid duration
  },
  
  updateObjective: {
    title: 'Updated E2E Test Objective',
    description: 'Updated description for testing',
    duration: '90',
  },
};

export const performanceThresholds = {
  create: 2000, // 2 seconds
  read: 1000,   // 1 second
  update: 2000, // 2 seconds
  delete: 1000, // 1 second
};

export const testUsers = {
  freeUser: {
    email: 'e2e-free-user@test.com',
    password: 'TestPassword123!',
    role: 'free',
    expectedLimits: {
      teams: 1,
      exercises: 15,
    },
  },
  
  coachUser: {
    email: 'e2e-coach-user@test.com',
    password: 'TestPassword123!',
    role: 'coach',
    expectedLimits: {
      teams: 'unlimited',
      exercises: 'unlimited',
    },
  },
  
  clubAdmin: {
    email: 'e2e-admin-user@test.com',
    password: 'TestPassword123!',
    role: 'admin',
    expectedLimits: {
      teams: 'unlimited',
      exercises: 'unlimited',
      canManageUsers: true,
    },
  },
};

/**
 * Generates unique test data to avoid conflicts
 */
export function generateUniqueTestData(baseData: any, prefix = 'e2e') {
  const timestamp = Date.now();
  const id = uuidv4().slice(0, 8);
  
  return {
    ...baseData,
    name: baseData.name ? `${prefix}-${baseData.name}-${timestamp}-${id}` : baseData.name,
    title: baseData.title ? `${prefix}-${baseData.title}-${timestamp}-${id}` : baseData.title,
    email: baseData.email ? `${prefix}-${timestamp}-${id}-${baseData.email}` : baseData.email,
  };
}

/**
 * Validation error messages expected in tests
 */
export const validationMessages = {
  required: {
    name: 'El nombre es obligatorio',
    title: 'El título es obligatorio',
    description: 'La descripción es obligatoria',
    email: 'El email es obligatorio',
    password: 'La contraseña es obligatoria',
  },
  
  invalid: {
    email: 'El formato del email no es válido',
    duration: 'La duración debe ser mayor a 0',
    participants: 'El número de participantes debe ser mayor a 0',
    maxPlayers: 'El número máximo de jugadores debe ser mayor a 0',
  },
  
  limits: {
    freeUserTeamLimit: 'Los usuarios gratuitos solo pueden crear 1 equipo',
    freeUserExerciseLimit: 'Los usuarios gratuitos solo pueden crear 15 ejercicios',
  },
};

/**
 * Network simulation scenarios for testing
 */
export const networkScenarios = {
  slow3G: {
    offline: false,
    downloadThroughput: 500 * 1024, // 500kb/s
    uploadThroughput: 500 * 1024,
    latency: 2000, // 2s
  },
  
  offline: {
    offline: true,
  },
  
  slowConnection: {
    offline: false,
    downloadThroughput: 100 * 1024, // 100kb/s
    uploadThroughput: 100 * 1024,
    latency: 5000, // 5s
  },
};