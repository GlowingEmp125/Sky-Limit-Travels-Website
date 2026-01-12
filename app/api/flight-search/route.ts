import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';
import { isRateLimited } from '@/lib/api-rate-limiter';
import CostOptimizer from '@/lib/api-cost-optimizer';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  const ip = request.ip || 'unknown';
  
  try {
    // Extract search parameters early for validation
    const { searchParams } = new URL(request.url);
    const searchParamsObj = {
      originLocationCode: (searchParams.get('origin') || 'LHR').toUpperCase(),
      destinationLocationCode: (searchParams.get('destination') || '').toUpperCase(),
      departureDate: searchParams.get('departureDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      adults: searchParams.get('adults') || '1',
      children: searchParams.get('children') || '0'
    };

    // STEP 1: Early validation to prevent unnecessary API calls
    const validation = CostOptimizer.validateSearchParams(searchParamsObj);
    if (!validation.valid) {
      logAmadeusEvent(
        LogLevel.WARNING,
        'flight-search-api',
        `Invalid search parameters [${requestId}]: ${validation.error}`,
        searchParamsObj
      );
      
      return createErrorResponse(
        validation.error || 'Invalid search parameters',
        400,
        { requestId }
      );
    }

    // STEP 2: Generate session ID for user-specific caching
    const userAgent = request.headers.get('user-agent') || '';
    const sessionId = Buffer.from(`${ip}-${userAgent.substring(0, 50)}`).toString('base64').substring(0, 16);
    
    // STEP 3: Check session cache first (30-minute cache per user)
    const cacheKey = `search-${searchParamsObj.originLocationCode}-${searchParamsObj.destinationLocationCode}-${searchParamsObj.departureDate}-${searchParamsObj.returnDate}`;
    
    const cachedResult = CostOptimizer.getSessionCache(sessionId, cacheKey);
    if (cachedResult) {
      logAmadeusEvent(
        LogLevel.INFO,
        'flight-search-api',
        `Returning cached results [${requestId}]: ${searchParamsObj.originLocationCode} → ${searchParamsObj.destinationLocationCode}`,
        { source: 'session-cache', resultCount: cachedResult.length }
      );
      
      return NextResponse.json(cachedResult, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=1800', // 30 minutes browser cache
        }
      });
    }

    // STEP 4: Check cost limits before making API call
    const costCheck = CostOptimizer.isApiCallAllowed('flight-search', ip, sessionId);
    if (!costCheck.allowed) {
      logAmadeusEvent(
        LogLevel.WARNING,
        'flight-search-api',
        `API call blocked due to cost limits [${requestId}]: ${costCheck.reason}`,
        { ip, sessionId, estimatedCost: costCheck.cost }
      );
      
      return createErrorResponse(
        `Service temporarily unavailable: ${costCheck.reason}. Please try again later.`,
        429,
        { requestId, retryAfter: '3600' } // Suggest retry in 1 hour
      );
    }

    // STEP 5: Check traditional rate limits
    const rateLimit = isRateLimited(request, 'flight-search');
    if (!rateLimit.allowed) {
      logAmadeusEvent(
        LogLevel.WARNING,
        'flight-search-api',
        `Rate limit exceeded [${requestId}]: ${rateLimit.reason}`,
        { ip, reason: rateLimit.reason }
      );
      
      return createErrorResponse(
        `Rate limit exceeded: ${rateLimit.reason}`,
        429,
        { requestId }
      );
    }

    // STEP 6: Optimize search parameters to reduce costs
    const optimizedParams = CostOptimizer.optimizeSearchParams(searchParamsObj);
    
    // Log search request with cost tracking
    logAmadeusEvent(
      LogLevel.INFO,
      'flight-search-api',
      `Flight search request [${requestId}]: ${optimizedParams.originLocationCode} → ${optimizedParams.destinationLocationCode}`,
      { estimatedCost: costCheck.cost },
      optimizedParams
    );

    // STEP 7: Add timeout wrapper for Amadeus API call (reduced timeout to save costs)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API_TIMEOUT')), 6000); // 6 second timeout
    });

    try {
      // Race between API call and timeout
      const flightData = await Promise.race([
        searchFlights(optimizedParams),
        timeoutPromise
      ]);
      
      // Track successful API call
      CostOptimizer.trackApiCall('flight-search', ip, optimizedParams, true);
      
      // Save to session cache for future requests
      if (flightData && Array.isArray(flightData) && flightData.length > 0) {
        CostOptimizer.setSessionCache(sessionId, cacheKey, flightData);
      }
      
      // Log successful results
      logAmadeusEvent(
        LogLevel.INFO,
        'flight-search-api',
        `Search completed [${requestId}]: Found ${flightData?.length || 0} flights`,
        { 
          resultCount: flightData?.length || 0,
          cached: true,
          costTracked: true
        }
      );
      
      return NextResponse.json(flightData, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, max-age=1800', // 30 minutes browser cache
        }
      });

    } catch (timeoutError) {
      if (timeoutError.message === 'API_TIMEOUT') {
        // Track failed API call
        CostOptimizer.trackApiCall('flight-search', ip, optimizedParams, false);
        
        logAmadeusEvent(
          LogLevel.WARNING,
          'flight-search-api',
          `API timeout [${requestId}] - falling back to cached/mock data`,
          { timeout: '6000ms' }
        );
        
        // Return a helpful response instead of error
        return createErrorResponse(
          'Search taking longer than expected. Please try a different route or contact us for assistance.',
          408,
          { requestId, suggestion: 'Try searching for a different destination or date' }
        );
      }
      throw timeoutError;
    }

  } catch (error) {
    // Track failed API call if error occurred during API call
    if (error.message?.includes('API') || error.message?.includes('amadeus')) {
      CostOptimizer.trackApiCall('flight-search', ip, {}, false);
    }
    
    // Handle Amadeus-specific errors
    const errorResponse = handleAmadeusError(error, requestId);
    if (errorResponse) {
      return errorResponse;
    }
    
    // Log generic error
    logAmadeusEvent(
      LogLevel.ERROR,
      'flight-search-api',
      `Unexpected error [${requestId}]: ${error.message}`,
      { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }
    );
    
    return createErrorResponse(
      'An unexpected error occurred. Our team has been notified.',
      500,
      { requestId }
    );
  }
} 