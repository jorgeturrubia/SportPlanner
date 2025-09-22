# Data Model: SportPlanner

## Core Entities

### User
**Purpose**: Represents individuals using the platform, authenticated via Supabase
**Fields**:
- `Id` (Guid, PK) - Supabase user ID
- `Email` (string, unique) - User email from Supabase
- `Name` (string) - Display name
- `CreatedAt` (DateTime) - Registration timestamp
- `UpdatedAt` (DateTime) - Last profile update
- `IsActive` (bool) - Soft delete flag

**Relationships**:
- One-to-many with UserSubscription
- One-to-many with UserOrganizationRole
- One-to-many with UserTeamRole
- One-to-many with custom Concepts/Exercises (as creator)

**Validation Rules**:
- Email format validation
- Name required, 2-100 characters
- Supabase ID must be valid GUID

### Subscription
**Purpose**: Defines access levels and limitations for platform features
**Fields**:
- `Id` (int, PK) - Internal subscription type ID
- `Name` (string) - Free, Coach, Club
- `Price` (decimal) - Monthly cost in euros
- `MaxTeams` (int) - Team limit (1 for Free, unlimited for others)
- `MaxTrainings` (int) - Training limit (15 for Free, unlimited for others)
- `CanCreateCustomConcepts` (bool) - Custom concept creation permission
- `CanAccessMarketplace` (bool) - Marketplace access permission
- `CanManageOrganizations` (bool) - Organization management (Club only)
- `IsActive` (bool) - Whether subscription is currently offered

**Validation Rules**:
- Price >= 0
- MaxTeams >= 1 or unlimited (-1)
- MaxTrainings >= 1 or unlimited (-1)

### UserSubscription
**Purpose**: Links users to their active subscriptions
**Fields**:
- `Id` (int, PK) - Internal ID
- `UserId` (Guid, FK) - Reference to User
- `SubscriptionId` (int, FK) - Reference to Subscription
- `StartDate` (DateTime) - Subscription start
- `EndDate` (DateTime?) - Subscription end (null for active)
- `IsActive` (bool) - Current subscription status
- `PaymentStatus` (enum) - Active, Cancelled, Failed
- `CreatedAt` (DateTime) - Purchase timestamp

**Relationships**:
- Many-to-one with User
- Many-to-one with Subscription

**Validation Rules**:
- User can have one free + one paid subscription maximum
- EndDate must be after StartDate if specified

### Organization
**Purpose**: Groups multiple teams under club subscription management
**Fields**:
- `Id` (int, PK) - Internal organization ID
- `Name` (string) - Organization name
- `Description` (string?) - Optional description
- `OwnerId` (Guid, FK) - User who owns the organization
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last modification
- `IsActive` (bool) - Visibility flag for archival

**Relationships**:
- Many-to-one with User (owner)
- One-to-many with Team
- One-to-many with UserOrganizationRole

**Validation Rules**:
- Name required, 2-100 characters
- Owner must have Club subscription
- Organization names unique per owner

### Team
**Purpose**: Sports team with characteristics and user assignments
**Fields**:
- `Id` (int, PK) - Internal team ID
- `Name` (string) - Team name
- `Gender` (enum) - Masculine, Feminine, Mixed
- `AgeCategory` (enum) - Alevin, Infantil, Cadete, Juvenil, Senior
- `Level` (enum) - A (advanced), B (intermediate), C (beginner)
- `OrganizationId` (int?, FK) - Parent organization (null for individual)
- `CreatedByUserId` (Guid, FK) - User who created the team
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last modification
- `IsActive` (bool) - Visibility flag for archival

**Relationships**:
- Many-to-one with Organization (optional)
- Many-to-one with User (creator)
- One-to-many with UserTeamRole
- Many-to-many with Planning

**Validation Rules**:
- Name required, 2-100 characters
- Team names unique per organization/creator
- Creator must have appropriate subscription for team count

### UserOrganizationRole
**Purpose**: Defines user permissions within organizations
**Fields**:
- `Id` (int, PK) - Internal ID
- `UserId` (Guid, FK) - User reference
- `OrganizationId` (int, FK) - Organization reference
- `Role` (enum) - Administrator, Director
- `CreatedAt` (DateTime) - Assignment timestamp
- `IsActive` (bool) - Role status

**Validation Rules**:
- One role per user per organization
- Only Administrator can assign Director roles

