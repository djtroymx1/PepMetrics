# PepMetrics - Project Context for Claude Code

> **Last Updated:** December 3, 2024
> **Status:** UI Scaffold Complete, Ready for Backend Integration

## Quick Summary

PepMetrics is a peptide tracking and health optimization web application. The frontend UI has been built and deployed to Vercel. The next phase is backend integration with Supabase and Garmin Health API.

**Live Site:** https://pep-metrics.vercel.app
**GitHub:** https://github.com/djtroymx1/PepMetrics

---

## What's Been Built

### Tech Stack
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **Components:** shadcn/ui (customized)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Fonts:** Inter (UI), JetBrains Mono (metrics/numbers)

### Design System

**Theme:** Dark mode first (user preference confirmed)

**Colors (CSS Variables in globals.css):**
- Primary: `#14b8a6` (teal) - health/tracking actions
- Accent: `#8b5cf6` (violet) - AI features
- Background: `#09090b` (near-black)
- Card/Surface: `#18181b`
- Elevated: `#1f1f23`
- Success: `#22c55e` (green)
- Warning: `#f59e0b` (amber)
- Error: `#ef4444` (red)

**Design Principles:**
- Flat surfaces with subtle borders, no harsh shadows
- Rounded corners: 12px cards, 8px buttons, full for avatars/gauges
- Gradient cards for key metrics (amber, rose, violet, indigo)
- Tabular-nums on all numeric displays for alignment

### Pages Implemented

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Dashboard | `/` | ✅ Complete | Fasting timer, schedule, metrics overview |
| Protocols | `/protocols` | ✅ Complete | Protocol list, vial inventory, reconstitution calculator |
| Health | `/health` | ✅ Complete | Garmin connection UI, sleep/HRV/activity charts |
| Progress | `/progress` | ✅ Complete | Weight trends, measurements, progress photos, check-ins |
| Calendar | `/calendar` | ✅ Complete | Month view with injection/meal overlays |
| AI Insights | `/insights` | ✅ Complete | Correlation cards, chat interface |
| Bloodwork | `/bloodwork` | ✅ Complete | Biomarker categories, range visualization |
| Settings | `/settings` | ✅ Complete | Profile, integrations, notifications, data management |

### Key Components

**Navigation:**
- `app-sidebar.tsx` - Collapsible desktop sidebar (240px/64px)
- `mobile-nav.tsx` - Bottom tab bar with floating "+" button

**Dashboard Components:**
- `fasting-timer.tsx` - Shows fasting progress, "Safe to Inject" status based on 2hr+ fast
- `schedule-card.tsx` - Today's schedule with quick-log capability
- `circular-gauge.tsx` - Reusable gauge with glow effect

**Protocol Components:**
- `protocol-list.tsx` - Card-based protocol management
- `vial-inventory.tsx` - Visual remaining doses with low-stock alerts
- `reconstitution-calculator.tsx` - BAC water calculator

**Health Components:**
- `garmin-connect.tsx` - OAuth connection UI (not yet functional)
- `sleep-chart.tsx`, `hrv-chart.tsx`, `activity-chart.tsx` - Recharts visualizations
- `metric-card.tsx` - Reusable metric display

**Logging:**
- `quick-log-modal.tsx` - Multi-tab modal for Injection/Meal/Weight/Water logging

---

## User's Peptide Stack (Use for Realistic Data)

The app owner uses these peptides - always use these for sample data, NOT generic names like "Semaglutide":

| Peptide | Dose | Frequency | Notes |
|---------|------|-----------|-------|
| Retatrutide | 2mg | Weekly | GLP-1/GIP/Glucagon agonist, requires fasting |
| BPC-157 | 250mcg | Daily | Recovery, can take with food |
| MOTS-c | 10mg | 2x/week | Mitochondrial peptide, morning fasted |
| TB-500 | 500mcg | Daily | Recovery stack with BPC-157 |
| Tesamorelin | varies | Daily | GH releasing, requires fasting |
| Epithalon | varies | Cycling | Telomerase activation |
| GHK-Cu | varies | Daily | Skin/healing |
| SS-31 | varies | Daily | Mitochondrial support |

**User Name:** Troy
**Membership:** Pro Member

---

## What Needs to Be Built Next

### Phase 1: Backend Foundation (Priority)

