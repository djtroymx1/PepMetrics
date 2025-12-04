# PepMetrics AI Insights Engine
## Feature Specification Document

> **Purpose:** Transform raw peptide dosing logs and Garmin health data into actionable, personalized insights that help users understand how their protocols are affecting their bodies.

---

## The Big Picture

PepMetrics sits at an intersection that no other app currently occupies: **correlating peptide protocol data with objective biometric measurements**. 

Existing peptide trackers (SHOTLOG, Peptide Log, MyPeptideApp) focus purely on logging doses and reminders. They tell you *what* you took and *when*. But they can't tell you *if it's working*.

Garmin and other wearables provide rich health data, but they have no context about what interventions you're making. They might show your HRV improved, but they can't connect it to the BPC-157 you started three weeks ago.

**PepMetrics bridges this gap.** The AI doesn't just crunch numbers---it tells the story of what's happening in your body.

---

## Data Sources

### From PepMetrics (User Input)

| Data Type | Fields | Frequency |
|-----------|--------|-----------|
| Dose Logs | peptide, dose, timestamp, timing (fasted/fed), notes | Per event |
| Protocol Changes | started/stopped/paused, dose adjustments, frequency changes | Per event |
| Fasting Windows | start time, end time, duration before dose | Per event |
| Subjective Notes | optional user comments on how they feel | Per event |
| Weight | value, timestamp | Daily/weekly |
| Check-ins (future) | mood, energy, sleep quality (1-5 scale) | Daily |

### From Garmin (CSV Import Only)

**Note:** Garmin API access was denied (December 2024). PepMetrics will use manual CSV import instead. This is actually fine---it gives users full control over their data, requires no OAuth complexity, and the export process is straightforward.

Based on Garmin's export formats, here's what we can capture:

**Daily Summary Data:**
- Steps, distance, floors climbed
- Active calories, BMR calories
- Active time, moderate/vigorous intensity duration
- Resting heart rate
- Average/min/max heart rate
- Average stress level, stress duration breakdown (low/medium/high)
- Stress qualifier (balanced, stressful, very_stressful)

**Sleep Data:**
- Total sleep duration
- Deep sleep, light sleep, REM sleep durations
- Awake duration during sleep
- Sleep score (0-100)
- Sleep score qualifiers (totalDuration, stress, awakeCount, remPercentage, restlessness, lightPercentage, deepPercentage)
- Nap data

**HRV Data:**
- Last night average HRV (ms)
- Last night 5-min high HRV
- HRV values throughout night (5-min intervals)

**Stress/Body Battery Data:**
- Stress level values (3-min averages, 1-100 scale)
- Body Battery values (5-100 scale)
- Body Battery events (recovery/activity impacts)

**Activity Data:**
- Activity type, duration, calories
- Heart rate zones
- Training effect

---

## AI Analysis Architecture

### Weekly Analysis Cycle

The AI runs a comprehensive analysis once per week (Sunday night or Monday morning). This cadence:
- Gives enough data points for meaningful patterns
- Avoids analysis paralysis from daily fluctuations
- Creates a ritual/habit around reviewing insights
- Reduces compute costs

### Analysis Pipeline

```
1. DATA AGGREGATION
   - Pull last 7 days of dose logs
   - Pull last 7 days of Garmin data
   - Pull historical baseline (previous 4-8 weeks)

2. STATISTICAL ANALYSIS (Pre-AI)
   - Calculate rolling averages for all metrics
   - Identify outliers (>1.5 standard deviations from baseline)
   - Run correlation analysis between dosing events and metric changes
   - Detect trends (improving, declining, stable)

3. AI INTERPRETATION (Claude API - Anthropic)
   - Send structured data summary to Claude
   - Include user's active protocols and recent changes
   - Request pattern identification and plain-English insights
   - Generate weekly report

4. DELIVERY
   - Store insights in database
   - Display in app
   - Send email summary (if enabled)
```

### Why Claude API

PepMetrics uses Anthropic's Claude API for AI-powered insights. Reasons for this choice:

1. **Quality of Analysis** - Claude excels at interpreting complex data and writing nuanced, readable reports. It handles the critical distinction between correlation and causation well.

2. **Appropriate Caution** - Health-adjacent insights require an AI that won't overstate conclusions. Claude's training emphasizes intellectual honesty and appropriate hedging.

3. **Natural Writing Style** - Weekly reports should feel like they're written by a knowledgeable friend, not a generic AI. Claude's output has personality without being unprofessional.

4. **Structured Output** - Claude reliably returns well-formatted JSON when asked, which is essential for parsing insights into the UI.

