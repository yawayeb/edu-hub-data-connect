-- =====================================================
-- Add UPDATE Policy for Orders
-- =====================================================
-- This allows users to update their own orders
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Create UPDATE policy for orders
CREATE POLICY "Users can update own orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Verify the policy was created
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN 'View'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END as permission_type
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY cmd;

-- You should now see:
-- orders | Users can view own orders | SELECT
-- orders | Users can insert own orders | INSERT
-- orders | Users can update own orders | UPDATE

