# SportPlanner Quickstart Guide

## Prerequisites

- Node.js 18+ with npm
- .NET 8 SDK
- Docker (for local PostgreSQL)
- Git

## Quick Start Commands

### Backend Setup (.NET 8 API)

```bash
# Navigate to backend directory
cd src/back/SportPlanner

# Restore packages
dotnet restore

# Set up local database (Docker)
docker run --name sportplanner-db \
  -e POSTGRES_DB=sportplanner \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update connection string in appsettings.Development.json
# Add Supabase configuration

# Run EF migrations
dotnet ef database update

# Start API server
dotnet run
# API available at: https://localhost:7201
```

### Frontend Setup (Angular 20+)

```bash
# Navigate to frontend directory
cd src/front/SportPlanner

# Install dependencies
npm install

# Configure environment
# Update src/environments/environment.development.ts with:
# - Supabase URL and anon key
# - API base URL (https://localhost:7201/v1)

# Start development server
npm start
# App available at: http://localhost:4200
```

## Initial User Journey Test

### 1. User Registration and Subscription

**Goal**: Verify new user can register and select subscription

**Steps**:
1. Open http://localhost:4200
2. Click "Register"
3. Fill form:
   - Email: test@example.com
   - Password: TestPassword123
   - Name: Test User
   - Subscription: Free
4. Click "Create Account"

**Expected**:
- User redirected to dashboard
- Subscription limits displayed: "1 team, 15 trainings available"
- "Create Team" card visible in center

### 2. Team Creation

**Goal**: Verify team creation with subscription limits

**Steps**:
1. Click "Create Team" card
2. Fill form:
   - Name: "Test Basketball Team"
   - Gender: Masculine
   - Age Category: Alevin
   - Level: B
3. Click "Create Team"

**Expected**:
- Team created successfully
- Team appears in teams list
- Team limit shows: "1/1 teams used"

### 3. Planning Creation with Concepts

**Goal**: Verify planning creation and concept assignment

**Steps**:
1. Click on created team
2. Click "Create Planning"
3. Fill form:
   - Name: "Basic Skills Training"
   - Start Date: Today + 1 week
   - End Date: Today + 3 months
   - Training Days: Monday, Wednesday, Friday
   - Start Time: 18:00
   - Duration: 90 minutes
   - Court: Full court
4. Add concepts:
   - Search "dribbling" → Select "Basic Dribbling"
   - Search "passing" → Select "Chest Pass"
5. Click "Create Planning"

**Expected**:
- Planning created successfully
- Concepts visible in planning details
- "Generate Trainings" button available

### 4. Automatic Training Generation

**Goal**: Verify automatic training creation

**Steps**:
1. In planning details, click "Generate Trainings"
2. Confirm generation dialog

**Expected**:
- System calculates training sessions for selected days
- Multiple trainings created (approximately 36 sessions for 3 months)
- Training limit warning if approaching 15 limit
- Calendar view shows scheduled trainings

### 5. Training Execution

**Goal**: Verify dynamic training execution view

**Steps**:
1. Navigate to today's training (if available) or future training
2. Click "Start Training"
3. Confirm location if prompted

**Expected**:
- Training status changes to "In Progress"
- Dynamic view shows:
  - Previous exercise: (none for first)
  - Current exercise: First planned exercise
  - Next exercise: Second planned exercise
- Chronometer starts at 00:00
- Exercise controls available (Complete, Skip)

### 6. Exercise Execution with Chronometer

**Goal**: Verify chronometer and exercise progression

**Steps**:
1. Let chronometer run for 30 seconds
2. Click "Complete Exercise"
3. Verify next exercise becomes current

**Expected**:
- Chronometer shows elapsed time (00:30+)
- First exercise marked "Completed"
- Second exercise becomes "Current"
- Progress bar updates
- Previous/Current/Next exercises update

### 7. Concept Progress Tracking

**Goal**: Verify concept progress updates

**Steps**:
1. During training, access "Progress" tab
2. Update concept status:
   - "Basic Dribbling" → "Practiced"
   - Rate quality: 4/5 stars
3. Add notes: "Good improvement in ball control"
4. Save progress

**Expected**:
- Concept status updated to "Practiced"
- Quality rating displayed
- Progress reflected in training analytics

### 8. Training Completion

**Goal**: Verify training completion workflow

**Steps**:
1. Complete remaining exercises or click "End Training"
2. Add final notes: "Great session, good energy"
3. Click "Complete Training"

