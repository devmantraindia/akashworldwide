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

    const { paymentId, reason } = await request.json();

    if (!paymentId || !reason) {
      return NextResponse.json(
        { error: 'Payment ID and reason are required' },
        { status: 400 }
      );
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        payment_status: 'Rejected',
        verification_status: 'Rejected',
        rejected_reason: reason,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) throw updateError;

    // Log action
    await supabase.from('payment_logs').insert({
      payment_id: paymentId,
      action: 'Payment Rejected',
      performed_by: user.id,
      details: { reason },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[v0] Payment rejection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject payment' },
      { status: 500 }
    );
  }
}
