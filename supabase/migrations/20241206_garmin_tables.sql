-- Ensure Garmin data tables exist for AI Insights ingest
-- Safe to run multiple times; uses IF NOT EXISTS and idempotent policies/indexes

-- ============================================
-- GARMIN ACTIVITIES (per-activity summary)
-- ============================================
CREATE TABLE IF NOT EXISTS public.garmin_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  garmin_activity_id TEXT UNIQUE,
  activity_type TEXT NOT NULL,
  activity_name TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER,
  distance_meters INTEGER,
  calories INTEGER,
  avg_heart_rate INTEGER,
  max_heart_rate INTEGER,
  avg_speed_mps DECIMAL(6,2),
  elevation_gain_meters INTEGER,
  training_effect_aerobic DECIMAL(3,1),
  training_effect_anaerobic DECIMAL(3,1),
  raw_data JSONB DEFAULT '{}'::jsonb,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_garmin_activities_user_id ON public.garmin_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_start ON public.garmin_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_garmin_activities_type ON public.garmin_activities(activity_type);

ALTER TABLE public.garmin_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own garmin_activities"
  ON public.garmin_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own garmin_activities"
  ON public.garmin_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own garmin_activities"
  ON public.garmin_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own garmin_activities"
  ON public.garmin_activities FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GARMIN DAILY DATA (per-day health metrics)
-- ============================================
CREATE TABLE IF NOT EXISTS public.garmin_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_date DATE NOT NULL,
  sleep JSONB DEFAULT '{}'::jsonb,
  hrv_avg INTEGER,
  hrv_status TEXT,
  resting_heart_rate INTEGER,
  stress_avg INTEGER,
  body_battery_high INTEGER,
  body_battery_low INTEGER,
  steps INTEGER,
  active_minutes INTEGER,
  calories_total INTEGER,
  calories_active INTEGER,
  floors_climbed INTEGER,
  distance_meters INTEGER,
  intensity_minutes INTEGER,
  avg_spo2 DECIMAL(4,1),
  respiration_avg INTEGER,
  raw_data JSONB DEFAULT '{}'::jsonb,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_date)
);

CREATE INDEX IF NOT EXISTS idx_garmin_data_user_id ON public.garmin_data(user_id);
CREATE INDEX IF NOT EXISTS idx_garmin_data_date ON public.garmin_data(data_date);

ALTER TABLE public.garmin_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own garmin_data"
  ON public.garmin_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own garmin_data"
  ON public.garmin_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own garmin_data"
  ON public.garmin_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own garmin_data"
  ON public.garmin_data FOR DELETE
  USING (auth.uid() = user_id);
