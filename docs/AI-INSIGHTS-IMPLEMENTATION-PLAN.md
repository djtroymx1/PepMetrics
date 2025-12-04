# PepMetrics AI Insights Engine - Implementation Plan

> **Document Purpose:** Technical implementation roadmap for the AI Insights Engine feature
> **Status:** Approved for Development
> **Reference:** [pepmetrics-ai-insights-spec.md](../pepmetrics-ai-insights-spec.md)

---

## Overview

This plan implements the **complete** AI Insights Engine as specified in the feature spec. The feature transforms peptide dosing logs and Garmin health data into actionable, personalized insights using Anthropic's Claude API.

### Full Feature Scope

1. **Garmin Data Import** - Activity CSV + Full Data Export JSON
2. **Weekly Analysis** - All 6 insight types (Correlation, Timing, Compliance, Anomaly, Trend, Contextual)
3. **Chat Interface** - On-demand questions about user data
4. **Manual Trigger** - Generate analysis button (future: automated weekly)
5. **Dashboard Widget** - Insights preview on home page
6. **Trend Charts** - Metrics over 4-8 weeks with protocol event overlays

### Tech Stack

- **AI Provider:** Anthropic Claude API
  - Weekly Analysis: `claude-sonnet-4-20250514`
  - Chat Interface: `claude-haiku-4-5-20251001`
- **Database:** Supabase (PostgreSQL + RLS)
- **Frontend:** Next.js 16, React 19, TypeScript, Recharts
- **UI Components:** Shadcn/Radix UI + Tailwind CSS

---

## Phase 1: Foundation & Dependencies

### 1.1 Install Anthropic SDK

```bash
npm install @anthropic-ai/sdk
```

### 1.2 Environment Variables

Add to `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### 1.3 Type Definitions

**File:** `lib/types.ts` (UPDATE)

```typescript
// AI Insights Types
export type InsightType = 'correlation' | 'timing' | 'compliance' | 'anomaly' | 'trend'
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
  weeklySummary: string
  insights: Insight[]
  recommendations: string[]
  generatedAt: string
}

// Data structures for analysis pipeline
export interface UserAnalysisData {
  activeProtocols: ProtocolSummary[]
  protocolChanges: ProtocolChange[]
  doseLogs: DoseLogEntry[]
  garminData: GarminDailySummary[]
  baselineMetrics: BaselineMetrics
  correlations: CorrelationResult[]
}
```

---

## Phase 2: Database Schema

### 2.1 New Tables (Supabase Migration)

**File:** `supabase/migrations/001_ai_insights.sql` (NEW)

```sql
-- AI Insights Table
CREATE TABLE public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  metrics_summary JSONB DEFAULT '{}',
  protocol_summary JSONB DEFAULT '{}',
  correlation_data JSONB DEFAULT '{}',
  insights JSONB DEFAULT '[]',
  weekly_summary TEXT,
  recommendations JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_version TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  UNIQUE(user_id, week_start)
);

-- RLS Policies
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insights" ON public.ai_insights
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insights" ON public.ai_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Garmin Imports Tracking
CREATE TABLE public.garmin_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  import_date TIMESTAMPTZ DEFAULT NOW(),
  file_name TEXT,
  file_type TEXT DEFAULT 'activity_csv',
  records_imported INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  date_range_start DATE,
  date_range_end DATE
);

ALTER TABLE public.garmin_imports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own imports" ON public.garmin_imports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own imports" ON public.garmin_imports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Dose Logs Table (migrate from localStorage)
CREATE TABLE public.dose_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id TEXT NOT NULL,
  peptide_name TEXT NOT NULL,
  dose TEXT NOT NULL,
  dose_number INTEGER DEFAULT 1,
  scheduled_for TIMESTAMPTZ NOT NULL,
  taken_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('pending', 'taken', 'skipped', 'overdue')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dose_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own dose_logs" ON public.dose_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_dose_logs_user_scheduled ON public.dose_logs(user_id, scheduled_for);