### UserTeamRole
**Purpose**: Defines user permissions within specific teams
**Fields**:
- `Id` (int, PK) - Internal ID
- `UserId` (Guid, FK) - User reference
- `TeamId` (int, FK) - Team reference
- `Role` (enum) - Coach, Assistant
- `Permission` (enum) - FullAccess, ViewOnly, ExecuteOnly
- `AssignedByUserId` (Guid, FK) - User who made the assignment
- `CreatedAt` (DateTime) - Assignment timestamp
- `IsActive` (bool) - Role status

**Validation Rules**:
- One role per user per team
- Assistant permissions cannot exceed assigning user's permissions

### Concept
**Purpose**: Training objectives categorized by type and difficulty
**Fields**:
- `Id` (int, PK) - Internal concept ID
- `Name` (string) - Concept name (e.g., "Cambio de mano")
- `Category` (string) - Main category (e.g., "Técnica individual")
- `Subcategory` (string) - Specific area (e.g., "Bote")
- `Difficulty` (enum) - Beginner, Intermediate, Advanced
- `EstimatedLearningTimeHours` (int) - Expected time to master
- `Description` (string?) - Optional detailed description
- `IsCustom` (bool) - System-provided vs user-created
- `CreatedByUserId` (Guid?, FK) - Creator (null for system concepts)
- `CreatedAt` (DateTime) - Creation timestamp
- `IsActive` (bool) - Availability status

**Relationships**:
- Many-to-one with User (creator, for custom concepts)
- Many-to-many with Exercise
- Many-to-many with Planning

**Validation Rules**:
- Name required, 2-200 characters
- Category and subcategory required
- EstimatedLearningTimeHours > 0
- Custom concepts require Coach+ subscription

### Exercise
**Purpose**: Physical activities linked to training concepts
**Fields**:
- `Id` (int, PK) - Internal exercise ID
- `Name` (string) - Exercise name
- `Description` (string) - Detailed instructions
- `DurationMinutes` (int) - Typical duration
- `MinPlayers` (int) - Minimum participants
- `MaxPlayers` (int) - Maximum participants
- `Equipment` (string?) - Required equipment
- `IsCustom` (bool) - System-provided vs user-created
- `CreatedByUserId` (Guid?, FK) - Creator (null for system exercises)
- `CreatedAt` (DateTime) - Creation timestamp
- `IsActive` (bool) - Availability status

**Relationships**:
- Many-to-one with User (creator, for custom exercises)
- Many-to-many with Concept
- One-to-many with TrainingExercise

**Validation Rules**:
- Name required, 2-200 characters
- Description required, 10-2000 characters
- DurationMinutes > 0
- MinPlayers >= 1, MaxPlayers >= MinPlayers

### Planning
**Purpose**: Training plan with schedule and concept distribution
**Fields**:
- `Id` (int, PK) - Internal planning ID
- `Name` (string) - Planning name
- `Description` (string?) - Optional description
- `StartDate` (DateTime) - Planning start date
- `EndDate` (DateTime) - Planning end date
- `TrainingDays` (string) - JSON array of days (Monday, Tuesday, etc.)
- `StartTime` (TimeSpan) - Daily training start time
- `DurationMinutes` (int) - Training session duration
- `IsFullCourt` (bool) - Full court vs split court
- `CreatedByUserId` (Guid, FK) - Planning creator
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last modification
- `IsActive` (bool) - Visibility flag
- `IsInMarketplace` (bool) - Published to marketplace
- `MarketplaceRating` (decimal?) - Average rating (1-5 stars)
- `MarketplaceRatingCount` (int) - Number of ratings

**Relationships**:
- Many-to-one with User (creator)
- Many-to-many with Team
- Many-to-many with Concept (through PlanningConcept)
- One-to-many with Training
- One-to-many with PlanningRating

**Validation Rules**:
- Name required, 2-200 characters
- EndDate must be after StartDate
- TrainingDays must contain valid days
- DurationMinutes > 0

### PlanningConcept
**Purpose**: Links concepts to plannings with priority weighting
**Fields**:
- `PlanningId` (int, FK) - Planning reference
- `ConceptId` (int, FK) - Concept reference
- `Priority` (enum) - Primary, Secondary, Tertiary
- `WeightPercentage` (decimal) - Concept emphasis (0-100)

**Validation Rules**:
- WeightPercentage between 0 and 100
- Total weight per planning should sum to 100%

