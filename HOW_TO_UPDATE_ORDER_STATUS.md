# How to Update Order Status

There are **3 ways** to change order status from "pending" to "delivered":

## Method 1: Using the Transactions Page (Recommended) ✅

1. Go to **Transactions** page in the app
2. Find the order with "pending" status
3. Click the **green checkmark** button (✓) next to the status badge
4. Status will update to "delivered" immediately
5. You can also click the **red X** button to mark as "failed"

**Note:** You must run the UPDATE policy SQL first (see Method 3).

## Method 2: Using Supabase Table Editor

1. Go to your **Supabase Dashboard**
2. Click **Table Editor** in the left sidebar
3. Select the **orders** table
4. Find the order you want to update
5. Click on the **status** cell
6. Change from `pending` to `delivered` (or `failed`, `refunded`)
7. Click **Save** (or press Enter)

## Method 3: Using SQL (Bulk Updates)

Run this in **Supabase SQL Editor**:

```sql
-- Update a specific order by order_id
UPDATE orders
SET status = 'delivered'
WHERE order_id = '#1234567890';

-- Update all pending orders to delivered (use carefully!)
UPDATE orders
SET status = 'delivered'
WHERE status = 'pending';

-- Update orders by date range
UPDATE orders
SET status = 'delivered'
WHERE status = 'pending'
  AND created_at >= '2024-01-01'
  AND created_at < '2024-02-01';
```

## ⚠️ Important: Add UPDATE Policy First

Before you can update orders from the app, you **must** run this SQL in Supabase:

```sql
-- Add UPDATE policy for orders
CREATE POLICY "Users can update own orders" 
  ON orders FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

Or run the complete file: `supabase-add-update-policy.sql`

## Status Options

- `pending` - Order created, waiting for delivery
- `delivered` - Bundle successfully delivered
- `failed` - Delivery failed
- `refunded` - Order refunded

## Quick Test

After adding the UPDATE policy:

1. Create a test order (buy a bundle)
2. Go to Transactions page
3. Find the pending order
4. Click the green checkmark (✓)
5. Status should change to "delivered" ✅

## Troubleshooting

**If you get a 403 error when clicking the button:**
- Make sure you ran the UPDATE policy SQL
- Check that you're logged in
- Verify the policy exists: Run `SELECT * FROM pg_policies WHERE tablename = 'orders';`

**If the status doesn't update:**
- Check browser console for errors
- Verify you're updating your own orders (RLS policy)
- Try refreshing the page

