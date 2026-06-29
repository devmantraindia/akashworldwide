# Manual UPI Payment System - Complete Documentation

## System Overview

A complete manual UPI payment system for the akashworldwide platform with:
- **No payment gateways** - Razorpay, Stripe, Cashfree, PhonePe are NOT integrated
- **Manual UPI QR code** payment only
- **Admin dashboard** for payment verification
- **User payment interface** with UPI deep linking
- **Secure file storage** for QR codes and payment screenshots
- **Complete audit logging** of all transactions

## Quick Start

### 1. Set Up Supabase Storage Buckets

Create two public storage buckets in your Supabase dashboard:

**Bucket 1: QR Codes**
```
Name: payment-qrcodes
Visibility: Public
Description: QR code images for payment
```

**Bucket 2: Payment Screenshots**
```
Name: payment-screenshots
Visibility: Public
Description: User-uploaded payment proof screenshots
```

### 2. Create an Admin User

First, create a regular user account. Then, update the database to make them an admin:

```sql
UPDATE profiles SET is_admin = true 
WHERE email = 'your-admin@example.com';
```

### 3. Configure Payment Settings

1. **Go to**: `/admin/payment-settings`
2. **Fill in**:
   - Account Holder Name
   - UPI ID (e.g., business@okhdfcbank)
   - Bank Name (optional)
   - Payment Instructions
   - Support Email
   - Support Phone
3. **Upload**: QR Code image (PNG, JPG, WEBP - max 5MB)
4. **Save**: Click "Save Settings"

## User Payment Flow

### Step 1: Place Order
- User selects a service
- Clicks "Proceed to Payment"
- Order is created in database
- Redirected to payment page: `/payment/[orderId]`

### Step 2: View Payment Details
On the payment page, user sees:
- Service name and order details
- Order amount
- QR code image
- UPI ID with copy button
- Account holder name
- Payment instructions

### Step 3: Make Payment
User can:
- **Option A**: Scan QR code with any UPI app (Google Pay, PhonePe, etc.)
- **Option B**: Click "Copy UPI ID" and paste in their UPI app
- **Option C**: Click "Open UPI App" to use deep linking

### Step 4: Submit Payment Proof
After making the payment:
1. Click "I've Made Payment"
2. Fill payment submission form:
   - Upload payment screenshot
   - Enter Transaction ID (UTR from payment receipt)
   - Enter payer name
   - Enter mobile number
   - Select payment date/time
   - Add optional notes
3. Submit

### Step 5: Payment Status
Payment shows as: **Pending Verification**
Order shows as: **Waiting for Admin**

## Admin Verification Flow

### Access Payment Verification
**URL**: `/admin/payments`

### View Pending Payments
1. Filter by "Pending Verification"
2. See list of all submissions
3. Click "View Details" on any payment

### Verify Payment
In the details modal:
1. **Review**:
   - Download and verify screenshot
   - Check transaction details
   - Verify payer information
   - Read any notes
2. **Approve** if payment is valid:
   - Click "Approve Payment"
   - Order status changes to "Processing"
   - User is notified
   - Payment status changes to "Paid"
3. **Reject** if payment is invalid:
   - Provide rejection reason
   - User can resubmit

## File Management

### QR Code Management
- **Upload**: `/admin/payment-settings` - Upload tab
- **Replace**: Upload a new file to replace existing
- **Delete**: Click delete button to remove
- **Preview**: Click "Preview" to see full QR code

### Payment Screenshots
- **Upload**: User uploads during payment submission
- **View**: Admin can view in payment verification
- **Download**: Admin can download from modal
- **Storage**: Stored in `payment-screenshots` bucket with timestamp-based naming

## Database Schema

### payment_settings
```
id (UUID)
account_holder_name (TEXT) - Required
upi_id (TEXT) - Required
bank_name (TEXT)
payment_instructions (TEXT)
support_email (TEXT) - Required
support_phone (TEXT)
qr_code_url (TEXT) - Public URL to QR image
qr_code_path (TEXT) - Storage path
is_enabled (BOOLEAN) - Enable/disable payments
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### payments
```
id (UUID)
order_id (UUID FK) - Linked order
user_id (UUID FK) - Payer
transaction_id (TEXT)
utr_number (TEXT) - Transaction UTR
payer_name (TEXT)
mobile_number (TEXT)
payment_screenshot_url (TEXT) - Public URL
payment_screenshot_path (TEXT) - Storage path
payment_date (TIMESTAMP) - When user paid
notes (TEXT) - User notes
payment_status (TEXT) - "Pending Verification", "Paid", "Rejected"
verification_status (TEXT) - "Pending", "Approved", "Rejected"
rejected_reason (TEXT)
admin_notes (TEXT)
verified_by (UUID FK) - Which admin verified
verified_at (TIMESTAMP)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### payment_screenshots
```
id (UUID)
payment_id (UUID FK) - Reference payment
screenshot_url (TEXT) - Public URL
screenshot_path (TEXT) - Storage path
upload_date (TIMESTAMP)
```

### payment_logs
```
id (UUID)
payment_id (UUID FK) - Reference payment
action (TEXT) - "Payment Submitted", "Payment Approved", etc.
performed_by (UUID FK) - Who took action
details (JSONB) - Additional data
created_at (TIMESTAMP)
```

## Page Routes

### Public Routes
- `/checkout` - Service selection and checkout
- `/payment/[orderId]` - User payment page

### Protected Admin Routes
- `/admin/payment-settings` - Configure UPI payment
- `/admin/payments` - Verify user payments
- `/admin` - Dashboard with payment stats

## API Routes

