# Peptide Tracking Dashboard: UX Design Blueprint

A peptide tracking app commanding 80% mobile usage demands a **single-screen hub** where users can assess status, take action, and track progress without scrolling. Research across leading health apps reveals a clear hierarchy: **time-sensitive actions first, health metrics second, historical data on demand**.

---

## The "hero-hub" pattern dominates successful health dashboards

Analysis of MyFitnessPal, Noom, Zero, Medisafe, and Round Health reveals a consistent architecture: a prominent primary element (circular timer, calorie ring, medication due) flanked by secondary action cards and tertiary metric displays. Zero fasting app's circular timer serves as the "centerpiece"—users immediately see elapsed time and goal progress. Medisafe places the next medication due at top, with quick "Taken" and "Skip" buttons visible without scrolling. The critical insight: **57% of viewing time occurs above the fold**, making the first ~400 pixels of screen real estate decisive.

For peptide tracking, this translates to placing the **injection schedule and fasting timer** in the hero zone. Research from Oura Ring's 2024 redesign introduced the "one big thing" pattern—surfacing a single primary insight rather than overwhelming with data. Your dashboard should answer one question instantly: *"What do I need to do right now?"*

---

## Recommended dashboard layout structure

Based on cross-app pattern analysis, here's the optimal information architecture for mobile:

### Zone 1: Hero section (above fold, ~200px)
**Primary content**: Next injection status + countdown timer

```
┌─────────────────────────────────────┐
│  💉 BPC-157 · Next in 2d 14h        │
│  ━━━━━━━━━━━━━━━░░░░ 3 of 7 weekly  │
│  [Mark Complete]        [Schedule →]│
└─────────────────────────────────────┘
```

The injection card uses **horizontal progress** (linear bar) rather than circular because peptide schedules are typically weekly cycles, not 24-hour loops. Research shows linear progress works better for multi-day timelines, while circular excels for within-day tracking.

### Zone 2: Active timers (above fold, ~160px)
**Split view**: Fasting timer + meal logging

```
┌─────────────────┬───────────────────┐
│  🍽 Fasting      │    Log Meal       │
│     16:42       │       (+)         │
│  ████████░░░    │   Last: 2h ago    │
│   16/18 hours   │                   │
└─────────────────┴───────────────────┘
```

The **circular progress ring** is optimal for fasting because it represents the cyclical 24-hour pattern users intuitively understand. Zero, Fastic, and Life Fasting all center on this visual metaphor. The ring fills clockwise, with color transitioning from **teal-500** (in progress) to **teal-400** (goal achieved) to **violet-400** (bonus zone). Include phase indicators at key points (12h ketosis, 18h autophagy) as subtle markers on the ring's edge.

### Zone 3: Health metrics grid (below fold start, ~200px)
**2x2 card layout** with sparklines

```
┌─────────────────┬───────────────────┐
│  Weight         │   Sleep Score     │
│  165.2 lbs      │      82           │
│  ↓0.3 ▁▂▃▂▁     │   ●●●●○  ▂▃▅▆▄   │
└─────────────────┴───────────────────┘
┌─────────────────────────────────────┐
│  HRV · 45ms                         │
│  ↑ 8% vs your baseline  ▁▂▃▂▄▅▃▂   │
└─────────────────────────────────────┘
```