### Claude API Configuration

**Model Selection:**

- **Primary: Claude Sonnet 4** (`claude-sonnet-4-20250514`) - Best balance of quality and cost for weekly analysis
- **Fallback: Claude Haiku 4** (`claude-haiku-4-5-20251001`) - For high-volume scenarios or chat interface

**Estimated Costs:**

| Scenario | Input Tokens | Output Tokens | Cost per Analysis |
|----------|--------------|---------------|-------------------|
| Weekly Report (Sonnet) | ~3,000 | ~1,500 | ~$0.03 |
| Chat Query (Haiku) | ~2,000 | ~500 | ~$0.004 |

At 100 users generating weekly reports: **~$12/month**
At 1,000 users: **~$120/month**

These costs are negligible relative to the value provided.

**API Setup:**

```typescript
// lib/anthropic.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateWeeklyInsights(
  userData: UserAnalysisData
): Promise<WeeklyInsights> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: buildAnalysisPrompt(userData),
      },
    ],
  });

  return parseInsightsResponse(response.content[0].text);
}
```

**Environment Variables:**

```env
ANTHROPIC_API_KEY=sk-ant-...
```

Get your API key at: https://console.anthropic.com/

### Proactive vs Reactive Insights

**Proactive (Automatic - Weekly Report):**
- Obvious correlations that jump out of the data
- Significant changes from baseline
- Compliance summaries
- Trend alerts (improving or declining metrics)
- Anomaly detection

**Reactive (On-Demand Chat):**
- User asks: "How has my sleep changed since starting Epithalon?"
- User asks: "What's my best time to take MOTS-c based on my data?"
- User asks: "Show me my HRV trend over the last month"

---

## Types of Insights

### 1. Correlation Insights

These connect dosing events to metric changes. Always framed as *possible* correlations, not causation.

**Examples:**
- "Your HRV has averaged 52ms over the past week, up 18% from your 4-week baseline of 44ms. This improvement began approximately 10 days after starting your MOTS-c protocol. Worth monitoring."

- "Sleep quality scores are 12% lower on the two nights following your weekly Retatrutide injection compared to other nights. This is a common pattern with GLP-1 agonists. Consider timing your injection earlier in the day."

- "Deep sleep duration increased by 22 minutes on average since adding Epithalon to your stack 3 weeks ago. Your REM sleep has remained stable."

### 2. Timing Optimization Insights

Help users find their optimal dosing windows.

**Examples:**
- "You've logged BPC-157 doses at various times between 6am and 10am. Your Body Battery recovery scores are highest (averaging 78) when you dose before 7am versus after 8am (averaging 64). Consider standardizing your morning dose time."

- "Your stress scores are lowest on days when you maintain at least a 14-hour overnight fast before your morning peptides. You've achieved this 4 of 7 days this week."

### 3. Compliance Insights

Track adherence without being judgmental.

**Examples:**
- "This week: 100% compliance on BPC-157 (7/7 doses), 100% on TB-500 (7/7), 67% on MOTS-c (2/3 scheduled doses). You missed the Saturday MOTS-c---this has happened 3 of the last 4 weeks. Consider adjusting your weekend schedule or setting a reminder."

- "Your Retatrutide doses have been logged within 30 minutes of your target time 4 of 4 weeks. Excellent consistency."

### 4. Anomaly Alerts

Flag unusual patterns that warrant attention.

**Examples:**
- "Your resting heart rate spiked to 72 BPM on Tuesday, up from your baseline of 58. This coincided with starting Tesamorelin the day before. Monitor this---if it persists, consider discussing with your provider."

- "Body Battery failed to recover above 50% for three consecutive days. This is unusual for you. Contributing factors may include: higher than normal stress scores, reduced sleep duration, or cumulative training load."

- "Your HRV dropped below your 4-week baseline for 5 consecutive days. This pattern began shortly after increasing your Tirzepatide dose from 5mg to 7.5mg. Consider whether the dose increase is appropriate for your current recovery capacity."

### 5. Trend Summaries

Big-picture view of what's happening over time.

