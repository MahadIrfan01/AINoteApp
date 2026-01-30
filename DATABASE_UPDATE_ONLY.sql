-- ============================================
-- DATABASE UPDATE FOR NEW FEATURES
-- ============================================
-- Copy and paste this ENTIRE file into your Supabase SQL Editor
-- Then click "RUN" to update your database
-- ============================================

-- Add status and scheduled_date columns to quiz_results if they don't exist
ALTER TABLE quiz_results ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed';
ALTER TABLE quiz_results ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE;

-- Create reminders table (NEW)
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reminder_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance (NEW)
CREATE INDEX IF NOT EXISTS idx_quiz_results_status ON quiz_results(status);
CREATE INDEX IF NOT EXISTS idx_reminders_class_id ON reminders(class_id);
CREATE INDEX IF NOT EXISTS idx_reminders_datetime ON reminders(reminder_datetime DESC);

-- Enable Row Level Security (NEW)
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (NEW)
-- For production, you should customize these based on your auth requirements
-- Uncomment the line below if you want to enable the policy:
-- CREATE POLICY "Allow all operations on reminders" ON reminders
--   FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- That's it! Your database is now updated.
-- Close this window and start using the reminder features!
-- ============================================
