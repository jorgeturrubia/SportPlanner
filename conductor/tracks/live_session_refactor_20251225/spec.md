# Specification: Training Execution Component Refactor

## 1. Overview
The current training execution component (accessed via Teams > Trainings > Play) is malfunctioning. The timers do not synchronize correctly, and the auto-transition between exercises is broken. This track aims to fix these functional bugs and significantly upgrade the UI/UX to a professional standard.

## 2. Functional Requirements
### 2.1 Core Logic
- [ ] **State Management:** Implement a robust state machine (using Angular Signals) to handle session states: `Idle`, `Running`, `Paused`, `Completed`.
- [ ] **General Timer:** Displays the total time elapsed since the session started (Counts UP).
- [ ] **Exercise Timer:** Displays the time remaining for the *current* exercise (Counts DOWN).
- [ ] **Auto-Transition:** When the Exercise Timer reaches 0, automatically transition to the next exercise in the list.
- [ ] **Manual Navigation:**
    -   **Next:** Skip to the next exercise immediately.
    -   **Previous:** Return to the start of the current exercise or the previous one.
- [ ] **Controls:**
    -   **Play:** Starts/Resumes both timers.
    -   **Pause:** Freezes both timers.
    -   **Stop/Finish:** Ends the session manually.

### 2.2 Audio Feedback
- [ ] Play a distinct sound when an exercise begins.
- [ ] Play a distinct sound when an exercise ends (timer reaches 0).

## 3. UI/UX Requirements
### 3.1 Layout & Visuals
- [ ] **Current Exercise Display:** Prominently show the name, description, and media (image/video) of the active exercise.
- [ ] **Timer Visibility:**
    -   Exercise Timer: Large, central display.
    -   General Timer: Smaller, secondary display.
- [ ] **Progress Indicators:**
    -   Visual progress bar for the current exercise duration.
    -   Color coding: Active (Green), Warning/Ending (Amber), Paused (Gray/Red).
- [ ] **Upcoming List:** clearly display the queue of next exercises.

### 3.2 Controls
- [ ] Large, touch-friendly buttons for Play, Pause, Next, Previous.
- [ ] Icons should be standard and intuitive.

## 4. Technical Constraints
-   **Framework:** Angular (latest as per project), utilizing Signals and Standalone components.
-   **Styling:** Tailwind CSS.
-   **Architecture:** Logic should be decoupled into a `TrainingSessionService` or similar store.

## 5. Out of Scope
-   Editing the training plan during execution.
-   Saving complex telemetry data (heart rate, etc.) for this iteration.