```

### 2.2 Update TypeScript Types

**File:** `types/database.ts` (UPDATE)

- Add `ai_insights`, `garmin_imports`, `dose_logs` table types

---

## Phase 3: Garmin CSV Import

### 3.1 CSV Parser

**File:** `lib/parsers/garmin-csv.ts` (NEW)

**Responsibilities:**
- Parse Garmin Connect activity CSV exports
- Handle field mapping: Activity Type, Date, Distance, Calories, Time, Avg HR, Max HR
- Date parsing for various Garmin formats
- Return typed `ParsedGarminActivity[]`

**CSV Field Mapping:**

| Garmin CSV Column | Database Field | Transformation |
|-------------------|----------------|----------------|
| Activity Type | activity_type | Direct |
| Date | start_time | Parse to ISO |
| Title | activity_name | Direct |
| Distance | distance_meters | Convert km/mi to meters |
| Calories | calories | Parse integer |
| Time | duration_seconds | Parse HH:MM:SS |
| Avg HR | avg_heart_rate | Parse integer |
| Max HR | max_heart_rate | Parse integer |

### 3.2 JSON Parser (Full Export)

**File:** `lib/parsers/garmin-json.ts` (NEW)

**Responsibilities:**
- Parse Garmin full data export (ZIP with JSON files)
- Extract sleep, HRV, stress, Body Battery data
- Normalize to garmin_data table schema

### 3.3 API Route

**File:** `app/api/garmin/import/route.ts` (NEW)

```typescript
// POST - Handle CSV/JSON file upload
// 1. Authenticate user
// 2. Validate file (size, type)
// 3. Parse content (CSV or JSON)
// 4. Upsert to garmin_activities / garmin_data tables
// 5. Create import record
// 6. Return summary
```

### 3.4 Import Hook

**File:** `hooks/use-garmin-import.ts` (NEW)

- `uploadFile(file: File)` - Upload and process file
- `isUploading`, `progress`, `error` state
- `importHistory` - Fetch past imports

### 3.5 Import Component

**File:** `components/garmin-import.tsx` (NEW - replaces garmin-connect.tsx)

**Features:**
- Drag-and-drop upload zone
- Expandable instructions section
- States: Empty, Has Data, Uploading, Complete, Error
- Support for both CSV and JSON files

### 3.6 Health Page Update

**File:** `app/health/page.tsx` (UPDATE)

- Replace `<GarminConnect />` with `<GarminImport />`
- Fetch real Garmin data for charts

---

## Phase 4: Claude API Integration

### 4.1 Anthropic Client

**File:** `lib/anthropic.ts` (NEW)

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const WEEKLY_ANALYSIS_SYSTEM_PROMPT = `You are the AI insights engine for PepMetrics...`

export async function generateWeeklyInsights(
  userData: UserAnalysisData
): Promise<WeeklyInsightsResponse>

export async function chatWithContext(
  message: string,
  context: UserContext
): Promise<ReadableStream>
```

### 4.2 Data Aggregation

**File:** `lib/analysis/data-aggregation.ts` (NEW)

- `aggregateUserData(userId, weekStart, weekEnd)` - Fetch all data for analysis
- Pull: protocols, dose logs, Garmin data, baseline (4-week lookback)
- Format data for Claude API prompt

### 4.3 Statistical Analysis

**File:** `lib/analysis/statistics.ts` (NEW)

- `runStatisticalAnalysis()` - Pre-AI correlation detection
- Calculate rolling averages
- Identify outliers (>1.5 std dev from baseline)
- Detect trends (improving/declining/stable)
- Compliance rate calculation

### 4.4 Data Validation

**File:** `lib/analysis/validation.ts` (NEW)

- `validateDataSufficiency()` - Check minimum data requirements
- Return: `{ isValid, missingData[], warnings[] }`

### 4.5 Generate Insights API

**File:** `app/api/insights/generate/route.ts` (NEW)

```typescript
// POST - Generate weekly analysis
// 1. Authenticate user
// 2. Aggregate user data
// 3. Validate data sufficiency
// 4. Run statistical pre-analysis
// 5. Call Claude API (Sonnet)
// 6. Store results in ai_insights table
// 7. Return insights
```

### 4.6 Get Insights API

**File:** `app/api/insights/route.ts` (NEW)

```typescript
// GET - Fetch user's insights history
// Paginated, ordered by week_start DESC
```

### 4.7 Chat API

**File:** `app/api/insights/chat/route.ts` (NEW)

```typescript
// POST - Handle chat messages
// 1. Authenticate user
// 2. Build user context (protocols, recent data)
// 3. Call Claude API (Haiku) with streaming
// 4. Return streamed response
```

---

## Phase 5: UI Components

### 5.1 Insight Card

**File:** `components/insight-card.tsx` (NEW)

- Display single insight with type icon, severity badge
- Expandable body with Collapsible
- Data points as metric pills
- Confidence indicator
- Hover state animations

### 5.2 Weekly Summary

**File:** `components/weekly-summary.tsx` (NEW)

- Prose summary with Brain icon
- Date range display
- Match existing card styling

