# PepMetrics Refactor Implementation Prompt

> **Goal:** Simplify PepMetrics from a complex peptide management app to a focused dose tracking and scheduling tool. Remove mixing/reconstitution features, add robust scheduling with cycling support, and preserve the existing UI design system.

---

## Context

**Repository:** https://github.com/djtroymx1/PepMetrics  
**Live Site:** https://pep-metrics.vercel.app  
**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, Lucide icons

The app currently has a full UI scaffold with mock data. We're refactoring the core functionality before adding Supabase backend integration.

---

## What to REMOVE

1. **Reconstitution Calculator** (`reconstitution-calculator.tsx` or similar)
   - Delete the component entirely
   - Remove any imports/references from the Protocols page

2. **Vial Inventory Tracking** (`vial-inventory.tsx` or similar)
   - Delete the component
   - Remove from Protocols page
   - We no longer track remaining doses in vials

3. **Any mixing/BAC water guidance** - Remove any UI or copy related to reconstitution, mixing ratios, or water calculations

---

## What to BUILD

### 1. Peptide Database (Static for now, Supabase later)

Create `/lib/peptides.ts` with a comprehensive list of peptides. Each entry should have:

```typescript
interface PeptideDefinition {
  id: string;
  name: string;
  category: 'glp1-agonist' | 'growth-hormone' | 'recovery' | 'mitochondrial' | 'longevity' | 'cosmetic' | 'other';
  commonDoses: string[]; // e.g., ["250mcg", "500mcg", "1mg"]
  typicalFrequency: string; // e.g., "Daily", "Weekly", "2x/week"
  requiresFasting: boolean;
  notes?: string;
}
```

**Include these peptides (minimum):**

**GLP-1 Agonists:**
- Retatrutide
- Tirzepatide (Mounjaro/Zepbound)
- Semaglutide (Ozempic/Wegovy)
- Liraglutide
- CagriSema

**Growth Hormone Releasing:**
- Tesamorelin
- Ipamorelin
- CJC-1295 (with and without DAC)
- Sermorelin
- GHRP-2
- GHRP-6
- MK-677 (Ibutamoren)
- Hexarelin

**Recovery/Healing:**
- BPC-157
- TB-500 (Thymosin Beta-4)
- KPV
- Pentadeca Arginate (PDA)
- GHK-Cu
- Thymosin Alpha-1

**Mitochondrial/Longevity:**
- MOTS-c
- SS-31 (Elamipretide)
- Epithalon
- DSIP (Delta Sleep Inducing Peptide)
- Selank
- Semax

**Other:**
- Melanotan II
- PT-141 (Bremelanotide)
- Kisspeptin
- AOD-9604
- 5-Amino-1MQ
- NAD+ (injectable)

Also include a "Custom" option that allows freeform entry.

---

### 2. Protocol Data Model

Create `/lib/types.ts` with these interfaces:

```typescript
interface Protocol {
  id: string;
  odId: string;
  peptideId: string; // references PeptideDefinition.id or "custom"
  customPeptideName?: string; // only if peptideId === "custom"
  dose: string; // e.g., "2mg", "250mcg"
  
  // Scheduling
  frequencyType: 'daily' | 'specific-days' | 'every-x-days' | 'cycling';
  
  // For 'specific-days': which days of the week
  specificDays?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  
  // For 'every-x-days': interval
  intervalDays?: number;
  
  // For 'cycling': on/off pattern
  cycleOnDays?: number;
  cycleOffDays?: number;
  cycleStartDate?: string; // ISO date when cycle began
  
  // Timing
  timingPreference: 'morning-fasted' | 'morning-with-food' | 'afternoon' | 'evening' | 'before-bed' | 'any-time';
  preferredTime?: string; // optional specific time like "08:00"
  
  // Multi-dose tracking
  dosesPerDay: number; // 1, 2, or 3
  
  // Status
  status: 'active' | 'paused';
  startDate: string; // ISO date
  
  createdAt: string;
  updatedAt: string;
}

interface DoseLog {
  id: string visudo
  odId: string;
  protocolId: string;
  peptideName: string; // denormalized for easy display
  dose: string;
  doseNumber?: number; // 1, 2, or 3 if multi-dose
  scheduledFor: string; // ISO datetime when it was due
  takenAt?: string; // ISO datetime when actually taken (null if not yet taken)
  status: 'pending' | 'taken' | 'skipped' | 'overdue';
  notes?: string;
}
```

---

### 3. Scheduling Logic

Create `/lib/scheduling.ts` with functions:

```typescript
// Calculate the next dose date based on protocol settings
function getNextDoseDate(protocol: Protocol, lastDoseDate?: Date): Date

// Check if a protocol is due today
function isDueToday(protocol: Protocol, doseHistory: DoseLog[]): boolean

// Check if a dose is overdue
function isOverdue(protocol: Protocol, doseHistory: DoseLog[]): boolean

// For cycling protocols, determine if currently in "on" or "off" phase
function getCyclePhase(protocol: Protocol): 'on' | 'off'

// Generate upcoming doses for the next X days (for calendar view)
function getUpcomingDoses(protocols: Protocol[], days: number): ScheduledDose[]
```

---

### 4. Updated Protocols Page (`/app/protocols/page.tsx`)

Redesign to show:

