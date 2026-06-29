'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Check,
  X,
  RotateCcw,
  DownloadCloud,
} from 'lucide-react';
import { formatCurrency } from '@/lib/payment-utils';

export default function PaymentsPage() {
  const supabase = createClient();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, [filterStatus]);

  async function loadPayments() {
    try {
      setLoading(true);

      let query = supabase
        .from('payments')
        .select(`
          *,
          orders (
            id,
            total_amount,
            services (name)
          ),
          profiles:user_id (
            id,
            display_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('payment_status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPayments(data || []);
    } catch (err: any) {
      console.error('[v0] Error loading payments:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprovePayment(paymentId: string) {
    try {
      setVerifyLoading(true);
      setActionError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Update payment
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

      // Find the payment's order
      const payment = payments.find((p) => p.id === paymentId);
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

      setActionSuccess('Payment approved successfully');
      loadPayments();
    } catch (err: any) {
      console.error('[v0] Error approving payment:', err);
      setActionError(err.message || 'Failed to approve payment');
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleRejectPayment(paymentId: string, reason: string) {
    try {
      setVerifyLoading(true);
      setActionError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'Rejected',
          verification_status: 'Rejected',
          rejected_reason: reason,
          verified_by: user.id,
          verified_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (error) throw error;

      await supabase.from('payment_logs').insert({
        payment_id: paymentId,
        action: 'Payment Rejected',
        performed_by: user.id,
        details: { reason },
      });

      setActionSuccess('Payment rejected');
      loadPayments();
    } catch (err: any) {
      console.error('[v0] Error rejecting payment:', err);
      setActionError(err.message || 'Failed to reject payment');
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleRequestReupload(paymentId: string) {
    try {
      setVerifyLoading(true);
      setActionError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('payments')
        .update({
          payment_status: 'Pending Verification',
          verification_status: 'Re-upload Requested',
        })
        .eq('id', paymentId);

      if (error) throw error;

      await supabase.from('payment_logs').insert({
        payment_id: paymentId,
        action: 'Re-upload Requested',
        performed_by: user.id,
      });

      setActionSuccess('Re-upload requested');
      loadPayments();
    } catch (err: any) {
      console.error('[v0] Error requesting reupload:', err);
      setActionError(err.message || 'Failed to request reupload');
    } finally {
      setVerifyLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Payment Verification</h1>
        <p className="text-muted-foreground mt-2">Review and verify user payments</p>
      </div>

      <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Filter Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Pending Verification', 'Paid', 'Rejected'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status === 'all' ? 'All Payments' : status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {actionError && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500">{actionError}</p>
        </div>
      )}

      {actionSuccess && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-500">{actionSuccess}</p>
        </div>
      )}

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No payments found</p>
            </CardContent>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id} className="bg-card/40 border-card/50 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Service</p>
                    <p className="font-semibold">{payment.orders?.services?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(payment.orders?.total_amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Payer</p>
                    <p className="text-sm font-mono">{payment.payer_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {payment.payment_status === 'Paid' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-semibold text-green-500">Paid</span>
                        </>
                      )}
                      {payment.payment_status === 'Pending Verification' && (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-yellow-500">Pending</span>
                        </>
                      )}
                      {payment.payment_status === 'Rejected' && (
                        <>
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-semibold text-red-500">Rejected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>

                  {payment.payment_status === 'Pending Verification' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprovePayment(payment.id)}
                        disabled={verifyLoading}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectPayment(payment.id, 'Invalid payment details')}
                        disabled={verifyLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestReupload(payment.id)}
                        disabled={verifyLoading}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Request Re-upload
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payer Information */}
              <div>
                <h3 className="font-semibold mb-3">Payer Information</h3>
                <div className="grid md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedPayment.payer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mobile</p>
                    <p className="font-medium">{selectedPayment.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm">{selectedPayment.profiles?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Date</p>
                    <p className="font-medium">
                      {new Date(selectedPayment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="font-semibold mb-3">Transaction Details</h3>
                <div className="grid md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Transaction ID (UTR)</p>
                    <p className="font-mono text-sm">{selectedPayment.utr_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary">
                      {formatCurrency(selectedPayment.orders?.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedPayment.payment_screenshot_url && (
                <div>
                  <h3 className="font-semibold mb-3">Payment Screenshot</h3>
                  <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border-2 border-primary/30">
                    <Image
                      src={selectedPayment.payment_screenshot_url}
                      alt="Payment Screenshot"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <a
                    href={selectedPayment.payment_screenshot_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <DownloadCloud className="w-4 h-4" />
                    Download Screenshot
                  </a>
                </div>
              )}

              {/* Notes */}
              {selectedPayment.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Payer Notes</h3>
                  <p className="text-sm bg-muted/30 p-4 rounded-lg">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Admin Notes */}
              {selectedPayment.admin_notes && (
                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <p className="text-sm bg-muted/30 p-4 rounded-lg text-yellow-600">
                    {selectedPayment.admin_notes}
                  </p>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedPayment.rejected_reason && (
                <div>
                  <h3 className="font-semibold mb-2">Rejection Reason</h3>
                  <p className="text-sm bg-red-500/10 p-4 rounded-lg text-red-600">
                    {selectedPayment.rejected_reason}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedPayment.payment_status === 'Pending Verification' && (
                <div className="flex gap-2 border-t pt-4">
                  <Button onClick={() => handleApprovePayment(selectedPayment.id)} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Approve Payment
                  </Button>
                  <Button variant="destructive" onClick={() => setShowDetails(false)} className="flex-1">
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
