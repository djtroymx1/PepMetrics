# PepMetrics - Product Requirements Document

**Version:** 1.0  
**Date:** December 2, 2024  
**Author:** Digital Visionworks LLC  
**Status:** Research Complete - Ready for Development

---

## Executive Summary

PepMetrics is a comprehensive peptide tracking and optimization platform that solves a critical problem: people using peptides have no centralized tool to manage their protocols, correlate health outcomes, and make data-driven decisions. Users currently rely on scattered notes, AI chat histories, spreadsheets, and memory - leading to confusion, inconsistent dosing, and missed insights.

PepMetrics brings together peptide protocol management, wearable health data (via Garmin), nutrition tracking optimized for peptide timing, bloodwork logging, and AI-powered insights - all in one platform designed specifically for the peptide optimization community.

**Primary Value Proposition:** Stop guessing. Start tracking. See what's actually working.

---

## Product Vision

**Vision Statement:** Become the essential companion app for anyone using peptides, providing the tools, data, and intelligence needed to optimize their protocols and achieve their health goals.

**Problem Statement:**
- Peptide protocols are complex (multiple compounds, varying dosages, reconstitution math, timing requirements)
- No existing app adequately addresses the specific needs of peptide users
- Critical data is fragmented across wearables, notes, and memory
- Users cannot easily correlate their protocols with objective health outcomes
- Educational resources are scattered across YouTube videos and forum posts
- The learning curve for new peptide users is steep and error-prone

**Solution:** A unified platform that handles the complexity so users can focus on results.

---

## Target Users

### Primary Persona: The Optimization-Focused User
- Age 30-55
- Uses peptides for weight loss, recovery, performance, or longevity
- Already tracks fitness with Garmin or similar wearable
- Data-driven decision maker
- Willing to pay for tools that save time and improve outcomes
- Moderate to high technical comfort level

### Secondary Persona: The Peptide Beginner
- New to peptides, potentially overwhelmed
- Needs guidance on reconstitution, dosing, timing
- High anxiety about "doing it right"
- Values educational content and hand-holding
- May graduate to power user over time

### Tertiary Persona: The Multi-Protocol User
- Running multiple peptides simultaneously
- Needs sophisticated scheduling and tracking
- Wants to isolate which compounds are producing which effects
- Values detailed historical data and analytics

---

## Core Features

### 1. Peptide Protocol Management

**1.1 Peptide Library**
- Pre-populated database of common peptides with default information:
  - Standard dosage ranges
  - Reconstitution guidelines
  - Storage requirements
  - Timing recommendations (fasted vs. fed)
  - Common stacking combinations
  - Half-life information
  - Expected timeline for effects
- AI-generated educational content for each peptide
- User can add custom peptides not in library

**1.2 Protocol Builder**
- Create named protocols (e.g., "Retatrutide Cut," "Recovery Stack")
- Define peptides included, dosages, frequency, duration
- Support for titration schedules (ramping up/down)
- Support for cycling (on/off periods)
- Clone and modify existing protocols

**1.3 Reconstitution Calculator**
- Input: Vial size (mg), desired concentration (mcg per unit)
- Output: BAC water volume needed
- Reverse calculator: Input vial size + BAC water used, output concentration per unit
- Store reconstitution records per vial
- Track reconstitution date and calculated expiration
- Support for syringe unit types (insulin units, ml markings)

**1.4 Injection Logging**
- Quick-log interface (one tap for scheduled dose)
- Manual entry with:
  - Peptide selection
  - Dosage (mcg or units)
  - Injection site (visual body map)
  - Time/date
  - Notes field
- Site rotation tracking with visual history
- Alerts for overused sites

**1.5 Inventory Management**
- Track vials on hand (reconstituted vs. unreconstituted)
- Automatic deduction from inventory on injection log
- Low inventory alerts
- Cost tracking (optional)
- Expiration tracking for reconstituted vials

