# Amadeus API Setup for Production

This document outlines how to set up and maintain the Amadeus API integration for Sky Limit Travels in a cost-effective way.

## Setup Instructions

### 1. Environment Configuration

The Amadeus API credentials need to be added to your production environment variables. If you're using Vercel for deployment, add these in the Vercel dashboard under Project Settings > Environment Variables.

Required environment variables:
- `AMADEUS_CLIENT_ID` - Your production Amadeus API client ID
- `AMADEUS_CLIENT_SECRET` - Your production Amadeus API client secret
- `ADMIN_PASSWORD` - A secure password for admin endpoints (cache management)

### 2. Cost-Effective Measures Implemented

The implementation includes several measures to keep API usage costs minimal:

#### 2.1 Extensive Caching

All API responses are cached for 3 days by default. This significantly reduces the number of API calls made to Amadeus.

Caching is implemented for:
- Popular flight searches
- Country-specific flight searches
- Direct flight searches by parameters

#### 2.2 Minimal API Parameters

API calls use minimal required parameters to reduce processing costs on the Amadeus side.

#### 2.3 Result Limiting

API requests are limited to return only the necessary number of results:
- 5 results for flight searches
- 3 results for destination searches

#### 2.4 Single Representative Endpoints

When searching for flights to countries, we use a single major airport per country rather than multiple cities to reduce API calls.

### 3. Cache Management

To keep the API costs low while ensuring fresh data, we've implemented cache management utilities.

#### 3.1 Viewing Cache Statistics

To view cache statistics, make a GET request to:

```
GET /api/admin/cache
```

This will return information about cached files, sizes, and timestamps.

#### 3.2 Clearing Cache

To clear the cache, make a POST request with Basic Authentication:

```
POST /api/admin/cache?all=false&days=7
```

Parameters:
- `all` - If 'true', clears all cache regardless of age (default: false)
- `days` - Clear cache older than specified number of days (default: 7)

Authentication:
- Basic Authentication with username: "admin" and password from `ADMIN_PASSWORD` environment variable

Example using curl:
```bash
curl -X POST -u "admin:YOUR_ADMIN_PASSWORD" "https://yoursite.com/api/admin/cache?all=true"
```

### 4. Fallback Mechanism

If the Amadeus API fails for any reason, the system will automatically fall back to mock data to ensure the website continues to function.

### 5. Testing in Production

Before making the site live, it's recommended to test the production API by:

1. Setting up the environment variables on Vercel
2. Deploying a preview version
3. Monitoring the API calls in the Amadeus Developer Dashboard
4. Checking the console logs for any errors

## Troubleshooting

### API Rate Limiting

If you encounter rate limiting from Amadeus, you might want to:
1. Increase the cache duration (currently set to 3 days)
2. Reduce the number of results requested per call
3. Contact Amadeus to discuss your rate limits

### Invalid API Responses

If you get invalid responses:
1. Check that your production API key is correct
2. Verify the API parameters against the Amadeus documentation
3. Look at the error messages in the logs

### High Costs

If API costs are higher than expected:
1. Use the cache statistics endpoint to monitor cache utilisation
2. Consider increasing the cache duration
3. Review which endpoints are being called most frequently
4. Reduce the maximum results per call

## Support

If you encounter any issues with the Amadeus API integration, please contact their support team at:
- Amadeus for Developers: https://developers.amadeus.com/support 