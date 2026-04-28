# Hostinger Deployment Troubleshooting Guide

## Why the Build Failed on Hostinger

The most common reasons for build failures are:

1. **Missing Environment Variables** ❌
2. **Incorrect Database URL Format** ❌
3. **Node.js Version Mismatch** ⚠️
4. **Missing `package-lock.json` or `.node-version`** ⚠️

---

## ✅ Step 1: Set Environment Variables on Hostinger

Your build will fail if environment variables aren't set. Follow these exact steps:

### In Hostinger hPanel:

1. Go to **App Management** (or **Hosting**)
2. Select your project
3. Click **Environment Variables**
4. Add **ALL** of these variables (don't miss any):

```
AMADEUS_CLIENT_ID=yXsVG8xKiqnogwSmXZUYkWi14Vxmj4lA
AMADEUS_CLIENT_SECRET=VLbA6vKRSGoyh7Ns

DATABASE_URL=postgresql://postgres.jczhjnvdaptpqkbzeltv:5qsHP8Ss4sM1SUjC@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

POSTGRES_PRISMA_URL=postgresql://postgres.jczhjnvdaptpqkbzeltv:5qsHP8Ss4sM1SUjC@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

POSTGRES_URL_NON_POOLING=postgresql://postgres:5qsHP8Ss4sM1SUjC@db.jczhjnvdaptpqkbzeltv.supabase.co:5432/postgres

NEXTAUTH_URL=https://yourdomain.com

NEXTAUTH_SECRET=03145f86fc04c986ebf1ec563f54370b3aaa01145bfd6b6935f4903017fe6c52

ADMIN_PASSWORD=Admin123

CACHE_DURATION_DAYS=3

API_KEY_SECRET=skylimit-default-secret-key
```

**IMPORTANT**: Replace `https://yourdomain.com` with your actual Hostinger domain!

---

## ✅ Step 2: Configure Build Settings

In Hostinger hPanel → App Management → Build Settings:

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm start
```

### Node.js Version (if available)
```
18.x or higher
```

### Root Directory
```
./
```

---

## ✅ Step 3: Enable Auto-Deploy

1. Go to **Deployments** in Hostinger
2. Enable **Auto Deploy on Git Push**
3. Select **GitHub** as provider
4. Select your repository and **main** branch

---

## ✅ Step 4: Verify Git Integration

Before deploying, ensure:

- [ ] Repository is connected to Hostinger
- [ ] Main branch is selected
- [ ] Auto-deploy is enabled

---

## Troubleshooting: Specific Error Messages

### Error: "DATABASE_URL is not set"

**Solution**: 
1. Check that `DATABASE_URL` variable is added in Hostinger
2. Verify the value is correct (copy from .env file)
3. Redeploy after adding the variable

### Error: "Tenant or user not found"

**Solution**: 
1. The database connection string is incorrect
2. Verify `POSTGRES_PRISMA_URL` is exactly as shown above
3. Make sure your Supabase database is running

### Error: "Cannot find module '@prisma/client'"

**Solution**:
1. This usually means `npm install` failed
2. Check that `package.json` and `package-lock.json` are in the repository
3. Clear Hostinger cache and redeploy

### Error: "Next.js build failed"

**Solution**:
1. Check the full error message in Hostinger logs
2. Compare with local `npm run build` output
3. Ensure all environment variables are set
4. Try increasing the build timeout in Hostinger settings

---

## ✅ Step 5: Manual Deployment Test

If auto-deploy isn't working:

1. Go to **Deployments** in Hostinger
2. Click **Deploy** or **Redeploy**
3. Monitor the build progress
4. Check the logs if it fails

---

## ✅ Step 6: Verify Deployment

After successful build:

1. Visit your domain (e.g., `https://yourdomain.com`)
2. Check if the page loads
3. Try accessing `/admin/login` to verify database connection
4. Test flight search functionality

---

## Still Not Working?

### Check These:

1. **Are environment variables visible on Hostinger?**
   - Go to Environment Variables section
   - Verify all variables are listed
   - Check values are not cut off

2. **Is the database accessible?**
   - Test database connection locally (copy the URL from Hostinger to local .env and run `npm run build`)
   - Verify Supabase database is active

3. **Check Hostinger Logs:**
   - Go to Deployments → Failed Build → View Logs
   - Copy the error message
   - Search for the error in this document or online

4. **Try Clearing Cache:**
   - In Hostinger, clear build cache
   - Delete node_modules and .next folders locally
   - Run `npm install && npm run build` locally again
   - Push to GitHub to trigger re-deploy

---

## Common Issues Checklist

| Issue | Check | Solution |
|-------|-------|----------|
| Build times out | Set timeout in Hostinger | Increase timeout to 30+ minutes |
| Build uses old code | Git push not recognized | Check if commit reached Hostinger |
| Database errors | Environment variables | Add all DB variables to Hostinger |
| Module not found | package.json issues | Ensure package-lock.json is in repo |
| Port conflicts | Different port on Hostinger | Configure port in build settings |

---

## Hostinger Support

If you're still stuck:

1. Contact **Hostinger Support** → App Management section
2. Provide them with:
   - Your domain name
   - GitHub repository URL
   - Last 50 lines of build log
3. Ask them to check:
   - Node.js version compatibility
   - Available disk space
   - Build timeout settings

---

## Next Deploy Attempt

1. **Set all environment variables** (Step 1)
2. **Verify build settings** (Step 2)
3. **Push a test commit** to GitHub
4. **Monitor the build** in Hostinger Deployments
5. **Check logs** if build fails

---

**Last Updated:** April 28, 2026
