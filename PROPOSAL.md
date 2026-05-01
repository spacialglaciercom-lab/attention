# Attention Optimizer App Proposal

## 1. Project Overview
A React Native iOS prototype designed to implement the "Tools to Optimize Attention" methodology by Karine Bellefleur. The app focuses on baseline focus calibration, timeboxed work sessions, and a structured distraction-logging protocol.

## 2. Technical Stack
- **Framework:** React Native with Expo (SDK 50+)
- **Language:** TypeScript
- **State Management:** Zustand
- **Navigation:** React Navigation (Bottom Tabs + Modals)
- **Storage:** `expo-sqlite` for tasks and history; `AsyncStorage` for user settings.
- **Notifications:** `expo-notifications` for session alerts and reminders.
- **Styling:** Vanilla CSS (via `StyleSheet`) with a clean, minimalist iOS aesthetic.

## 3. Core Features & User Stories

### A. Focus Calibration (The Baseline)
- **User Story:** As a user, I want to measure how long I can focus on a boring task so I can set realistic work intervals.
- **Feature:** A "Stopwatch" mode that tracks time until the user hits "Distracted". It averages the last 3-5 sessions to determine the "Baseline Capacity".

### B. Timeboxed Focus Sessions
- **User Story:** As a user, I want to work in dedicated blocks based on my capacity to maintain high quality.
- **Feature:** A countdown timer initialized with the baseline time. Includes a "Break" state and a "Wrap-Up" state.

### C. The ABC Distraction Protocol
- **User Story:** As a user, I want to quickly log distractions without breaking my flow.
- **Feature:** During a focus session, a quick-input field allows logging tasks. These are tagged as `isLoggedDistraction` for later review.

### D. Task Management (ABC List & Planner)
- **User Story:** As a user, I want to manage my tasks by priority and schedule.
- **Feature:**
    - **ABC List:** Tasks grouped by A (Urgent/Important), B (Important), and C (Nice to do).
    - **Planner:** Calendar integration or simple dated list for time-sensitive tasks.

### E. Wrap-Up Review
- **User Story:** As a user, I want to process the distractions I logged during my session.
- **Feature:** At the end of a timer block, the app presents a list of items captured during that session for prioritization or scheduling.

## 4. Data Models (TypeScript)

```typescript
type Priority = 'A' | 'B' | 'C' | 'UNASSIGNED';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  isCompleted: boolean;
  isLoggedDistraction: boolean;
  createdAt: number; // timestamp
}

interface UserProfile {
  baselineFocusTimeMs: number;
  calibrationHistory: number[]; // Array of durations
}
```

## 5. UI/UX Structure (Tab-Based)
1. **Focus:** The central hub with the timer/stopwatch.
2. **Tasks:** The ABC prioritized list.
3. **Planner:** Scheduled items.
4. **Settings:** Calibration history and notification preferences.

## 6. Implementation Phases
1. **Phase 1: Setup:** Initialize Expo project, install dependencies, and define core types.
2. **Phase 2: Calibration Engine:** Build the stopwatch and baseline calculation logic.
3. **Phase 3: Focus Session & Distraction Capture:** Implement the countdown timer and the quick-log modal.
4. **Phase 4: ABC Backlog & Storage:** Build the task list UI and persistence layer.
5. **Phase 5: Notifications & Polish:** Add iOS-native alerts and refine the minimalist UI.

---
**Next Steps:** Upon approval, I will begin Phase 1 (Scaffolding the Expo project).