### 5.3 Generate Button

**File:** `components/generate-analysis-button.tsx` (NEW)

- "Generate Weekly Analysis" CTA
- States: idle, generating (Spinner), success
- Toast notifications for feedback

### 5.4 Empty States

**File:** `components/insights-empty-state.tsx` (NEW)

- Variants: no-garmin, insufficient-data, no-analysis
- Clear CTAs for each state

### 5.5 Trend Charts

**File:** `components/insights-trend-chart.tsx` (NEW)

- Line charts showing metrics over 4-8 weeks
- ReferenceLine markers for protocol start dates
- Tabs to switch between metrics (HRV, Sleep, Stress, Body Battery)
- Follow existing Recharts patterns from hrv-chart.tsx

### 5.6 Chat Interface

**File:** `components/insights-chat.tsx` (NEW)

- Message list with user/assistant styling
- Input form with send button
- Suggested question chips
- Streaming response display
- Conversation stored in component state

### 5.7 Insights Page Update

**File:** `app/insights/page.tsx` (UPDATE)

- Replace mock data with real data fetching
- Add GenerateAnalysisButton
- Wire up InsightCard components
- Wire up Chat interface (right column)
- Handle loading/error/empty states

### 5.8 Dashboard Widget

**File:** `components/weekly-insights-widget.tsx` (NEW)

- Preview card for dashboard (home page)
- Top insight + sparkline
- "View Full Report" link

**File:** `app/page.tsx` (UPDATE)

- Add WeeklyInsightsWidget to dashboard

---

## Phase 6: Dose Logs Migration

### 6.1 Sync API

**File:** `app/api/dose-logs/sync/route.ts` (NEW)

- POST - Migrate logs from localStorage to Supabase
- Upsert logic to avoid duplicates

### 6.2 Storage Update

**File:** `lib/storage.ts` (UPDATE)

- Add hybrid mode: read from Supabase, fallback to localStorage
- Sync function to migrate existing data
- Migration prompt for existing users

---

## Implementation Order

### Week 1: Data Infrastructure

| # | Task | File |
|---|------|------|
| 1 | Install `@anthropic-ai/sdk` | package.json |
| 2 | Add ANTHROPIC_API_KEY | .env.local |
| 3 | Run database migrations | supabase/migrations/ |
| 4 | Update database types | types/database.ts |
| 5 | Add insight types | lib/types.ts |

### Week 2: Garmin CSV Import

| # | Task | File |
|---|------|------|
| 6 | Create Activity CSV parser | lib/parsers/garmin-csv.ts |
| 7 | Create Full Export JSON parser | lib/parsers/garmin-json.ts |
| 8 | Create import API route | app/api/garmin/import/route.ts |
| 9 | Create import hook | hooks/use-garmin-import.ts |
| 10 | Create import component | components/garmin-import.tsx |
| 11 | Update Health page | app/health/page.tsx |

### Week 3: AI Backend - Weekly Analysis

| # | Task | File |
|---|------|------|
| 12 | Create Anthropic client | lib/anthropic.ts |
| 13 | Create data aggregation | lib/analysis/data-aggregation.ts |
| 14 | Create statistics module | lib/analysis/statistics.ts |
| 15 | Create validation module | lib/analysis/validation.ts |
| 16 | Create generate API | app/api/insights/generate/route.ts |
| 17 | Create get insights API | app/api/insights/route.ts |

### Week 4: AI Backend - Chat Interface

| # | Task | File |
|---|------|------|
| 18 | Create chat API (streaming) | app/api/insights/chat/route.ts |
| 19 | Create chat component | components/insights-chat.tsx |
| 20 | Create chat types & context builder | lib/analysis/chat-context.ts |

### Week 5: UI Components

| # | Task | File |
|---|------|------|
| 21 | Create insight card | components/insight-card.tsx |
| 22 | Create weekly summary | components/weekly-summary.tsx |
| 23 | Create generate button | components/generate-analysis-button.tsx |
| 24 | Create empty states | components/insights-empty-state.tsx |
| 25 | Create trend charts | components/insights-trend-chart.tsx |

### Week 6: Page Integration

| # | Task | File |
|---|------|------|
| 26 | Update insights page | app/insights/page.tsx |
| 27 | Create dashboard widget | components/weekly-insights-widget.tsx |
| 28 | Update dashboard | app/page.tsx |

### Week 7: Dose Logs & Data Sync

