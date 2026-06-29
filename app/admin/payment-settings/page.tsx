'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Upload, Trash2, Eye, Save, AlertCircle } from 'lucide-react';
import { validateImageFile, formatCurrency } from '@/lib/payment-utils';

export default function PaymentSettingsPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    account_holder_name: '',
    upi_id: '',
    bank_name: '',
    payment_instructions: '',
    support_email: '',
    support_phone: '',
    is_enabled: true,
  });

  // Load settings on mount
  useEffect(() => {
    setSupabase(createClient());
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const client = createClient();
      const { data, error: err } = await client
        .from('payment_settings')
        .select('*')
        .limit(1)
        .single();

      if (err && err.code !== 'PGRST116') {
        throw err;
      }

      if (data) {
        setSettings(data);
        setFormData({
          account_holder_name: data.account_holder_name || '',
          upi_id: data.upi_id || '',
          bank_name: data.bank_name || '',
          payment_instructions: data.payment_instructions || '',
          support_email: data.support_email || '',
          support_phone: data.support_phone || '',
          is_enabled: data.is_enabled ?? true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleUploadQRCode() {
    if (!selectedFile) {
      setError('Please select a QR code image');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Upload to Supabase storage
      const fileName = `qr-code-${Date.now()}.${selectedFile.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-qrcodes')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('payment-qrcodes')
        .getPublicUrl(uploadData.path);

      // Update settings
      if (settings?.id) {
        const { error: updateError } = await supabase
          .from('payment_settings')
          .update({
            qr_code_url: urlData.publicUrl,
            qr_code_path: uploadData.path,
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);

        if (updateError) throw updateError;
      } else {
        const { data: newSettings, error: insertError } = await supabase
          .from('payment_settings')
          .insert({
            ...formData,
            qr_code_url: urlData.publicUrl,
            qr_code_path: uploadData.path,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }

      setSuccess('QR code uploaded successfully');
      setSelectedFile(null);
      setFilePreview(null);
      loadSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to upload QR code');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQRCode() {
    if (!settings?.qr_code_path) return;

    try {
      setSaving(true);
      setError(null);

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('payment-qrcodes')
        .remove([settings.qr_code_path]);

      if (deleteError) throw deleteError;

      // Update settings
      const { error: updateError } = await supabase
        .from('payment_settings')
        .update({
          qr_code_url: null,
          qr_code_path: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSuccess('QR code deleted successfully');
      loadSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to delete QR code');
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSettings() {
    if (!formData.account_holder_name || !formData.upi_id || !formData.support_email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (settings?.id) {
        const { error: updateError } = await supabase
          .from('payment_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', settings.id);

        if (updateError) throw updateError;
      } else {
        const { data: newSettings, error: insertError } = await supabase
          .from('payment_settings')
          .insert(formData)
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }

      setSuccess('Settings saved successfully');
      loadSettings();
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading payment settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground mt-2">Configure UPI payment details and QR code</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-500">{success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* QR Code Section */}
        <Card className="bg-card/40 border-card/50 backdrop-blur-xl lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              QR Code
            </CardTitle>
            <CardDescription>Upload or manage payment QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings?.qr_code_url && (
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={settings.qr_code_url}
                  alt="Payment QR Code"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {!settings?.qr_code_url && (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground text-sm">No QR code uploaded</p>
              </div>
            )}

            <div>
              <Label htmlFor="qr-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-muted rounded-lg p-4 hover:border-primary transition text-center">
                  <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP • Max 5MB</p>
                </div>
              </Label>
              <input
                id="qr-upload"
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {filePreview && (
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex gap-2 flex-col">
              {filePreview && (
                <>
                  <Button onClick={handleUploadQRCode} disabled={saving} className="w-full">
                    {saving ? 'Uploading...' : 'Upload QR Code'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilePreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {settings?.qr_code_url && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteQRCode}
                    disabled={saving}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="enable-payment"
                checked={formData.is_enabled}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_enabled: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="enable-payment" className="text-sm cursor-pointer flex-1 mb-0">
                Enable Manual UPI Payment
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="bg-card/40 border-card/50 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Configure your UPI payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_holder_name">Account Holder Name *</Label>
                <Input
                  id="account_holder_name"
                  name="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Akash Worldwide"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="upi_id">UPI ID *</Label>
                <Input
                  id="upi_id"
                  name="upi_id"
                  value={formData.upi_id}
                  onChange={handleInputChange}
                  placeholder="e.g., business@okhdfcbank"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Bank Name (Optional)</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC Bank"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="support_phone">Support Phone</Label>
                <Input
                  id="support_phone"
                  name="support_phone"
                  value={formData.support_phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +91-9876543210"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="support_email">Support Email *</Label>
              <Input
                id="support_email"
                name="support_email"
                type="email"
                value={formData.support_email}
                onChange={handleInputChange}
                placeholder="e.g., support@akashworldwide.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="payment_instructions">Payment Instructions</Label>
              <textarea
                id="payment_instructions"
                name="payment_instructions"
                value={formData.payment_instructions}
                onChange={handleInputChange}
                placeholder="e.g., Please scan the QR code or use the UPI ID to make payment. Verify the account name before sending the payment."
                rows={4}
                className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={saving} size="lg" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {showPreview && settings?.qr_code_url && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
                <Image
                  src={settings.qr_code_url}
                  alt="Payment QR Code"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
