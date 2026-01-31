-- Run this in Supabase SQL Editor to check your database setup
-- Copy the results and share them

-- 1. Check if user_id column exists in classes table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- 2. Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'classes';

-- 3. Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'classes';

-- 4. Check if there are any classes in the table
SELECT id, name, user_id, created_at
FROM classes
LIMIT 5;

-- 5. Check current user (if logged in via Supabase)
SELECT auth.uid() as current_user_id;
