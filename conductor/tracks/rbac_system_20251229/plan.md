# Implementation Plan - Role-Based Access Control (RBAC)

## Phase 1: Auth Infrastructure & Claims Mapping
- [x] Task: Define Role Constants
    - [x] Sub-task: Create a `UserRoles` static class in `back/SportPlanner/Models/` with constants for `AdminOwner`, `Coach`, etc.
- [x] Task: Update JWT Claims Mapping
    - [x] Sub-task: Modify `Program.cs` or Authentication configuration to extract the `role` claim from the `app_metadata` section of the Supabase JWT.
    - [x] Sub-task: Ensure the extracted claim is mapped to `ClaimTypes.Role` so `User.IsInRole()` works natively.
- [x] Task: Implement `ICurrentUserService`
    - [x] Sub-task: Create a service to easily access `UserId`, `Role`, and `HasActiveSubscription` across the backend.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Auth Infrastructure & Claims Mapping' (Protocol in workflow.md)

## Phase 2: Supabase Role Management Service
- [x] Task: Supabase Admin Integration
    - [x] Sub-task: Configure the backend with the Supabase `SERVICE_ROLE_KEY` (securely in secrets/env).
    - [x] Sub-task: Implement `ISupabaseAdminService` with a method `UpdateUserRoleAsync(string userId, string role)`.
    - [/] Sub-task: Add unit tests for the role update logic (mocking the HTTP call to Supabase).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Supabase Role Management Service' (Protocol in workflow.md)

## Phase 3: Subscription & Role Synchronization
- [x] Task: Link Subscriptions to Roles
    - [x] Sub-task: Update the Subscription creation logic (likely in `SubscriptionService`) to trigger a role update.
    - [x] Sub-task: Define the mapping: `Coach Subscription` -> `Coach Role`.
- [/] Task: Handle "No Subscription" State
    - [/] Sub-task: Implement a global filter or middleware check that detects users with `NoRole` and provides a specific error/instruction (supporting the frontend redirect logic).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Subscription & Role Synchronization' (Protocol in workflow.md)

## Phase 4: Refactor Business Logic & Authorization
- [x] Task: Clean up Hardcoded Admin Checks
    - [x] Sub-task: Replace `var adminId = "43ccbcfc-5fc1-47b4-a9ce-bd8ed0356c75"` in `MarketplaceController` and `SportConceptsController` with `User.IsInRole(UserRoles.AdminOwner)`.
- [x] Task: Secure Marketplace Management
    - [x] Sub-task: Add `[Authorize(Roles = UserRoles.AdminOwner)]` to endpoints that manage System content.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Refactor Business Logic & Authorization' (Protocol in workflow.md)
