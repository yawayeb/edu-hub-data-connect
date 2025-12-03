import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || 'Edu-Hub Data <noreply@edu-hub-data.com>';

if (!resendApiKey) {
  console.warn('⚠️  RESEND_API_KEY not configured. Email functionality will be disabled.');
}

const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper function to send welcome email
async function sendWelcomeEmail(data) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  const { data: emailData, error } = await resend.emails.send({
    from: fromEmail,
    to: [data.email],
    subject: 'Welcome to Edu-Hub Data Connect! 🎓',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Edu-Hub Data Connect</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Welcome to Edu-Hub Data Connect!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${data.fullName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for joining Edu-Hub Data Connect! We're excited to have you on board.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              With your account, you can now:
            </p>
            
            <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
              <li>Purchase data bundles for MTN, AirtelTigo, and Telecel</li>
              <li>Top up your wallet for quick and easy purchases</li>
              <li>Track all your transactions in one place</li>
              <li>View your purchase history and wallet activity</li>
            </ul>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Getting Started:</strong><br>
                Log in to your dashboard to start purchasing data bundles. If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Happy browsing! 📱
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Edu-Hub Data Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Edu-Hub Data Connect. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) throw error;
  return emailData;
}

// Helper function to send bundle purchase email
async function sendBundlePurchaseEmail(data) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  const networkLabels = {
    MTN_UP2U: 'MTN UP2U',
    AT_ISHARE: 'AT iShare',
    AT_BIGTIME: 'AT Big Time',
    TELECEL: 'Telecel',
    MTN: 'MTN',
  };

  const statusLabels = {
    pending: 'Pending',
    delivered: 'Delivered',
    failed: 'Failed',
    refunded: 'Refunded',
  };

  const statusColors = {
    pending: '#f59e0b',
    delivered: '#10b981',
    failed: '#ef4444',
    refunded: '#6b7280',
  };

  const { data: emailData, error } = await resend.emails.send({
    from: fromEmail,
    to: [data.email],
    subject: `Data Bundle Purchase Confirmation - ${data.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bundle Purchase Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📦 Bundle Purchase Confirmation</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${data.fullName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thank you for your purchase! Your data bundle order has been received and is being processed.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6C2BD9;">
              <h2 style="margin-top: 0; color: #6C2BD9; font-size: 20px;">Order Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Order ID:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${data.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Network:</td>
                  <td style="padding: 8px 0;">${networkLabels[data.network] || data.network}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Package:</td>
                  <td style="padding: 8px 0;">${data.package}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone Number:</td>
                  <td style="padding: 8px 0;">${data.phoneNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Amount Paid:</td>
                  <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #6C2BD9;">GH¢${data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: ${statusColors[data.status] || '#6b7280'}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                      ${statusLabels[data.status] || data.status}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            ${data.status === 'pending' ? `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 14px; color: #92400e;">
                  <strong>⏳ Processing:</strong> Your bundle is being processed. You'll receive another email once it's delivered.
                </p>
              </div>
            ` : data.status === 'delivered' ? `
              <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 0; font-size: 14px; color: #065f46;">
                  <strong>✅ Delivered:</strong> Your data bundle has been successfully delivered to ${data.phoneNumber}. Enjoy your data!
                </p>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; margin-top: 30px;">
              You can view all your orders and track their status in your dashboard.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Edu-Hub Data Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Edu-Hub Data Connect. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) throw error;
  return emailData;
}

// Helper function to send wallet top-up email
async function sendWalletTopUpEmail(data) {
  if (!resend) {
    throw new Error('Resend API key not configured');
  }

  const { data: emailData, error } = await resend.emails.send({
    from: fromEmail,
    to: [data.email],
    subject: `Wallet Top-Up Confirmation - GH¢${data.amount.toFixed(2)}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Wallet Top-Up Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #6C2BD9 0%, #8B5CF6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💳 Wallet Top-Up Confirmation</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello <strong>${data.fullName}</strong>,</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Your wallet has been successfully topped up! The funds are now available for your data bundle purchases.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h2 style="margin-top: 0; color: #10b981; font-size: 20px;">Transaction Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Amount Added:</td>
                  <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #10b981;">+GH¢${data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">New Balance:</td>
                  <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #6C2BD9;">GH¢${data.newBalance.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Reference:</td>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${data.reference}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
              <p style="margin: 0; font-size: 14px; color: #065f46;">
                <strong>✅ Success:</strong> Your wallet balance has been updated. You can now use these funds to purchase data bundles.
              </p>
            </div>
            
            <p style="font-size: 16px; margin-top: 30px;">
              You can view your wallet balance and transaction history in your dashboard.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>The Edu-Hub Data Connect Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Edu-Hub Data Connect. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) throw error;
  return emailData;
}

// Routes
app.post('/api/email/welcome', async (req, res) => {
  try {
    const { fullName, email } = req.body;
    
    if (!fullName || !email) {
      return res.status(400).json({ error: 'fullName and email are required' });
    }

    const result = await sendWelcomeEmail({ fullName, email });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

app.post('/api/email/bundle-purchase', async (req, res) => {
  try {
    const { fullName, email, orderId, network, package: pkg, phoneNumber, amount, status } = req.body;
    
    if (!fullName || !email || !orderId || !network || !pkg || !phoneNumber || !amount || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await sendBundlePurchaseEmail({
      fullName,
      email,
      orderId,
      network,
      package: pkg,
      phoneNumber,
      amount,
      status,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending bundle purchase email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

app.post('/api/email/wallet-topup', async (req, res) => {
  try {
    const { fullName, email, amount, reference, newBalance } = req.body;
    
    if (!fullName || !email || !amount || !reference || newBalance === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await sendWalletTopUpEmail({
      fullName,
      email,
      amount,
      reference,
      newBalance,
    });
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending wallet top-up email:', error);
    res.status(500).json({ error: error.message || 'Failed to send email' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Email API server running on http://localhost:${PORT}`);
  console.log(`📧 Resend configured: ${resend ? '✅' : '❌'}`);
});

