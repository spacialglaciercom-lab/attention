# FocusFlow Pro 2026

**FocusFlow** is a high-precision attention management system for iOS, built to implement the "Tools to Optimize Attention" methodology by Karine Bellefleur. Unlike standard Pomodoro timers, FocusFlow uses scientific calibration to find your unique biological focus baseline and protects your flow with integrated **Gemini AI**.

---

## 🌟 Core Features

### 1. High-Precision Focus Engine
- **Baseline Calibration:** A millisecond-accurate stopwatch that measures your real focus span to set realistic, non-arbitrary work intervals.
- **Zero-Drift Timer:** Uses real-world timestamp deltas (`Date.now()`) to ensure perfect accuracy, even if the app is backgrounded or the JS thread is under heavy load.
- **Biometric Energy Sync:** Proactively adjusts session lengths based on physiological energy levels (simulated HealthKit integration).

### 2. Gemini AI Intelligence
- **AI Capture Modal:** Instantly offload intrusive thoughts during deep work. Powered by **Google Gemini**, the app automatically analyzes, cleans, and prioritizes your distractions.
- **Predictive ABC Sorting:** Automatically categorizes tasks into **A (Urgent)**, **B (Important)**, or **C (Low Priority)** based on text intent.

### 3. Hard-Protection Protocols
- **Nuclear Mode:** Simulates a system-level app block on social media and distractions during active sessions.
- **Glance Penalty:** Uses device motion sensors to detect phone pickups. Triggers warning haptics and turns the UI red to discourage "glancing" during focus.
- **Mandatory Wrap-Up:** A structured end-of-session flow ensures all captured distractions are processed before your break begins.

### 4. 2026 "Liquid Glass" UI/UX
- **Apple HIG 2026 Design:** A high-depth, obsidian-based interface utilizing **Liquid Glass** materials (functional translucency and refraction).
- **Refractive Orb:** A dynamic, floating timer container that visualizes your focus state through light and blur.
- **Spatial Sync Foundation:** Ready for broadcasting timer states to **Apple Vision Pro** and Mac Continuity environments.

---

## 🛠 Technical Stack

- **Framework:** React Native + Expo (SDK 54)
- **State Management:** Zustand (High-performance reactive state)
- **Persistence:** AsyncStorage (FocusFlow Storage v2)
- **AI Layer:** `@react-native-firebase/vertexai` (Google Gemini)
- **Visuals:** `expo-blur` (Gaussian Glass), `lucide-react-native` (Icons)
- **Native Hooks:** `expo-notifications`, `expo-haptics`, `expo-location`, `expo-keep-awake`
- **Testing:** Jest + `@testing-library/react-native`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo Go app on your iOS device

### Installation
1. Clone the repository and navigate to the project folder.
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the App
Start the Expo development server:
```bash
npx expo start
```
Scan the QR code with your iPhone camera to launch the **FocusFlow Pro** experience.

### Running Tests
Verify the core engine and AI logic:
```bash
npm test
```

---

## 📐 Architecture Note
FocusFlow utilizes a **Background-First** architecture. By scheduling iOS-native notifications at the start of every session and using `AppState` listeners to resync UI state upon return, the app provides a fail-safe focus experience that survives system suspensions and multitasking.

---
**FocusFlow Pro** — *Built for the Future of Deep Work.*
