# Payment System Setup Checklist

## ✅ Code Implementation Complete

### Files Created
- [x] `/lib/payment-utils.ts` - Payment utilities
- [x] `/app/admin/payment-settings/page.tsx` - Admin settings page
- [x] `/app/payment/[orderId]/page.tsx` - User payment page
- [x] `/app/admin/payments/page.tsx` - Payment verification page
- [x] `/app/api/payments/approve/route.ts` - Approve API
- [x] `/app/api/payments/reject/route.ts` - Reject API
- [x] `/app/checkout/page.tsx` - Updated with payment integration
- [x] `/app/admin/page.tsx` - Dashboard with payment stats

### Documentation
- [x] `PAYMENT_SYSTEM_SETUP.md` - Technical setup guide
- [x] `PAYMENT_README.md` - Complete user/admin guide
- [x] `PAYMENT_IMPLEMENTATION_SUMMARY.md` - Overview
- [x] `PAYMENT_SETUP_CHECKLIST.md` - This file

## 🔄 Before You Deploy

### 1. Supabase Setup

#### Create Storage Buckets
```bash
# Do this in Supabase Dashboard > Storage

Bucket 1: payment-qrcodes
  - Visibility: Public
  - Purpose: Store QR code images
  
Bucket 2: payment-screenshots
  - Visibility: Public
  - Purpose: Store user payment proof screenshots
```

**Checklist:**
- [ ] payment-qrcodes bucket created
- [ ] payment-screenshots bucket created
- [ ] Both buckets set to Public
- [ ] Verified in Supabase Dashboard

#### Run SQL Migrations

Go to Supabase > SQL Editor and run the SQL file from:
`PAYMENT_SYSTEM_SETUP.md` section "Database Schema"

Or copy the schema:
```sql
-- Run all CREATE TABLE statements
-- From PAYMENT_SYSTEM_SETUP.md
```

**Checklist:**
- [ ] payment_settings table created
- [ ] payments table created
- [ ] payment_screenshots table created
- [ ] payment_logs table created
- [ ] All tables have RLS enabled
- [ ] Foreign keys configured
- [ ] Verified tables in Supabase

### 2. User Setup

#### Create Admin User

**Option 1: Via Supabase Auth**
1. Go to Supabase Dashboard
2. Go to Authentication > Users
3. Click "Add user"
4. Create admin@yourdomain.com
5. Set password
6. Note: Make sure email is verified

**Option 2: Via SQL**
After user is created:
```sql
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@yourdomain.com';
```

**Checklist:**
- [ ] Admin user created
- [ ] Email is verified
- [ ] User exists in profiles table
- [ ] is_admin = true in database
- [ ] Can login successfully

### 3. Admin Configuration

#### Configure Payment Settings

1. **Login as admin** to your application
2. **Navigate to** `/admin/payment-settings`
3. **Fill in all fields**:
   - [ ] Account Holder Name (e.g., "Akash Worldwide")
   - [ ] UPI ID (e.g., "business@okhdfcbank")
   - [ ] Bank Name (optional, e.g., "HDFC Bank")
   - [ ] Payment Instructions (instructions for users)
   - [ ] Support Email (e.g., "support@example.com")
   - [ ] Support Phone (e.g., "+91-9876543210")

4. **Upload QR Code**:
   - [ ] Have QR code image ready (PNG, JPG, or WEBP)
   - [ ] Size must be less than 5MB
   - [ ] Click "Upload QR Code"
   - [ ] Wait for upload to complete
   - [ ] Verify QR code appears in preview

5. **Enable Payments**:
   - [ ] Check "Enable Manual UPI Payment" box
   - [ ] Click "Save Settings"

6. **Verify in Database**:
   ```sql
   SELECT * FROM payment_settings LIMIT 1;
   ```
   - [ ] Settings saved with correct values
   - [ ] qr_code_url is populated
   - [ ] is_enabled = true

### 4. Environment Variables

