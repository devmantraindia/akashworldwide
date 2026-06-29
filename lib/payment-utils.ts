// Payment utilities and helpers

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Only PNG, JPG, JPEG, and WEBP files are allowed',
    };
  }

  return { valid: true };
}

export function generateUPIDeepLink(upiId: string, payeeName: string, amount?: string): string {
  const params = new URLSearchParams();
  params.append('pa', upiId);
  params.append('pn', payeeName);
  if (amount) {
    params.append('am', amount);
  }
  params.append('tn', 'akashworldwide Payment');

  return `upi://pay?${params.toString()}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const element = document.createElement('textarea');
    element.value = text;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);
    return Promise.resolve();
  }
}

export function formatPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'Pending Verification': 'Awaiting Verification',
    'Paid': 'Payment Confirmed',
    'Rejected': 'Payment Rejected',
    'Processing': 'Being Processed',
  };
  return statusMap[status] || status;
}

export async function uploadFileToSupabase(
  file: File,
  bucket: string,
  path: string,
  supabaseClient: any
): Promise<{ url?: string; path?: string; error?: string }> {
  try {
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${path}/${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { error: error.message };
    }

    const { data: publicUrlData } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to upload file' };
  }
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(num);
}
