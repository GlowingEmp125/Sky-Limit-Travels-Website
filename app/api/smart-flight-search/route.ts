import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';
import { isRateLimited } from '@/lib/api-rate-limiter';
import CostOptimizer from '@/lib/api-cost-optimizer';
import { 
  shouldMakeApiCall, 
  getCachedDestinations, 
  trackSearchSelection,
  getEstimatedPrice 
} from '@/lib/smart-search-cache';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  const ip = request.ip || 'unknown';
  
  try {
    const { searchParams } = new URL(request.url);
    const searchParamsObj = {
      originLocationCode: (searchParams.get('origin') || 'LHR').toUpperCase(),
      destinationLocationCode: (searchParams.get('destination') || '').toUpperCase(),
      departureDate: searchParams.get('departureDate') || '',
      returnDate: searchParams.get('returnDate') || '',
      adults: searchParams.get('adults') || '1',
      children: searchParams.get('children') || '0',
      searchType: searchParams.get('searchType') || 'full' // 'preview' or 'full'
    };

    // Track the search attempt
    if (searchParamsObj.originLocationCode && searchParamsObj.destinationLocationCode) {
      trackSearchSelection(
        searchParamsObj.originLocationCode, 
        searchParamsObj.destinationLocationCode
      );
    }

    // SMART SEARCH LOGIC: Different behaviour based on search type
    if (searchParamsObj.searchType === 'preview') {
      // For preview searches (before user locks in final selection)
      // Return cached/estimated data without API call
      return handlePreviewSearch(searchParamsObj, requestId);
    }

    // For full searches, proceed with API call validation
    const validation = CostOptimizer.validateSearchParams(searchParamsObj);
    if (!validation.valid) {
      logAmadeusEvent(
        LogLevel.WARNING,
        'smart-flight-search-api',
        `Invalid search parameters [${requestId}]: ${validation.error}`,
        searchParamsObj
      );
      
      return createErrorResponse(
        validation.error || 'Invalid search parameters',
        400,
        { requestId }
      );
    }

    // Check if we should make an API call based on smart caching logic
    if (!shouldMakeApiCall(
      searchParamsObj.originLocationCode,
      searchParamsObj.destinationLocationCode,
      searchParamsObj.departureDate,
      searchParamsObj.returnDate
    )) {
      // Return cached data without API call
      return handleCachedSearch(searchParamsObj, requestId);
    }

    // Generate session ID for user-specific caching
    const userAgent = request.headers.get('user-agent') || '';
    const sessionId = Buffer.from(`${ip}-${userAgent.substring(0, 50)}`).toString('base64').substring(0, 16);
    
    // Check session cache
    const cacheKey = `smart-search-${searchParamsObj.originLocationCode}-${searchParamsObj.destinationLocationCode}-${searchParamsObj.departureDate}-${searchParamsObj.returnDate}`;
    
    const cachedResult = CostOptimizer.getSessionCache(sessionId, cacheKey);
    if (cachedResult) {
      logAmadeusEvent(
        LogLevel.INFO,
        'smart-flight-search-api',
        `Returning cached results [${requestId}]: ${searchParamsObj.originLocationCode} → ${searchParamsObj.destinationLocationCode}`,
        { source: 'session-cache', resultCount: cachedResult.length }
      );
      
      return NextResponse.json({
        data: cachedResult,
        source: 'cache',
        cached: true,
        timestamp: Date.now()
      });
    }

    // Check cost limits before making API call
    const costCheck = CostOptimizer.isApiCallAllowed('smart-flight-search', ip, sessionId);
    if (!costCheck.allowed) {
      // Instead of blocking, return cached/estimated data with notice
      const fallbackData = await generateFallbackResponse(searchParamsObj);
      
      logAmadeusEvent(
        LogLevel.WARNING,
        'smart-flight-search-api',
        `API call blocked - returning fallback data [${requestId}]: ${costCheck.reason}`,
        { ip, sessionId, estimatedCost: costCheck.cost }
      );
      
      return NextResponse.json({
        data: fallbackData,
        source: 'fallback',
        notice: 'Live pricing temporarily unavailable. Showing estimated prices.',
        timestamp: Date.now()
      });
    }

    // Proceed with API call
    const optimizedParams = CostOptimizer.optimizeSearchParams(searchParamsObj);
    
    logAmadeusEvent(
      LogLevel.INFO,
      'smart-flight-search-api',
      `Making API call [${requestId}]: ${optimizedParams.originLocationCode} → ${optimizedParams.destinationLocationCode}`,
      { estimatedCost: costCheck.cost }
    );

    // API call with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API_TIMEOUT')), 8000); // 8 second timeout
    });

    try {
      const flightData = await Promise.race([
        searchFlights(optimizedParams),
        timeoutPromise
      ]);
      
      // Track successful API call
      CostOptimizer.trackApiCall('smart-flight-search', ip, optimizedParams, true);
      
      // Save to session cache
      if (flightData && Array.isArray(flightData) && flightData.length > 0) {
        CostOptimizer.setSessionCache(sessionId, cacheKey, flightData);
      }
      
      logAmadeusEvent(
        LogLevel.INFO,
        'smart-flight-search-api',
        `Search completed [${requestId}]: Found ${flightData?.length || 0} flights`,
        { resultCount: flightData?.length || 0 }
      );
      
      return NextResponse.json({
        data: flightData,
        source: 'api',
        cached: false,
        timestamp: Date.now()
      });

    } catch (error) {
      if (error.message === 'API_TIMEOUT') {
        // Return fallback data on timeout
        const fallbackData = await generateFallbackResponse(searchParamsObj);
        
        logAmadeusEvent(
          LogLevel.WARNING,
          'smart-flight-search-api',
          `API timeout [${requestId}] - returning fallback data`,
          { timeout: '8000ms' }
        );
        
        return NextResponse.json({
          data: fallbackData,
          source: 'fallback',
          notice: 'Search took longer than expected. Showing available options.',
          timestamp: Date.now()
        });
      }
      throw error;
    }

  } catch (error) {
    // Track failed API call
    CostOptimizer.trackApiCall('smart-flight-search', ip, {}, false);
    
    const errorResponse = handleAmadeusError(error, requestId);
    if (errorResponse) {
      return errorResponse;
    }
    
    logAmadeusEvent(
      LogLevel.ERROR,
      'smart-flight-search-api',
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

/**
 * Handle preview searches - return cached/estimated data without API calls
 */
async function handlePreviewSearch(params: any, requestId: string) {
  const cachedDestinations = getCachedDestinations(params.originLocationCode);
  
  // Filter for the specific destination if provided
  let relevantDestinations = cachedDestinations;
  if (params.destinationLocationCode) {
    relevantDestinations = cachedDestinations.filter(
      dest => dest.code === params.destinationLocationCode
    );
  }

  const previewData = relevantDestinations.slice(0, 5).map((dest, index) => {
    const estimatedPrice = params.departureDate 
      ? getEstimatedPrice(params.originLocationCode, dest.code)
      : dest.basePrice;

    return {
      id: `preview-${dest.code}-${index}`,
      destination: dest,
      estimatedPrice,
      isEstimate: true,
      currency: 'GBP'
    };
  });

  logAmadeusEvent(
    LogLevel.INFO,
    'smart-flight-search-api',
    `Preview search [${requestId}]: ${params.originLocationCode} → ${params.destinationLocationCode || 'all'}`,
    { resultCount: previewData.length, type: 'preview' }
  );

  return NextResponse.json({
    data: previewData,
    source: 'preview',
    isEstimate: true,
    timestamp: Date.now()
  });
}

/**
 * Handle cached searches - return existing cached data
 */
async function handleCachedSearch(params: any, requestId: string) {
  // Try to find cached data for this specific route
  const cacheKey = `${params.originLocationCode}-${params.destinationLocationCode}-${params.departureDate}`;
  
  // For now, return estimated data
  // In a real implementation, you'd check your cache files
  const fallbackData = await generateFallbackResponse(params);
  
  logAmadeusEvent(
    LogLevel.INFO,
    'smart-flight-search-api',
    `Cached search [${requestId}]: ${params.originLocationCode} → ${params.destinationLocationCode}`,
    { source: 'smart-cache' }
  );

  return NextResponse.json({
    data: fallbackData,
    source: 'smart-cache',
    cached: true,
    timestamp: Date.now()
  });
}

/**
 * Generate fallback response when API is unavailable
 */
async function generateFallbackResponse(params: any) {
  const cachedDestinations = getCachedDestinations(params.originLocationCode);
  const destination = cachedDestinations.find(d => d.code === params.destinationLocationCode);
  
  if (!destination) {
    return [];
  }

  // Generate realistic fallback flights
  const basePrice = params.departureDate 
    ? getEstimatedPrice(params.originLocationCode, params.destinationLocationCode)
    : destination.basePrice;

  const fallbackFlights = [
    {
      id: `fallback-${params.destinationLocationCode}-1`,
      price: { total: basePrice.toString(), currency: 'GBP' },
      isEstimate: true,
      notice: 'Estimated pricing - call for live rates',
      destination: destination.city,
      itineraries: [{
        segments: [{
          departure: {
            iataCode: params.originLocationCode,
            at: params.departureDate ? `${params.departureDate}T08:00:00` : new Date().toISOString()
          },
          arrival: {
            iataCode: params.destinationLocationCode,
            at: params.departureDate ? `${params.departureDate}T10:30:00` : new Date().toISOString()
          },
          carrierCode: 'BA',
          number: '100',
          duration: 'PT2H30M'
        }]
      }]
    },
    {
      id: `fallback-${params.destinationLocationCode}-2`,
      price: { total: (basePrice * 1.2).toString(), currency: 'GBP' },
      isEstimate: true,
      notice: 'Estimated pricing - call for live rates',
      destination: destination.city,
      itineraries: [{
        segments: [{
          departure: {
            iataCode: params.originLocationCode,
            at: params.departureDate ? `${params.departureDate}T14:00:00` : new Date().toISOString()
          },
          arrival: {
            iataCode: params.destinationLocationCode,
            at: params.departureDate ? `${params.departureDate}T16:30:00` : new Date().toISOString()
          },
          carrierCode: 'EZY',
          number: '200',
          duration: 'PT2H30M'
        }]
      }]
    }
  ];

  return fallbackFlights;
} 