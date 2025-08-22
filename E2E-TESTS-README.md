# PlanSport E2E Testing Documentation

## Overview

This document provides comprehensive information about the End-to-End (E2E) testing implementation for PlanSport, covering Teams, Exercises, and Objectives entities with full CRUD operation validation.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- .NET 8 SDK
- PostgreSQL (for local testing)
- Git

### Running Tests Locally

#### Windows (PowerShell)
```powershell
.\run-e2e-tests.ps1 -TestSuite all -Headed
```

#### Unix/Linux/macOS (Bash)
```bash
./run-e2e-tests.sh --suite all --headed
```

#### Manual Setup
```bash
# Frontend setup
cd src/front/SportPlanner
npm install
npx playwright install

# Backend setup
cd src/back/SportPlanner/SportPlanner.Api
dotnet restore
dotnet run &

# Run tests
cd src/front/SportPlanner
npm run test:e2e
```

## 📁 Test Structure

```
src/front/SportPlanner/e2e/
├── setup/
│   ├── global-setup.ts         # Global test setup
│   └── global-teardown.ts      # Global test cleanup
├── utils/
│   ├── test-config.ts          # Test configuration
│   ├── test-data-manager.ts    # Data management utilities
│   └── page-objects.ts         # Page object models
├── fixtures/
│   └── test-data.ts           # Test data fixtures
└── tests/
    ├── teams/
    │   ├── teams-crud.spec.ts     # Teams CRUD operations
    │   ├── teams-auth.spec.ts     # Teams authentication
    │   └── teams-performance.spec.ts # Teams performance
    ├── exercises/
    │   └── exercises-crud.spec.ts  # Exercises CRUD operations
    ├── objectives/
    │   └── objectives-crud.spec.ts # Objectives CRUD operations
    ├── auth/
    │   └── auth-comprehensive.spec.ts # Authentication tests
    ├── performance/
    │   └── performance-baseline.spec.ts # Performance tests
    └── validation/
        └── error-handling.spec.ts  # Error handling tests
```

## 🧪 Test Suites

### 1. Teams CRUD Tests (`teams-crud.spec.ts`)
- ✅ Create team with validation
- ✅ Read/display teams with search
- ✅ Update team information
- ✅ Delete team with confirmation
- ✅ Performance within thresholds (≤2s create/update, ≤1s read/delete)
- ✅ Subscription tier limitations
- ✅ Concurrent operations handling

### 2. Exercises CRUD Tests (`exercises-crud.spec.ts`)
- ✅ Create exercise with multimedia support
- ✅ Read/display with filtering by category/difficulty
- ✅ Update exercise information
- ✅ Delete exercise with cascade handling
- ✅ Validation constraints (participants, duration)
- ✅ Free user limitations (15 exercises max)

### 3. Objectives CRUD Tests (`objectives-crud.spec.ts`)
- ✅ Create objective with categories
- ✅ Read/display with search functionality
- ✅ Update objective information
- ✅ Delete objective with relationship handling
- ✅ Exercise-objective relationships
- ✅ Prerequisites and difficulty progression

### 4. Authentication Tests (`auth-comprehensive.spec.ts`)
- ✅ JWT token validation and structure
- ✅ Role-based permissions (Free, Coach, Club Admin)
- ✅ Token expiration handling
- ✅ Cross-user data access prevention
- ✅ Concurrent session management
- ✅ Security headers validation

### 5. Performance Tests (`performance-baseline.spec.ts`)
- ✅ CRUD operation benchmarks
- ✅ Bulk operation efficiency
- ✅ Network condition handling
- ✅ Memory usage monitoring
- ✅ API request optimization
- ✅ Database query performance

### 6. Error Handling Tests (`error-handling.spec.ts`)
- ✅ Required field validation
- ✅ Data type constraints
- ✅ Business rule validation
- ✅ Network error handling
- ✅ Server error responses
- ✅ Malicious input protection

## ⚡ Performance Thresholds

| Operation | Threshold | Entity Coverage |
|-----------|-----------|-----------------|
| Create    | ≤ 2000ms  | Teams, Exercises, Objectives |
| Read      | ≤ 1000ms  | List views, Search, Filters |
| Update    | ≤ 2000ms  | Form submissions, Data changes |
| Delete    | ≤ 1000ms  | Single/bulk deletions |

## 🔐 Authentication & Authorization

### User Roles Tested
- **Free User**: 1 team, 15 exercises limit
- **Coach User**: Unlimited teams/exercises, private data
- **Club Admin**: Full access, user management

