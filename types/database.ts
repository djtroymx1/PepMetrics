export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          email: string | null
          avatar_url: string | null
          membership_tier: 'free' | 'pro' | 'enterprise'
          units_system: 'imperial' | 'metric'
          timezone: string
          notify_injection_reminders: boolean
          notify_fasting_alerts: boolean
          notify_low_inventory: boolean
          notify_weekly_insights: boolean
          garmin_connected: boolean
          garmin_access_token: string | null
          garmin_refresh_token: string | null
          garmin_token_expires_at: string | null
          garmin_last_sync: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          email?: string | null
          avatar_url?: string | null
          membership_tier?: 'free' | 'pro' | 'enterprise'
          units_system?: 'imperial' | 'metric'
          timezone?: string
          notify_injection_reminders?: boolean
          notify_fasting_alerts?: boolean
          notify_low_inventory?: boolean
          notify_weekly_insights?: boolean
          garmin_connected?: boolean
          garmin_access_token?: string | null
          garmin_refresh_token?: string | null
          garmin_token_expires_at?: string | null
          garmin_last_sync?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          display_name?: string | null
          email?: string | null
          avatar_url?: string | null
          membership_tier?: 'free' | 'pro' | 'enterprise'
          units_system?: 'imperial' | 'metric'
          timezone?: string
          notify_injection_reminders?: boolean
          notify_fasting_alerts?: boolean
          notify_low_inventory?: boolean
          notify_weekly_insights?: boolean
          garmin_connected?: boolean
          garmin_access_token?: string | null
          garmin_refresh_token?: string | null
          garmin_token_expires_at?: string | null
          garmin_last_sync?: string | null
        }
      }
      protocols: {
        Row: {
          id: string
          user_id: string
          name: string
          peptides: string[]
          dosage: string | null
          frequency: string
          duration: string | null
          start_date: string
          end_date: string | null
          status: 'active' | 'paused' | 'completed' | 'archived'
          phase: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          peptides?: string[]
          dosage?: string | null
          frequency: string
          duration?: string | null
          start_date: string
          end_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'archived'
          phase?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          peptides?: string[]
          dosage?: string | null
          frequency?: string
          duration?: string | null
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'paused' | 'completed' | 'archived'
          phase?: string | null
          notes?: string | null
        }
      }
      vials: {
        Row: {
          id: string
          user_id: string
          peptide_name: string
          total_mg: number
          remaining_mg: number
          concentration: string | null
          reconstitution_volume_ml: number | null
          reconstitution_date: string | null
          expiry_date: string | null
          lot_number: string | null
          vendor: string | null
          status: 'good' | 'low' | 'expired' | 'empty'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          peptide_name: string
          total_mg: number
          remaining_mg: number
          concentration?: string | null
          reconstitution_volume_ml?: number | null
          reconstitution_date?: string | null
          expiry_date?: string | null
          lot_number?: string | null
          vendor?: string | null
          status?: 'good' | 'low' | 'expired' | 'empty'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          peptide_name?: string
          total_mg?: number
          remaining_mg?: number
          concentration?: string | null
          reconstitution_volume_ml?: number | null
          reconstitution_date?: string | null
          expiry_date?: string | null
          lot_number?: string | null
          vendor?: string | null
          status?: 'good' | 'low' | 'expired' | 'empty'
          notes?: string | null
        }
      }
      injections: {
        Row: {
          id: string
          user_id: string
          protocol_id: string | null
          vial_id: string | null
          peptide_name: string
          dose_value: number
          dose_unit: 'mcg' | 'mg' | 'IU' | 'units'
          injection_site: string | null
          injection_time: string
          notes: string | null
          side_effects: string | null
          fasting_hours: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          protocol_id?: string | null
          vial_id?: string | null
          peptide_name: string
          dose_value: number
          dose_unit: 'mcg' | 'mg' | 'IU' | 'units'
          injection_site?: string | null
          injection_time?: string
          notes?: string | null
          side_effects?: string | null
          fasting_hours?: number | null
          created_at?: string
        }
        Update: {
          peptide_name?: string
          dose_value?: number
          dose_unit?: 'mcg' | 'mg' | 'IU' | 'units'
          injection_site?: string | null
          injection_time?: string
          notes?: string | null
          side_effects?: string | null
          fasting_hours?: number | null
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_time: string
          description: string | null
          calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          fiber_g: number | null
          notes: string | null
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_time?: string
          description?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          notes?: string | null
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          meal_time?: string
          description?: string | null
          calories?: number | null
          protein_g?: number | null
          carbs_g?: number | null
          fat_g?: number | null
          fiber_g?: number | null
          notes?: string | null
          photo_url?: string | null
        }
      }
      weights: {
        Row: {
          id: string
          user_id: string
          value: number
          unit: 'lbs' | 'kg'
          measured_at: string
          notes: string | null
          body_fat_percentage: number | null
          muscle_mass_lbs: number | null
          water_percentage: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          value: number
          unit: 'lbs' | 'kg'
          measured_at?: string
          notes?: string | null
          body_fat_percentage?: number | null
          muscle_mass_lbs?: number | null
          water_percentage?: number | null
          created_at?: string
        }
        Update: {
          value?: number
          unit?: 'lbs' | 'kg'
          measured_at?: string
          notes?: string | null
          body_fat_percentage?: number | null
          muscle_mass_lbs?: number | null
          water_percentage?: number | null
        }
      }
      water_intake: {
        Row: {
          id: string
          user_id: string
          amount_oz: number
          logged_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount_oz: number
          logged_at?: string
          created_at?: string
        }
        Update: {
          amount_oz?: number
          logged_at?: string
        }
      }
      fasting_windows: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          target_hours: number
          actual_hours: number | null
          status: 'active' | 'completed' | 'broken'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          start_time: string
          end_time?: string | null
          target_hours?: number
          actual_hours?: number | null
          status?: 'active' | 'completed' | 'broken'
          notes?: string | null
          created_at?: string
        }
        Update: {
          start_time?: string
          end_time?: string | null
          target_hours?: number
          actual_hours?: number | null
          status?: 'active' | 'completed' | 'broken'
          notes?: string | null
        }
      }
      bloodwork_results: {
        Row: {
          id: string
          user_id: string
          test_date: string
          lab_name: string | null
          biomarkers: Json
          pdf_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_date: string
          lab_name?: string | null
          biomarkers?: Json
          pdf_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          test_date?: string
          lab_name?: string | null
          biomarkers?: Json
          pdf_url?: string | null
          notes?: string | null
        }
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          thumbnail_url: string | null
          photo_type: 'front' | 'side' | 'back' | 'other'
          taken_at: string
          weight_at_time: number | null
          weight_unit: 'lbs' | 'kg' | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          photo_url: string
          thumbnail_url?: string | null
          photo_type: 'front' | 'side' | 'back' | 'other'
          taken_at?: string
          weight_at_time?: number | null
          weight_unit?: 'lbs' | 'kg' | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          photo_url?: string
          thumbnail_url?: string | null
          photo_type?: 'front' | 'side' | 'back' | 'other'
          taken_at?: string
          weight_at_time?: number | null
          weight_unit?: 'lbs' | 'kg' | null
          notes?: string | null
        }
      }
      check_ins: {
        Row: {
          id: string
          user_id: string
          check_in_date: string
          energy_level: number | null
          mood_level: number | null
          hunger_level: number | null
          sleep_quality: number | null
          stress_level: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          check_in_date: string
          energy_level?: number | null
          mood_level?: number | null
          hunger_level?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          check_in_date?: string
          energy_level?: number | null
          mood_level?: number | null
          hunger_level?: number | null
          sleep_quality?: number | null
          stress_level?: number | null
          notes?: string | null
        }
      }
      garmin_data: {
        Row: {
          id: string
          user_id: string
          data_date: string
          sleep: Json
          hrv_avg: number | null
          hrv_status: string | null
          resting_heart_rate: number | null
          stress_avg: number | null
          body_battery_high: number | null
          body_battery_low: number | null
          steps: number | null
          active_minutes: number | null
          calories_total: number | null
          calories_active: number | null
          floors_climbed: number | null
          distance_meters: number | null
          intensity_minutes: number | null
          avg_spo2: number | null
          respiration_avg: number | null
          raw_data: Json
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data_date: string
          sleep?: Json
          hrv_avg?: number | null
          hrv_status?: string | null
          resting_heart_rate?: number | null
          stress_avg?: number | null
          body_battery_high?: number | null
          body_battery_low?: number | null
          steps?: number | null
          active_minutes?: number | null
          calories_total?: number | null
          calories_active?: number | null
          floors_climbed?: number | null
          distance_meters?: number | null
          intensity_minutes?: number | null
          avg_spo2?: number | null
          respiration_avg?: number | null
          raw_data?: Json
          synced_at?: string
        }
        Update: {
          data_date?: string
          sleep?: Json
          hrv_avg?: number | null
          hrv_status?: string | null
          resting_heart_rate?: number | null
          stress_avg?: number | null
          body_battery_high?: number | null
          body_battery_low?: number | null
          steps?: number | null
          active_minutes?: number | null
          calories_total?: number | null
          calories_active?: number | null
          floors_climbed?: number | null
          distance_meters?: number | null
          intensity_minutes?: number | null
          avg_spo2?: number | null
          respiration_avg?: number | null
          raw_data?: Json
        }
      }
      garmin_activities: {
        Row: {
          id: string
          user_id: string
          garmin_activity_id: string | null
          activity_type: string
          activity_name: string | null
          start_time: string
          duration_seconds: number | null
          distance_meters: number | null
          calories: number | null
          avg_heart_rate: number | null
          max_heart_rate: number | null
          avg_speed_mps: number | null
          elevation_gain_meters: number | null
          training_effect_aerobic: number | null
          training_effect_anaerobic: number | null
          raw_data: Json
          synced_at: string
        }
        Insert: {
          id?: string
          user_id: string
          garmin_activity_id?: string | null
          activity_type: string
          activity_name?: string | null
          start_time: string
          duration_seconds?: number | null
          distance_meters?: number | null
          calories?: number | null
          avg_heart_rate?: number | null
          max_heart_rate?: number | null
          avg_speed_mps?: number | null
          elevation_gain_meters?: number | null
          training_effect_aerobic?: number | null
          training_effect_anaerobic?: number | null
          raw_data?: Json
          synced_at?: string
        }
        Update: {
          garmin_activity_id?: string | null
          activity_type?: string
          activity_name?: string | null
          start_time?: string
          duration_seconds?: number | null
          distance_meters?: number | null
          calories?: number | null
          avg_heart_rate?: number | null
          max_heart_rate?: number | null
          avg_speed_mps?: number | null
          elevation_gain_meters?: number | null
          training_effect_aerobic?: number | null
          training_effect_anaerobic?: number | null
          raw_data?: Json
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Protocol = Database['public']['Tables']['protocols']['Row']
export type Vial = Database['public']['Tables']['vials']['Row']
export type Injection = Database['public']['Tables']['injections']['Row']
export type Meal = Database['public']['Tables']['meals']['Row']
export type Weight = Database['public']['Tables']['weights']['Row']
export type WaterIntake = Database['public']['Tables']['water_intake']['Row']
export type FastingWindow = Database['public']['Tables']['fasting_windows']['Row']
export type BloodworkResult = Database['public']['Tables']['bloodwork_results']['Row']
export type ProgressPhoto = Database['public']['Tables']['progress_photos']['Row']
export type CheckIn = Database['public']['Tables']['check_ins']['Row']
export type GarminData = Database['public']['Tables']['garmin_data']['Row']
export type GarminActivity = Database['public']['Tables']['garmin_activities']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProtocolInsert = Database['public']['Tables']['protocols']['Insert']
export type VialInsert = Database['public']['Tables']['vials']['Insert']
export type InjectionInsert = Database['public']['Tables']['injections']['Insert']
export type MealInsert = Database['public']['Tables']['meals']['Insert']
export type WeightInsert = Database['public']['Tables']['weights']['Insert']
export type WaterIntakeInsert = Database['public']['Tables']['water_intake']['Insert']
export type FastingWindowInsert = Database['public']['Tables']['fasting_windows']['Insert']
export type BloodworkResultInsert = Database['public']['Tables']['bloodwork_results']['Insert']
export type ProgressPhotoInsert = Database['public']['Tables']['progress_photos']['Insert']
export type CheckInInsert = Database['public']['Tables']['check_ins']['Insert']
export type GarminDataInsert = Database['public']['Tables']['garmin_data']['Insert']
export type GarminActivityInsert = Database['public']['Tables']['garmin_activities']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type ProtocolUpdate = Database['public']['Tables']['protocols']['Update']
export type VialUpdate = Database['public']['Tables']['vials']['Update']
export type InjectionUpdate = Database['public']['Tables']['injections']['Update']
export type MealUpdate = Database['public']['Tables']['meals']['Update']
export type WeightUpdate = Database['public']['Tables']['weights']['Update']
export type WaterIntakeUpdate = Database['public']['Tables']['water_intake']['Update']
export type FastingWindowUpdate = Database['public']['Tables']['fasting_windows']['Update']
export type BloodworkResultUpdate = Database['public']['Tables']['bloodwork_results']['Update']
export type ProgressPhotoUpdate = Database['public']['Tables']['progress_photos']['Update']
export type CheckInUpdate = Database['public']['Tables']['check_ins']['Update']
export type GarminDataUpdate = Database['public']['Tables']['garmin_data']['Update']
export type GarminActivityUpdate = Database['public']['Tables']['garmin_activities']['Update']
