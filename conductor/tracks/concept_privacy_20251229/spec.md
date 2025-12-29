# Specification: Concept Visibility and Ownership

## 1. Overview
Currently, all created `SportConcept` entities default to `IsSystem = true` and lack an owner, making every user-created concept public and visible in the global Marketplace. This track aims to implement proper ownership and visibility logic so that user-created concepts remain private to their library unless explicitly shared or created by an administrator.

## 2. Functional Requirements

### 2.1. Concept Ownership
- [ ] **Add `OwnerId`**: The `SportConcept` entity must include an optional `OwnerId` (string) field to link concepts to a specific user (Supabase User ID).
- [ ] **Update Creation Logic**: When a regular user creates a concept:
    - `OwnerId` must be set to the current user's ID.
    - `IsSystem` must be set to `false`.
- [ ] **Admin Creation**: Only specific system administrators (e.g., specific User IDs or roles) can create concepts with `IsSystem = true`.

### 2.2. Visibility Rules
- [ ] **User Library**: A user should see:
    - Concepts they own (`OwnerId == CurrentUser.Id`).
    - System concepts (`IsSystem == true` AND `IsActive == true`).
- [ ] **Marketplace/Global List**: The public Marketplace must ONLY display concepts where `IsSystem == true`. User-created private concepts must NOT appear here.

### 2.3. Marketplace Interaction (Copy/Link)
- [ ] **Download/Use**: When a user "downloads" or uses a system concept/template:
    - The system must create a **Link/Reference** to the original System Concept, not a full deep copy, to maintain standardization.
    - (Existing logic in `PlanningTemplateService` seems to support "Shadow Copies" for templates; ensure this aligns with the new Concept ownership model).

## 3. Non-Functional Requirements
- **Data Integrity**: Existing concepts in the database may need a data migration to assign them to a default system owner or specific users if their origin is known.
- **Performance**: Queries for fetching concepts must remain efficient when filtering by `OwnerId OR IsSystem`.

## 4. Out of Scope
- "Publishing" flow for users to submit private concepts to the Marketplace.
- Editing System concepts by regular users (they are read-only references).

## 5. Acceptance Criteria
- [ ] A regular user creates a concept -> It appears in their "My Concepts" list.
- [ ] A regular user creates a concept -> It does NOT appear in the "Marketplace" or for other users.
- [ ] An Admin creates a concept -> It appears in the Marketplace for everyone.
- [ ] "My Concepts" list shows both my private concepts and system concepts.