**Weekly Summary Example:**
```
WEEK OF DEC 1-7, 2024

Protocol Status:
- Active compounds: Retatrutide, BPC-157, MOTS-c, TB-500
- Compliance: 94% overall (missed 1 MOTS-c dose)
- Fasting compliance: 86% of doses taken in proper fasted state

Health Metrics vs. 4-Week Baseline:
- HRV: 51ms avg (+8% from baseline) - Trending Up
- Resting HR: 56 bpm (-3% from baseline) - Stable
- Sleep Score: 78 avg (+5% from baseline) - Trending Up
- Deep Sleep: 1h 42m avg (+15% from baseline) - Improving
- Stress Score: 34 avg (-12% from baseline) - Improving
- Body Battery: Starting day at 72 avg (+9% from baseline) - Improving

Notable Observations:
1. Sleep quality continues to improve in week 4 of your current stack
2. HRV showing sustained improvement since starting MOTS-c
3. Weekend compliance remains a challenge for evening doses

Recommendation:
Your metrics are trending positively. Maintain current protocols and timing.
Consider setting weekend reminders for MOTS-c.
```

### 6. Contextual Insights

Connect multiple data points to tell a fuller story.

**Example:**
"Looking at the full picture this week: Your HRV is up, resting heart rate is down, and Body Battery is recovering well. Sleep quality improved, particularly deep sleep duration. Stress scores are lower than your baseline. All of these metrics moving in positive directions simultaneously suggests your current protocol stack and timing are well-suited to your body. You're in a good recovery state."

---

## Technical Implementation

### Data Storage (Supabase)

```sql
-- Weekly AI analysis results
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  
  -- Raw analysis data
  metrics_summary JSONB, -- aggregated Garmin data
  protocol_summary JSONB, -- doses logged, compliance, etc.
  correlation_data JSONB, -- statistical correlations found
  
  -- AI-generated content
  insights JSONB[], -- array of insight objects
  weekly_summary TEXT, -- prose summary
  recommendations TEXT[],
  
  -- Metadata
  generated_at TIMESTAMP DEFAULT NOW(),
  model_version TEXT,
  
  UNIQUE(user_id, week_start)
);

-- Individual insight structure
-- {
--   "type": "correlation" | "timing" | "compliance" | "anomaly" | "trend",
--   "severity": "info" | "notable" | "alert",
--   "title": "HRV Improvement Correlated with MOTS-c",
--   "body": "Full insight text...",
--   "metrics": ["hrv", "mots-c"],
--   "confidence": "possible" | "likely" | "strong",
--   "data_points": {...supporting numbers...}
-- }
```

### Claude System Prompt for Weekly Analysis

```typescript
const WEEKLY_ANALYSIS_SYSTEM_PROMPT = `You are the AI insights engine for PepMetrics, a peptide protocol tracking application. Your role is to analyze peptide dosing data alongside health metrics from Garmin wearables to help users understand how their protocols may be affecting their bodies.

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
  "insights": [
    {
      "type": "correlation" | "timing" | "compliance" | "anomaly" | "trend",
      "severity": "info" | "notable" | "alert",
      "title": "Short descriptive title",
      "body": "Full insight explanation (2-4 sentences)",
      "metrics": ["list", "of", "relevant", "metrics"],
      "confidence": "possible" | "likely" | "strong",
      "data_points": { "relevant": "numbers" }
    }
  ],
  "weekly_summary": "2-3 paragraph prose summary of the week",
  "recommendations": ["actionable", "suggestions"]
}

Aim for 3-5 insights per analysis, mixing types. Prioritize notable and alert severity items.`;

const buildAnalysisPrompt = (data: UserAnalysisData): string => `
USER'S ACTIVE PROTOCOLS:
${JSON.stringify(data.activeProtocols, null, 2)}

RECENT PROTOCOL CHANGES (last 30 days):
${JSON.stringify(data.protocolChanges, null, 2)}

DOSE LOGS (past 7 days):
${JSON.stringify(data.doseLogs, null, 2)}

GARMIN METRICS (past 7 days):
${JSON.stringify(data.garminData, null, 2)}

BASELINE AVERAGES (previous 4 weeks):
${JSON.stringify(data.baselineMetrics, null, 2)}

PRE-COMPUTED CORRELATIONS:
${JSON.stringify(data.correlations, null, 2)}

Analyze this data and provide insights following your system prompt guidelines.
`;
```

### Claude Prompt for Chat Interface (Future)

```typescript
const CHAT_SYSTEM_PROMPT = `You are a helpful assistant for PepMetrics users. You have access to their peptide protocol data and Garmin health metrics. Answer their questions about their data in a friendly, informative way.

GUIDELINES:
- Reference specific numbers and dates from their data when relevant
- If the data doesn't support a clear answer, say so
- Never give medical advice - you're a data assistant, not a doctor
- Keep responses concise but complete
- If asked about something outside their data, politely redirect

