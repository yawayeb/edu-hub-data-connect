-- =====================================================
-- Fix RLS Policies - Add INSERT Permissions
-- =====================================================
-- Run this in Supabase SQL Editor to fix 403 errors
-- =====================================================

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;

-- Allow users to insert their own wallet transactions
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('wallet_transactions', 'orders')
ORDER BY tablename, policyname;

