# AkashWorldwide - Production Deployment Guide

## Overview

AkashWorldwide is a complete SaaS platform for digital services with manual UPI payment integration. This guide covers deployment to production.

## System Requirements

- Node.js 18+ or 20+
- npm/pnpm/yarn
- PostgreSQL (Supabase managed or self-hosted)
- Minimum 512MB RAM
- Node.js process manager (PM2, systemd, etc. for self-hosted)

## Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database tables migrated
- [ ] Environment variables configured
- [ ] Admin user created with `is_admin = true`
- [ ] Payment settings configured with UPI ID and QR code
- [ ] Storage buckets created (payment-qrcodes, payment-screenshots)
- [ ] SSL certificate obtained (if self-hosted)
- [ ] Domain configured
- [ ] Email service configured (optional)

## Installation

```bash
# Clone repository
git clone <your-repo-url>
cd akashworldwide

# Install dependencies
npm install
# or
pnpm install

# Create .env.local from .env.example
cp .env.example .env.local

# Configure environment variables
nano .env.local
```

## Environment Variables

See `.env.example` for complete list. Key variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Database Setup

```bash
# Run database migrations (if using Supabase, create tables via dashboard or SQL editor)
npx supabase db push

# Seed database with initial data (optional)
npm run seed
```

## Building for Production

```bash
# Build application
npm run build

# Test production build locally
npm run start
```

The build process will:
- Compile TypeScript
- Optimize images
- Minify CSS/JS
- Create optimized bundles
- Generate static routes

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect GitHub repository and auto-deploy on push
```

**Configuration:**
- Set environment variables in Vercel dashboard
- Enable automatic builds
- Configure production domain

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Or connect GitHub for auto-deployment
```

**Configuration:**
- Create netlify.toml
- Configure environment variables
- Set build command: `npm run build`
- Set publish directory: `.next`

### Option 3: Self-Hosted (Node.js Server)

**Using PM2:**

```bash
# Install PM2 globally
npm i -g pm2

# Start application
pm2 start npm --name "akashworldwide" -- start

# Monitor
pm2 monit

# Auto-restart on reboot
pm2 startup
pm2 save
```

**Using systemd:**

Create `/etc/systemd/system/akashworldwide.service`:

```ini
[Unit]
Description=AkashWorldwide SaaS Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/akashworldwide
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable akashworldwide
sudo systemctl start akashworldwide
```

**Using Docker:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t akashworldwide .
docker run -p 3000:3000 --env-file .env.local akashworldwide
```

**Using Nginx Reverse Proxy:**

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check application health
curl https://yourdomain.com
curl https://yourdomain.com/api/health (if implemented)

# Check logs
pm2 logs akashworldwide  # PM2
journalctl -u akashworldwide -f  # systemd
docker logs container_id  # Docker
```

### 2. Monitor Performance

- Set up monitoring with:
  - Vercel Analytics
  - DataDog
  - New Relic
  - PM2 Plus

### 3. Setup CI/CD

GitHub Actions example:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test  # if tests exist
      - run: npm run deploy  # custom deploy script
```

### 4. Backup Strategy

```bash
# Daily Supabase backups (automatic with Supabase Pro)
# Manual backup export
supabase db dump --db-url postgresql://... > backup.sql
```

### 5. Security Hardening

```bash
# Update dependencies
npm audit fix
npm update

# Enable HTTPS (use Let's Encrypt for self-hosted)
# Configure CORS if needed
# Set security headers in next.config.mjs (already configured)
# Enable rate limiting on API routes
# Configure firewall rules
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or run on different port
PORT=3001 npm start
```

### Database Connection Errors

```bash
# Verify Supabase credentials
# Check database is running
# Verify network connectivity
# Check firewall rules
```

### Build Fails

```bash
# Clean build
rm -rf .next
npm run build

# Check for TypeScript errors
npm run type-check

# Check for ESLint errors
npm run lint
```

### Memory Issues

```bash
# Increase Node.js heap
NODE_OPTIONS=--max-old-space-size=2048 npm start

# Or in PM2
pm2 start npm --name "app" -- start --max-old-space-size=2048
```

## Performance Optimization

1. **Image Optimization**
   - Configured in next.config.mjs
   - Automatic WebP/AVIF conversion
   - Lazy loading enabled

2. **Caching**
   - HTTP headers configured for static assets
   - ISR (Incremental Static Regeneration) enabled
   - Client-side caching optimized

3. **Database**
   - Indexes created on common queries
   - Connection pooling configured
   - Query optimization applied

4. **Code Splitting**
   - Dynamic imports for large components
   - Route-based code splitting
   - CSS minimization enabled

## Monitoring & Logging

### Application Logs
```bash
# View recent logs
pm2 logs --lines 100

# Watch logs in real-time
pm2 logs
```

### Error Tracking
- Integrate Sentry for error tracking
- Email alerts on critical errors
- Track performance metrics

### Database Monitoring
- Monitor Supabase dashboard
- Check connection count
- Review slow queries

## Rollback Procedure

```bash
# For Vercel
vercel rollback

# For self-hosted
git checkout previous_commit
npm run build
pm2 restart akashworldwide

# For Docker
docker run --env-file .env.local previous_image_id
```

## Support & Maintenance

- **Update Schedule**: Weekly security updates, monthly feature updates
- **Downtime Window**: 2-4 AM UTC (if self-hosted)
- **SLA**: 99.9% uptime target

## Contact

- Support Email: support@akashworldwide.com
- Documentation: https://docs.akashworldwide.com
- Status Page: https://status.akashworldwide.com
