# Row Level Security (RLS) Setup Guide

## Overview

This guide will help you secure your Supabase database by enabling Row Level Security (RLS) and setting up appropriate policies for all your tables.

## Why RLS is Important

Without RLS, your database tables are public and can be accessed by anyone with the database URL. This is a **critical security vulnerability**. RLS ensures that:

- Users can only access data they're authorised to see
- Your admin operations remain secure
- Public forms (enquiries, trip plans) work correctly
- Your API endpoints maintain proper security

## Current Tables Requiring RLS

Based on your schema, these tables need RLS policies:
- `Enquiry` - Contact form submissions
- `User` - Admin users
- `Holiday` - Holiday packages
- `TripPlan` - Customer trip requests

## Step-by-Step Implementation

### Step 1: Enable RLS in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the improved RLS script: `scripts/setup-rls-improved.sql`

### Step 2: Verify Service Role Access

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy your **service_role** key (keep this secret!)
3. Add it to your environment variables:

```bash
# Add to your .env.local file
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Update Your Prisma Configuration

The `lib/prisma-admin.ts` file has been created to handle different connection types:

- **prismaAdmin**: For admin operations (bypasses RLS)
- **prismaPublic**: For public operations (respects RLS)

### Step 4: Update Your API Routes

You'll need to update your API routes to use the appropriate Prisma client:

#### For Admin Operations (existing routes in `/api/admin/`)

```typescript
// Instead of: import { prisma } from '@/lib/prisma'
import { prismaAdmin, executeAsAdmin } from '@/lib/prisma-admin'

// Example usage:
export async function GET() {
  const enquiries = await executeAsAdmin(async (prisma) => {
    return await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    })
  })
  
  return NextResponse.json(enquiries)
}
```

#### For Public Operations (contact forms, etc.)

```typescript
// For public endpoints like contact forms
import { prismaPublic } from '@/lib/prisma-admin'

export async function POST(request: Request) {
  const data = await request.json()
  
  // This will work with RLS policies for public access
  const enquiry = await prismaPublic.enquiry.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      message: data.message,
      // ... other fields
    }
  })
  
  return NextResponse.json(enquiry)
}
```

### Step 5: Update Existing API Routes

Here are the key files you'll need to update:

#### Admin Routes (use `prismaAdmin`)
- `/api/admin/enquiries/route.ts`
- `/api/admin/holidays/route.ts`
- `/api/admin/trip-plans/route.ts`
- `/api/admin/stats/route.ts`

#### Public Routes (use `prismaPublic`)
- `/api/contact/route.ts`
- `/api/trip-plans/route.ts`

### Step 6: Test Your Implementation

1. **Test Public Access**:
   - Submit a contact form → Should work
   - Submit a trip plan → Should work
   - View available holidays → Should work

2. **Test Admin Access**:
   - Login to admin panel → Should work
   - View all enquiries → Should work
   - Create/edit holidays → Should work

3. **Test Security**:
   - Try accessing admin data without authentication → Should fail
   - Try accessing other users' data → Should fail

### Step 7: Verify RLS is Working

Run these queries in Supabase SQL Editor to verify:

```sql
-- Check that RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

## Security Policies Summary

### Enquiry Table
- ✅ Anyone can submit enquiries (public forms)
- ✅ Only admins can view/edit/delete enquiries

### User Table
- ✅ Only admins can access user records
- ✅ Prevents unauthorised access to admin credentials

### Holiday Table
- ✅ Anyone can view available holidays
- ✅ Only admins can create/edit/delete holidays

### TripPlan Table
- ✅ Anyone can create trip plans (public forms)
- ✅ Only admins can view/edit/delete trip plans

## Troubleshooting

### Issue: "Permission denied" errors
**Solution**: Make sure you're using `prismaAdmin` for admin operations and `executeAsAdmin()` helper function.

### Issue: Public forms not working
**Solution**: Ensure you're using `prismaPublic` for public endpoints and that the anon role has INSERT permissions.

### Issue: Admin panel not loading data
**Solution**: Check that your admin routes are using `prismaAdmin` and that the service role is configured correctly.

### Issue: Database connection errors
**Solution**: Verify that both `POSTGRES_URL_NON_POOLING` and `POSTGRES_PRISMA_URL` are correctly set in your environment variables.

## Environment Variables Required

```bash
# Supabase PostgreSQL connection (pooled)
POSTGRES_PRISMA_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase PostgreSQL connection (direct)
POSTGRES_URL_NON_POOLING="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase service role key (for bypassing RLS)
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
```

## Next Steps

1. ✅ Run the RLS setup script
2. ✅ Update your API routes to use appropriate Prisma clients
3. ✅ Test all functionality thoroughly
4. ✅ Monitor for any permission issues
5. ✅ Consider implementing additional security measures as needed

## Additional Security Considerations

1. **API Key Validation**: Consider implementing API key validation for additional security
2. **Rate Limiting**: Implement rate limiting on public endpoints
3. **Audit Logging**: Add logging for admin operations
4. **Input Validation**: Ensure all inputs are properly validated
5. **HTTPS Only**: Ensure all connections use HTTPS in production

## Support

If you encounter any issues during implementation, check:
1. Supabase logs for database errors
2. Next.js console for application errors
3. Network tab for API request failures
4. Verify environment variables are correctly set 