You have access to the user's context which will be provided with each message.`;
```

### Email Report

Weekly email containing:
1. Visual summary card (compliance rate, key metrics)
2. Top 3 insights as bullet points
3. "Full Report" CTA button linking to app
4. Unsubscribe link

Use a service like Resend or SendGrid with a clean, branded HTML template.

---

## Garmin CSV Import Feature

Since Garmin API access is not available, PepMetrics uses a straightforward CSV import process. This section defines the user experience and technical implementation.

### Import UI Location

Place a prominent import section at the top of the **Health** page (`/health`). This should be the first thing users see before any charts or data.

### Import Component Design

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Import Your Garmin Data                                     │
│                                                                 │
│  Connect your Garmin health metrics to unlock AI-powered       │
│  insights about how your protocols affect your body.           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │     [cloud upload icon]                                 │   │
│  │                                                         │   │
│  │     Drag and drop your Garmin CSV file here            │   │
│  │     or click to browse                                  │   │
│  │                                                         │   │
│  │     Accepts: .csv files from Garmin Connect            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  How to export from Garmin Connect ↓                           │
└─────────────────────────────────────────────────────────────────┘
```

### Export Instructions (Expandable Section)

When the user clicks "How to export from Garmin Connect", expand to show:

---

**How to Export Your Garmin Data**

Garmin Connect makes it easy to export your health and activity data. Here's how:

**On Desktop (Recommended):**