### Training
**Purpose**: Individual training session within a planning
**Fields**:
- `Id` (int, PK) - Internal training ID
- `PlanningId` (int, FK) - Parent planning
- `TeamId` (int, FK) - Target team
- `ScheduledDate` (DateTime) - Planned training date
- `Location` (string?) - Training venue
- `Status` (enum) - Planned, InProgress, Completed, Cancelled
- `StartTime` (DateTime?) - Actual start time
- `EndTime` (DateTime?) - Actual end time
- `Notes` (string?) - Post-training notes
- `CreatedAt` (DateTime) - Creation timestamp
- `UpdatedAt` (DateTime) - Last modification

**Relationships**:
- Many-to-one with Planning
- Many-to-one with Team
- One-to-many with TrainingExercise
- One-to-many with TrainingConceptProgress

**Validation Rules**:
- ScheduledDate within planning date range
- StartTime/EndTime logical sequence when present

### TrainingExercise
**Purpose**: Exercises assigned to specific training sessions
**Fields**:
- `Id` (int, PK) - Internal ID
- `TrainingId` (int, FK) - Parent training
- `ExerciseId` (int, FK) - Exercise reference
- `Order` (int) - Exercise sequence in training
- `PlannedDurationMinutes` (int) - Expected duration
- `ActualDurationMinutes` (int?) - Actual duration
- `Status` (enum) - Planned, InProgress, Completed, Skipped
- `Notes` (string?) - Exercise-specific notes

**Validation Rules**:
- Order > 0
- PlannedDurationMinutes > 0
- ActualDurationMinutes >= 0 when set

### TrainingConceptProgress
**Purpose**: Tracks concept achievement during training
**Fields**:
- `Id` (int, PK) - Internal ID
- `TrainingId` (int, FK) - Parent training
- `ConceptId` (int, FK) - Concept reference
- `Status` (enum) - NotWorked, Introduced, Practiced, Mastered
- `QualityRating` (int?) - Coach assessment (1-5)
- `Notes` (string?) - Progress observations

**Validation Rules**:
- QualityRating between 1 and 5 when set

### PlanningRating
**Purpose**: Marketplace ratings for shared plannings
**Fields**:
- `Id` (int, PK) - Internal ID
- `PlanningId` (int, FK) - Rated planning
- `UserId` (Guid, FK) - Rating user
- `Rating` (int) - Star rating (1-5)
- `Comment` (string?) - Optional review comment
- `CreatedAt` (DateTime) - Rating timestamp

**Validation Rules**:
- Rating between 1 and 5
- One rating per user per planning
- User cannot rate their own planning

## State Transitions

### Training Execution Flow
1. **Planned** → **InProgress** (coach starts training)
2. **InProgress** → **Completed** (training finished)
3. **InProgress** → **Cancelled** (training abandoned)
4. **Planned** → **Cancelled** (training cancelled before start)

### Exercise Execution Flow
1. **Planned** → **InProgress** (exercise started)
2. **InProgress** → **Completed** (exercise finished)
3. **InProgress** → **Skipped** (exercise skipped)
4. **Planned** → **Skipped** (exercise skipped without start)

### Concept Progress Flow
1. **NotWorked** → **Introduced** (concept first presented)
2. **Introduced** → **Practiced** (concept actively worked)
3. **Practiced** → **Mastered** (concept achieved proficiency)

## Multi-tenant Isolation

### Row Level Security (RLS) Policies

**User Context**: All queries filtered by authenticated user context
**Organization Scope**: Users can only access their organization's data
**Team Scope**: Users can only access teams they have roles for
**Planning Scope**: Users can access plannings for their teams or marketplace plannings

### Data Isolation Rules

1. **Custom Concepts/Exercises**: Only visible to creating user
2. **Teams**: Visible to organization members and assigned users
3. **Plannings**: Visible to team members and marketplace (if published)
4. **Trainings**: Visible to team members with appropriate permissions
5. **Progress Data**: Visible to coaches and organization administrators

## Performance Considerations

### Indexing Strategy
- Composite indexes on foreign keys and common query patterns
- Indexes on date fields for calendar queries
- Full-text search indexes on names and descriptions
- Partial indexes on active records only

### Query Optimization
- Projection-only queries for list views
- Eager loading for related data in detail views
- Pagination for large result sets
- Caching for frequently accessed reference data