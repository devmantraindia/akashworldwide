'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Copy, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';
import { copyToClipboard, generateUPIDeepLink, formatCurrency } from '@/lib/payment-utils';
import { useRouter } from 'next/navigation';

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    setSupabase(createClient());
    loadPaymentData();
  }, []);

  async function loadPaymentData() {
    try {
      setLoading(true);

      // Get order details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          services (
            id,
            name,
            description,
            price
          ),
          payments (*)
        `)
        .eq('id', params.orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      // Get payment settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('is_enabled', true)
        .limit(1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      setPaymentSettings(settingsData);
    } catch (err: any) {
      console.error('[v0] Error loading payment data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyUPI() {
    if (paymentSettings?.upi_id) {
      await copyToClipboard(paymentSettings.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleOpenUPIApp() {
    if (paymentSettings?.upi_id) {
      const deepLink = generateUPIDeepLink(
        paymentSettings.upi_id,
        paymentSettings.account_holder_name,
        order?.total_amount?.toString()
      );
      window.location.href = deepLink;
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading payment details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-center text-muted-foreground">Order not found</p>
            <Button onClick={() => router.push('/dashboard')} className="w-full mt-4">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const existingPayment = order.payments?.[0];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Make Payment</h1>
          <p className="text-muted-foreground mt-2">Complete your payment to process the order</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="text-lg font-semibold">{order.services?.name}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-sm font-mono bg-muted/50 p-2 rounded">{order.id}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(order.total_amount)}</p>
              </div>

              {existingPayment && (
                <div className="mt-6 pt-6 border-t border-border space-y-2">
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <div className="flex items-center gap-2">
                    {existingPayment.payment_status === 'Paid' ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <p className="font-semibold text-green-500">Paid</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <p className="font-semibold text-yellow-500">
                          {existingPayment.payment_status}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>UPI Payment</CardTitle>
              <CardDescription>Scan QR or use UPI ID to pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentSettings?.qr_code_url && (
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border-2 border-primary/30">
                  <Image
                    src={paymentSettings.qr_code_url}
                    alt="Payment QR Code"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account Holder</p>
                <p className="text-lg font-semibold">{paymentSettings?.account_holder_name}</p>
              </div>

              <div className="space-y-3">
                <Label>UPI ID</Label>
                <div className="flex gap-2">
                  <Input
                    value={paymentSettings?.upi_id}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyUPI}
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Copied!
                  </p>
                )}
              </div>

              {paymentSettings?.bank_name && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="text-sm">{paymentSettings.bank_name}</p>
                </div>
              )}

              {paymentSettings?.payment_instructions && (
                <div className="bg-muted/50 p-4 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Payment Instructions</p>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {paymentSettings.payment_instructions}
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-col">
                <Button onClick={handleOpenUPIApp} size="lg" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open UPI App
                </Button>
                <Button
                  onClick={() => setShowPaymentForm(true)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  I&apos;ve Made Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Submission Form */}
        {showPaymentForm && (
          <PaymentSubmissionForm
            orderId={order.id}
            amount={order.total_amount}
            onClose={() => {
              setShowPaymentForm(false);
              loadPaymentData();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Payment Submission Form Component
function PaymentSubmissionForm({
  orderId,
  amount,
  onClose,
}: {
  orderId: string;
  amount: number;
  onClose: () => void;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    utr_number: '',
    payer_name: '',
    mobile_number: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_time: new Date().toTimeString().slice(0, 5),
    notes: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!screenshot) {
      setError('Please upload a payment screenshot');
      return;
    }

    if (!formData.utr_number || !formData.payer_name || !formData.mobile_number) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload screenshot
      const fileName = `payment-${orderId}-${Date.now()}.${screenshot.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshot);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(uploadData.path);

      // Create payment record
      const paymentDate = new Date(
        `${formData.payment_date}T${formData.payment_time}`
      ).toISOString();

      const { data: paymentRecord, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          user_id: user.id,
          utr_number: formData.utr_number,
          payer_name: formData.payer_name,
          mobile_number: formData.mobile_number,
          payment_screenshot_url: urlData.publicUrl,
          payment_screenshot_path: uploadData.path,
          payment_date: paymentDate,
          notes: formData.notes,
          payment_status: 'Pending Verification',
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Log the action
      await supabase.from('payment_logs').insert({
        payment_id: paymentRecord.id,
        action: 'Payment Submitted',
        performed_by: user.id,
        details: { amount },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/dashboard/orders');
      }, 2000);
    } catch (err: any) {
      console.error('[v0] Error submitting payment:', err);
      setError(err.message || 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="bg-card/40 border-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Payment Verification</CardTitle>
        <CardDescription>Upload your payment proof and transaction details</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Payment Submitted Successfully</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Your payment is pending admin verification. You&apos;ll be notified once verified.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <div>
              <Label>Payment Screenshot *</Label>
              <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-6 hover:border-primary transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  className="hidden"
                  id="screenshot"
                />
                <Label htmlFor="screenshot" className="cursor-pointer text-center block">
                  <div className="text-muted-foreground">
                    <p className="font-medium">Click to upload screenshot</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP • Max 5MB</p>
                  </div>
                </Label>
                {screenshot && (
                  <p className="text-sm text-green-500 mt-2">Selected: {screenshot.name}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="utr_number">Transaction ID (UTR) *</Label>
                <Input
                  id="utr_number"
                  value={formData.utr_number}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, utr_number: e.target.value }))
                  }
                  placeholder="e.g., 302246637192"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="payer_name">Payer Name *</Label>
                <Input
                  id="payer_name"
                  value={formData.payer_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, payer_name: e.target.value }))}
                  placeholder="Your name"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile_number">Mobile Number *</Label>
                <Input
                  id="mobile_number"
                  value={formData.mobile_number}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mobile_number: e.target.value }))
                  }
                  placeholder="e.g., 9876543210"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="payment_date">Payment Date & Time *</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="payment_date"
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, payment_date: e.target.value }))
                    }
                    className="flex-1"
                  />
                  <Input
                    type="time"
                    value={formData.payment_time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, payment_time: e.target.value }))
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional information..."
                rows={3}
                className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Payment'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
