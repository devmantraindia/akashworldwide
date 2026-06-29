# Production Deployment Checklist

## Pre-Deployment (1-2 days before)

### Code Review & Testing
- [ ] All features tested locally
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No ESLint warnings: `npm run lint`
- [ ] All tests pass: `npm test` (if applicable)
- [ ] Security scan completed
- [ ] Dependencies updated and audited
- [ ] No console errors in dev tools
- [ ] Responsive design tested on all devices

### Environment Setup
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Storage buckets created
- [ ] .env.local configured locally
- [ ] Production environment variables documented
- [ ] API keys and secrets secure
- [ ] No secrets committed to git

### Backend & Database
- [ ] All Supabase migrations applied
- [ ] RLS policies configured correctly
- [ ] Indexes created on common queries
- [ ] Connection pooling configured
- [ ] Backup strategy documented
- [ ] Database size estimated
- [ ] Query performance tested

### Authentication
- [ ] Login flow tested
- [ ] Signup flow tested
- [ ] Password reset flow (if applicable)
- [ ] Admin authentication working
- [ ] Role-based access control (RBAC) verified
- [ ] Session management configured
- [ ] CORS properly configured

### Payment System
- [ ] Manual UPI setup tested
- [ ] QR code uploading works
- [ ] Payment submission form works
- [ ] Admin verification dashboard works
- [ ] Payment status updates work
- [ ] Order status updates work
- [ ] Test payments processed successfully

### File Uploads
- [ ] File validation working (size, type)
- [ ] Storage bucket permissions correct
- [ ] File deletion working
- [ ] File recovery plan documented
- [ ] Storage quota monitored
- [ ] Image optimization tested

### SEO & Metadata
- [ ] robots.txt configured
- [ ] sitemap.xml working
- [ ] Meta tags optimized
- [ ] OpenGraph images set
- [ ] Social media cards working
- [ ] Canonical URLs set correctly

### Performance
- [ ] Lighthouse score > 90
- [ ] Time to First Byte (TTFB) < 500ms
- [ ] Core Web Vitals passing
- [ ] Images optimized (WebP, AVIF)
- [ ] CSS/JS minified
- [ ] Caching headers configured
- [ ] CDN configured (if using)

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] CSRF tokens configured

### Monitoring & Logging
- [ ] Error tracking setup (Sentry, etc.)
- [ ] Application logging configured
- [ ] Performance monitoring setup
- [ ] Uptime monitoring configured
- [ ] Alert system tested
- [ ] Log retention policy set

## Day of Deployment

### Final Checks (2 hours before)
- [ ] All code committed and pushed
- [ ] No uncommitted changes
- [ ] Branch protection rules active
- [ ] Deployment environment ready
- [ ] Rollback plan reviewed
- [ ] Team notified of deployment window
- [ ] On-call support ready

### Deployment Steps

#### For Vercel:
```
vercel --prod
```
- [ ] Build completes successfully
- [ ] Preview deployed correctly
- [ ] Production domain updated
- [ ] DNS propagated
- [ ] SSL certificate valid

#### For Netlify:
```
netlify deploy --prod
```
- [ ] Build completes successfully
- [ ] Build time < 10 minutes
- [ ] Preview looks correct
- [ ] Production site live
- [ ] Redirects working

#### For Self-Hosted:
```
git pull origin main
npm install
npm run build
npm start
```
- [ ] All dependencies installed
- [ ] Build completes successfully
- [ ] Service starts without errors
- [ ] Health check passing
- [ ] Logs show normal operation

### Post-Deployment (First 30 minutes)

#### Immediate Verification
- [ ] Website loads: https://yourdomain.com
- [ ] Login page accessible
- [ ] Signup working
- [ ] Services page loads
- [ ] Payment flow accessible
- [ ] Admin dashboard accessible
- [ ] No 404 or 500 errors

#### Functional Testing
- [ ] User can login
- [ ] User can browse services
- [ ] User can create order
- [ ] Payment page displays QR code
- [ ] Admin can view payments
- [ ] Admin can approve/reject payment
- [ ] Order status updates
- [ ] Notifications sent correctly

#### Performance Testing
- [ ] Page load time acceptable (< 3s)
- [ ] Lighthouse score good (> 80)
- [ ] No console errors
- [ ] No console warnings
- [ ] Database queries optimized
- [ ] No memory leaks

#### Monitoring
- [ ] Error tracking receiving events
- [ ] Performance metrics collected
- [ ] Logs being written
- [ ] Alerts configured
- [ ] Uptime monitoring active
- [ ] Traffic monitoring active

### First 24 Hours Post-Deployment

- [ ] Monitor error logs hourly
- [ ] Check database performance
- [ ] Verify backup completion
- [ ] Test payment transactions
- [ ] Confirm user registrations working
- [ ] Check email notifications (if configured)
- [ ] Monitor API response times
- [ ] Check storage usage
- [ ] Review user feedback

### First Week Post-Deployment

- [ ] Daily error log review
- [ ] Weekly performance review
- [ ] Security scan completion
- [ ] Database optimization
- [ ] User adoption monitoring
- [ ] Feature usage analytics
- [ ] Bug tracking & fixes
- [ ] Documentation updates

## Rollback Procedure (If needed)

### For Vercel
```
vercel rollback
```

### For Netlify
```
netlify deploy --prod --dir .next-backup
```

### For Self-Hosted
```
git revert HEAD
npm run build
npm restart app
```

## Post-Deployment Monitoring

### Daily
- [ ] Error logs checked
- [ ] User feedback reviewed
- [ ] Performance metrics reviewed
- [ ] Uptime verified

### Weekly
- [ ] Security updates applied
- [ ] Performance optimization done
- [ ] Backup verified
- [ ] Team sync completed

### Monthly
- [ ] Full security audit
- [ ] Performance analysis
- [ ] Capacity planning
- [ ] Documentation updated
- [ ] Disaster recovery test

## Contacts

- **Deployment Lead**: [Name/Email]
- **On-Call Support**: [Phone/Slack]
- **Emergency Contact**: [Phone/Email]
- **Stakeholders**: [List]

## Notes

Additional deployment notes and custom configurations:
(Add as needed)