### Security Validations
- JWT token structure and claims
- Token expiration and refresh
- Cross-user data isolation
- Role-based permission enforcement
- Malicious input sanitization

## 🛠️ Configuration

### Environment Variables
```bash
PLAYWRIGHT_API_URL=http://localhost:5000
PLAYWRIGHT_FRONTEND_URL=http://localhost:4200
PLAYWRIGHT_SUPABASE_URL=your-supabase-url
PLAYWRIGHT_SUPABASE_ANON_KEY=your-anon-key
PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Test Configuration (`test-config.ts`)
```typescript
export const testConfig = {
  api: { baseUrl: 'http://localhost:5000', timeout: 10000 },
  frontend: { baseUrl: 'http://localhost:4200' },
  supabase: { /* Supabase configuration */ },
  performance: { /* Performance thresholds */ },
  auth: { /* Test user credentials */ }
};
```

## 📊 Test Data Management

### Automatic Cleanup
- Test data is automatically created and cleaned up
- Unique identifiers prevent conflicts
- Database isolation for concurrent tests

### Data Factories
```typescript
// Generate unique test data
const uniqueTeam = generateUniqueTestData(testTeams.validTeam);

// Create via API
const testTeam = await testDataManager.createTestTeam(teamData);

// Verify in database
const exists = await testDataManager.verifyDataInDatabase('teams', teamId);
```

## 🚀 CI/CD Integration

### GitHub Actions Workflows

#### Full E2E Tests (`.github/workflows/e2e-tests.yml`)
- Runs on push to main/develop
- Full test suite execution
- Performance regression checks
- Security scanning
- Artifact upload (reports, screenshots)

#### PR Quick Check (`.github/workflows/e2e-pr-check.yml`)
- Runs on pull requests
- Smoke tests only (faster feedback)
- Concurrent execution cancellation

### Workflow Features
- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile viewport testing
- ✅ Performance regression detection
- ✅ Security vulnerability scanning
- ✅ Test result notifications
- ✅ Artifact management

## 📈 Reporting

### Available Reports
- **HTML Report**: Interactive test results with traces
- **JSON Report**: Machine-readable results for CI
- **JUnit XML**: Integration with test management tools
- **Performance Metrics**: Response time trends

### Viewing Reports
```bash
# Show last test report
npx playwright show-report

# Generate fresh report
npm run test:e2e:report
```

## 🔍 Debugging

### Debug Mode
```bash
# Run with debugger
npm run test:e2e:debug

# Run specific test with debug
npx playwright test teams-crud.spec.ts --debug
```

### Screenshots and Videos
- Automatic screenshots on failure
- Video recording for failed tests
- Trace files for detailed debugging

## 🎯 Best Practices

### Test Organization
- One feature per spec file
- Clear test descriptions
- Independent test cases
- Proper setup/teardown

### Page Objects
- Encapsulate UI interactions
- Reusable across tests
- Clear method naming
- Wait strategies included

### Data Management
- Isolated test data
- Automatic cleanup
- Unique identifiers
- Factory patterns

## 🚨 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check ports
netstat -an | grep :4200
netstat -an | grep :5000

# Kill processes
pkill -f "ng serve"
pkill -f "dotnet run"
```

#### Browser Issues
```bash
# Reinstall browsers
npx playwright install --with-deps

# Clear browser data
rm -rf ~/.cache/ms-playwright
```

#### Database Issues
```bash
# Reset test database
dotnet ef database drop --force
dotnet ef database update
```

## 📋 Test Checklist

### Before Committing
- [ ] All tests pass locally
- [ ] New features have tests
- [ ] Performance thresholds met
- [ ] No security vulnerabilities
- [ ] Clean test data

### Before Deploying
- [ ] CI/CD tests pass
- [ ] Performance regression check
- [ ] Security scan clean
- [ ] Test coverage adequate

## 🤝 Contributing

### Adding New Tests
1. Create spec file in appropriate directory
2. Follow naming convention: `feature-type.spec.ts`
3. Use existing page objects and utilities
4. Include performance and validation tests
5. Update this documentation

### Test Categories
- **@smoke**: Quick validation tests
- **@regression**: Full feature validation
- **@performance**: Performance benchmarks
- **@security**: Security validations

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review test logs and artifacts
3. Contact development team
4. Create GitHub issue with details

---

*Last updated: 2025-08-22*
*E2E Test Coverage: Teams, Exercises, Objectives CRUD + Auth + Performance + Validation*