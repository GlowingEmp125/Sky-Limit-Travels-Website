# Amadeus API Migration Guide

## Overview
This guide explains how to migrate from your current custom Amadeus implementation to a more reliable, SDK-based approach.

## Key Problems with Current Implementation

### 1. **Manual Authentication**
- ❌ **Current**: Manual OAuth token fetching
- ✅ **Improved**: SDK handles authentication automatically

### 2. **Direct API Calls**
- ❌ **Current**: Manual `fetch()` calls to Amadeus endpoints
- ✅ **Improved**: Official SDK methods with built-in error handling

### 3. **Complex Airport Logic**
- ❌ **Current**: Custom logic for 'C' and 'A' suffix handling, multiple API calls
- ✅ **Improved**: Single API call, let Amadeus handle airport variations

### 4. **Rate Limiting Issues**
- ❌ **Current**: Multiple API calls in loops can exhaust rate limits
- ✅ **Improved**: Single API call per search request

## Migration Steps

### Step 1: Replace the Core Library
Replace `lib/amadeus.ts` with `lib/amadeus-improved.ts`:

```bash
# Backup your current implementation
mv lib/amadeus.ts lib/amadeus-old.ts

# Rename the improved version
mv lib/amadeus-improved.ts lib/amadeus.ts
```

### Step 2: Update API Routes
Replace your current API routes with the improved versions:

```bash
# Backup current routes
mv app/api/flight-search/route.ts app/api/flight-search/route-old.ts

# Use the improved version
mv app/api/flight-search-improved/route.ts app/api/flight-search/route.ts
```

### Step 3: Update Frontend Calls (if needed)
The API interface remains the same, so your frontend shouldn't need changes. However, you can now remove any client-side workarounds for API failures.

## Benefits of the New Implementation

### 🚀 **Reliability**
- Official SDK handles authentication, retries, and error handling
- Fewer failure points
- Better error messages

### ⚡ **Performance**
- Single API call instead of multiple calls in loops
- No manual token management overhead
- Reduced rate limit pressure

### 🛠️ **Maintainability**
- Much simpler code (200 lines vs 800+ lines)
- Follows Amadeus best practices
- Easier to debug and extend

### 📊 **Better Monitoring**
- Clearer logging with request IDs
- Proper error categorisation
- Performance metrics

## Testing the Migration

### 1. **Test Basic Search**
```bash
curl "http://localhost:3000/api/flight-search?origin=LHR&destination=JFK&departureDate=2024-12-15&adults=1"
```

### 2. **Test Return Journey**
```bash
curl "http://localhost:3000/api/flight-search?origin=LHR&destination=JFK&departureDate=2024-12-15&returnDate=2024-12-22&adults=1"
```

### 3. **Test Error Handling**
```bash
curl "http://localhost:3000/api/flight-search?origin=INVALID&destination=JFK&departureDate=2024-12-15&adults=1"
```

## Rollback Plan

If you need to rollback:

```bash
# Restore original files
mv lib/amadeus-old.ts lib/amadeus.ts
mv app/api/flight-search/route-old.ts app/api/flight-search/route.ts
```

## Environment Variables

Ensure these are set (same as before):
```env
AMADEUS_API_KEY=your_client_id
AMADEUS_API_SECRET=your_client_secret
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## Expected Improvements

After migration, you should see:
- ✅ Fewer API failures
- ✅ Faster response times
- ✅ Clearer error messages
- ✅ Better rate limit management
- ✅ Easier debugging

## Monitoring

Watch your logs for these patterns:
- `✅ Flight search successful` - API working properly
- `⚠️ No flights found, using fallback data` - API returned empty results
- `❌ Flight search failed` - API errors (should be much rarer)

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your Amadeus API credentials
3. Ensure your rate limits aren't exceeded
4. Test with the fallback data to isolate API vs code issues 