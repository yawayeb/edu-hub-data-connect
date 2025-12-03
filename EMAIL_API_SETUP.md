# Email API Server Setup

Due to CORS restrictions, Resend API cannot be called directly from the browser. We've created a backend API server to handle email sending securely.

## Quick Start

### 1. Install Dependencies

The server dependencies are already installed. If not, run:

```bash
npm install
```

### 2. Create Server Environment File

Create a `.env` file in the `server/` directory:

```bash
# Copy the example file
cp server/.env.example server/.env
```

Then edit `server/.env` and add your Resend API key:

```env
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=Edu-Hub Data <noreply@yourdomain.com>
PORT=3001
```

### 3. Update Frontend Environment

Add this to your main `.env` file (root directory):

```env
VITE_EMAIL_API_URL=http://localhost:3001
```

For production, change to your deployed server URL:
```env
VITE_EMAIL_API_URL=https://your-api-domain.com
```

### 4. Start the Server

**Option A: Run server separately**
```bash
npm run dev:server
```

**Option B: Run both frontend and server together**
```bash
npm run dev:all
```

**Option C: Run manually**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
node index.js
```

## API Endpoints

The server provides three endpoints:

### 1. Welcome Email
```
POST /api/email/welcome
Body: { fullName: string, email: string }
```

### 2. Bundle Purchase Email
```
POST /api/email/bundle-purchase
Body: { 
  fullName: string, 
  email: string, 
  orderId: string, 
  network: string, 
  package: string, 
  phoneNumber: string, 
  amount: number, 
  status: string 
}
```

### 3. Wallet Top-Up Email
```
POST /api/email/wallet-topup
Body: { 
  fullName: string, 
  email: string, 
  amount: number, 
  reference: string, 
  newBalance: number 
}
```

## Testing

1. Start the server: `npm run dev:server`
2. Test health endpoint: `curl http://localhost:3001/health`
3. Test welcome email:
```bash
curl -X POST http://localhost:3001/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com"}'
```

## Production Deployment

### Option 1: Deploy to Railway/Render/Fly.io

1. Push your code to GitHub
2. Connect your repo to Railway/Render/Fly.io
3. Set environment variables:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `PORT` (usually auto-set)
4. Update `VITE_EMAIL_API_URL` in your frontend `.env` to the deployed URL

### Option 2: Deploy to Vercel/Netlify (Serverless)

You'll need to convert the Express server to serverless functions. See their documentation.

### Option 3: Use Supabase Edge Functions

Convert the server to a Supabase Edge Function for serverless deployment.

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify `RESEND_API_KEY` is set in `server/.env`
- Check server logs for errors

### Emails not sending
- Verify Resend API key is correct
- Check server console for errors
- Verify `VITE_EMAIL_API_URL` is set in frontend `.env`
- Check browser console for CORS or fetch errors

### CORS errors
- Make sure server is running
- Check `VITE_EMAIL_API_URL` matches server URL
- Verify server CORS is enabled (already configured)

## Security Notes

- ✅ API key is stored server-side only
- ✅ CORS is enabled for your frontend domain
- ✅ Input validation on all endpoints
- ⚠️ For production, add rate limiting
- ⚠️ For production, add authentication/API keys

## Next Steps

1. Get your Resend API key from [resend.com](https://resend.com)
2. Add it to `server/.env`
3. Start the server
4. Test email sending
5. Deploy to production when ready

