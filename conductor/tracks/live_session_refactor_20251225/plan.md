# Plan: Training Execution Component Refactor

## Phase 1: Investigation and Preparation
- [~] Task: Locate and analyze existing components related to Training Execution.
- [x] Task: Audit the current `TrainingExecutionController` and frontend services.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Investigation and Preparation' (Protocol in workflow.md) [checkpoint: a4d8abb]

## Phase 2: Core Logic (Service Layer)
- [ ] Task: Create or refactor `TrainingExecutionService` using Angular Signals to manage session state (Idle, Running, Paused, Completed).
- [ ] Task: Implement the General Timer (Count UP) logic within the service.
- [ ] Task: Implement the Exercise Timer (Count DOWN) and auto-transition logic.
- [ ] Task: Write unit tests for `TrainingExecutionService` state transitions and timer accuracy.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Core Logic (Service Layer)' (Protocol in workflow.md)

## Phase 3: Component UI Refactor
- [ ] Task: Refactor the Training Execution component template for a professional layout (Large timer, active exercise focus).
- [ ] Task: Implement progress bars and color-coded status indicators using Tailwind CSS.
- [ ] Task: Add large, touch-friendly controls (Play/Pause, Next/Previous) and bind them to the service.
- [ ] Task: Implement the "Upcoming List" queue display.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Component UI Refactor' (Protocol in workflow.md)

## Phase 4: Audio Feedback and Polishing
- [ ] Task: Integrate audio alerts for exercise transitions (start/end).
- [ ] Task: Refine animations and transitions between exercises.
- [ ] Task: Perform final responsive testing and UI polish.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Audio Feedback and Polishing' (Protocol in workflow.md)
