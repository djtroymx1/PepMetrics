-- AI Insights Engine Database Migration
-- Creates tables for: ai_insights, garmin_imports, dose_logs

-- ============================================
-- AI INSIGHTS TABLE
-- Stores weekly AI-generated analysis results
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,

  -- Raw analysis data
  metrics_summary JSONB DEFAULT '{}',
  protocol_summary JSONB DEFAULT '{}',
  correlation_data JSONB DEFAULT '{}',

  -- AI-generated content
  insights JSONB DEFAULT '[]',
  weekly_summary TEXT,
  recommendations JSONB DEFAULT '[]',

  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_version TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, week_start)
);

-- Indexes for ai_insights
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_week_start ON public.ai_insights(week_start);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated_at ON public.ai_insights(generated_at);

-- RLS Policies for ai_insights
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON public.ai_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights"
  ON public.ai_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON public.ai_insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights"
  ON public.ai_insights FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GARMIN IMPORTS TABLE
-- Tracks import history for Garmin data files
-- ============================================
CREATE TABLE IF NOT EXISTS public.garmin_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  import_date TIMESTAMPTZ DEFAULT NOW(),
  file_name TEXT,
  file_type TEXT DEFAULT 'activity_csv' CHECK (file_type IN ('activity_csv', 'full_export')),
  records_imported INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  date_range_start DATE,
  date_range_end DATE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for garmin_imports
CREATE INDEX IF NOT EXISTS idx_garmin_imports_user_id ON public.garmin_imports(user_id);
CREATE INDEX IF NOT EXISTS idx_garmin_imports_import_date ON public.garmin_imports(import_date);

-- RLS Policies for garmin_imports
ALTER TABLE public.garmin_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own imports"
  ON public.garmin_imports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imports"
  ON public.garmin_imports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own imports"
  ON public.garmin_imports FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- DOSE LOGS TABLE
-- Stores dose log entries (migrated from localStorage)
-- ============================================
CREATE TABLE IF NOT EXISTS public.dose_logs (
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for dose_logs
CREATE INDEX IF NOT EXISTS idx_dose_logs_user_id ON public.dose_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_protocol_id ON public.dose_logs(protocol_id);
CREATE INDEX IF NOT EXISTS idx_dose_logs_scheduled_for ON public.dose_logs(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_dose_logs_status ON public.dose_logs(status);
CREATE INDEX IF NOT EXISTS idx_dose_logs_user_scheduled ON public.dose_logs(user_id, scheduled_for);

-- RLS Policies for dose_logs
ALTER TABLE public.dose_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dose_logs"
  ON public.dose_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dose_logs"
  ON public.dose_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dose_logs"
  ON public.dose_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dose_logs"
  ON public.dose_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CHAT CONVERSATIONS TABLE (for future chat persistence)
-- ============================================
CREATE TABLE IF NOT EXISTS public.insight_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for insight_conversations
CREATE INDEX IF NOT EXISTS idx_insight_conversations_user_id ON public.insight_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_insight_conversations_created_at ON public.insight_conversations(created_at);

-- RLS Policies for insight_conversations
ALTER TABLE public.insight_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own conversations"
  ON public.insight_conversations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- Auto-update updated_at column on row changes
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to ai_insights
DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON public.ai_insights;
CREATE TRIGGER update_ai_insights_updated_at
  BEFORE UPDATE ON public.ai_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to dose_logs
DROP TRIGGER IF EXISTS update_dose_logs_updated_at ON public.dose_logs;
CREATE TRIGGER update_dose_logs_updated_at
  BEFORE UPDATE ON public.dose_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to insight_conversations
DROP TRIGGER IF EXISTS update_insight_conversations_updated_at ON public.insight_conversations;
CREATE TRIGGER update_insight_conversations_updated_at
  BEFORE UPDATE ON public.insight_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
