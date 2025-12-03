# Resend Email Integration Setup

This guide will help you set up Resend API to send automated emails for:
- ✅ New user registration (Welcome email)
- ✅ Data bundle purchase confirmation
- ✅ Wallet top-up confirmation

## Step 1: Create Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

## Step 2: Get Your API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click **"Create API Key"**
3. Give it a name (e.g., "Edu-Hub Data Connect")
4. Copy the API key (starts with `re_`)

## Step 3: Verify Your Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click **"Add Domain"**
3. Add your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain
5. Wait for verification (usually a few minutes)

**Note:** For testing, you can use Resend's default domain, but emails might go to spam.

## Step 4: Configure Environment Variables

Add these to your `.env` file:

```env
# Resend Email Configuration
VITE_RESEND_API_KEY=re_your_api_key_here
VITE_RESEND_FROM_EMAIL=Edu-Hub Data <noreply@yourdomain.com>
```

**For testing (using Resend's default domain):**
```env
VITE_RESEND_API_KEY=re_your_api_key_here
VITE_RESEND_FROM_EMAIL=onboarding@resend.dev
```

## Step 5: Restart Dev Server

```bash
npm run dev
```

## Email Templates

### 1. Welcome Email
- **Trigger:** When a new user registers
- **Content:** Welcome message, account features, getting started guide

### 2. Bundle Purchase Email
- **Trigger:** When a user successfully purchases a data bundle
- **Content:** Order details, network, package, amount, status

### 3. Wallet Top-Up Email
- **Trigger:** When a user tops up their wallet
- **Content:** Amount added, new balance, transaction reference

## Testing

### Test Welcome Email
1. Register a new account
2. Check your email inbox
3. You should receive a welcome email

### Test Bundle Purchase Email
1. Purchase a data bundle
2. Check your email inbox
3. You should receive a purchase confirmation email

### Test Wallet Top-Up Email
1. Top up your wallet
2. Check your email inbox
3. You should receive a top-up confirmation email

## Troubleshooting

### Emails Not Sending

1. **Check API Key:**
   - Make sure `VITE_RESEND_API_KEY` is set correctly
   - Check browser console for errors

2. **Check From Email:**
   - Must be a verified domain or use `onboarding@resend.dev` for testing
   - Format: `Name <email@domain.com>`

3. **Check Console:**
   - Open browser DevTools → Console
   - Look for email-related errors
   - Should see "Email sent successfully" or error messages

4. **Check Resend Dashboard:**
   - Go to [Resend Logs](https://resend.com/emails)
   - See if emails are being sent
   - Check for delivery errors

### Emails Going to Spam

1. **Verify Your Domain:**
   - Use a verified domain instead of `onboarding@resend.dev`
   - Add SPF, DKIM, and DMARC records

2. **Check Email Content:**
   - Avoid spam trigger words
   - Use proper HTML formatting
   - Include unsubscribe link (for production)

### API Key Not Working

1. **Check Environment Variable:**
   - Make sure it's prefixed with `VITE_`
   - Restart dev server after adding
   - Check `.env` file is in root directory

2. **Check API Key Format:**
   - Should start with `re_`
   - Should be the full key from Resend dashboard

## Production Checklist

- [ ] Verify your domain in Resend
- [ ] Update `VITE_RESEND_FROM_EMAIL` with your verified domain
- [ ] Test all three email types
- [ ] Monitor email delivery in Resend dashboard
- [ ] Set up email analytics (optional)
- [ ] Add unsubscribe links (for compliance)

## Email Limits

**Free Tier:**
- 100 emails/day
- 3,000 emails/month

**Pro Tier:**
- 50,000 emails/month
- $20/month

For production, consider upgrading to Pro tier if you expect high volume.

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
- [Resend Status](https://status.resend.com)

