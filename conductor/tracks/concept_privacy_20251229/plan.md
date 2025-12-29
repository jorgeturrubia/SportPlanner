# Implementation Plan - Concept Ownership & Visibility

## Phase 1: Database & Model Updates
- [x] Task: Create Migration for OwnerId abc0d52
    - [x] Sub-task: Generate EF Core migration to add `OwnerId` (string, nullable) to `SportConcept` table.
    - [x] Sub-task: Apply migration to update the database schema.
- [x] Task: Update SportConcept Model 54e32f7
    - [x] Sub-task: Add `OwnerId` property to `SportConcept` class in `back/SportPlanner/Models/SportConcept.cs`.
    - [x] Sub-task: Update `SportConceptDto` and `CreateSportConceptDto` (if necessary) to handle or exclude `OwnerId` (it should likely be inferred from context, not sent by client).
- [x] Task: Data Migration (Optional/Manual)
    - [x] Sub-task: Script to set existing `IsSystem=true` concepts to have `OwnerId = NULL` (or a system user ID) to ensure backward compatibility.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Model Updates' (Protocol in workflow.md) [checkpoint: 6b19b48]

## Phase 2: Backend Logic Implementation
- [x] Task: Update SportConceptsController.Create 6606f00
    - [x] Sub-task: Modify `Create` method to automatically assign `OwnerId` from `User.FindFirst(ClaimTypes.NameIdentifier)`.
    - [x] Sub-task: Set `IsSystem = false` by default for regular users.
    - [x] Sub-task: Add logic to allow Admin users (hardcoded ID or role check) to set `IsSystem = true`.
- [x] Task: Update SportConceptService Query Logic 80be781
    - [x] Sub-task: Modify `GetBySportAsync` and `GetAllAsync` to filter by `(IsSystem == true || OwnerId == currentUserId)`.
    - [x] Sub-task: Ensure Marketplace-specific endpoints (if any separate ones exist) strictly filter `IsSystem == true`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend Logic Implementation' (Protocol in workflow.md)

## Phase 3: Verification & Cleanup
- [ ] Task: Test User Creation
    - [ ] Sub-task: Create a concept as a standard user. Verify `OwnerId` is set and `IsSystem` is false.
- [ ] Task: Test Visibility
    - [ ] Sub-task: Verify standard user sees their concept.
    - [ ] Sub-task: Verify OTHER users do NOT see that concept in Marketplace.
    - [ ] Sub-task: Verify Admin-created concepts are visible to all.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification & Cleanup' (Protocol in workflow.md)
