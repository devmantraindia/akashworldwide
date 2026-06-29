# Manual UPI Payment System Setup Guide

This document provides complete setup instructions for the manual UPI payment system integrated into the akashworldwide platform.

## System Overview

The payment system is built with:
- **Supabase** PostgreSQL database with Row Level Security
- **Manual UPI QR Payment** only (No payment gateways)
- **File Storage** for QR codes and payment screenshots
- **Admin Dashboard** for payment verification
- **User Payment Page** with UPI deep linking

## Database Schema

### Tables Created

1. **payment_settings** - Admin payment configuration
   - account_holder_name
   - upi_id
   - bank_name (optional)
   - payment_instructions
   - support_email
   - support_phone
   - qr_code_url
   - qr_code_path
   - is_enabled

2. **payments** - User payment records
   - order_id (FK)
   - user_id (FK)
   - transaction_id (UTR)
   - utr_number
   - payer_name
   - mobile_number
   - payment_screenshot_url
   - payment_screenshot_path
   - payment_date
   - notes
   - payment_status (Pending Verification / Paid / Rejected)
   - verification_status
   - rejected_reason
   - admin_notes
   - verified_by
   - verified_at

3. **payment_screenshots** - Version history for payment uploads
   - payment_id (FK)
   - screenshot_url
   - screenshot_path
   - upload_date

4. **payment_logs** - Audit trail
   - payment_id (FK)
   - action
   - performed_by
   - details (JSONB)
   - created_at

### Row Level Security (RLS)

All tables have RLS enabled:
- **payment_settings**: All users can view, only admins can modify
- **payments**: Users see their own, admins see all
- **payment_screenshots**: Users see own payment screenshots, admins see all
- **payment_logs**: Only admins can view

## Supabase Storage Setup

Create the following storage buckets in Supabase:

### 1. QR Code Storage Bucket
```
Bucket Name: payment-qrcodes
Visibility: Public
```

### 2. Payment Screenshots Storage Bucket
```
Bucket Name: payment-screenshots
Visibility: Public (images are user-uploaded payment proof)
```

#### Storage Policies

Set the following policies:

**payment-qrcodes bucket:**
- Allow admins to upload and delete
- Allow all authenticated users to read

**payment-screenshots bucket:**
- Allow authenticated users to upload their own
- Allow users to view their own
- Allow admins to view all

## Admin Panel Features

### Payment Settings Page
Location: `/admin/payment-settings`

Features:
- Upload/Replace/Delete QR Code image
- Preview QR Code
- Set UPI ID
- Set Account Holder Name
- Set Bank Name (optional)
- Add Payment Instructions
- Set Support Email & Phone
- Enable/Disable manual payments
- Save settings to database

### Payment Verification Page
Location: `/admin/payments`

Features:
- View all user payments
- Filter by status (All, Pending Verification, Paid, Rejected)
- View payment details modal with:
  - Payer information
  - Transaction details
  - Payment screenshot
  - Admin notes
  - Rejection reason
- Approve payment (marks as Paid, updates order)
- Reject payment (with reason)
- Request re-upload
- Download screenshot
- Audit logs

## User Payment Flow

### 1. Service Selection & Checkout
- User selects service
- Creates order in database
- Gets redirected to payment page

### 2. Payment Page
Location: `/payment/[orderId]`

Features:
- Display order details
- Show QR code from admin settings
- Display UPI ID with copy button
- Account holder name
- Payment instructions
- "Copy UPI ID" button
- "Open UPI App" button (deep link)

### 3. Payment Submission
- User scans QR or uses UPI ID
- After payment, user clicks "I've Made Payment"
- Fills payment submission form:
  - Upload payment screenshot (5MB max, PNG/JPG/WEBP)
  - Transaction ID (UTR)
  - Payer name
  - Mobile number
  - Payment date & time
  - Optional notes
- Submits payment

### 4. Admin Verification
- Admin receives payment
- Admin verifies screenshot
- Admin approves or rejects
- System updates order status to Processing
- User receives notification

## API Routes

