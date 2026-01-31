-- TEMPORARY: Disable RLS for testing
-- This will help us determine if RLS is the issue
-- Run this in Supabase SQL Editor

-- Temporarily disable RLS on classes table
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;

-- After testing, you can re-enable it with:
-- ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
