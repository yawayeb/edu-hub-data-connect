import { usePaystackPayment } from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PAYSTACK_PUBLIC_KEY } from '@/lib/paystack';
import { useMemo } from 'react';

interface UsePaystackPaymentOptions {
  amount: number;
  onSuccess?: (reference: string) => void;
  onError?: (error: Error) => void;
}

export function usePaystackPaymentHook({ amount, onSuccess, onError }: UsePaystackPaymentOptions) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const config = useMemo(() => ({
    publicKey: PAYSTACK_PUBLIC_KEY,
    email: user?.email || '',
    amount: amount * 100, // Convert GH¢ to pesewas (kobo)
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'wallet_topup',
        },
        {
          display_name: 'User ID',
          variable_name: 'user_id',
          value: user?.id || '',
        },
      ],
    },
  }), [user?.email, user?.id, amount]);

  const initializePayment = usePaystackPayment(config);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to make a payment');
      return;
    }

    if (!user.email) {
      toast.error('Email is required for payment');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    if (!PAYSTACK_PUBLIC_KEY) {
      toast.error('Paystack is not configured. Please contact support.');
      return;
    }

    initializePayment({
      onSuccess: async (response) => {
        try {
          console.log('Payment successful, creating transaction...', {
            user_id: user.id,
            amount: amount,
            reference: response.reference,
          });

          // Create wallet transaction record
          const { data: transactionData, error: transactionError } = await supabase
            .from('wallet_transactions')
            .insert({
              user_id: user.id,
              amount: amount,
              type: 'credit',
              description: `Wallet top-up via Paystack`,
              reference: response.reference,
              status: 'completed',
            })
            .select()
            .single();

          if (transactionError) {
            console.error('Error creating transaction:', transactionError);
            console.error('Transaction error code:', transactionError.code);
            console.error('Transaction error message:', transactionError.message);
            console.error('User ID:', user.id);
            console.error('Auth UID check:', await supabase.auth.getUser());
            
            if (transactionError.code === '42501') {
              toast.error('Permission denied. Please run the RLS policy fix SQL in Supabase.');
            } else {
              toast.error(`Payment successful but failed to record transaction: ${transactionError.message}`);
            }
            return;
          }

          console.log('Transaction created successfully:', transactionData);

          // Update user balance using RPC or direct update
          // First, get current balance
          const { data: currentProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();

          if (fetchError) {
            console.error('Error fetching current balance:', fetchError);
            toast.error('Payment successful but failed to fetch balance');
            return;
          }

          const currentBalance = currentProfile?.balance || 0;
          const newBalance = currentBalance + amount;

          const { error: balanceError } = await supabase
            .from('profiles')
            .update({ balance: newBalance })
            .eq('id', user.id);

          if (balanceError) {
            console.error('Error updating balance:', balanceError);
            console.error('Balance error details:', JSON.stringify(balanceError, null, 2));
            
            // Check if it's an RLS policy error
            if (balanceError.code === '42501' || balanceError.message?.includes('policy')) {
              toast.error('Permission denied. Please check RLS policies in Supabase.');
            } else {
              toast.error('Payment successful but failed to update balance. Please refresh the page.');
            }
            // Redirect without success parameter since balance update failed
            navigate('/wallet?error=balance_update_failed');
            return;
          }

          // Balance update succeeded - continue with success flow
          // Wait a moment for database to update, then refresh profile
          await new Promise(resolve => setTimeout(resolve, 500));
          await refreshProfile();

          // Get updated profile for email
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('full_name, balance')
            .eq('id', user.id)
            .single();

          // Send wallet top-up confirmation email
          try {
            const { sendWalletTopUpEmail } = await import('@/lib/email');
            if (updatedProfile && user.email) {
              await sendWalletTopUpEmail({
                fullName: updatedProfile.full_name || user.email.split('@')[0] || 'Customer',
                email: user.email,
                amount: amount,
                reference: response.reference,
                newBalance: updatedProfile.balance || 0,
              });
            }
          } catch (emailError) {
            // Don't fail transaction if email fails
            console.error('Failed to send wallet top-up email:', emailError);
          }
          
          toast.success(`Payment successful! GH¢${amount.toFixed(2)} added to wallet`);
          onSuccess?.(response.reference);
          
          // Redirect to wallet page with success parameter
          navigate('/wallet?success=true');
        } catch (error) {
          console.error('Error processing payment:', error);
          toast.error('Payment successful but failed to update wallet');
          onError?.(error as Error);
        }
      },
      onClose: () => {
        toast.info('Payment cancelled');
      },
    });
  };

  return {
    handlePayment,
    isReady: !!user && !!user.email && !!PAYSTACK_PUBLIC_KEY && amount > 0,
  };
}

