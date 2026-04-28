# Hostinger Deployment Guide - Sky Limit Travels

## Overview
This guide helps you deploy the Next.js application to Hostinger with GitHub integration.

## Prerequisites
- Hostinger account with Node.js hosting
- GitHub repository connected to Hostinger
- PostgreSQL database (e.g., Supabase or similar)

## Step 1: Set Up Database Connection

### Get Your Database Credentials
1. Go to your database provider (e.g., Supabase)
2. Find your connection strings:
   - **Connection string with pooling**: `postgresql://user:password@host:6543/database?pgbouncer=true&connection_limit=1`
   - **Direct connection**: `postgresql://user:password@host:5432/database`

### Important for Hostinger Build
The build process (`npm run build`) needs database credentials to succeed. Even though the build doesn't actually connect to the database at build time, the Prisma client initialization requires the connection strings to be present.

## Step 2: Configure Environment Variables in Hostinger

Go to your Hostinger hPanel → App Management → Environment Variables, and add:

### Required Variables
```bash
# PRIMARY DATABASE CONNECTION (with connection pooling for serverless)
POSTGRES_PRISMA_URL=postgresql://user:password@host:6543/database?pgbouncer=true&connection_limit=1

# NON-POOLING CONNECTION (for migrations)
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/database

# FALLBACK URL
DATABASE_URL=postgresql://user:password@host:5432/database

# NEXTAUTH
NEXTAUTH_SECRET=your-secure-random-secret-key
NEXTAUTH_URL=https://yourdomain.com

# API KEYS
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret

# OPTIONAL: Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

### Replace Values
- `user`, `password`, `host`, `database` with your actual database credentials
- `your-secure-random-secret-key` with a random string (use: `openssl rand -hex 32`)
- `yourdomain.com` with your actual domain
- API keys with actual credentials

## Step 3: Configure Build Settings

In Hostinger App Management → Build Settings:

### Build Command
```bash
npm run build
```

### Start Command  
```bash
npm start
```

### Root Directory
```
./
```

## Step 4: Deploy with GitHub

1. **Connect Repository**
   - Go to Hostinger hPanel → App Management
   - Connect your GitHub repository
   - Select the branch to deploy (usually `main` or `master`)

2. **Auto-Deploy on Push**
   - Enable "Auto Deploy" when new commits are pushed
   - Hostinger will automatically run `npm install` → `npm run build` → `npm start`

## Step 5: Verify Deployment

After deployment completes:

1. **Check Status**
   - Go to hPanel → App Management → Deployments
   - Verify the latest build succeeded (shows "✓")

2. **Test the Application**
   - Visit your domain
   - Check the home page loads
   - Try searching for flights
   - Test admin login at `/admin/login`

## Troubleshooting

### Build Fails with "Tenant or user not found"
**Solution**: Verify all `POSTGRES_*` environment variables are set correctly in Hostinger.

### Application Shows Database Connection Error
**Solution**: 
1. Check that `POSTGRES_PRISMA_URL` is correct
2. Verify your database is running
3. Test connection manually from terminal

### Application Won't Start
**Solution**:
1. Check `npm start` works locally: `npm run build && npm start`
2. Verify `NEXTAUTH_SECRET` is set
3. Check Hostinger logs for errors

### Static Generation Warnings
**Note**: During `npm run build`, you may see warnings about database operations like "force-reset admin" or "clean users". These are safe and expected - the application handles database unavailability during build gracefully.

## Performance Tips

1. **Enable Caching**
   - Set cache headers in `next.config.js`
   - Use Next.js Image Optimization

2. **Monitor API Costs**
   - Amadeus API can be expensive
   - Check `lib/api-cost-optimizer.ts` settings
   - Monitor usage in `/admin/api-logs`

3. **Database Connection Pooling**
   - Using connection pooling (pgbouncer) improves performance
   - Set `connection_limit=1` in `POSTGRES_PRISMA_URL`

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is set to a random value
- [ ] Database credentials are stored as environment variables (not in code)
- [ ] Admin credentials changed from default
- [ ] HTTPS enabled (Hostinger does this automatically)
- [ ] API keys are protected and not exposed

## Maintenance

### Regular Tasks
- Monitor error logs in `/admin/api-logs`
- Check API usage and costs
- Review user enquiries in `/admin/enquiries`
- Backup database regularly through your database provider

### Database Migrations
If you update the Prisma schema:
```bash
npx prisma migrate deploy
```

This runs automatically during deployment if migrations exist.

## Support

- **Hostinger Support**: https://support.hostinger.com
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

## Common Environment Variable Mistakes

| Mistake | Fix |
|---------|-----|
| Missing `POSTGRES_PRISMA_URL` | Copy from your database provider's connection string |
| Using wrong URL format | Ensure it includes `?pgbouncer=true&connection_limit=1` |
| Special characters in password | URL-encode them (e.g., `@` becomes `%40`) |
| Missing `NEXTAUTH_SECRET` | Generate with: `openssl rand -hex 32` |
| Wrong domain in `NEXTAUTH_URL` | Use your actual Hostinger domain |

## Next Steps

1. Deploy to Hostinger
2. Test all functionality
3. Monitor logs for errors
4. Optimize performance based on usage patterns
5. Plan regular backups

---

**Last Updated**: April 2026
