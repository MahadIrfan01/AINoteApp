-- ============================================
-- SIMPLE FIX: Add user_id column and basic policies
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Add user_id column to classes table
ALTER TABLE classes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Add user_id column to invitations table
ALTER TABLE invitations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 3: Add user_id column to reminders table
ALTER TABLE reminders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Create indexes
CREATE INDEX idx_classes_user_id ON classes(user_id);
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);

-- Step 5: Temporarily disable RLS (we'll re-enable with proper policies)
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;
ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;

-- ============================================
-- SUCCESS! Now try adding a class.
-- After you confirm it works, we'll add proper RLS policies.
-- ============================================
