# Database Reset Instructions

This guide explains how to completely reset your database and start fresh if you're experiencing migration issues.

## Important Warning

**WARNING: These procedures will DELETE ALL DATA in your database. Only use them in development or when you're fully prepared to lose all production data.**

## Fresh Database Setup on Vercel

If your facing issues with Prisma migrations or database setup on Vercel, follow these steps:

### 1. Clean up migration history (locally)

First, clean up the migration history and prepare for a fresh start:

```bash
# Run this locally to clean up migration history
npm run db:clean-migrations
```

This script will:
- Back up your existing migrations
- Create a fresh migrations directory
- Set up a proper migration_lock.toml file for PostgreSQL

### 2. Reset your production database (if needed)

If you need to completely reset your Vercel/Supabase database:

```bash
# This will DELETE ALL DATA in your production database
# Only run if you're sure you want to start completely fresh
npm run db:reset
```

This script will:
- Drop all existing tables
- Recreate the schema
- Push the latest Prisma schema
- Set up initial data

### 3. Deploy to Vercel

After cleaning up migrations locally:

1. Commit your changes and push to your repository
2. Deploy to Vercel

The deployment process will:
- Test the database connection
- Generate Prisma client
- Set up the database with tables based on your schema
- Create an admin user if needed
- Build and deploy your Next.js application

## Using Individual Scripts

For more granular control, you can use these scripts:

- `npm run db:clean-migrations` - Clean up migration history
- `npm run db:reset` - Reset the entire database
- `npm run db:setup` - Set up the database without resetting
- `npm run db:push` - Push schema changes without migrations
- `npm run test-db` - Test database connectivity

## Environment Variables

Ensure these environment variables are set in your Vercel project:

```
POSTGRES_PRISMA_URL=postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

The `POSTGRES_URL_NON_POOLING` is especially important for migrations and schema changes.

## Troubleshooting

If you continue to experience issues:

1. Check Vercel logs for specific error messages
2. Verify your Supabase database is properly configured
3. Make sure your environment variables are correctly set
4. Consider manually resetting the database through the Supabase SQL editor 