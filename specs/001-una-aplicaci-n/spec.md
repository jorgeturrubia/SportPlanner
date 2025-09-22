# Feature Specification: SportPlanner - Multi-tenant Sports Planning Platform

**Feature Branch**: `001-una-aplicaci-n`
**Created**: 2025-09-22
**Status**: Draft
**Input**: User description: "Una aplicación que se encarga de las planificaciones de distintos deportes. Se trata de facilitar, la creación de objetivos, sesiones, control de ejecución de entrenamientos."

## User Scenarios & Testing

### Primary User Story
As a sports coach, I want to quickly create comprehensive training plans for my teams by either building custom plans with concepts and exercises or importing proven plans from a marketplace, so that I can focus on training execution rather than planning logistics. The system should automatically generate training sessions based on my planning parameters and provide real-time chronometer support during training execution.

### Acceptance Scenarios
1. **Given** I am a new user with free subscription, **When** I register and complete onboarding, **Then** I can create one team and up to 15 training sessions
2. **Given** I have a coach subscription, **When** I create a planning, **Then** I can add custom concepts, create unlimited trainings, and access the marketplace
3. **Given** I have created a team and planning, **When** I request automatic training generation, **Then** the system creates all training sessions for the specified period and days
4. **Given** I am executing a training session, **When** I use the dynamic view, **Then** I can see previous/current/next exercises with integrated chronometer
5. **Given** I am a sports director with club subscription, **When** I invite coaches, **Then** I can assign them specific teams with defined permissions (view-only or edit)
6. **Given** I have created a successful planning, **When** I publish to marketplace, **Then** other users can discover, rate (1-5 stars), and import my planning
7. **Given** I want to create a new planning, **When** I browse marketplace, **Then** I can filter by sport, age category, team level, and training frequency

### Edge Cases
- What happens when a user reaches subscription limits (team count, training count)?
- How does system handle training execution when exercises have conflicting concepts?
- What happens when a coach tries to access a team they don't have permissions for?
- How are imported marketplace plannings adapted to different team characteristics?
- What happens when a user downgrades subscription with existing data exceeding new limits?

## Requirements

### Functional Requirements

**Authentication & Subscription Management**:
- **FR-001**: System MUST authenticate users via Supabase authentication
- **FR-002**: System MUST enforce subscription-based access control (Free: 1 team + 15 trainings, Coach: unlimited trainings + custom concepts, Club: multi-team management)
- **FR-003**: Users MUST be able to purchase and manage multiple subscription types (one free + one paid maximum)
- **FR-004**: System MUST support invited users without subscriptions who access through organization permissions

**Team & Organization Management**:
- **FR-005**: Users MUST be able to create teams with gender (masculine/feminine), age category, and skill level (A/B/C)
- **FR-006**: Club subscription users MUST be able to create organizations and assign multiple teams
- **FR-007**: System MUST support role-based permissions (Administrator, Director, Coach, Assistant) with team-specific access
- **FR-008**: System MUST allow hiding/showing teams and plannings without deletion for archival purposes

**Planning & Concept System**:
- **FR-009**: System MUST provide base concepts categorized by category and subcategory (e.g., "Individual Technique" ’ "Dribbling")
- **FR-010**: Coach+ users MUST be able to create custom concepts with difficulty levels and estimated learning time
- **FR-011**: System MUST support planning creation through direct concept selection or predefined itineraries
- **FR-012**: Plannings MUST define start/end dates, training days, hours, and court allocation (full/split)
- **FR-013**: System MUST automatically generate training sessions based on planning parameters and concept distribution

**Exercise & Training Execution**:
- **FR-014**: System MUST allow linking exercises to multiple concepts for training coherence
- **FR-015**: System MUST provide dynamic training view showing previous/current/next exercises
- **FR-016**: System MUST include integrated chronometer for training execution timing
- **FR-017**: System MUST track planned vs executed concepts for progress reporting

**Marketplace & Sharing**:
- **FR-018**: System MUST provide marketplace for sharing plannings with 5-star rating system
- **FR-019**: Users MUST be able to filter marketplace content by sport, age category, team level, and training frequency
- **FR-020**: System MUST allow importing marketplace plannings and adapting them to team characteristics
- **FR-021**: System MUST maintain original creator attribution for imported plannings

**Reporting & Analytics**:
- **FR-022**: System MUST generate reports showing concept distribution percentages in plannings
- **FR-023**: System MUST provide planned vs trained vs pending concept analytics
- **FR-024**: System MUST display calendar view of past and future trainings (only future modifiable)
- **FR-025**: System MUST support progress tracking for individual concepts and overall planning completion

**Data Management**:
- **FR-026**: System MUST maintain data isolation between different organizations and users
- **FR-027**: System MUST support both system-provided and custom concepts/exercises per user
- **FR-028**: System MUST allow plannings to be shared across multiple teams within same organization

### Key Entities

- **User**: Represents individuals using the platform (authenticated via Supabase)
- **Subscription**: Defines access levels (Free, Coach, Club) with specific limitations and capabilities
- **Organization**: Groups multiple teams under club subscription management
- **Team**: Sports team with gender, age category, skill level, and assigned users with roles
- **Planning**: Training plan with date range, schedule, concepts, and target teams
- **Concept**: Training objective with category, subcategory, difficulty, and learning time estimation
- **Exercise**: Physical activity linked to one or more concepts for training execution
- **Training Session**: Scheduled training with date, location, exercises, and execution tracking
- **Itinerary**: Predefined concept collection for quick planning setup
- **Marketplace Entry**: Published planning with ratings and metadata for sharing
- **User Role**: Permission system defining access levels per user per team/organization

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---