1. Go to [connect.garmin.com](https://connect.garmin.com) and sign in
2. Click **Activities** in the left sidebar
3. Scroll down to load all the activities you want to include (the page loads more as you scroll)
4. In the upper right corner, click **Export CSV**
5. A file will download to your computer
6. Drag that file into the upload area above

**On Mobile:**

The Garmin Connect mobile app doesn't support CSV export directly. Use the desktop website for the best experience, or access connect.garmin.com in your mobile browser and request the desktop site.

**What Gets Exported:**

Your export will include activity summaries with metrics like duration, calories, heart rate, and more. For detailed health metrics (sleep, HRV, stress, Body Battery), you may need to request a full data export:

1. Go to [garmin.com/account](https://www.garmin.com/account)
2. Click **Data Management** then **Export Your Data**
3. Garmin will email you a download link (may take a few hours)
4. The zip file contains detailed health data in JSON format

**Privacy Note:**

Your data stays on your device and in your PepMetrics account. We never share your health information with third parties.

---

### Technical Implementation

**File Upload Component:**

```typescript
// components/garmin-import.tsx

interface GarminImportProps {
  onImportComplete: (data: GarminData) => void;
  existingDataRange?: { start: Date; end: Date };
}

// Accept CSV and JSON files (for full data export)
const ACCEPTED_TYPES = ['.csv', '.json'];

// Parse Garmin CSV format
// Expected columns vary by export type, but typically include:
// Activity Type, Date, Favorite, Title, Distance, Calories, Time, 
// Avg HR, Max HR, Avg Pace, Elevation Gain, etc.

// For health data JSON (from full export), parse:
// - wellness summaries
// - sleep data  
// - stress data
// - HRV data
```

**Data Normalization:**

Different Garmin exports have different formats. The importer should:

1. Detect export type (activity CSV vs. full data export JSON)
2. Extract relevant fields and normalize to our schema
3. Handle date/time parsing (Garmin uses various formats)
4. Merge with existing data (don't duplicate, update if newer)
5. Show import summary ("Imported 47 days of health data")

**Supported Data Types:**

| Export Type | Source | Contains |
|-------------|--------|----------|
| Activity CSV | connect.garmin.com/activities | Activity summaries, basic HR, calories |
| Full Data Export | garmin.com/account | Sleep, HRV, stress, Body Battery, detailed metrics |

**Storage:**

Store imported Garmin data in Supabase:

```sql
CREATE TABLE garmin_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  import_date TIMESTAMP DEFAULT NOW(),
  file_type TEXT, -- 'activity_csv' or 'full_export'
  records_imported INTEGER,
  date_range_start DATE,
  date_range_end DATE
);

CREATE TABLE garmin_daily_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  calendar_date DATE NOT NULL,
  
  -- Activity metrics
  steps INTEGER,
  distance_meters DECIMAL,
  active_calories INTEGER,
  floors_climbed INTEGER,
  
  -- Heart metrics
  resting_hr INTEGER,
  avg_hr INTEGER,
  min_hr INTEGER,
  max_hr INTEGER,
  
  -- Stress/Recovery
  avg_stress_level INTEGER,
  stress_qualifier TEXT,
  body_battery_start INTEGER,
  body_battery_end INTEGER,
  
  -- Sleep (from previous night)
  sleep_duration_seconds INTEGER,
  deep_sleep_seconds INTEGER,
  light_sleep_seconds INTEGER,
  rem_sleep_seconds INTEGER,
  awake_seconds INTEGER,
  sleep_score INTEGER,
  
  -- HRV
  hrv_avg INTEGER,
  hrv_5min_high INTEGER,
  
  -- Metadata
  source TEXT, -- 'activity_csv', 'full_export', 'manual'
  imported_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, calendar_date)
);
```

### Import States

**Empty State (No Data Yet):**
Show the full import UI with instructions prominently displayed.

**Has Data State:**
- Show summary: "Last import: Dec 3, 2024 (47 days of data)"
- Collapse instructions by default
- Show "Import More Data" button
- Display date range of existing data

**Import in Progress:**
- Show progress indicator
- "Processing your Garmin data..."
- Count of records being imported

**Import Complete:**
- Success message with summary
- "Imported 23 new days of health data"
- "Your AI insights will update with your next weekly analysis"
- Show/refresh the health charts below

**Import Error:**
- Clear error message
- "This file doesn't appear to be a Garmin export. Please check that you're uploading a CSV file from Garmin Connect."
- Link to instructions

---

## UI Components

### Insights Dashboard Card (Home Page)

A prominent card on the dashboard showing:
- "Weekly Insights" header with date range
- Top insight preview (title + first sentence)
- Sparkline showing a key metric trend
- "View Full Report" button

### Insights Page (`/insights`)

Full insights experience:
1. **Weekly Report Section**
   - Prose summary at top
   - Expandable insight cards below
   - Each card shows type icon, title, full body, supporting data

2. **Trends Section**
   - Line charts showing key metrics over 4-8 weeks
   - Ability to overlay protocol start dates on charts
   - Toggle between metrics (HRV, sleep, stress, etc.)

3. **Chat Interface**
   - "Ask about your data" input at bottom
   - Conversation history
   - Suggested questions as chips

### Correlation Visualization

Show a simple matrix or card layout indicating:
- Which metrics have potential correlation to which protocols
- Strength indicator (weak/moderate/strong)
- Direction (positive/negative)
- Tap to expand for details

---

## Minimum Viable Version

For the MVP AI feature:

1. **CSV Import with Clear Instructions** - Drag-and-drop interface with step-by-step Garmin export guide
2. **Activity CSV Support First** - Parse the basic activity export (simpler format, good starting point)
3. **Weekly Summary Only** - Skip the chat interface for v1
4. **3 Core Insight Types** - Compliance, Trends, and Correlations
5. **Email Optional** - In-app only for v1
6. **Manual Trigger** - Button to "Generate Weekly Analysis" rather than automated

This gets the core value proposition live quickly while laying groundwork for the full vision.

---

## Privacy & Safety Considerations

1. **Data Storage** - All health data stored encrypted in Supabase
2. **AI Processing** - Data sent to Anthropic's Claude API is not stored or used for training (per Anthropic's API data policy)
3. **No Medical Claims** - All insights framed as observations, not diagnoses
4. **User Control** - Easy data export, account deletion, opt-out of AI features
5. **Disclaimer** - Clear messaging that this is for informational purposes only
6. **API Key Security** - Anthropic API key stored as environment variable, never exposed to client

---

## Future Enhancements

1. **Full Data Export Support** - Parse the detailed Garmin JSON export for sleep/HRV/stress/Body Battery
2. **Apple Health Export** - Support Apple's health data export format
3. **Google Fit Export** - Support Google's Takeout health data format
4. **Chat Interface** - Natural language queries about user's data
5. **Predictive Modeling** - "Based on your patterns, you may feel low energy tomorrow"
6. **Protocol Recommendations** - Suggest timing adjustments (with heavy disclaimers)
7. **Community Insights** - Anonymized, aggregated patterns across users (opt-in)
8. **Photo Progress Correlation** - Connect body composition changes to protocols
9. **Automated Weekly Reports** - Scheduled analysis with email delivery

---

## Why This Matters

The peptide community is running thousands of individual experiments. Most are flying blind---taking compounds, hoping they work, with no objective way to measure impact beyond the scale and the mirror.

PepMetrics with AI insights changes that. It turns subjective "I think I feel better" into objective "Your HRV improved 15% and sleep quality is up 20% since starting this protocol."

That's the clear picture you're looking for, Troy. Not just tracking what you take, but understanding what it's doing.