Verify in your Vercel project settings:

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
```

**Checklist:**
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY set
- [ ] Variables copied from Supabase Project Settings
- [ ] Verified in Vercel Dashboard

### 5. Testing

#### Test User Payment Flow

**Step 1: Create Order**
```
1. Go to http://localhost:3000/checkout (or your URL)
2. Login as regular user
3. Select a service
4. Click "Proceed to Payment"
5. Should be redirected to /payment/[orderId]
```
- [ ] Service selection page loads
- [ ] Can select service
- [ ] Redirected to payment page

**Step 2: View Payment Page**
```
1. On payment page, verify:
   - Order details show correctly
   - Service name and price displayed
   - QR code image is visible
   - UPI ID is shown
   - Account holder name displayed
   - All buttons present
```
- [ ] QR code loads from admin settings
- [ ] UPI ID matches what admin configured
- [ ] Account name matches
- [ ] Copy button works
- [ ] "Open UPI App" button visible

**Step 3: Submit Payment**
```
1. Click "I've Made Payment"
2. Fill form with test data:
   - Upload any image as screenshot
   - Enter test UTR (e.g., "123456789012")
   - Enter test payer name
   - Enter test mobile (e.g., "9876543210")
   - Confirm date/time
3. Click "Submit Payment"
4. Should see success message
```
- [ ] Payment form opens
- [ ] Can upload image
- [ ] Form validates all required fields
- [ ] Success message appears after submit

**Step 4: Check Database**
```sql
SELECT * FROM payments WHERE payment_status = 'Pending Verification';
```
- [ ] Payment record created
- [ ] payment_status = "Pending Verification"
- [ ] user_id correct
- [ ] order_id correct
- [ ] screenshot URL populated

#### Test Admin Verification Flow

**Step 1: View Admin Dashboard**
```
1. Go to http://localhost:3000/admin (or your URL)
2. Login as admin user
3. Should see:
   - Payment statistics
   - "Pending Payments" card showing count
   - "Verified Payments" card
   - "Payment Settings" card
```
- [ ] Dashboard loads
- [ ] Payment stats visible
- [ ] Can click "Review Payments" button

**Step 2: Access Payment Verification**
```
1. Click "Verify Payments" on dashboard
2. Or go to /admin/payments
3. Should see:
   - List of all payments
   - Filter by status buttons
   - Each payment shows basic info
```
- [ ] Payment list loads
- [ ] Can see submitted payment
- [ ] Status filter buttons present
- [ ] "View Details" button available

**Step 3: Review Payment Details**
```
1. Click "View Details" on payment
2. Modal opens showing:
   - Payer name and mobile
   - Transaction ID (UTR)
   - Payment screenshot
   - Payment date/time
3. Can download screenshot
```
- [ ] Modal opens correctly
- [ ] All payment details shown
- [ ] Screenshot displays correctly
- [ ] Can download screenshot
- [ ] Approve button visible

**Step 4: Approve Payment**
```
1. Click "Approve Payment"
2. Wait for success message
3. Check database:
   - Payment status changed to "Paid"
   - verified_by set to admin user
   - verified_at set to current time
4. Check order:
   - Order status changed to "Processing"
   - payment_id set to payment record
```
- [ ] Approval succeeds
- [ ] Success message shown
- [ ] Database updated correctly
- [ ] Order status changed
- [ ] Payment log created

**Step 5: Test Rejection**
```
1. Create another test payment
2. In admin, click "Reject"
3. Provide rejection reason
4. Check database:
   - Payment status = "Rejected"
   - rejected_reason = provided reason
   - verified_by = admin