1. **Supabase Setup**
   - Create project
   - Design database schema (see below)
   - Set up Row Level Security (RLS)
   - Configure auth (email/password + OAuth)

2. **Database Schema Needed:**
   ```
   users
   protocols (user_id, name, peptides[], frequency, start_date, status)
   vials (user_id, peptide_name, total_mg, remaining_mg, reconstitution_date)
   injections (user_id, protocol_id, peptide, dose, site, timestamp)
   meals (user_id, type, timestamp, notes)
   weights (user_id, value, unit, timestamp)
   water_intake (user_id, amount, timestamp)
   fasting_windows (user_id, start_time, end_time, target_hours)
   bloodwork_results (user_id, test_date, biomarkers JSONB)
   progress_photos (user_id, photo_url, type, timestamp)
   check_ins (user_id, date, mood, energy, sleep_quality, notes)
   garmin_data (user_id, date, sleep JSONB, hrv, stress, steps, etc.)
   ```

3. **Garmin Health API Integration**
   - API access requires application approval (1-4 weeks)
   - OAuth 1.0a flow
   - Webhook endpoints for push notifications
   - Data we need: Sleep stages, HRV, stress, Body Battery, steps, activities

### Phase 2: Core Functionality

1. **Quick Log Modal** - Wire up to Supabase
2. **Fasting Timer** - Persist state, calculate from last meal
3. **Protocol CRUD** - Create, edit, delete protocols
4. **Vial Management** - Track reconstitution, auto-decrement on injection

### Phase 3: AI Features

1. **Bloodwork PDF Parsing** - Upload PDF → Claude API → Extract biomarkers
2. **Correlation Engine** - Analyze peptide timing vs. health metrics
3. **Chat Interface** - Natural language queries about user's data

---

## Legal Considerations (Already Researched)

- **FDA:** App is legal as tracking/logging tool. No medical claims, no dosing recommendations.
- **App Stores:** PWA-first strategy avoids Apple/Google review issues. Can list as "supplement tracker."
- **HIPAA:** Does NOT apply (we're not a covered entity)
- **FTC Health Breach Rule:** DOES apply - need breach notification procedures
- **Data Privacy:** Need clear privacy policy, data export, account deletion

---

## File Structure

```
pepmetrics/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── layout.tsx            # Root layout with fonts
│   ├── globals.css           # Global styles
│   ├── bloodwork/page.tsx
│   ├── calendar/page.tsx
│   ├── health/page.tsx
│   ├── insights/page.tsx
│   ├── progress/page.tsx
│   ├── protocols/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── ui/                   # shadcn components
│   ├── app-sidebar.tsx
│   ├── mobile-nav.tsx
│   ├── fasting-timer.tsx
│   ├── schedule-card.tsx
│   ├── circular-gauge.tsx
│   ├── protocol-list.tsx
│   ├── vial-inventory.tsx
│   ├── garmin-connect.tsx
│   ├── quick-log-modal.tsx
│   └── [other components]
├── styles/
│   └── globals.css           # Design system CSS variables
├── lib/
│   └── utils.ts              # Utility functions
├── hooks/
│   └── use-toast.ts
├── PepMetrics-PRD.md         # Product Requirements Document
└── CLAUDE-CONTEXT.md         # This file
```

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Deploy (auto-deploys on push to GitHub)
git add .
git commit -m "your message"
git push
```

---

## Important Notes

1. **Dark Mode:** The app uses dark mode by default. The color system is defined in `styles/globals.css` with CSS variables.

2. **Realistic Data:** Always use Troy's actual peptide names (Retatrutide, BPC-157, MOTS-c, etc.), not generic placeholders.

3. **Fasting Logic:** Key feature - show "Safe to Inject" when fasted 2+ hours for peptides that require fasting (Retatrutide, MOTS-c, Tesamorelin).

4. **Mobile First:** Bottom nav on mobile, sidebar on desktop. The floating "+" button triggers the quick-log modal.

5. **No Auth Yet:** Currently no authentication. All data is mock/static. Supabase integration is the next major milestone.

---

## Questions? Context Missing?

If you need more context about any decision or feature, check:
- `PepMetrics-PRD.md` - Full product requirements
- The live site at https://pep-metrics.vercel.app
- Ask Troy for clarification on peptide-specific requirements
