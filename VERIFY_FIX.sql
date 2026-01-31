-- Run this to verify the fix was applied correctly
-- Copy all results and share them

-- 1. Check if user_id column exists in classes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'classes'
ORDER BY ordinal_position;

-- 2. Check RLS status (should be disabled for now)
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('classes', 'notes', 'quiz_results');

-- 3. Try a test insert (this will show if it works)
-- Note: This will only work if you run it while logged into Supabase
-- SELECT auth.uid() as my_user_id;
