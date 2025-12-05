# Dashboard Refactor v2.0: The "Hero-Hub" Architecture

**Date:** December 4, 2025
**Branch:** `feature/dashboard-refactor` -> `main`
**Objective:** Transform the legacy dashboard into a premium, mobile-first command center.

## 1. Overview & Philosophy

The original dashboard suffered from a "wall of data" problem—it presented too much information with equal weight, causing cognitive overload on mobile devices.

**The Solution:** We implemented the **"Hero-Hub" Pattern**.
This design prioritizes information based on urgency:

1.  **Hero Zone (Top):** Immediate Actions (Injections due _now_).
2.  **Active Zone (Middle):** Ongoing Monitoring (Fasting timer, Meal logging).
3.  **Data Zone (Bottom):** Passive Health Metrics (Weight, Sleep, HRV).

**Aesthetic Direction:** "Premium Dark Mode"

- **Glassmorphism:** Extensive use of `backdrop-blur-xl` and `bg-white/5` to create depth.
- **Gradients:** Subtle Teal-to-Violet gradients to indicate progress and status.
- **Typography:** Tight tracking and uppercase labels for a technical, high-precision feel.

## 2. Technical Architecture

The dashboard is built using **Next.js 14+ (App Router)** and is composed of four independent, data-aware components.

### File Structure

```
components/dashboard/
├── hero-section.tsx       # Zone 1: Injection Schedule
├── fasting-timer.tsx      # Zone 2: Fasting Ring & Quick Log
├── weekly-overview.tsx    # Zone 2.5: Compact 7-day Strip
└── metrics-grid.tsx       # Zone 3: Health Sparklines
```

### Dependencies

- **Visualization:** `@tremor/react` (SparkAreaCharts)
- **Animation:** `motion/react` (Framer Motion for micro-interactions)
- **Icons:** `lucide-react`
- **UI Base:** `shadcn/ui` (Card, Button, Progress)
- **Notifications:** `sonner`

## 3. Component Details

### A. Hero Section (`hero-section.tsx`)

- **Purpose:** The single source of truth for "What do I need to take today?"
- **Logic:**
  - Fetches active protocols from `localStorage`.
  - Calculates doses due _today_ vs. upcoming.
  - **Empty State:** If no doses are due, it gracefully collapses or shows a "Next dose in X days" countdown.
- **Key Features:**
  - **Individual Checkboxes:** Each dose is a discrete interactive row.
  - **Optimistic UI:** Clicking "Complete" instantly updates the UI before the data persists.
  - **Undo Capability:** Toast notification allows accidental completions to be reverted.

### B. Fasting Timer (`fasting-timer.tsx`)

- **Purpose:** Real-time tracking of fasting windows.
- **Layout:** Split 60/40 (Timer / Actions).
- **Logic:**
  - Persists `fastingStart` timestamp in `localStorage`.
  - Updates elapsed time every 60 seconds.
- **Smart Features:**
  - **"Safe to Inject" Badge:** Automatically appears when `elapsedTime >= 2 hours`. This removes the need for mental math for peptides requiring a fasted state.
  - **Color Phases:** Ring changes color (Blue -> Teal -> Violet) as fasting duration increases.

### C. Weekly Overview (`weekly-overview.tsx`)

- **Purpose:** A compact "at-a-glance" view of the week's adherence.
- **Visuals:**
  - **Teal Dot:** 100% Adherence.
  - **Amber Dot:** Partial Adherence.
  - **Gray Dot:** Future/No Data.

### D. Metrics Grid (`metrics-grid.tsx`)

- **Purpose:** High-level health trends without the clutter of full tables.
- **Data Sources:**
  - **Weight:** Connected to **Supabase** (`weights` table). Calculates 8-week trend and percentage change.
  - **Sleep/HRV:** Currently using placeholder data (structure ready for API integration).
- **Visuals:** Uses Tremor Sparklines to show immediate trends (Up/Down) rather than just static numbers.

## 4. Data Flow

The dashboard follows a **"Pull" architecture**:

1.  **Local Storage:** Protocols, Doses, and Fasting state are read directly from the browser's `localStorage` using custom hooks/helpers in `lib/storage.ts`.
2.  **Supabase:** Weight data is fetched via the Supabase Client SDK.
3.  **Reactivity:** Components listen for `window` storage events to sync state across tabs instantly.

## 5. Future Roadmap

- [ ] **Sleep/HRV Integration:** Connect `metrics-grid.tsx` to Oura/Garmin APIs or Supabase tables.
- [ ] **Customization:** Allow users to drag-and-drop zones to reorder them.
- [ ] **Haptics:** Add vibration feedback for mobile users when completing tasks.