**1.6 Schedule & Reminders**
- Calendar view of upcoming injections
- Push notifications for scheduled doses
- Flexible reminder timing (15 min before, 1 hour before, etc.)
- Snooze and complete actions from notification
- Fasting reminders tied to injection schedule

---

### 2. Garmin Health Integration

**2.1 Data Import**
- OAuth connection to Garmin Connect via Health API
- Automatic daily sync of health metrics
- Manual CSV import as fallback option
- Historical data import on initial connection

**2.2 Sleep Metrics**
- Total sleep duration
- Sleep stages (deep, light, REM, awake)
- Sleep score
- Time to fall asleep
- Sleep/wake times
- Respiration rate during sleep
- SpO2 during sleep (if available from device)

**2.3 HRV Metrics**
- Nightly HRV average (RMSSD)
- HRV trends over time
- Correlation with protocol changes

**2.4 Stress & Recovery**
- All-day stress scores
- Body Battery levels and trends
- Recovery indicators

**2.5 Activity Metrics**
- Workout type (mountain biking, motocross, running, etc.)
- Duration and distance
- Heart rate data (average, max, zones)
- Calories burned
- Training load/effect scores
- VO2 max estimates

**2.6 Baseline Metrics**
- Resting heart rate trends
- Daily step count
- Active minutes

---

### 3. Nutrition Tracking

**3.1 Meal Logging**
- Quick entry interface
- Food search with nutritional database
- Barcode scanning (future phase)
- Recent/favorite foods for quick re-entry
- Meal templates (save common meals)

**3.2 Macro & Calorie Tracking**
- Daily calorie totals
- Protein, carbohydrate, fat breakdown
- Customizable daily targets
- Visual progress toward daily goals

**3.3 Fasting Window Tracking**
- Automatic fasting timer based on last meal
- Current fasted state indicator (prominent in UI)
- Fasting history and streaks
- Integration with injection timing

**3.4 Peptide-Specific Guidance**
- Active alerts when logging food too close to injection
- Per-peptide fasting requirements displayed
- "Safe to eat" indicator after appropriate fasting window
- Meal timing suggestions based on protocol

**3.5 Water Intake (Optional)**
- Daily water tracking
- Hydration reminders

---

### 4. Bloodwork Integration

**4.1 PDF Upload & AI Parsing**
- Upload lab report PDFs
- AI extraction of key biomarkers
- Review/confirm parsed values before saving
- Support for major labs (Quest, LabCorp, private labs)

**4.2 Manual Entry**
- Structured form for common biomarkers
- Categorized entry (hormones, metabolic, lipids, etc.)
- Custom biomarker fields for non-standard tests

**4.3 Biomarker Tracking**
- Historical trending for each marker
- Visual charts with reference ranges
- Flag out-of-range values
- Date-stamped entries for correlation

**4.4 Baseline Establishment**
- Prompt for baseline bloodwork before starting protocols
- Baseline vs. current comparison views
- Recommendations for which markers to track based on peptides used

**4.5 Key Biomarkers to Track**
Hormones:
- Testosterone (total and free)
- Estradiol
- IGF-1
- Thyroid panel (TSH, T3, T4)
- Cortisol
- Insulin
- Growth hormone (if available)

Metabolic:
- Fasting glucose
- HbA1c
- Fasting insulin
- HOMA-IR (calculated)

Lipids:
- Total cholesterol
- LDL
- HDL
- Triglycerides

Liver/Kidney:
- ALT, AST
- BUN, Creatinine
- eGFR

Inflammation:
- CRP / hs-CRP
- Homocysteine

Other:
- CBC panel
- Vitamin D
- B12
- Ferritin

---

### 5. Progress Tracking

**5.1 Body Metrics**
- Weight (manual or smart scale integration future)
- Body measurements (waist, chest, arms, thighs, etc.)
- Body fat percentage (manual entry)
- BMI (calculated)