**Expected**:
- Training status changes to "Completed"
- Final duration calculated and stored
- Concept progress saved
- Training appears in completed history

### 9. Analytics and Reports

**Goal**: Verify reporting functionality

**Steps**:
1. Navigate to Team Analytics
2. Select date range covering completed training
3. View concept distribution chart

**Expected**:
- Chart shows concept percentages
- "Basic Dribbling" and "Chest Pass" appear
- Training completion statistics displayed
- Progress summary shows concepts in progress

### 10. Marketplace Preview (Coach+ Feature)

**Goal**: Verify marketplace access based on subscription

**Steps**:
1. Navigate to Marketplace
2. Attempt to browse plannings

**Expected for Free subscription**:
- Marketplace shows upgrade prompt
- "Coach subscription required" message
- View-only access to featured plannings

**Expected for Coach+ subscription**:
- Full marketplace access
- Filter controls active
- Planning import options available

## Performance Validation

### API Response Times
```bash
# Test key endpoints with curl
curl -w "%{time_total}" https://localhost:7201/v1/teams
curl -w "%{time_total}" https://localhost:7201/v1/plannings
curl -w "%{time_total}" https://localhost:7201/v1/trainings
```

**Expected**: All responses < 200ms

### Frontend Performance
- Page load time < 2 seconds
- Route navigation < 500ms
- Component rendering smooth (60fps)
- Bundle size < 500KB gzipped

### Database Performance
```sql
-- Test complex queries
EXPLAIN ANALYZE SELECT * FROM trainings
JOIN teams ON trainings.team_id = teams.id
WHERE teams.created_by_user_id = 'user-id'
AND trainings.scheduled_date >= NOW();
```

**Expected**: Query execution < 50ms

## Security Validation

### Authentication
1. Verify JWT token required for protected endpoints
2. Test token expiration and refresh
3. Confirm Supabase auth integration

### Multi-tenant Isolation
1. Create second user account
2. Verify cannot access first user's teams
3. Test organization-level isolation
4. Confirm RLS policies active

### Subscription Enforcement
1. Test team creation limit (Free: 1 team)
2. Test training creation limit (Free: 15 trainings)
3. Verify marketplace access restrictions
4. Test custom concept creation limits

## Development Validation

### Code Quality
```bash
# Frontend linting
cd src/front/SportPlanner
npm run lint

# Backend code analysis
cd src/back/SportPlanner
dotnet format --verify-no-changes
```

### Testing
```bash
# Run frontend tests
npm test

# Run backend tests
dotnet test

# Verify coverage targets
# Frontend: >80%
# Backend: >90%
```

### Constitutional Compliance
- [ ] Angular 20+ patterns used (no NgModules)
- [ ] .NET 8 minimal APIs implemented
- [ ] TypeScript strict mode enabled
- [ ] Tailwind CSS design system applied
- [ ] Dark/light mode support functional
- [ ] Responsive design working (mobile-first)
- [ ] Accessibility standards met (WCAG 2.1 AA)

## Troubleshooting

### Common Issues

**Database Connection Failed**:
```bash
# Check PostgreSQL container
docker ps | grep sportplanner-db
# Check connection string in appsettings.json
```

**Supabase Auth Not Working**:
- Verify API keys in environment files
- Check Supabase project configuration
- Confirm CORS settings for localhost

**API CORS Issues**:
```csharp
// In Program.cs, ensure CORS configured for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("Development", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

**Frontend Build Errors**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Issues

**Slow API Responses**:
- Check database query performance
- Verify proper indexing
- Monitor EF Core query generation

**Frontend Performance**:
- Check bundle size: `npm run build --analyze`
- Verify OnPush change detection
- Monitor component re-renders

## Success Criteria

✅ **Functional Requirements**:
- User registration and authentication working
- Team creation with subscription limits
- Planning creation and concept assignment
- Automatic training generation
- Dynamic training execution with chronometer
- Concept progress tracking
- Basic analytics and reporting

✅ **Performance Requirements**:
- API responses < 200ms (p95)
- Frontend page loads < 2 seconds
- Smooth chronometer operation
- Bundle size < 500KB gzipped

✅ **Security Requirements**:
- Multi-tenant data isolation
- JWT authentication enforced
- Subscription limits respected
- Row Level Security active

✅ **Quality Requirements**:
- All tests passing
- Code quality standards met
- Constitutional compliance verified
- Responsive design functional

This quickstart validates the core SportPlanner functionality and ensures the platform meets all constitutional requirements for performance, security, and code quality.