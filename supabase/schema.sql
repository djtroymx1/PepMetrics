-- PepMetrics Database Schema
-- Run this SQL in the Supabase SQL Editor: https://supabase.com/dashboard/project/hcxmxzxprltllxglesdy/sql
-- Execute each section in order

-- ============================================
-- SECTION 1: Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- SECTION 2: Profiles Table (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'pro', 'enterprise')),
  units_system TEXT DEFAULT 'imperial' CHECK (units_system IN ('imperial', 'metric')),
  timezone TEXT DEFAULT 'America/New_York',

  -- Notification preferences
  notify_injection_reminders BOOLEAN DEFAULT true,
  notify_fasting_alerts BOOLEAN DEFAULT true,
  notify_low_inventory BOOLEAN DEFAULT true,
  notify_weekly_insights BOOLEAN DEFAULT false,

  -- Garmin integration
  garmin_connected BOOLEAN DEFAULT false,
  garmin_access_token TEXT,
  garmin_refresh_token TEXT,
  garmin_token_expires_at TIMESTAMPTZ,
  garmin_last_sync TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SECTION 3: Protocols Table
-- ============================================
CREATE TABLE public.protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  peptides TEXT[] NOT NULL DEFAULT '{}',
  dosage TEXT,
  frequency TEXT NOT NULL,
  duration TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  phase TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_protocols_user_id ON public.protocols(user_id);
CREATE INDEX idx_protocols_status ON public.protocols(status);
CREATE INDEX idx_protocols_start_date ON public.protocols(start_date);

-- ============================================
-- SECTION 4: Vials Table
-- ============================================
CREATE TABLE public.vials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  peptide_name TEXT NOT NULL,
  total_mg DECIMAL(10,2) NOT NULL,
  remaining_mg DECIMAL(10,2) NOT NULL,
  concentration TEXT,
  reconstitution_volume_ml DECIMAL(10,2),
  reconstitution_date DATE,
  expiry_date DATE,
  lot_number TEXT,
  vendor TEXT,
  status TEXT DEFAULT 'good' CHECK (status IN ('good', 'low', 'expired', 'empty')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vials_user_id ON public.vials(user_id);
CREATE INDEX idx_vials_peptide ON public.vials(peptide_name);
CREATE INDEX idx_vials_status ON public.vials(status);

-- ============================================
-- SECTION 5: Injections Table
-- ============================================
CREATE TABLE public.injections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocol_id UUID REFERENCES public.protocols(id) ON DELETE SET NULL,
  vial_id UUID REFERENCES public.vials(id) ON DELETE SET NULL,
  peptide_name TEXT NOT NULL,
  dose_value DECIMAL(10,3) NOT NULL,
  dose_unit TEXT NOT NULL CHECK (dose_unit IN ('mcg', 'mg', 'IU', 'units')),
  injection_site TEXT,
  injection_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  side_effects TEXT,
  fasting_hours DECIMAL(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_injections_user_id ON public.injections(user_id);
CREATE INDEX idx_injections_protocol ON public.injections(protocol_id);
CREATE INDEX idx_injections_time ON public.injections(injection_time);
CREATE INDEX idx_injections_peptide ON public.injections(peptide_name);

-- ============================================
-- SECTION 6: Meals Table
-- ============================================
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  meal_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT,
  calories INTEGER,
  protein_g DECIMAL(6,1),
  carbs_g DECIMAL(6,1),
  fat_g DECIMAL(6,1),
  fiber_g DECIMAL(6,1),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_meals_time ON public.meals(meal_time);
CREATE INDEX idx_meals_type ON public.meals(meal_type);

-- ============================================
-- SECTION 7: Weights Table
-- ============================================
CREATE TABLE public.weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value DECIMAL(5,1) NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('lbs', 'kg')),
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  body_fat_percentage DECIMAL(4,1),
  muscle_mass_lbs DECIMAL(5,1),
  water_percentage DECIMAL(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_weights_user_id ON public.weights(user_id);
CREATE INDEX idx_weights_measured_at ON public.weights(measured_at);

-- ============================================
-- SECTION 8: Water Intake Table
-- ============================================
CREATE TABLE public.water_intake (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_oz DECIMAL(6,1) NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_user_id ON public.water_intake(user_id);
CREATE INDEX idx_water_logged_at ON public.water_intake(logged_at);

-- ============================================
-- SECTION 9: Fasting Windows Table
-- ============================================
CREATE TABLE public.fasting_windows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  target_hours INTEGER NOT NULL DEFAULT 16,
  actual_hours DECIMAL(4,1),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'broken')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fasting_user_id ON public.fasting_windows(user_id);
CREATE INDEX idx_fasting_start ON public.fasting_windows(start_time);
CREATE INDEX idx_fasting_status ON public.fasting_windows(status);

-- ============================================
-- SECTION 10: Bloodwork Results Table
-- ============================================
CREATE TABLE public.bloodwork_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  lab_name TEXT,
  biomarkers JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bloodwork_user_id ON public.bloodwork_results(user_id);
CREATE INDEX idx_bloodwork_test_date ON public.bloodwork_results(test_date);
CREATE INDEX idx_bloodwork_biomarkers ON public.bloodwork_results USING gin(biomarkers);

-- ============================================
-- SECTION 11: Progress Photos Table
-- ============================================
CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  weight_at_time DECIMAL(5,1),
  weight_unit TEXT CHECK (weight_unit IN ('lbs', 'kg')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_user_id ON public.progress_photos(user_id);
CREATE INDEX idx_photos_taken_at ON public.progress_photos(taken_at);
CREATE INDEX idx_photos_type ON public.progress_photos(photo_type);

-- ============================================
-- SECTION 12: Check-Ins Table
-- ============================================
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood_level INTEGER CHECK (mood_level >= 1 AND mood_level <= 10),
  hunger_level INTEGER CHECK (hunger_level >= 1 AND hunger_level <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, check_in_date)
);

CREATE INDEX idx_checkins_user_id ON public.check_ins(user_id);
CREATE INDEX idx_checkins_date ON public.check_ins(check_in_date);

-- ============================================
-- SECTION 13: Garmin Data Table (Daily Health)
-- ============================================
CREATE TABLE public.garmin_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data_date DATE NOT NULL,
  sleep JSONB DEFAULT '{}',
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
  raw_data JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, data_date)
);

