# Fix 403 RLS Policy Errors

## Problem

You're getting 403 errors when trying to:
1. Create wallet transactions (top-up)
2. Create orders (bundle purchase)

This is because **RLS policies are missing INSERT permissions**.

## Solution

### Step 1: Run SQL in Supabase

Go to your Supabase SQL Editor and run this:

```sql
-- Allow users to insert their own wallet transactions
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own orders
CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

Or run the entire file: `supabase-fix-rls-policies.sql`

### Step 2: Verify Policies

After running, verify with:

```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('wallet_transactions', 'orders')
ORDER BY tablename, policyname;
```

You should see:
- ✅ `Users can view own transactions` (SELECT)
- ✅ `Users can insert own transactions` (INSERT) ← **NEW**
- ✅ `Users can view own orders` (SELECT)
- ✅ `Users can insert own orders` (INSERT) ← **NEW**

## What Was Fixed

### 1. Wallet Balance Update
- ✅ Better error handling
- ✅ Fetches current balance before updating
- ✅ Waits 500ms before refreshing profile (ensures DB update)
- ✅ Wallet page refreshes profile on success redirect

### 2. Order Creation
- ✅ Better error logging
- ✅ Checks for RLS policy errors specifically
- ✅ Returns created order data for verification
- ✅ More detailed error messages

### 3. Code Improvements
- ✅ Added delay before profile refresh
- ✅ Better error messages
- ✅ Console logging for debugging

## Testing

After running the SQL:

1. **Test Wallet Top-Up:**
   - Go to Wallet page
   - Top up with any amount
   - Check that balance updates immediately
   - Check wallet_transactions table in Supabase

2. **Test Bundle Purchase:**
   - Go to any service page
   - Select bundle and enter phone
   - Pay with Paystack
   - Check that order is created
   - Check orders table in Supabase

## If Still Getting 403

1. **Check Authentication:**
   - Make sure user is logged in
   - Check browser console for auth errors

2. **Check RLS Policies:**
   - Go to Supabase → Authentication → Policies
   - Verify INSERT policies exist for both tables

3. **Check User ID:**
   - In browser console, check if `user.id` matches `auth.uid()`
   - They should be the same

4. **Test Directly in Supabase:**
   - Try inserting a row manually in Table Editor
   - If that works, the issue is in the app code
   - If that fails, the issue is RLS policies

## Quick Fix SQL

If you need to drop and recreate policies:

```sql
-- Drop and recreate wallet_transactions INSERT policy
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Drop and recreate orders INSERT policy
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

