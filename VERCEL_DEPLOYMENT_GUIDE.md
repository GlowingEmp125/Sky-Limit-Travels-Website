# Complete Vercel + Supabase Deployment Guide

This guide will help you properly set up and deploy your Sky Limit Travels website on Vercel with Supabase PostgreSQL database.

## Pre-deployment Checklist

### 1. Supabase Project Setup

1. **Create a Supabase project** at https://supabase.com/dashboard
2. **Get your database credentials** from Settings > Database
3. **Note down these important details:**
   - Project Reference ID
   - Database Password
   - Connection pooling URLs

### 2. Required Environment Variables for Vercel

Set these **exact** environment variables in your Vercel project settings:

```bash
# Database URLs (CRITICAL - use the exact format below)
POSTGRES_PRISMA_URL=postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
POSTGRES_URL_NON_POOLING=postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1

# Authentication
NEXTAUTH_SECRET=generate-a-32-character-random-string-here
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# API Keys
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret

# Admin Configuration
ADMIN_PASSWORD=Admin123!

# Environment
NODE_ENV=production

# Cache Settings
CACHE_DURATION_DAYS=3
```

## Step-by-Step Deployment Process

### Step 1: Update Local Environment

1. **Copy the example environment file:**
   ```bash
   cp env.example .env.local
   ```

2. **Update `.env.local` with your local development settings:**
   ```bash
   # For local development, keep SQLite
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-local-secret"
   NEXTAUTH_URL="http://localhost:3000"
   # Add your other API keys...
   ```

### Step 2: Test Database Connection Locally

```bash
# Test your local setup
npm run test-db
npm run dev
```

### Step 3: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add **ALL** the environment variables listed above
4. Make sure to replace placeholders with your actual values

### Step 4: Update Supabase Settings

1. **In your Supabase dashboard:**
   - Go to Settings > Database
   - Set **Pool Size** to 15 (recommended for most applications)
   - Ensure **Connection pooling** is enabled

2. **Network settings:**
   - Go to Settings > Network
   - Ensure your IP is allowed (or set to allow all)

### Step 5: Deploy

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Supabase for production"
   git push origin main
   ```

2. **Trigger deployment in Vercel:**
   - Go to your Vercel dashboard
   - Click **Redeploy** on your latest deployment
   - Or push a new commit to trigger auto-deployment

## Troubleshooting Common Issues

### Issue 1: "Prepared statement already exists"

**Solution:** Ensure your `POSTGRES_PRISMA_URL` includes `?pgbouncer=true&connection_limit=1`

### Issue 2: "Max client connections reached"

**Solutions:**
1. Reduce connection limit: `connection_limit=1` in the connection string
2. Increase Supabase pool size to 15-20
3. Use transaction mode (port 6543) instead of session mode

### Issue 3: Database connection timeouts

**Solutions:**
1. Increase function timeout in `vercel.json` (already set to 30s)
2. Check Supabase network settings
3. Verify environment variables are exactly correct

### Issue 4: Build failures

**Solutions:**
1. Check that all environment variables are set in Vercel
2. Ensure `NODE_ENV=production` is set
3. Use the correct build command: `npm run vercel-build-with-db`

## Verifying Your Deployment

### 1. Check Vercel Function Logs
- Go to Vercel dashboard > Functions
- Look for any database connection errors

### 2. Test API Endpoints
```bash
# Test these URLs after deployment
https://your-domain.vercel.app/api/health
https://your-domain.vercel.app/api/auth/session
```

### 3. Monitor Supabase Logs
- Go to Supabase dashboard > Logs
- Check for connection issues or query errors

## Database Management

### Setting up Production Database

Your database schema will be automatically created during deployment. If you need to manually set it up:

```bash
# Connect to your production database (set environment variables first)
npx prisma db push --accept-data-loss
```

### Accessing Production Database

You can access your production database using:
- Supabase dashboard SQL editor
- Any PostgreSQL client with the connection string
- Prisma Studio: `npx prisma studio`

## Performance Optimisation

### Connection Management
- Always use `connection_limit=1` for serverless functions
- Use transaction mode (port 6543) for better performance
- Close database connections properly in API routes

### Query Optimisation
- Add database indexes for frequently queried fields
- Use Prisma's query optimisation features
- Monitor query performance in Supabase dashboard

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to Git
   - Use different secrets for development and production
   - Rotate secrets regularly

2. **Database Security:**
   - Enable Row Level Security (RLS) on sensitive tables
   - Use proper authentication policies
   - Regularly review database access logs

## Getting Help

If you're still experiencing issues:

1. **Check Vercel build logs** for specific error messages
2. **Review Supabase logs** for database connection issues
3. **Verify all environment variables** are correctly set
4. **Test the database connection** using the provided scripts

## Additional Resources

- [Supabase Vercel Integration Guide](https://supabase.com/docs/guides/platform/vercel)
- [Prisma with Supabase](https://supabase.com/docs/guides/database/prisma)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) 