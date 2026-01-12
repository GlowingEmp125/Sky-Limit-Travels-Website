import { NextRequest, NextResponse } from 'next/server';
import { getPopularFlights } from '@/lib/amadeus';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';
import { isRateLimited } from '@/lib/api-rate-limiter';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check rate limits
  const rateLimit = isRateLimited(request, 'popular-flights');
  if (!rateLimit.allowed) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'popular-flights-api',
      `Rate limit exceeded [${requestId}]: ${rateLimit.reason}`,
      { ip: request.ip, reason: rateLimit.reason }
    );
    
    return createErrorResponse(
      `Rate limit exceeded: ${rateLimit.reason}`,
      429,
      { requestId }
    );
  }
  
  // Log the request
  logAmadeusEvent(
    LogLevel.INFO,
    'popular-flights-api',
    `Popular flights request [${requestId}]`,
    { url: request.url }
  );
  
  try {
    const flights = await getPopularFlights();
    
    if (!flights || !Array.isArray(flights)) {
      logAmadeusEvent(
        LogLevel.ERROR,
        'popular-flights-api',
        `Invalid flight data format [${requestId}]`,
        { flights }
      );
      
      return createErrorResponse(
        'Invalid flight data format received',
        500,
        { requestId }
      );
    }
    
    // Check if we're returning static data (by ID prefix)
    const isStaticData = flights.length > 0 && flights[0].id.startsWith('static-');
    
    // Log successful results
    logAmadeusEvent(
      LogLevel.INFO,
      'popular-flights-api',
      `Popular flights retrieved [${requestId}]`,
      { 
        resultCount: flights.length,
        isStaticData,
        source: isStaticData ? 'static-fallback' : 'amadeus-api'
      }
    );
    
    return NextResponse.json(flights);
  } catch (error) {
    // Use our error handler
    const errorDetails = handleAmadeusError(
      error,
      'popular-flights-api',
      { requestId, url: request.url }
    );

    // For production, provide fallback data instead of error responses
    // This ensures users never see error pages
    try {
      // Import the new fallback function
      const { generatePopularFlightsFallback } = await import('@/lib/fallback-data');
      
      // Generate comprehensive fallback data
      const fallbackFlights = generatePopularFlightsFallback();

      // Log that we're using fallback data
      logAmadeusEvent(
        LogLevel.WARNING,
        'popular-flights-api',
        `Using fallback data due to API error [${requestId}]`,
        { 
          originalError: errorDetails.error,
          fallbackResultCount: fallbackFlights.length,
          source: 'comprehensive-fallback'
        }
      );

      return NextResponse.json(fallbackFlights);
    } catch (fallbackError) {
      // If even fallback fails, log it and return minimal error
      logAmadeusEvent(
        LogLevel.ERROR,
        'popular-flights-api',
        `Fallback data generation failed [${requestId}]`,
        { 
          originalError: errorDetails.error,
          fallbackError: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        }
      );

      return createErrorResponse(
        errorDetails.error,
        errorDetails.status,
        { ...errorDetails.details, requestId }
      );
    }
  }
} 