**5.2 Progress Photos**
- Guided photo capture (front, side, back)
- Date-stamped photo timeline
- Side-by-side comparison tool
- Private/secure storage

**5.3 Subjective Ratings**
- Daily check-in prompts (optional)
- Energy level (1-10 scale)
- Mood rating
- Sleep quality (subjective, complements Garmin data)
- Appetite level
- Libido (optional)
- Overall wellbeing

**5.4 Side Effects Logging**
- Searchable side effect library
- Severity rating
- Duration tracking
- Notes field
- Correlation with specific peptides/doses

**5.5 Goals & Milestones**
- Set target weight, measurements, or other goals
- Track progress toward goals
- Celebrate milestones

---

### 6. AI Insights Engine

**6.1 Correlation Analysis**
- Automatically correlate peptide protocols with:
  - Sleep quality changes
  - HRV trends
  - Weight changes
  - Energy ratings
  - Side effects
  - Bloodwork changes
- Surface statistically significant patterns
- Example insight: "Your deep sleep increased 23% in the two weeks following MOTS-c initiation"

**6.2 Protocol Recommendations**
- Timing optimization suggestions
- Dosage adjustment considerations based on logged data
- Fasting window reminders
- Stacking considerations

**6.3 Weekly/Monthly Summaries**
- AI-generated narrative summary of the period
- Key metrics overview
- Notable correlations
- Suggested focus areas

**6.4 Conversational Interface**
- Ask questions about your data in natural language
- "How has my sleep changed since starting retatrutide?"
- "What was my average weight last month vs. this month?"
- "Show me my HRV trend for the past 90 days"

**6.5 Trend Alerts**
- Proactive notifications for significant changes
- Declining sleep quality warnings
- Weight plateau detection
- Positive trend reinforcement