### Approve Payment
```
POST /api/payments/approve
Authorization: Required (Admin)
Body: {
  paymentId: string
}
Response: { success: true }
```

### Reject Payment
```
POST /api/payments/reject
Authorization: Required (Admin)
Body: {
  paymentId: string,
  reason: string
}
Response: { success: true }
```

## Security Features

### Authentication & Authorization
- All endpoints require Supabase authentication
- Admin-only operations verified via `is_admin` flag
- Users can only see their own payments

### Row Level Security (RLS)
- Users view only own payments
- Admins view all payments
- Screenshots protected by RLS policies
- Audit logs admin-only

### File Upload Validation
- **Allowed formats**: PNG, JPG, JPEG, WEBP
- **Max file size**: 5MB
- **Validation**: MIME type & size checked before upload
- **Storage**: Supabase managed storage with public URLs

### Data Protection
- Transaction IDs stored securely
- Mobile numbers and names in database
- Payment proof stored with public URLs
- Audit trail of all admin actions

## UPI Deep Linking

The system supports opening UPI apps directly:

```
upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&tn=DESCRIPTION
```

### Supported UPI Apps
- Google Pay
- PhonePe
- Paytm
- BHIM
- Other UPI-enabled apps

### Example Link
```
upi://pay?pa=business@okhdfcbank&pn=Akash%20Worldwide&am=299&tn=akashworldwide%20Payment
```

## Payment Statuses

### Payment Status
| Status | Meaning |
|--------|---------|
| Pending Verification | User submitted, awaiting admin review |
| Paid | Admin verified and approved |
| Rejected | Admin rejected, user can resubmit |

### Verification Status
| Status | Meaning |
|--------|---------|
| Pending | Initial state after submission |
| Approved | Admin verified and approved |
| Rejected | Admin rejected |
| Re-upload Requested | Admin asking for new screenshot |

### Order Status
| Status | Meaning |
|--------|---------|
| pending | Order created, waiting for payment |
| Processing | Payment verified, order being processed |
| completed | Order completed |
| cancelled | Order cancelled |

## Admin Dashboard Stats

The admin dashboard shows:
- **Pending Payments**: Count needing verification
- **Verified Payments**: Count of successful payments
- **Payment Settings**: Link to configure UPI
- **Quick Links**: To payment settings, verification, services

## Handling Common Scenarios

### User Submitted Wrong Payment
1. Admin views in payment details
2. Clicks "Request Re-upload"
3. User gets notification to resubmit
4. User can upload corrected screenshot

### Payment Doesn't Match
1. Admin can reject with reason
2. User sees rejection in dashboard
3. User can correct and resubmit
4. Admin verification runs again

### User Lost Receipt
1. User can retry the payment
2. Create new payment record
3. Admin verifies latest payment
4. Previous payment records remain in history

## Testing

### Test Payments Workflow
1. Create test user
2. Make test order
3. Submit fake payment proof
4. Login as admin
5. Verify the payment
6. Check order status changes

### Test Admin Settings
1. Go to `/admin/payment-settings`
2. Fill in test UPI details
3. Upload test QR image
4. Verify saved in database
5. Clear and disable payments

## Troubleshooting

### QR Code Upload Fails
- Check file size (must be < 5MB)
- Check format (PNG, JPG, WEBP only)
- Verify Supabase storage bucket exists
- Check bucket permissions are public

### Payment Screenshot Not Appearing
- Verify authenticated user submitted
- Check file uploaded successfully
- Verify Supabase storage bucket exists
- Check browser console for errors

### Payment Not Listed in Admin
- Verify payment created in database
- Check RLS policies on payments table
- Verify admin user has is_admin = true
- Check payment_status is not empty

### UPI App Not Opening
- Some UPI apps may not be installed
- Deep link works best on mobile
- Fallback: User can manually enter UPI ID
- Check URL encoding in deep link

## Customization

### Change Payment Instructions
Edit in `/admin/payment-settings`

### Change Supported File Types
Edit in `/lib/payment-utils.ts`:
```typescript
ALLOWED_IMAGE_TYPES = ['image/png', ...];
ALLOWED_IMAGE_EXTENSIONS = ['png', ...];
MAX_FILE_SIZE = 5 * 1024 * 1024; // bytes
```

### Modify UPI Deep Link
Edit `generateUPIDeepLink()` in `/lib/payment-utils.ts`

### Add Email Notifications
Implement in API routes after payment approval/rejection

## Production Deployment

### Pre-Deployment Checklist
- [ ] Supabase storage buckets created
- [ ] Admin user created and configured
- [ ] Payment settings configured
- [ ] QR code image uploaded
- [ ] Test payment flow works
- [ ] Admin verification works
- [ ] Order status updates correctly
- [ ] Environment variables set

### Deployment Steps
1. Push code to GitHub
2. Deploy to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run Supabase migrations
5. Create storage buckets
6. Create admin user
7. Configure payment settings
8. Test end-to-end

## Support & Maintenance

### Monitoring
- Check payment logs regularly
- Review admin actions audit trail
- Monitor error logs
- Verify backups of screenshots

### Maintenance
- Clean old rejected payments periodically
- Archive old payment screenshots
- Update bank information when needed
- Test UPI deep links monthly

### Updates
- Monitor Supabase changes
- Update dependencies
- Test new UPI apps support
- Review security patches

## Future Enhancements

Possible improvements:
- Email notifications to users
- SMS notifications
- Automated payment reminders
- OCR-based screenshot verification
- Payment receipt generation
- Refund management
- Revenue reports and analytics
- Multiple UPI ID support
- Payment timeout handling
- Bulk payment processing

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready
**Payment Method**: Manual UPI Only (No Gateways)
