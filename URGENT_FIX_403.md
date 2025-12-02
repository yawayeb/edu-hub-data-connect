# 🚨 URGENT: Fix 403 RLS Policy Error

## The Problem

You're getting this error:
```
code: "42501"
message: "new row violates row-level security policy for table \"wallet_transactions\""
```

This means **the INSERT policy doesn't exist** or is incorrect.

## ✅ IMMEDIATE FIX

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste This ENTIRE SQL

```sql
-- Fix wallet_transactions INSERT policy
DROP POLICY IF EXISTS "Users can insert own transactions" ON wallet_transactions;
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Fix orders INSERT policy
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

### Step 3: Click "Run" (or press Ctrl+Enter)

### Step 4: Verify It Worked

Run this to check:

```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('wallet_transactions', 'orders')
ORDER BY tablename, cmd;
```

You should see:
- ✅ `wallet_transactions` | `Users can view own transactions` | `SELECT`
- ✅ `wallet_transactions` | `Users can insert own transactions` | `INSERT` ← **MUST EXIST**
- ✅ `orders` | `Users can view own orders` | `SELECT`
- ✅ `orders` | `Users can insert own orders` | `INSERT` ← **MUST EXIST**

## Why This Happens

The original schema only created **SELECT** policies, but forgot **INSERT** policies. Users can read their data but can't create new records.

## After Running the SQL

1. **Refresh your browser** (or restart dev server)
2. **Try wallet top-up again** - should work now!
3. **Try bundle purchase** - should work now!

## Still Not Working?

If you still get 403 after running the SQL:

1. **Check you're logged in:**
   - Open browser console
   - Type: `localStorage.getItem('sb-...')` (check for Supabase session)

2. **Check user ID matches:**
   - In Supabase, go to Authentication → Users
   - Find your user ID
   - Make sure it matches what's in the error

3. **Try this test query in Supabase SQL Editor:**
   ```sql
   -- This should work if you're logged in
   INSERT INTO wallet_transactions (user_id, amount, type, description, status)
   VALUES (auth.uid(), 10.00, 'credit', 'Test', 'completed');
   ```
   - If this works: The policy is correct, issue is in app
   - If this fails: The policy is still wrong

## Quick Copy-Paste SQL

Just copy this and run it:

```sql
CREATE POLICY "Users can insert own transactions" 
  ON wallet_transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" 
  ON orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

That's it! Run this and the 403 errors will be fixed.