```
- [ ] Can reject payment
- [ ] Rejection reason saved
- [ ] Payment marked as rejected

### 6. Security Verification

**Authentication**
- [ ] Only authenticated users can access /payment/[orderId]
- [ ] Only authenticated users can submit payments
- [ ] Only admin users can access /admin pages
- [ ] Only admin users can approve/reject payments

**File Upload**
- [ ] Can't upload files > 5MB (test with large file)
- [ ] Can't upload non-image files (test with .txt)
- [ ] Only PNG, JPG, WEBP accepted
- [ ] Files stored securely in Supabase

**Data Access**
- [ ] Users see only their own payments
- [ ] Regular users can't see admin panel
- [ ] Admin can see all payments
- [ ] Unauthenticated users redirected to login

### 7. Visual Inspection

**Payment Page**
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] QR code clearly visible
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Color scheme matches brand

**Admin Pages**
- [ ] Settings page responsive
- [ ] Verification page responsive
- [ ] Forms have proper labels
- [ ] Error messages clear
- [ ] Success messages visible
- [ ] No layout shifts
- [ ] Images load properly

### 8. Performance Check

**Load Times**
- [ ] Payment page loads < 2 seconds
- [ ] Admin dashboard loads < 2 seconds
- [ ] Payment list loads < 3 seconds
- [ ] No console errors
- [ ] No memory leaks

**Database**
- [ ] Queries are efficient
- [ ] RLS policies don't slow down
- [ ] No N+1 queries
- [ ] Indexes working properly

### 9. Documentation Review

**For Users**
- [ ] PAYMENT_README.md is clear
- [ ] User flow explained well
- [ ] Instructions are followable
- [ ] Contact info provided

**For Admins**
- [ ] Admin instructions clear
- [ ] Settings configuration explained
- [ ] Verification process detailed
- [ ] Troubleshooting guide available

**For Developers**
- [ ] PAYMENT_SYSTEM_SETUP.md comprehensive
- [ ] Database schema documented
- [ ] API routes documented
- [ ] File structure clear

### 10. Final Verification

**Functional**
- [ ] End-to-end payment flow works
- [ ] Admin verification works
- [ ] Order status updates correctly
- [ ] No errors in console
- [ ] No unhandled rejections

**Data Integrity**
- [ ] All required fields populated
- [ ] Foreign keys correct
- [ ] RLS policies working
- [ ] Audit logs created
- [ ] No data corruption

**Security**
- [ ] No SQL injection possible
- [ ] No XSS vulnerabilities
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Files secured

**Deployment Ready**
- [ ] Code pushed to GitHub
- [ ] No console warnings
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Storage buckets created
- [ ] Admin user configured
- [ ] Payment settings configured

## 🚀 After Deployment

### Week 1
- [ ] Monitor payment submissions
- [ ] Test with real payments
- [ ] Verify admin receiving notifications
- [ ] Check for any errors
- [ ] Gather user feedback

### Week 2-4
- [ ] Process accumulated payments
- [ ] Review payment logs
- [ ] Verify all approvals correct
- [ ] Monitor database performance
- [ ] Plan any improvements

### Monthly
- [ ] Review payment stats
- [ ] Check for failed payments
- [ ] Verify QR code still working
- [ ] Update documentation
- [ ] Plan new features

## 🔧 Troubleshooting

### Issue: QR code not showing on payment page
**Solution:**
1. Check payment_settings table has qr_code_url
2. Verify Supabase storage bucket is public
3. Test URL directly in browser
4. Check file still exists in storage

### Issue: Can't upload payment screenshot
**Solution:**
1. Check file size < 5MB
2. Check file format is PNG/JPG/WEBP
3. Verify Supabase bucket exists
4. Check browser console for errors
5. Verify authenticated user

### Issue: Admin can't approve payments
**Solution:**
1. Verify user is admin (is_admin = true)
2. Check payment exists in database
3. Verify API route is accessible
4. Check browser console for errors
5. Review payment_logs for issues

### Issue: Order status not updating
**Solution:**
1. Check API route receives correct paymentId
2. Verify order_id in payment record
3. Check orders table has payment_id column
4. Review database logs
5. Try manual update to test

### Issue: Payment not appearing in list
**Solution:**
1. Check payment created in database
2. Verify payment_status is set
3. Check RLS policies on payments table
4. Refresh browser page
5. Try clearing cache

## 📞 Support Contacts

**Payment Settings Issues:**
- Check `/admin/payment-settings`
- Review configuration in database
- Verify QR code upload

**Payment Submission Issues:**
- Check `/payment/[orderId]` page
- Review browser console
- Check Supabase logs

**Admin Verification Issues:**
- Check `/admin/payments` page
- Verify admin status
- Review API responses

**General Issues:**
- Review PAYMENT_README.md
- Check PAYMENT_SYSTEM_SETUP.md
- Review code comments

---

**Setup Date**: ___________
**Completed By**: ___________
**Verified By**: ___________
**Go-Live Date**: ___________

✅ **When all checkboxes are checked, your payment system is ready!**
