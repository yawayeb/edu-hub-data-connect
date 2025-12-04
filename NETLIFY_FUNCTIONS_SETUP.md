# Netlify Functions Setup for Resend Email

This guide explains how to set up Resend email functionality using Netlify Functions.

## Files Structure

```
netlify/
  functions/
    health.ts          # Health check endpoint
    send-email.ts      # Email sending function
```

## Environment Variables Setup in Netlify

To make Resend work with Netlify Functions, you need to set the following environment variables in your Netlify dashboard:

### Required Environment Variables

1. **RESEND_API_KEY**
   - Your Resend API key (starts with `re_`)
   - Get it from: https://resend.com/api-keys
   - Example: `re_123456789abcdefghijklmnopqrstuvwxyz`

2. **RESEND_FROM_EMAIL** (Optional)
   - Default: `Edu-Hub Data <noreply@gigadata.store>`
   - Format: `Name <email@domain.com>`
   - Must be a verified domain in Resend or use `onboarding@resend.dev` for testing

3. **ADMIN_EMAIL** (Optional but Recommended)
   - Your admin email address to receive notifications
   - You will receive emails when:
     - A new user signs up
     - A user purchases a bundle
     - A user tops up their wallet
   - Example: `admin@yourdomain.com` or `your-email@gmail.com`
   - If not set, admin notifications will be disabled (user emails will still work)

### How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site (gigadata.store)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add each variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key
6. Repeat for `RESEND_FROM_EMAIL` (optional, defaults to `noreply@gigadata.store`)
7. Repeat for `ADMIN_EMAIL` (optional, but recommended for admin notifications)

## Function Endpoints

### Health Check
- **URL**: `/.netlify/functions/health`
- **Method**: `GET`
- **Response**: JSON with status and timestamp

### Send Email
- **URL**: `/.netlify/functions/send-email`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Email Types

1. **Welcome Email**
```json
{
  "type": "welcome",
  "fullName": "John Doe",
  "email": "john@example.com"
}
```

2. **Bundle Purchase Email**
```json
{
  "type": "bundle-purchase",
  "fullName": "John Doe",
  "email": "john@example.com",
  "orderId": "ORD-123",
  "network": "MTN_UP2U",
  "package": "5GB",
  "phoneNumber": "0244123456",
  "amount": 25.00,
  "status": "delivered"
}
```

3. **Wallet Top-Up Email**
```json
{
  "type": "wallet-topup",
  "fullName": "John Doe",
  "email": "john@example.com",
  "amount": 100.00,
  "reference": "REF-123456",
  "newBalance": 150.00
}
```

## Domain Configuration

Your domain `gigadata.store` is configured in the function. Make sure:

1. **Verify your domain in Resend**:
   - Go to https://resend.com/domains
   - Add `gigadata.store`
   - Add the DNS records provided by Resend to your domain
   - Wait for verification (usually a few minutes)

2. **Update FROM email** (if needed):
   - Set `RESEND_FROM_EMAIL` in Netlify environment variables
   - Format: `Edu-Hub Data <noreply@gigadata.store>`

## Testing

### Test Health Endpoint
```bash
curl https://gigadata.store/.netlify/functions/health
```

### Test Email Function
```bash
curl -X POST https://gigadata.store/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "welcome",
    "fullName": "Test User",
    "email": "your-email@example.com"
  }'
```

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**:
   - Verify `RESEND_API_KEY` is set in Netlify dashboard
   - Check Netlify function logs: Site settings → Functions → View logs

2. **Check Domain Verification**:
   - Ensure `gigadata.store` is verified in Resend
   - Check DNS records are correct

3. **Check Function Logs**:
   - Go to Netlify dashboard → Your site → Functions
   - Click on `send-email` function
   - View logs for errors

4. **Check Resend Dashboard**:
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for delivery errors

### Common Issues

- **403 Forbidden**: Domain not verified in Resend
- **401 Unauthorized**: Invalid API key
- **CORS errors**: Already handled in function headers
- **Function not found**: Make sure `netlify.toml` has `functions = "netlify/functions"`

## Frontend Integration

The frontend automatically uses the Netlify function endpoint:
- Development: `/.netlify/functions/send-email` (when using Netlify Dev)
- Production: `/.netlify/functions/send-email`

No additional configuration needed in the frontend code.

## Deployment

After setting environment variables:
1. Push your code to Git
2. Netlify will automatically rebuild
3. Functions will be available at `/.netlify/functions/[function-name]`

## Admin Notifications

When `ADMIN_EMAIL` is configured, you will automatically receive email notifications for:

1. **New User Registrations**
   - Sent when a new user signs up
   - Includes: user name, email, registration time

2. **Bundle Purchases**
   - Sent when a user purchases a data bundle
   - Includes: order ID, customer details, network, package, amount, status

3. **Wallet Top-Ups**
   - Sent when a user tops up their wallet
   - Includes: customer details, amount, new balance, payment reference

**Note:** Admin notifications are sent asynchronously (fire-and-forget), so they won't delay the user email delivery. If admin email sending fails, it's logged but doesn't affect the user experience.

## Notes

- Functions are serverless and scale automatically
- No need to run a separate server
- Environment variables are secure and not exposed to the frontend
- Functions have a 10-second timeout by default (can be increased in Netlify settings)
- Admin notifications are optional and won't break functionality if not configured