| # | Task | File |
|---|------|------|
| 29 | Create dose logs sync API | app/api/dose-logs/sync/route.ts |
| 30 | Update storage module | lib/storage.ts |
| 31 | Add migration UI prompt | components/dose-log-migration.tsx |

### Week 8: Testing & Polish

| # | Task | Notes |
|---|------|-------|
| 32 | E2E testing | Full flow: import → generate → display |
| 33 | Error handling | API failures, rate limits, edge cases |
| 34 | Loading states | Skeleton UI, progress indicators |
| 35 | Performance | Optimize data fetching, caching |

---

## Critical Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `lib/types.ts` | UPDATE | Add Insight types |
| `types/database.ts` | UPDATE | Add new table types |
| `lib/anthropic.ts` | NEW | Claude API client (Sonnet + Haiku) |
| `lib/parsers/garmin-csv.ts` | NEW | Activity CSV parsing |
| `lib/parsers/garmin-json.ts` | NEW | Full export JSON parsing |
| `lib/analysis/data-aggregation.ts` | NEW | Data fetching layer |
| `lib/analysis/statistics.ts` | NEW | Pre-AI statistical analysis |
| `app/api/insights/generate/route.ts` | NEW | Weekly analysis endpoint |
| `app/api/insights/chat/route.ts` | NEW | Chat endpoint (streaming) |
| `app/api/garmin/import/route.ts` | NEW | File upload endpoint |
| `components/garmin-import.tsx` | NEW | Upload UI with drag-drop |
| `components/insight-card.tsx` | NEW | Insight card display |
| `components/insights-chat.tsx` | NEW | Chat interface |
| `components/insights-trend-chart.tsx` | NEW | Metric trend charts |
| `app/insights/page.tsx` | UPDATE | Full insights page |
| `app/health/page.tsx` | UPDATE | Add import component |
| `app/page.tsx` | UPDATE | Add dashboard widget |

---

## Security Considerations

1. **API Key Protection**: `ANTHROPIC_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
2. **User Data Isolation**: RLS policies enforce `user_id = auth.uid()`
3. **File Validation**: Size limits (5MB), type checking before processing
4. **Input Sanitization**: CSV/JSON content parsed, not executed
5. **Rate Limiting**: Consider 1 analysis/hour/user limit to prevent abuse

---

## Cost Estimates

Based on spec calculations:

| Scenario | Model | Input Tokens | Output Tokens | Cost |
|----------|-------|--------------|---------------|------|
| Weekly Report | Sonnet | ~3,000 | ~1,500 | ~$0.03 |
| Chat Query | Haiku | ~2,000 | ~500 | ~$0.004 |

**Monthly projections:**
- 100 users: ~$12/month
- 1,000 users: ~$120/month

---

## Success Criteria

1. User can upload Garmin Activity CSV and see data in Health page
2. User can upload Garmin Full Export JSON for sleep/HRV/stress data
3. User can click "Generate Weekly Analysis" and receive AI insights
4. All 6 insight types display with proper severity, confidence, and data points
5. User can ask questions via chat and receive contextual answers
6. Trend charts show metrics over 4-8 weeks with protocol event markers
7. Empty states guide users when data is insufficient
8. Dashboard shows latest insight preview with sparkline
9. Dose logs sync seamlessly from localStorage to Supabase

---

## Appendix: Claude System Prompts

### Weekly Analysis Prompt

```
You are the AI insights engine for PepMetrics, a peptide protocol tracking application. Your role is to analyze peptide dosing data alongside health metrics from Garmin wearables to help users understand how their protocols may be affecting their bodies.

CORE PRINCIPLES:
1. NEVER claim causation - only note correlations and possibilities
2. Frame all insights as observations, not medical advice
3. Be specific with numbers, percentages, and timeframes
4. Highlight both positive trends and potential concerns equally
5. Use plain language, but include technical metrics for users who want depth
6. If data is insufficient for a conclusion, say so clearly
7. Err on the side of caution with health-related observations

OUTPUT FORMAT:
Return a JSON object with this structure:
{
  "insights": [...],
  "weekly_summary": "...",
  "recommendations": [...]
}
```

### Chat Prompt

```
You are a helpful assistant for PepMetrics users. You have access to their peptide protocol data and Garmin health metrics. Answer their questions about their data in a friendly, informative way.

GUIDELINES:
- Reference specific numbers and dates from their data when relevant
- If the data doesn't support a clear answer, say so
- Never give medical advice - you're a data assistant, not a doctor
- Keep responses concise but complete
- If asked about something outside their data, politely redirect
```

---

*Document created: December 3, 2024*
*Last updated: December 3, 2024*
