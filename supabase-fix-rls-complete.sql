-- =====================================================
-- Complete RLS Policy Fix for Wallet & Orders
-- =====================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- This will fix all 403 errors
-- =====================================================

-- =====================================================
-- 1. Fix wallet_transactions policies
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;

-- Recreate SELECT policy
CREATE POLICY "Users can view own transactions" 
  ON wallet_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- Create INSERT policy (THIS IS THE FIX)
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 2. Fix orders policies
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;

-- Recreate SELECT policy
CREATE POLICY "Users can view own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Create INSERT policy (THIS IS THE FIX)
CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. Verify all policies exist
-- =====================================================

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
WHERE tablename IN ('wallet_transactions', 'orders', 'profiles')
ORDER BY tablename, cmd;

-- =====================================================
-- 4. Test query (should return policies)
-- =====================================================
-- You should see:
-- wallet_transactions | Users can view own transactions | SELECT
-- wallet_transactions | Users can insert own transactions | INSERT
-- orders | Users can view own orders | SELECT
-- orders | Users can insert own orders | INSERT
-- profiles | Users can view own profile | SELECT
-- profiles | Users can update own profile | UPDATE

