# AI Insights Engine - Complete Implementation Guide

## Overview

The AI Insights Engine transforms peptide dosing logs and Garmin health data into actionable, personalized insights using Anthropic's Claude API. This document covers the complete implementation from Week 1 through Week 8.

**Key Features:**
- Garmin CSV Import (Activity data)
- Weekly AI Analysis with 6 insight types
- Interactive Chat Interface for on-demand questions
- Dashboard widget with insights preview
- Automatic dose log syncing to Supabase

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Week 1: Data Infrastructure](#week-1-data-infrastructure)
3. [Week 2: Garmin CSV Import](#week-2-garmin-csv-import)
4. [Week 3: AI Backend - Weekly Analysis](#week-3-ai-backend---weekly-analysis)
5. [Week 4: AI Backend - Chat Interface](#week-4-ai-backend---chat-interface)
6. [Week 5: UI Components](#week-5-ui-components)
7. [Week 6: Dashboard Widget](#week-6-dashboard-widget)
8. [Week 7: Dose Logs & Data Sync](#week-7-dose-logs--data-sync)
9. [Week 8: Testing & Polish](#week-8-testing--polish)
10. [API Reference](#api-reference)
11. [Database Schema](#database-schema)
12. [Security Considerations](#security-considerations)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard          │  Insights Page      │  Health Page        │
│  - InsightsWidget   │  - WeeklySummary    │  - GarminImport     │
│                     │  - InsightCards     │                     │
│                     │  - InsightsChat     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│  /api/insights          │  /api/insights/generate               │
│  /api/insights/chat     │  /api/garmin/import                   │
│  /api/dose-logs         │  /api/dose-logs/sync                  │
└─────────────────────────┴───────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    Anthropic Claude     │     │       Supabase          │
│    - claude-sonnet-4    │     │  - ai_insights          │
│    - Weekly Analysis    │     │  - garmin_activities    │
│    - Chat Responses     │     │  - dose_logs            │
└─────────────────────────┘     │  - garmin_imports       │
                                └─────────────────────────┘
```

---

## Week 1: Data Infrastructure

### 1.1 Dependencies Installed

```bash
npm install @anthropic-ai/sdk
```

### 1.2 Environment Variables

Add to `.env.local`:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 1.3 Type Definitions

**File:** `lib/types.ts`

```typescript
// Insight Types
export type InsightType = 'correlation' | 'timing' | 'compliance' | 'anomaly' | 'trend' | 'contextual'
export type InsightSeverity = 'info' | 'notable' | 'alert'
export type InsightConfidence = 'possible' | 'likely' | 'strong'

export interface Insight {
  type: InsightType
  severity: InsightSeverity
  title: string
  body: string
  metrics: string[]
  confidence: InsightConfidence
  data_points: Record<string, number | string>
}

export interface WeeklyInsights {
  id: string
  userId: string
  weekStart: string
  weekEnd: string
  metricsSummary: Record<string, unknown>
  protocolSummary: Record<string, unknown>
  correlationData: CorrelationResult[]
  insights: Insight[]
  weeklySummary: string
  recommendations: string[]
  generatedAt: string
  modelVersion: string
}

export type InsightsState = 'loading' | 'generating' | 'empty' | 'no-data' | 'error' | 'ready'

// Analysis Data Types
export interface UserAnalysisData {
  userId: string
  weekStart: string
  weekEnd: string
  activeProtocols: ProtocolSummary[]
  doseLogs: DoseLogEntry[]
  garminData: GarminDailySummary[]
  baselineMetrics: BaselineMetrics
  correlations: CorrelationResult[]
}

export interface GarminDailySummary {
  date: string
  sleep_score?: number
  sleep_duration_hours?: number
  deep_sleep_hours?: number
  light_sleep_hours?: number
  rem_sleep_hours?: number
  awake_hours?: number
  hrv_avg?: number
  hrv_low?: number
  hrv_high?: number
  resting_hr?: number
  stress_avg?: number
  stress_high?: number
  stress_low?: number
  body_battery_high?: number
  body_battery_low?: number
  steps?: number
  calories_total?: number
  active_calories?: number
  floors_climbed?: number
  intensity_minutes?: number
}
```

### 1.4 Database Migration

**File:** `supabase/migrations/20241204_ai_insights.sql`

Creates tables:
- `ai_insights` - Stores weekly AI-generated analysis
- `garmin_imports` - Tracks import history
- `dose_logs` - Stores dose log entries (migrated from localStorage)
- `insight_conversations` - For future chat persistence

Key features:
- Row Level Security (RLS) on all tables
- Automatic `updated_at` triggers
- Unique constraints to prevent duplicates
- Indexes for performance

---

## Week 2: Garmin CSV Import

### 2.1 CSV Parser

**File:** `lib/parsers/garmin-csv.ts`

Parses Garmin Connect activity CSV exports with:
- Automatic column mapping
- Date format handling (`YYYY-MM-DD HH:MM:SS`)
- Unit conversions (miles→meters, feet→meters, mph→m/s)
- Error handling for malformed data

```typescript
export function parseGarminCSV(csvContent: string): ParsedGarminActivity[]
```

**Supported columns:**
- Activity Type, Date, Title
- Distance, Calories, Time
- Avg HR, Max HR
- Total Ascent, Total Descent
- Avg Speed, Max Speed

### 2.2 Import API

**File:** `app/api/garmin/import/route.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/garmin/import` | Upload and process CSV file |
| GET | `/api/garmin/import` | Get import history and stats |

**POST Response:**
```json
{
  "success": true,
  "recordsImported": 45,
  "recordsUpdated": 3,
  "recordsSkipped": 2,
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-12-01"
  }
}
```

### 2.3 Import Hook

**File:** `hooks/use-garmin-import.ts`

```typescript
const {
  isUploading,
  uploadProgress,
  uploadError,
  lastImportResult,
  activityStats,
  uploadFile,
  fetchHistory,
  reset,
} = useGarminImport()
```

### 2.4 Import Component

**File:** `components/garmin-import.tsx`

Features:
- Drag-and-drop file upload
- Progress indicator
- Success/error states
- Collapsible export instructions
- Activity stats display

---

## Week 3: AI Backend - Weekly Analysis

### 3.1 Anthropic Client

**File:** `lib/anthropic.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateWeeklyInsights(
  userData: UserAnalysisData
): Promise<{ response: InsightsResponse; usage: TokenUsage }>
```

**System Prompt Core Principles:**
1. Never claim causation - only correlation
2. Frame as observations, not diagnoses
3. Acknowledge data limitations
4. Prioritize actionable insights
5. Be specific with numbers and dates

**Output JSON Structure:**
```json
{
  "weekly_summary": "2-3 sentence overview...",
  "insights": [
    {
      "type": "correlation|timing|compliance|anomaly|trend|contextual",
      "severity": "info|notable|alert",
      "title": "Short title",
      "body": "Detailed explanation...",
      "metrics": ["HRV", "Sleep"],
      "confidence": "possible|likely|strong",
      "data_points": {"avg_hrv": 45, "change": "+12%"}
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
```

### 3.2 Data Aggregation

**File:** `lib/analysis/data-aggregation.ts`

```typescript
export async function aggregateUserData(
  userId: string,
  weekStart: string,
  weekEnd: string
): Promise<UserAnalysisData>
```

Aggregates:
- Active protocols
- Dose logs for the week
- Garmin daily summaries
- 4-week baseline metrics
- Pre-calculated correlations

### 3.3 Statistical Analysis

**File:** `lib/analysis/statistics.ts`

Functions:
- `calculateCorrelations()` - Time-lagged correlation between doses and metrics
- `detectOutliers()` - IQR method outlier detection
- `calculateTrend()` - Linear regression slope
- `calculateComplianceRate()` - Dose adherence percentage
- `compareToBaseline()` - Current vs 4-week baseline

### 3.4 Data Validation

**File:** `lib/analysis/validation.ts`

```typescript
export function validateDataSufficiency(
  data: UserAnalysisData
): DataValidationResult
```

Minimum requirements:
- 7 days of Garmin data
- 3 logged doses
- At least 1 active protocol

Data quality ratings:
- `excellent` - 90%+ score
- `good` - 70-90% score
- `fair` - 50-70% score
- `insufficient` - <50% score

### 3.5 Generate Insights API

**File:** `app/api/insights/generate/route.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/insights/generate` | Generate weekly AI analysis |

**Flow:**
1. Authenticate user
2. Calculate week boundaries (Monday-Sunday)
3. Check for cached results (<1 hour old)
4. Aggregate user data
5. Validate data sufficiency
6. Call Claude API
7. Store results in `ai_insights` table
8. Return insights

**Response:**
```json
{
  "success": true,
  "insightsId": "uuid",
  "insights": { ... },
  "weekStart": "2024-12-02",
  "weekEnd": "2024-12-08",
  "usage": { "inputTokens": 1500, "outputTokens": 800 },
  "dataQuality": "good"
}
```

---

## Week 4: AI Backend - Chat Interface

### 4.1 Chat API

**File:** `app/api/insights/chat/route.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/insights/chat` | Send chat message, receive streamed response |

**Request:**
```json
{
  "message": "How has my sleep been this week?",
  "conversationHistory": [...]
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"type":"start"}
data: {"type":"delta","content":"Based on"}
data: {"type":"delta","content":" your data..."}
data: {"type":"done","usage":{"input":500,"output":200}}
```

### 4.2 Chat Context Builder

```typescript
export async function aggregateChatContext(
  userId: string
): Promise<ChatContext>
```

Includes:
- Active protocols with recent doses
- Last 14 days of Garmin data
- Latest AI insights (if available)
- Recent dose logs

### 4.3 Chat Hook

**File:** `hooks/use-insights-chat.ts`

```typescript
const {
  messages,
  isLoading,
  error,
  sendMessage,
  clearMessages,
} = useInsightsChat()
```

Features:
- Streaming response handling
- Abort controller for cancellation
- Message history management
- Error handling

---

## Week 5: UI Components

### 5.1 Insight Card

**File:** `components/insight-card.tsx`

Displays individual insights with:
- Type icon (correlation, timing, etc.)
- Severity badge (info, notable, alert)
- Expandable body text
- Metric pills
- Confidence indicator
- Data points display

### 5.2 Weekly Summary

**File:** `components/weekly-summary.tsx`

- Date range display
- Prose summary
- Numbered recommendations list
- Brain icon header

### 5.3 Generate Analysis Button

**File:** `components/generate-analysis-button.tsx`

States:
- Idle - "Generate Weekly Analysis"
- Generating - Spinner with text
- Success - Checkmark animation
- Error - Error message

Variants: `default` | `compact`

### 5.4 Empty States

**File:** `components/insights-empty-state.tsx`

Variants:
- `no-analysis` - First time, prompt to generate
- `insufficient-data` - Need more data (links to import)
- `no-garmin` - No Garmin data (links to Health page)

### 5.5 Chat Interface

**File:** `components/insights-chat.tsx`

Features:
- Message list with user/assistant styling
- Typing indicator animation
- Suggested question chips
- Auto-scroll to latest message
- Clear chat button
- Medical disclaimer

**Suggested Questions:**
- "How has my sleep changed this week?"
- "What correlations do you see in my data?"
- "When's the best time for my morning peptides?"
- "Summarize my compliance this week"

### 5.6 Insights Page

**File:** `app/insights/page.tsx`

Layout:
- Left column (2/3): Insights content
- Right column (1/3): Chat interface (sticky)

States:
- `loading` - Skeleton placeholders
- `generating` - Spinner with message
- `empty` - No analysis prompt
- `no-data` - Insufficient data message
- `error` - Error with retry button
- `ready` - Full insights display

---

## Week 6: Dashboard Widget

### 6.1 Weekly Insights Widget

**File:** `components/weekly-insights-widget.tsx`

Compact card showing:
- Latest featured insight (highest severity)
- Insight count
- Date range
- Link to full insights page

States:
- Loading skeleton
- No insights (get started prompt)
- Has insights (featured insight display)

### 6.2 Dashboard Integration

**File:** `app/page.tsx`

Widget placement: Right column, below compliance gauge

---

## Week 7: Dose Logs & Data Sync

### 7.1 Dose Logs API

**File:** `app/api/dose-logs/route.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dose-logs` | Fetch user's dose logs |
| POST | `/api/dose-logs` | Create/update dose log |

**Query Parameters (GET):**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `limit` - Max records (default: 100)

### 7.2 Sync API

**File:** `app/api/dose-logs/sync/route.ts`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dose-logs/sync` | Check sync status |
| POST | `/api/dose-logs/sync` | Migrate localStorage to Supabase |

**POST Request:**
```json
{
  "logs": [
    {
      "protocolId": "...",
      "peptideName": "BPC-157",
      "dose": "250mcg",
      "scheduledFor": "2024-12-01T08:00:00Z",
      "status": "taken"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "synced": 45,
  "skipped": 3,
  "message": "Synced 45 logs, skipped 3 duplicates"
}
```

### 7.3 Sync Hook

**File:** `hooks/use-dose-logs-sync.ts`

```typescript
const {
  status,
  isSyncing,
  error,
  needsSync,
  syncFromLocalStorage,
  clearLocalAfterSync,
} = useDoseLogsSync()
```

### 7.4 Storage Updates

**File:** `lib/storage.ts`

New functions:
- `hasSyncedToSupabase()` - Check sync status
- `markAsSynced()` - Mark as synced
- `getLocalLogsCount()` - Count local logs
- `syncDoseLogToServer()` - Sync single log

Updated functions:
- `markDoseAsTaken()` - Now syncs to server
- `markDoseAsSkipped()` - Now syncs to server

---

## Week 8: Testing & Polish

### 8.1 Updated Page Objects

**InsightsPage** (`tests/page-objects/InsightsPage.ts`):
- Page states (loading, generating, empty, etc.)
- Chat interface elements
- Weekly summary and insight cards

**HealthPage** (`tests/page-objects/HealthPage.ts`):
- Garmin import section
- Import instructions collapsible
- Health metric cards

**DashboardPage** (`tests/page-objects/DashboardPage.ts`):
- AI Insights widget
- Due Today section
- Weekly overview

### 8.2 E2E Test Suite

**File:** `tests/e2e/ai-insights.spec.ts`

**Test Categories:**

1. **Insights Page UI States** (4 tests)
   - Page loads with heading
   - Chat interface visible
   - Suggested questions shown
   - Appropriate empty state

2. **Dashboard Insights Widget** (3 tests)
   - Widget visible on dashboard
   - Shows appropriate content
   - Navigation to insights page

3. **Health Page Garmin Import** (3 tests)
   - Import section visible
   - File input present
   - Instructions expandable

4. **Chat Interface** (3 tests)
   - Input accepts text
   - Send button visible
   - Disclaimer shown

5. **Navigation Flow** (3 tests)
   - Dashboard to insights
   - Sidebar navigation
   - Insights to health

6. **Responsive Layout** (2 tests)
   - Mobile insights page
   - Mobile health page

7. **API Endpoints** (6 tests)
   - All endpoints require authentication

### 8.3 Test Results

```
Smoke Tests:     11 passed
AI Insights:     22 passed, 2 skipped (mobile-only)
```

---

## API Reference

### Authentication

All API endpoints require authentication via Supabase session cookie. Unauthenticated requests return `401 Unauthorized`.

### Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/insights` | GET | Fetch insights history |
| `/api/insights` | DELETE | Delete insight by ID |
| `/api/insights/generate` | POST | Generate weekly analysis |
| `/api/insights/chat` | POST | Chat with AI (streaming) |
| `/api/garmin/import` | GET | Get import history/stats |
| `/api/garmin/import` | POST | Upload CSV file |
| `/api/dose-logs` | GET | Fetch dose logs |
| `/api/dose-logs` | POST | Create/update dose log |
| `/api/dose-logs/sync` | GET | Check sync status |
| `/api/dose-logs/sync` | POST | Sync localStorage to DB |

### Rate Limiting

- Insights generation: Cached for 1 hour per user
- Chat: No explicit limit (Anthropic rate limits apply)

---

## Database Schema

### ai_insights

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| week_start | DATE | Monday of analysis week |
| week_end | DATE | Sunday of analysis week |
| metrics_summary | JSONB | Aggregated metrics data |
| protocol_summary | JSONB | Protocol activity summary |
| correlation_data | JSONB | Pre-calculated correlations |
| insights | JSONB | Array of Insight objects |
| weekly_summary | TEXT | Prose summary |
| recommendations | JSONB | Array of recommendations |
| generated_at | TIMESTAMPTZ | Generation timestamp |
| model_version | TEXT | Claude model version |
| input_tokens | INTEGER | API usage tracking |
| output_tokens | INTEGER | API usage tracking |

**Unique Constraint:** `(user_id, week_start)`

### garmin_imports

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| import_date | TIMESTAMPTZ | When import occurred |
| file_name | TEXT | Original file name |
| file_type | TEXT | 'activity_csv' or 'full_export' |
| records_imported | INTEGER | New records count |
| records_skipped | INTEGER | Skipped records count |
| records_updated | INTEGER | Updated records count |
| date_range_start | DATE | Earliest activity date |
| date_range_end | DATE | Latest activity date |
| status | TEXT | 'processing', 'completed', 'failed' |

### dose_logs

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| protocol_id | TEXT | Protocol identifier |
| peptide_name | TEXT | Peptide name |
| dose | TEXT | Dose amount |
| dose_number | INTEGER | Dose number in day |
| scheduled_for | TIMESTAMPTZ | Scheduled time |
| taken_at | TIMESTAMPTZ | Actual taken time |
| status | TEXT | 'pending', 'taken', 'skipped', 'overdue' |
| notes | TEXT | Optional notes |

---

## Security Considerations

### API Key Protection

- `ANTHROPIC_API_KEY` is server-side only
- Never exposed to client
- Set via environment variable

### User Data Isolation

- Row Level Security (RLS) on all tables
- Policies enforce `user_id = auth.uid()`
- No cross-user data access possible

### File Validation

- CSV file type checking
- Size limits (5MB max)
- Content parsing (no execution)

### Input Sanitization

- User messages sanitized before Claude API
- JSON responses validated
- SQL injection prevented by Supabase client

### Privacy

- Health data stays in user's account
- No third-party data sharing
- Clear privacy messaging in UI

---

## File Summary

### New Files Created

```
lib/
├── anthropic.ts                    # Claude API client
├── parsers/
│   ├── garmin-csv.ts              # CSV parser
│   ├── garmin-json.ts             # JSON parser
│   └── index.ts                   # Exports
└── analysis/
    ├── data-aggregation.ts        # Data fetching
    ├── statistics.ts              # Statistical analysis
    ├── validation.ts              # Data validation
    └── index.ts                   # Exports

app/api/
├── insights/
│   ├── route.ts                   # GET/DELETE insights
│   ├── generate/route.ts          # POST generate
│   └── chat/route.ts              # POST chat (SSE)
├── garmin/
│   └── import/route.ts            # GET/POST import
└── dose-logs/
    ├── route.ts                   # GET/POST logs
    └── sync/route.ts              # GET/POST sync

hooks/
├── use-garmin-import.ts           # Import state
├── use-insights-chat.ts           # Chat state
└── use-dose-logs-sync.ts          # Sync state

components/
├── garmin-import.tsx              # Import UI
├── insight-card.tsx               # Single insight
├── weekly-summary.tsx             # Summary display
├── generate-analysis-button.tsx   # Generate CTA
├── insights-empty-state.tsx       # Empty states
├── insights-chat.tsx              # Chat interface
└── weekly-insights-widget.tsx     # Dashboard widget

tests/
├── page-objects/
│   ├── InsightsPage.ts            # Updated
│   ├── HealthPage.ts              # Updated
│   └── DashboardPage.ts           # Updated
└── e2e/
    └── ai-insights.spec.ts        # New test suite

supabase/migrations/
└── 20241204_ai_insights.sql       # Database schema

docs/
└── AI-INSIGHTS-ENGINE.md          # This file
```

### Modified Files

```
lib/types.ts                       # Added insight types
lib/storage.ts                     # Added sync functions
app/insights/page.tsx              # Complete rewrite
app/health/page.tsx                # Added GarminImport
app/page.tsx                       # Added widget
```

---

## Future Enhancements

1. **Chat Persistence** - Save conversations to `insight_conversations` table
2. **Garmin Full Export** - Parse JSON files for sleep/HRV/stress
3. **Automated Weekly Analysis** - Cron job for weekly generation
4. **Trend Charts** - Metric charts with protocol event overlays
5. **Export Insights** - PDF/email export functionality
6. **Notification System** - Alert users when new insights available