Each metric card follows the **current value + delta + sparkline** pattern. Research confirms sparklines are "data-intense, design-simple, word-sized graphics" ideal for compact spaces—show 7-14 days of trend data. Use **color-coded deltas**: teal for improvements, violet for stable, muted red for concerns. Anchor metrics to personalized baselines (Oura and Whoop's approach) rather than population averages.

---

## Tap-to-complete interactions that feel satisfying

The medication tracking research revealed a critical principle: **"Taken/Skip toggle must live above the fold—no scrolling, no hunting."** Round Health's single-tap circular interface and Medisafe's prominent buttons both follow this pattern.

### Recommended interaction for injection logging:

**Primary pattern**: Single tap on card → Immediate visual feedback → Snackbar with undo

1. **Tap response** (<100ms): Card background subtly shifts to teal-500/10
2. **Completion animation** (200-300ms): Checkmark draws itself using SVG stroke animation
3. **Haptic feedback**: iOS `UINotificationFeedbackGenerator.success` / Android `EFFECT_CLICK`
4. **Snackbar appears** (3-5 seconds): "Injection logged · UNDO"

```tsx
// Animation timing with Framer Motion
const completionVariants = {
  initial: { scale: 1 },
  complete: { 
    scale: [1, 1.15, 1],
    transition: { duration: 0.3, ease: [0.4, 0, 0.23, 1] }
  }
}
```

**Avoid swipe-to-complete as primary** for health apps—accidental swipes during scrolling can log false data. Research shows swipe has "discoverability issues" and accessibility challenges. Use it only as a power-user shortcut with visible button as primary action.

### Visual states for injection items:

| State | Background | Border | Icon | Text |
|-------|-----------|--------|------|------|
| Upcoming | gray-900 | gray-800 | gray-500 | "In 3 days" |
| Due today | teal-500/10 | teal-500 | teal-400 | "Due now" |
| Overdue | violet-500/10 | violet-500 | violet-400 | "Overdue" |
| Completed | gray-900 | gray-700 | teal-400 ✓ | "Taken 2h ago" |

---

## Fasting timer UX patterns that work

The fasting app research revealed **circular progress as the dominant pattern** across Zero, Fastic, and Life Fasting. Key elements for your implementation:

### Timer display hierarchy:
1. **Primary**: Elapsed time in large typography (24-32pt)
2. **Secondary**: Goal time and percentage complete
3. **Tertiary**: Current metabolic phase (optional, tappable for detail)

### Color progression through fasting phases:
- **0-12h**: teal-600 → teal-500 (building toward ketosis)
- **12-16h**: teal-500 → teal-400 (ketosis zone)
- **16h+**: teal-400 → violet-400 (extended benefits)

### Start/stop pattern:
Use a **single toggle button** that changes state—"Start Fast" becomes "End Fast" with contrasting styling. Zero's research showed users prefer simplicity over separate buttons. The button should be secondary visually (the timer ring is primary), placed below the ring.

---

## Managing information density without clutter

Research indicates **5-6 cards maximum** in initial view, with 8-point grid spacing creating visual rhythm. Your six data types (injection, fasting, meals, weight, sleep, HRV) fit this limit precisely.

### Density techniques that work:

**Vertical stacking for related actions**: Injection schedule and fasting timer are both "time-based tracking"—stack them vertically in the hero zone.

**Grid layout for parallel metrics**: Weight, sleep, and HRV are status indicators without immediate actions—display as 2-column grid with equal hierarchy.

**Progressive disclosure**: Tap any metric card to reveal detailed view in a drawer/sheet, not a navigation change. This maintains context while providing depth.

**Spacing system** (Tailwind classes):
- Card padding: `p-4` (16px)
- Card gap: `gap-3` (12px)
- Section gap: `gap-6` (24px)
- All measurements on 4-point grid

### Avoiding false bottom:
Cut cards at the fold line partially—users should see ~50% of the first metric card, signaling more content below. Research shows this increases scroll rate significantly.

---

## Dark mode implementation for premium aesthetics

Analysis of Nike Training Club, Strava, Fitbit, and Apple Fitness reveals consistent dark mode patterns that feel premium:

### Color system for your stack:

```tsx
// tailwind.config.ts extension
colors: {
  background: '#0a0a0a',      // Near-black base
  surface: {
    DEFAULT: '#141414',        // Card backgrounds
    elevated: '#1a1a1a',       // Modals, sheets
  },
  primary: {
    DEFAULT: '#14b8a6',        // teal-500
    muted: 'rgba(20,184,166,0.1)',
  },
  accent: {
    DEFAULT: '#8b5cf6',        // violet-500
    muted: 'rgba(139,92,246,0.1)',
  }
}
```

### Premium techniques:

**Layered elevation**: Surface brightness increases 4-8% per layer (background → card → modal). In dark mode, elevation is shown through lightness, not shadow.

**Accent tinting**: Add subtle teal tint to gray scale—`slate-800` reads warmer and more cohesive than pure `gray-800`.

**Desaturated bright colors**: Use teal-400 and violet-400 for accents rather than -500 variants—saturated colors "vibrate" against dark backgrounds.

**Fine borders**: `border border-white/5` creates subtle card separation without harsh lines.

**Text hierarchy**:
- Primary: `text-gray-100` (not pure white—reduces eye strain)
- Secondary: `text-gray-400`
- Muted: `text-gray-500`

---

## Implementation with shadcn/ui components

### Animated checkbox for daily tracking:

```tsx
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompletionCheckbox({ checked, onComplete }) {
  return (
    <motion.button
      onClick={onComplete}
      className={cn(
        "h-10 w-10 rounded-full border-2 flex items-center justify-center",
        "transition-colors duration-200",
        checked 
          ? "bg-teal-500 border-teal-500" 
          : "bg-transparent border-gray-600 hover:border-teal-500"
      )}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Check className="h-5 w-5 text-white" />
      </motion.div>
    </motion.button>
  )
}
```

### Snackbar with undo:

```tsx
import { toast } from "@/components/ui/sonner"

const handleComplete = () => {
  setCompleted(true)
  toast("Injection logged", {
    description: "BPC-157 250mcg marked complete",
    action: {
      label: "Undo",
      onClick: () => setCompleted(false)
    },
    duration: 5000
  })
}
```

### Circular progress ring:

```tsx
export function FastingRing({ elapsed, goal }) {
  const progress = Math.min(elapsed / goal, 1)
  const circumference = 2 * Math.PI * 45 // radius of 45
  
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="64" cy="64" r="45"
          stroke="currentColor"
          className="text-gray-800"
          strokeWidth="8"
          fill="none"
        />
        <motion.circle
          cx="64" cy="64" r="45"
          stroke="currentColor"
          className="text-teal-400"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          strokeDasharray={circumference}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-gray-100">
          {formatTime(elapsed)}
        </span>
        <span className="text-sm text-gray-400">
          of {goal}h
        </span>
      </div>
    </div>
  )
}
```

---

## Final layout specification

```
┌─────────────────────────────────────────┐
│  [Header: Today · Date]                 │  48px
├─────────────────────────────────────────┤
│  💉 Injection Schedule                  │
│  ━━━━━━━━━━░░░  BPC-157 in 2d 14h      │  120px
│  [✓ Mark Done]            [Schedule →] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐    ┌─────────────────┐    │
│  │  ○───○  │    │   Log Meal      │    │
│  │ 16:42   │    │     (+)         │    │  160px
│  │ Fasting │    │  Last: 2h ago   │    │
│  └─────────┘    └─────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐      │
│  │Weight 165.2 │  │ Sleep  82   │      │
│  │↓0.3 ▁▂▃▂▁  │  │●●●●○ ▂▃▅▆▄ │      │  100px
│  └─────────────┘  └─────────────┘      │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────┐      │
│  │ HRV  45ms  ↑8%  ▁▂▃▂▄▅▃▂▄▅   │      │  80px
│  └───────────────────────────────┘      │
└─────────────────────────────────────────┘
                                Total: ~508px
```

This layout fits on a 667px iPhone SE screen with minimal scrolling, while larger devices see everything above fold. The injection schedule dominates (time-critical), fasting timer provides constant visibility, and metrics offer glanceable status without demanding attention.

---

## Key principles distilled

The research converges on five non-negotiable patterns for your peptide dashboard:

1. **Time-sensitive above fold**: Injection schedule and fasting timer occupy the hero zone—users shouldn't scroll to take daily actions

2. **One-tap completion**: Mark injections complete without confirmation dialogs; use snackbar undo instead of modal confirmations

3. **Circular for daily, linear for multi-day**: Fasting gets a ring (24h cycle), injection schedule gets a progress bar (weekly cycle)

4. **Metrics with context**: Every number needs a trend indicator—current value alone lacks meaning without direction

5. **Deliberate density**: Five to six cards maximum, 16px card padding, 12px gaps, with progressive disclosure for depth

The dashboard becomes the user's health command center—not by showing everything, but by surfacing exactly what matters right now.