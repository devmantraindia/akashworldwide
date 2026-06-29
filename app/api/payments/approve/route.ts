import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'Paid',
        verification_status: 'Approved',
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) throw updateError;

    // Get payment details to update order
    const { data: payment } = await supabase
      .from('payments')
      .select('order_id')
      .eq('id', paymentId)
      .single();

    if (payment) {
      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'Processing',
          payment_id: paymentId,
        })
        .eq('id', payment.order_id);
    }

    // Log action
    await supabase.from('payment_logs').insert({
      payment_id: paymentId,
      action: 'Payment Approved',
      performed_by: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[v0] Payment approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
