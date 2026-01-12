# Vercel Deployment with Supabase

This guide provides instructions for deploying the Sky Limit Travels website on Vercel with a Supabase PostgreSQL database.

## Required Environment Variables

Set these in your Vercel project settings under "Environment Variables":

```
POSTGRES_PRISMA_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?pgbouncer=true&connection_limit=10
POSTGRES_URL_NON_POOLING=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
NEXTAUTH_SECRET=your-nextauth-secret-key
AMADEUS_CLIENT_ID=your-amadeus-client-id
AMADEUS_CLIENT_SECRET=your-amadeus-client-secret
ADMIN_PASSWORD=Admin123!
CACHE_DURATION_DAYS=3
```

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. Set up the environment variables listed above
3. Configure your Supabase database first
4. Deploy your project

## Important Changes to Fix Deployment Issues

This codebase includes several fixes for common deployment issues:

1. **Fixed "prepared statement already exists" error**
   - Added a custom database helper (`lib/vercel-db-helper.js`) that properly manages connections
   - Each database operation uses a fresh connection to avoid statement conflicts

2. **Optimized database connection handling**
   - All database operations use proper connection/disconnection cycles
   - Added error handling for database operations

3. **Improved build process**
   - Modified `vercel-build` script to ensure proper database setup
   - Added better error reporting during deployment

## Troubleshooting Database Connection Issues

If you encounter database connection errors during deployment:

1. Verify your Supabase connection strings in Vercel environment variables
2. Check that both `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are set correctly
3. Check that your IP address is allowed in Supabase network settings
4. Make sure the database user has the necessary permissions
5. Check the Vercel deployment logs for specific error messages

## Database Migration

The deployment process will automatically:
1. Check the database connection
2. Apply any pending Prisma migrations
3. Create a default admin user if none exists

## Manual Database Reset (if needed)

If you need to completely reset your database:

1. Go to the Supabase dashboard
2. Navigate to SQL Editor
3. Run: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;`
4. Redeploy your Vercel project

## Local Development

For local development, you can use either SQLite or connect to your Supabase instance.

### Using SQLite locally:
```
DATABASE_URL=file:./prisma/dev.db
```

### Connecting to Supabase locally:
```
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

Remember to run `npx prisma migrate dev` to apply migrations locally. 