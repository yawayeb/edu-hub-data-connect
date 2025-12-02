# How to Update Order Status in Supabase

Since status updates are now done manually in Supabase, here's how to update order status so it reflects on the customer's page automatically.

## Method 1: Using Supabase Table Editor (Easiest)

1. Go to your **Supabase Dashboard**
2. Click **Table Editor** in the left sidebar
3. Select the **orders** table
4. Find the order you want to update (use search or filters)
5. Click on the **status** cell for that order
6. Change the status:
   - `pending` → `delivered` (when bundle is successfully delivered)
   - `pending` → `failed` (when delivery fails)
   - `delivered` → `refunded` (if refund is needed)
7. Click **Save** (or press Enter)

**The customer's page will automatically update within 30 seconds** (or when they refresh/return to the tab).

## Method 2: Using SQL Editor (Bulk Updates)

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

-- Update orders for a specific user
UPDATE orders
SET status = 'delivered'
WHERE user_id = 'user-uuid-here'
  AND status = 'pending';
```

## Status Options

- `pending` - Order created, waiting for delivery
- `delivered` - Bundle successfully delivered ✅
- `failed` - Delivery failed ❌
- `refunded` - Order refunded 💰

## Auto-Refresh on Customer Page

The customer's Transactions page automatically:
- ✅ Refreshes every **30 seconds** to show latest status
- ✅ Refreshes when they **return to the browser tab**
- ✅ Shows updated status immediately after refresh

## Quick Status Update Workflow

1. Customer purchases bundle → Status: `pending`
2. You process the order in your system
3. Go to Supabase → Update status to `delivered`
4. Customer sees updated status within 30 seconds (or on refresh)

## Tips

- **Bulk Updates**: Use SQL for updating multiple orders at once
- **Quick Updates**: Use Table Editor for single order updates
- **Status History**: The `api_response` column stores additional details
- **Filtering**: Use Supabase filters to find orders by status, date, or user

## Verification

After updating status in Supabase:
1. Wait 30 seconds (or refresh customer's page)
2. Check the Transactions page
3. Status badge should show the new status with correct color:
   - 🟢 Green = Delivered
   - 🟡 Yellow = Pending
   - 🔴 Red = Failed
   - ⚪ Gray = Refunded

