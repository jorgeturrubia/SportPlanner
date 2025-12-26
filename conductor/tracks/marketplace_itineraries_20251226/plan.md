# Implementation Plan: Marketplace & Itineraries Management

This plan follows the TDD methodology and the shadowing/versioning architecture defined in the specification.

## Phase 1: Database & Backend Infrastructure
- [x] Task: Database - Add `IsSystem`, `OwnerId`, `Version`, `SystemSourceId`, `AverageRating`, `RatingCount` to `Itinerary` entity. [9c7fbf9]
- [x] Task: Database - Create `ItineraryRatings` table for 1-to-5 star votes. [db7f9dc]
- [x] Task: Database - Create `ItineraryConcept` join table (Many-to-Many) to store user personalizations (Description, linked exercises). [a93c2cf]
- [~] Task: Backend - Implement `MarketplaceService` with filtering (Author, Rating, Category).
- [ ] Task: Backend - Implement `ItineraryService` for "Download/Link" logic (creating UserItineraries references).
- [ ] Task: Backend - Implement `RatingService` with background process to update `AverageRating` in the main table.
- [ ] Task: Backend - Create `MarketplaceController` and update `ItinerariesController` for shadowing logic.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Database & Backend Infrastructure' (Protocol in workflow.md)

## Phase 2: Frontend Infrastructure & Marketplace UI
- [ ] Task: Frontend - Define DTOs and Interfaces for Itineraries (with `IsSystem` and `Author` metadata).
- [ ] Task: Frontend - Create `MarketplaceDataService` to interact with the new backend endpoints.
- [ ] Task: Frontend - Implement `MarketplaceComponent` (Sidebar entry "Marketplace").
- [ ] Task: Frontend - Build Marketplace Grid with filters (Rating, Author) and "Download" action.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Infrastructure & Marketplace UI' (Protocol in workflow.md)

## Phase 3: User Itineraries & Shadowing Logic
- [ ] Task: Frontend - Create `UserItineraryListComponent` ("My Itineraries").
- [ ] Task: Frontend - Implement visual badges for "System" vs "User" itineraries.
- [ ] Task: Frontend - Implement `ItineraryDetailComponent` with conditional read-only logic for System fields (Name, GUID).
- [ ] Task: Frontend - Allow users to edit Description and add personal Exercises to System Itineraries (Shadowing).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: User Itineraries & Shadowing Logic' (Protocol in workflow.md)

## Phase 4: Integration & Rating System
- [ ] Task: Frontend - Implement the Star Rating component in the Marketplace.
- [ ] Task: Backend - Finalize integration of linked itineraries in the Planning creation flow.
- [ ] Task: Frontend - Update Planning UI to show concepts from linked (Marketplace) itineraries.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Rating System' (Protocol in workflow.md)
