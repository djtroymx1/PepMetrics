---
name: pepmetrics-dev
description: Core development patterns and architecture for PepMetrics. Use when building features or understanding the codebase.
---

# PepMetrics Development Guide

## Project Overview

PepMetrics is a personal health and peptide protocol tracking application for biohackers.

**User**: Troy (test user throughout the app)
**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Tremor

## Architecture

### Page Structure

Every page follows this consistent pattern:

```tsx
"use client"  // Required for interactive pages

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

export default function PageName() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">Page Title</h1>
            <p className="text-muted-foreground mt-1">Description</p>
          </div>

          {/* Content */}
          <div className="grid gap-6">
            {/* Page components */}
          </div>
        </div>
      </main>
    </div>
  )
}
```

### File Organization

```
pepmetrics/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Dashboard (/)
│   ├── protocols/page.tsx   # Protocol management
│   ├── health/page.tsx      # Health metrics
│   ├── progress/page.tsx    # Progress tracking
│   ├── calendar/page.tsx    # Calendar view
│   ├── insights/page.tsx    # AI insights
│   ├── bloodwork/page.tsx   # Lab results
│   └── settings/page.tsx    # User settings
│
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── dashboard/           # Dashboard-specific components
│   ├── health/              # Health page components
│   ├── protocols/           # Protocol page components
│   ├── progress/            # Progress page components
│   ├── app-sidebar.tsx      # Main navigation
│   ├── mobile-nav.tsx       # Bottom nav for mobile
│   └── theme-toggle.tsx     # Dark mode toggle
│
├── tests/
│   ├── e2e/                 # Playwright tests
│   ├── fixtures/            # Test data (Troy's data)
│   └── page-objects/        # Page object models
│
└── .claude/skills/          # Claude Code skills
```

## Component Patterns

### Feature Component Organization

Each feature area has its own component folder with an index file:

```typescript
// components/dashboard/index.ts
export { ActivitySparkCard } from "./activity-spark-card"
export { SleepSparkCard } from "./sleep-spark-card"
// ... etc
```

### Card Component Pattern

```tsx
import { Card } from "@/components/ui/card"  // or @tremor/react

interface MyCardProps {
  title: string
  value: number
  // ...
}

export function MyCard({ title, value }: MyCardProps) {
  return (
    <Card className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  )
}
```

## Styling Conventions

### Design System Colors

```css
/* Primary: Teal */
--primary: #14b8a6  /* teal-500 */

/* Accent: Violet */
--accent: #8b5cf6   /* violet-500 */

/* Status Colors */
--success: emerald-500
--warning: amber-500
--error: rose-500
```

### Common Tailwind Patterns

```tsx
// Card styling
"rounded-2xl border border-border bg-card"

// Icon containers
"flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"

// Section headers
"px-5 py-4 border-b border-border bg-muted/30"

// Primary buttons
"px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium"

// Form inputs
"rounded-lg border border-border bg-muted px-3 py-2.5 text-sm"
```

### Responsive Grid

```tsx
// 2-col on tablet, 4-col on desktop
"grid gap-6 md:grid-cols-2 lg:grid-cols-4"

// Sidebar offset
"lg:pl-64 pb-20 lg:pb-0"  // Account for sidebar and mobile nav
```

## Data Conventions

### Troy's Test Data

All UI displays Troy's data:
- Name: Troy
- Email: troy@example.com
- Membership: Pro Member
- Peptides: Retatrutide, BPC-157, MOTS-c, TB-500, Tesamorelin, Epithalon, GHK-Cu, SS-31

### Health Metrics (Sample)

```typescript
const healthMetrics = {
  steps: 8200,
  sleepScore: 87,
  hrv: 62,
  stress: 32,
  activeMinutes: 42,
  calories: 2340,
}
```

## Dependencies

### React 19 Compatibility

```bash
# Always use --legacy-peer-deps for installs
npm install --legacy-peer-deps
```

### Key Libraries

| Library | Purpose |
|---------|---------|
| `@tremor/react` | Charts and data viz |
| `lucide-react` | Icons |
| `next-themes` | Dark mode |
| `date-fns` | Date formatting |
| `react-hook-form` + `zod` | Forms |

## Quick Reference

### Adding a New Page

1. Create `app/[page-name]/page.tsx`
2. Follow the page structure template
3. Create components in `components/[page-name]/`
4. Add index.ts exporting all components
5. Add page object in `tests/page-objects/`
6. Add route to `tests/fixtures/test-data.ts`

### Adding a Dashboard Card

1. Create component in `components/dashboard/`
2. Export from `components/dashboard/index.ts`
3. Import in `app/page.tsx`
4. Add to DashboardPage page object if testable