CREATE INDEX idx_garmin_user_id ON public.garmin_data(user_id);
CREATE INDEX idx_garmin_date ON public.garmin_data(data_date);

-- ============================================
-- SECTION 14: Garmin Activities Table
-- ============================================
CREATE TABLE public.garmin_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  raw_data JSONB DEFAULT '{}',
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON public.garmin_activities(user_id);
CREATE INDEX idx_activities_start ON public.garmin_activities(start_time);
CREATE INDEX idx_activities_type ON public.garmin_activities(activity_type);

-- ============================================
-- SECTION 15: Updated At Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at
  BEFORE UPDATE ON public.protocols
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vials_updated_at
  BEFORE UPDATE ON public.vials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bloodwork_updated_at
  BEFORE UPDATE ON public.bloodwork_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECTION 16: Enable Row Level Security
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fasting_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloodwork_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garmin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garmin_activities ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SECTION 17: RLS Policies - Profiles
-- ============================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- SECTION 18: RLS Policies - Protocols
-- ============================================
CREATE POLICY "Users can view own protocols"
  ON public.protocols FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own protocols"
  ON public.protocols FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own protocols"
  ON public.protocols FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own protocols"
  ON public.protocols FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 19: RLS Policies - Vials
-- ============================================
CREATE POLICY "Users can view own vials"
  ON public.vials FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vials"
  ON public.vials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vials"
  ON public.vials FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vials"
  ON public.vials FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 20: RLS Policies - Injections
-- ============================================
CREATE POLICY "Users can view own injections"
  ON public.injections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own injections"
  ON public.injections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own injections"
  ON public.injections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own injections"
  ON public.injections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 21: RLS Policies - Meals
-- ============================================
CREATE POLICY "Users can view own meals"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meals"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meals"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meals"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 22: RLS Policies - Weights
-- ============================================
CREATE POLICY "Users can view own weights"
  ON public.weights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weights"
  ON public.weights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weights"
  ON public.weights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weights"
  ON public.weights FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 23: RLS Policies - Water Intake
-- ============================================
CREATE POLICY "Users can view own water_intake"
  ON public.water_intake FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water_intake"
  ON public.water_intake FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own water_intake"
  ON public.water_intake FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 24: RLS Policies - Fasting Windows
-- ============================================
CREATE POLICY "Users can view own fasting_windows"
  ON public.fasting_windows FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fasting_windows"
  ON public.fasting_windows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fasting_windows"
  ON public.fasting_windows FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fasting_windows"
  ON public.fasting_windows FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 25: RLS Policies - Bloodwork
-- ============================================
CREATE POLICY "Users can view own bloodwork"
  ON public.bloodwork_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bloodwork"
  ON public.bloodwork_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bloodwork"
  ON public.bloodwork_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bloodwork"
  ON public.bloodwork_results FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 26: RLS Policies - Progress Photos
-- ============================================
CREATE POLICY "Users can view own photos"
  ON public.progress_photos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos"
  ON public.progress_photos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos"
  ON public.progress_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos"
  ON public.progress_photos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 27: RLS Policies - Check-Ins
-- ============================================
CREATE POLICY "Users can view own check_ins"
  ON public.check_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check_ins"
  ON public.check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check_ins"
  ON public.check_ins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own check_ins"
  ON public.check_ins FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 28: RLS Policies - Garmin Data
-- ============================================
CREATE POLICY "Users can view own garmin_data"
  ON public.garmin_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garmin_data"
  ON public.garmin_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garmin_data"
  ON public.garmin_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own garmin_data"
  ON public.garmin_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- SECTION 29: RLS Policies - Garmin Activities
-- ============================================
CREATE POLICY "Users can view own garmin_activities"
  ON public.garmin_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garmin_activities"
  ON public.garmin_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garmin_activities"
  ON public.garmin_activities FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own garmin_activities"
  ON public.garmin_activities FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- DONE! Your database is ready.
-- ============================================