1. **Active Protocols List**
   - Card for each protocol showing: peptide name, dose, frequency summary, timing preference, next dose due
   - Quick actions: Mark as taken, Pause, Edit, Delete
   - Visual indicator for "due today" or "overdue"

2. **Add Protocol Button**
   - Opens a modal/drawer with:
     - Peptide selector (searchable dropdown from peptide database)
     - Dose input (with common dose suggestions based on selected peptide)
     - Frequency selector (tabs or radio for daily/specific-days/every-x-days/cycling)
     - Dynamic fields based on frequency type
     - Timing preference dropdown
     - Doses per day selector (1, 2, or 3)
     - Start date picker

3. **Paused Protocols Section** (collapsed by default)

---

### 5. Updated Dashboard (`/app/page.tsx`)

Reorganize into:

1. **Due Today Section** (top priority)
   - List of protocols due today with one-tap "Mark as Taken" button
   - For multi-dose protocols, show "Dose 1 of 3" style indicator
   - Show timing preference as a subtle label (e.g., "Morning, fasted")

2. **Overdue Section** (alert style, only shows if there are overdue doses)
   - Red/warning styling
   - Shows what was missed and when

3. **Fasting Timer** (KEEP THIS - it's a key feature)
   - Keep the existing circular timer design
   - Show "Safe to Inject" status for fasting-required peptides
   - Connect to the timing preference data - highlight which protocols need fasting

4. **Weekly Overview** (lower on page)
   - 7-day calendar strip showing upcoming doses
   - Tap a day to see details

5. **Recent Activity** (optional, lower priority)
   - Last 5-7 logged doses

---

### 6. Calendar Page Updates (`/app/calendar/page.tsx`)

- Show scheduled doses on each day
- Past days show logged doses (taken/skipped)
- Future days show upcoming scheduled doses
- Tap a day to see full details and log doses

---

### 7. State Management (Temporary)

Until Supabase is integrated, use localStorage to persist:
- User's protocols
- Dose history (last 90 days)
- Fasting timer state

Create `/lib/storage.ts`:

```typescript
function saveProtocols(protocols: Protocol[]): void
function getProtocols(): Protocol[]
function saveDoseLog(log: DoseLog): void
function getDoseLogs(startDate: Date, endDate: Date): DoseLog[]
function saveFastingStart(timestamp: Date): void
function getFastingStart(): Date | null
```

---

## UI/UX Guidelines

1. **Preserve the existing design system** - dark mode, teal primary, violet accent, gradient cards
2. **Keep the fasting timer** - it's visually distinctive and functional
3. **Use existing shadcn/ui components** where possible
4. **Mobile-first** - the bottom nav and quick-log patterns should work well on phones
5. **Timing preferences should be visually clear** - use icons or color coding:
   - Morning fasted: sunrise + empty plate icon
   - Morning with food: sunrise + food icon
   - Before bed: moon icon
   - etc.

---

## Files to Modify

1. `/app/page.tsx` - Dashboard redesign
2. `/app/protocols/page.tsx` - Remove reconstitution, add new protocol management
3. `/app/calendar/page.tsx` - Connect to scheduling logic
4. `/components/protocol-list.tsx` - Refactor for new data model
5. `/components/quick-log-modal.tsx` - Simplify for dose logging only
6. `/components/fasting-timer.tsx` - Keep but connect to protocol timing data

## Files to Create

1. `/lib/peptides.ts` - Peptide database
2. `/lib/types.ts` - TypeScript interfaces
3. `/lib/scheduling.ts` - Scheduling logic functions
4. `/lib/storage.ts` - localStorage wrapper
5. `/components/add-protocol-modal.tsx` - New protocol creation flow
6. `/components/dose-card.tsx` - Reusable dose display component
7. `/components/timing-badge.tsx` - Visual timing preference indicator

## Files to Delete

1. `/components/reconstitution-calculator.tsx` (if exists)
2. `/components/vial-inventory.tsx` (if exists)
3. Any related utility functions for reconstitution math

---

## Testing Checklist

After implementation, verify:

- [ ] Can add a new protocol with all frequency types
- [ ] Can add a custom peptide not in the list
- [ ] Cycling protocols correctly show on/off days
- [ ] Dashboard shows "Due Today" correctly
- [ ] Overdue doses are highlighted
- [ ] Marking a dose as taken calculates next dose correctly
- [ ] Multi-dose protocols show "1 of 3" tracking
- [ ] Fasting timer still works and connects to fasting-required protocols
- [ ] Calendar shows past and future doses
- [ ] Data persists across page refreshes (localStorage)
- [ ] Mobile layout works correctly
- [ ] No console errors

---

## Do NOT Change

- Overall app structure and routing
- Design system colors and tokens
- Font choices (Inter + JetBrains Mono)
- Mobile navigation pattern
- Health page (Garmin integration - separate feature)
- Bloodwork page (separate feature)
- Settings page structure
- AI Insights page (future feature)

---

## Notes for Implementation

1. Start with the data model and types - get those right first
2. Build the scheduling logic with unit tests if possible
3. Then update the UI components
4. Test thoroughly on mobile viewport sizes
5. Keep commits atomic - one feature per commit for easy rollback

**User's name is Troy and he's a Pro Member** - use this in any personalized UI elements.