### Approve Payment
```
POST /api/payments/approve
Body: { paymentId: string }
Response: { success: true }
```

### Reject Payment
```
POST /api/payments/reject
Body: { paymentId: string, reason: string }
Response: { success: true }
```

## File Upload Security

### Validation Rules
- **Max file size**: 5MB
- **Allowed formats**: PNG, JPG, JPEG, WEBP
- **Upload location**: Supabase Storage
- **Public URL**: Generated for display

### File Naming
Files are named with timestamp to prevent collisions:
```
Format: {timestamp}-{original-filename}
Example: 1703123456789-payment-proof.jpg
```

## Configuration

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Admin User Setup
Admins must have `is_admin = true` in the profiles table.

To make a user admin, run this SQL:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'admin@example.com';
```

## Security Features

1. **Authentication**
   - All payment operations require authentication
   - Admin operations require admin role

2. **Row Level Security**
   - Users can only see their own payments
   - Admins can see all payments
   - Payment screenshots are protected

3. **File Upload Validation**
   - File type validation (MIME type check)
   - File size limit (5MB)
   - Secure storage in Supabase

4. **Audit Logging**
   - All admin actions logged
   - Timestamp of verification
   - Admin who verified recorded

## Testing the System

### 1. Setup Admin Settings
1. Go to `/admin/payment-settings`
2. Fill in payment details
3. Upload a QR code image
4. Save settings

### 2. Create Test Order
1. Go to `/checkout`
2. Select a service
3. Click "Proceed to Payment"

### 3. Submit Payment
1. On payment page, click "I've Made Payment"
2. Fill in fake payment details
3. Upload a test screenshot
4. Submit

### 4. Verify Payment
1. Go to `/admin/payments`
2. See pending payment
3. Click "View Details"
4. Click "Approve Payment"

## Payment Statuses

### Payment Status
- **Pending Verification** - User submitted, waiting for admin verification
- **Paid** - Admin approved payment
- **Rejected** - Admin rejected payment

### Verification Status
- **Pending** - Initial state
- **Approved** - Admin verified
- **Rejected** - Admin rejected
- **Re-upload Requested** - Admin asking for new screenshot

### Order Status
- **pending** - Order created
- **Processing** - Payment verified, being processed
- **completed** - Service delivered
- **cancelled** - Order cancelled

## UPI Deep Link

The system uses UPI deep links to open UPI apps:

```
upi://pay?pa={upi_id}&pn={name}&am={amount}&tn={description}
```

Example:
```
upi://pay?pa=business@okhdfcbank&pn=Akash%20Worldwide&am=299&tn=akashworldwide%20Payment
```

Supported on:
- Google Pay
- PhonePe
- Paytm
- BHIM
- Any UPI-enabled app

## Notifications

After payment approval:
- User notification on dashboard
- Order status changes to Processing
- Email notification (optional - implement separately)

## Troubleshooting

### QR Code Not Uploading
1. Check file size (< 5MB)
2. Check file format (PNG, JPG, WEBP)
3. Verify Supabase bucket exists
4. Check Supabase storage permissions

### Payment Screenshot Upload Failed
1. Verify user is authenticated
2. Check file size (< 5MB)
3. Verify Supabase storage bucket exists
4. Check browser console for errors

### Payment Not Appearing in Admin Panel
1. Check user is authenticated when submitting
2. Verify payment record created in database
3. Check RLS policies on payments table
4. Verify admin user has is_admin = true

### Deep Link Not Opening UPI App
1. UPI app may not be installed
2. Works best on mobile devices
3. Fallback: User can manually enter UPI ID

## Future Enhancements

Possible improvements:
- Email notifications
- SMS notifications
- Automated payment reminders
- OCR-based screenshot verification
- Payment status tracking in real-time
- Refund management
- Payment history reports
- Custom rejection reasons
- Payment receipt generation

## Support

For issues or questions, contact support at:
Email: support@akashworldwide.com
Phone: (from admin settings)

---

**Last Updated**: 2024
**Version**: 1.0
**System**: Manual UPI Payment Only