**6.6 Educational Responses**
- Ask general peptide questions
- Get AI-generated explanations based on trusted sources
- Context-aware (knows what peptides you're taking)

---

### 7. Dashboard & Calendar

**7.1 Home Dashboard**
- Today's scheduled injections (with quick-log)
- Current fasting status
- Key metrics at a glance (weight trend, sleep score, HRV)
- Recent activity summary
- Upcoming reminders

**7.2 Calendar View**
- Monthly/weekly/daily views
- Injection schedule overlay
- Workout/activity overlay
- Meal logging overlay
- Bloodwork dates
- Visual patterns (injection days vs. rest days)

**7.3 Analytics Dashboard**
- Customizable metric cards
- Trend charts for selected metrics
- Date range selection
- Export/share capabilities

---

### 8. Educational Content

**8.1 Peptide Guides**
- AI-generated comprehensive guides for each peptide
- What it does (mechanism of action simplified)
- Who it's for
- Typical protocols
- Reconstitution instructions
- Storage requirements
- Timing and fasting requirements
- What to expect (timeline)
- Common side effects
- Stacking considerations

**8.2 Getting Started Content**
- Onboarding educational flow
- Reconstitution tutorial
- Injection technique resources (links to external videos)
- Understanding your Garmin data
- Reading your bloodwork

**8.3 Contextual Help**
- In-app tooltips and explanations
- "Learn more" links throughout interface
- FAQ section

---

### 9. Settings & Account

**9.1 Profile**
- Basic info (age, weight, height, sex)
- Fitness goals selection
- Experience level with peptides
- Preferred units (metric/imperial, mcg/mg)

**9.2 Notification Preferences**
- Injection reminders on/off and timing
- Fasting alerts
- Weekly summary notifications
- Insight alerts

**9.3 Data Management**
- Export all data (CSV/JSON)
- Delete account and data
- Data backup options

**9.4 Connected Services**
- Garmin connection management
- Future integrations management

**9.5 Subscription Management**
- Plan details
- Billing history
- Upgrade/downgrade options

---

## Technical Architecture Recommendations

### Platform
- **Progressive Web App (PWA)** for initial launch
- React + TypeScript frontend
- Responsive design (mobile-first)
- Installable on iOS and Android home screens
- Native app wrappers (Capacitor or React Native) for Phase 2 if app store distribution desired

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
  - Handles authentication, database, file storage (photos, PDFs)
  - Row-level security for multi-user support
  - Real-time subscriptions for sync
- Alternative: Firebase if preferred

### AI Integration
- **Anthropic Claude API** for:
  - Bloodwork PDF parsing
  - Insight generation
  - Educational content generation
  - Conversational interface
- Consider caching common educational content to reduce API costs

### Garmin Integration
- Apply for Garmin Health API access via developer portal
- OAuth 2.0 flow for user authorization
- Webhook-based data delivery (Garmin pushes data to your endpoint)
- Alternative: Terra API for simplified integration (adds cost but reduces complexity)

### Hosting
- **Vercel** for frontend (aligns with your existing workflow)
- Supabase handles backend hosting
- Cloudflare for CDN/edge caching

### File Storage
- Supabase Storage for:
  - Progress photos (encrypted)
  - Uploaded bloodwork PDFs
- Implement client-side encryption for sensitive images

### Notifications
- PWA push notifications via Web Push API
- Service worker for background notification handling
- Consider OneSignal or Firebase Cloud Messaging for easier management
- Email notifications as backup delivery method

---

## Data Models (Simplified)

### User
- id, email, created_at
- profile (age, weight, height, sex, goals, units_preference)
- subscription_tier
- garmin_connected (boolean)
- onboarding_completed

### Peptide (Library)
- id, name, aliases
- category (GLP-1, growth hormone secretagogue, healing, etc.)
- default_storage_info
- fasting_required (boolean)
- fasting_duration_minutes
- educational_content (JSON)
- typical_dose_range
- half_life

### UserProtocol
- id, user_id, name
- status (active, completed, paused)
- start_date, end_date
- notes

### ProtocolPeptide
- id, protocol_id, peptide_id
- dosage_mcg
- frequency (daily, EOD, 2x/week, etc.)
- time_of_day
- special_instructions

### Vial
- id, user_id, peptide_id
- vial_mg
- bac_water_ml
- concentration_mcg_per_unit
- reconstitution_date
- expiration_date
- remaining_units (calculated)
- status (unreconstituted, active, depleted, expired)
- cost (optional)

### InjectionLog
- id, user_id, vial_id, peptide_id, protocol_id
- dosage_mcg
- units_used
- injection_site
- timestamp
- notes
- fasted_duration_minutes

### Meal
- id, user_id
- timestamp
- description
- calories, protein, carbs, fat
- is_breaking_fast (boolean)

### FastingWindow
- id, user_id
- start_time
- end_time
- duration_hours

### GarminData (Daily Summary)
- id, user_id, date
- sleep_duration, sleep_score, deep_sleep, light_sleep, rem_sleep
- hrv_average
- stress_average, body_battery_high, body_battery_low
- resting_hr, steps, active_minutes, calories_burned
- raw_json (store full API response)

### GarminActivity
- id, user_id, garmin_activity_id
- activity_type
- start_time, duration
- distance, calories
- avg_hr, max_hr
- training_effect
- raw_json

### Bloodwork
- id, user_id
- test_date
- lab_name
- pdf_url (if uploaded)
- is_baseline (boolean)
- notes

### BloodworkMarker
- id, bloodwork_id
- marker_name
- value
- unit
- reference_range_low
- reference_range_high
- is_flagged

### BodyMetric
- id, user_id
- date
- weight
- body_fat_percentage
- measurements (JSON: waist, chest, arms, etc.)

### ProgressPhoto
- id, user_id
- date
- photo_url (encrypted)
- photo_type (front, side, back)

### DailyCheckin
- id, user_id, date
- energy_level (1-10)
- mood (1-10)
- sleep_quality_subjective (1-10)
- appetite (1-10)
- notes

### SideEffect
- id, user_id
- peptide_id (optional - if attributable)
- date_started
- date_ended
- effect_name
- severity (mild, moderate, severe)
- notes

---

## User Stories

### Onboarding
- As a new user, I want to create an account and set up my profile so the app can personalize my experience
- As a new user, I want to connect my Garmin account so my health data syncs automatically
- As a new user, I want to add my current peptides and protocols so I can start tracking immediately
- As a new user, I want to log existing vials so my inventory is accurate from day one

### Daily Use
- As a user, I want to see my dashboard with today's schedule so I know what injections are due
- As a user, I want to log an injection with one tap so tracking is frictionless
- As a user, I want to see my current fasting status so I know if it's safe to take my peptide
- As a user, I want to log my meals so the app tracks my fasting windows
- As a user, I want to receive a reminder before my scheduled injection so I don't forget
- As a user, I want to see which injection site I used last so I can rotate properly

### Analysis
- As a user, I want to see my sleep trends correlated with my protocol so I can understand what's working
- As a user, I want to compare my current bloodwork to my baseline so I can see changes
- As a user, I want the AI to tell me what patterns it sees in my data so I get insights I'd miss
- As a user, I want to see my weight trend over time so I can track progress toward my goal
- As a user, I want to compare progress photos side-by-side so I can see visual changes

### Management
- As a user, I want to add a new vial and calculate reconstitution so I know my concentration
- As a user, I want to receive an alert when a vial is running low so I can reorder
- As a user, I want to create a new protocol when I change my stack so my tracking stays organized
- As a user, I want to log side effects so I have a record if issues arise

### Education
- As a new user, I want to read about my peptide so I understand how to use it properly
- As a user, I want to ask the AI questions about my protocol so I can learn in context
- As a user considering a new peptide, I want to research it in the app so I have trusted information

---

## Development Phases

### Phase 1: MVP (8-12 weeks)
**Goal:** Core tracking functionality that provides immediate value

- User authentication (Supabase Auth)
- Profile setup and onboarding flow
- Peptide library (10-15 most common peptides, AI-generated content)
- Protocol creation (basic)
- Vial management with reconstitution calculator
- Injection logging with site tracking
- Basic dashboard with today's schedule
- Injection reminders (PWA push notifications)
- Manual weight and measurement logging
- Daily check-in (energy, mood, side effects)
- Basic calendar view
- Mobile-responsive PWA

### Phase 2: Health Integration (6-8 weeks)
**Goal:** Connect objective health data

- Garmin Health API integration
- Automatic daily sync of sleep, HRV, stress, activity
- Health metrics dashboard
- Trend charts for Garmin data
- Activity logging (auto-imported from Garmin)
- Fasting window tracking
- Basic meal logging

### Phase 3: Intelligence Layer (6-8 weeks)
**Goal:** AI-powered insights and bloodwork

- Bloodwork PDF upload and AI parsing
- Manual bloodwork entry
- Biomarker trending and baseline comparison
- AI correlation analysis (protocol vs. health outcomes)
- Weekly AI-generated summaries
- Insight notifications
- Conversational AI interface for data queries

### Phase 4: Advanced Features (6-8 weeks)
**Goal:** Power user features and polish

- Progress photos with comparison tool
- Advanced protocol builder (titration, cycling)
- Nutrition tracking with macro breakdown
- Inventory alerts and cost tracking
- Data export
- Enhanced educational content
- Refined UI/UX based on user feedback

### Phase 5: Scale & Monetize (Ongoing)
**Goal:** Prepare for broader adoption

- Subscription implementation (Stripe)
- Free tier limitations
- Premium features gate
- Performance optimization
- Additional peptide library entries
- Community features consideration
- Native app wrappers if app store distribution desired

---

## Monetization Strategy

### Freemium Model

**Free Tier:**
- Track up to 3 peptides
- Basic injection logging
- Manual health data entry
- Limited AI queries (10/month)
- 30-day data history

**Premium Tier ($9.99/month or $79.99/year):**
- Unlimited peptides
- Garmin integration
- Bloodwork upload and AI parsing
- Unlimited AI insights and queries
- Unlimited data history
- Progress photos
- Priority support
- Advanced analytics

**Potential Add-ons (Future):**
- One-time bloodwork parsing without subscription
- Premium educational courses
- Practitioner/coach dashboard (B2B)

---

## Success Metrics

### Engagement
- Daily active users (DAU)
- Injections logged per user per week
- Session duration
- Feature adoption rates (Garmin connected, bloodwork uploaded, etc.)

### Retention
- Day 1, Day 7, Day 30 retention rates
- Subscription conversion rate (free to paid)
- Churn rate

### Value Delivery
- Average protocol duration (are users sticking with tracking?)
- AI insight engagement (are users viewing/acting on insights?)
- User-reported goal achievement

### Growth
- New user signups
- Referral rate
- App store ratings (if applicable)

---

## Risk Considerations

### Technical Risks
- **Garmin API approval delay:** Mitigate with CSV import fallback
- **AI parsing accuracy for bloodwork:** Mitigate with mandatory user confirmation before saving
- **PWA notification reliability on iOS:** Mitigate with email backup and consider native wrapper

### Business Risks
- **Low conversion to paid:** Mitigate by ensuring free tier is useful enough for word-of-mouth but limited enough to incentivize upgrade
- **Regulatory changes:** Monitor FDA/FTC guidance, maintain flexible architecture to adjust content approach
- **Competition:** Move fast, focus on Garmin integration and AI insights as differentiators

### User Risks
- **Data privacy concerns:** Implement strong encryption, clear privacy policy, user data ownership
- **Medical misinformation liability:** Include appropriate disclaimers, avoid prescriptive medical advice, frame as tracking/logging tool

---

## Legal Requirements

### Terms of Service
- Not medical advice disclaimer
- User assumes responsibility for their health decisions
- Data accuracy disclaimer (AI parsing may contain errors)
- Limitation of liability

### Privacy Policy
- GDPR and CCPA compliant
- Clear data collection and usage disclosure
- User data deletion rights
- No selling of personal health data

### In-App Disclaimers
- Educational content disclaimer on peptide guides
- "Consult a healthcare provider" language where appropriate
- Bloodwork parsing accuracy disclaimer

---

## Appendix: Garmin Health API Data Fields

Available via Health API (based on research):

**Sleep:**
- sleepTimeSeconds, napTimeSeconds
- deepSleepSeconds, lightSleepSeconds, remSleepSeconds, awakeSeconds
- sleepScores (overall, stress, awakenings, duration, depth, revitalization)
- sleepLevelsMap (timestamped sleep stage transitions)
- avgOvernightHrv, hrvStatus
- respirationValue
- spo2Values

**Stress & Recovery:**
- averageStressLevel, maxStressLevel, stressQualifier
- bodyBatteryChargedValue, bodyBatteryDrainedValue
- restingHeartRate, minHeartRate, maxHeartRate

**Activity:**
- activityType, duration, distance
- avgHeartRate, maxHeartRate
- calories, activeCalories
- trainingEffectLabel, anaerobicTrainingEffect
- vo2Max

**Daily Summaries:**
- steps, floorsClimbed, activeTimeSeconds
- moderateIntensityDurationSeconds, vigorousIntensityDurationSeconds

---

## Next Steps

1. Review and approve PRD
2. Finalize app name and branding
3. Set up development environment (Supabase project, Vercel, repository)
4. Apply for Garmin Health API access
5. Begin Phase 1 development
6. Design UI/UX mockups in parallel

---

*Document prepared for Digital Visionworks LLC*
*PepMetrics - Track. Correlate. Optimize.*
