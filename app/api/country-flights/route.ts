import { NextRequest, NextResponse } from 'next/server';
import { getFlightsToCountry } from '@/lib/amadeus';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';
import { isRateLimited } from '@/lib/api-rate-limiter';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check rate limits (now disabled but still tracks usage)
  const rateLimit = isRateLimited(request, 'country-flights');
  if (!rateLimit.allowed) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'country-flights-api',
      `Rate limit exceeded [${requestId}]: ${rateLimit.reason}`,
      { ip: request.ip, reason: rateLimit.reason }
    );
    
    return createErrorResponse(
      `Rate limit exceeded: ${rateLimit.reason}`,
      429,
      { requestId }
    );
  }
  
  // Extract country code from query parameters
  const searchParams = request.nextUrl.searchParams;
  const countryCode = searchParams.get('code');
  
  // Log the request
  logAmadeusEvent(
    LogLevel.INFO,
    'country-flights-api',
    `Country flights request [${requestId}]: ${countryCode}`,
    { url: request.url }
  );
  
  if (!countryCode) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'country-flights-api',
      `Missing country code parameter [${requestId}]`
    );
    
    return createErrorResponse(
      'Missing country code parameter',
      400
    );
  }
  
  try {
    const flights = await getFlightsToCountry(countryCode);
    
    // Log successful results
    logAmadeusEvent(
      LogLevel.INFO,
      'country-flights-api',
      `Country flights retrieved [${requestId}]: ${countryCode}`,
      { resultCount: flights?.length || 0 }
    );
    
    return NextResponse.json(flights);
  } catch (error) {
    // Use our error handler
    const errorDetails = handleAmadeusError(
      error,
      'country-flights-api',
      { requestId, countryCode, url: request.url }
    );

    // For production, provide fallback data instead of error responses
    // This ensures users never see error pages
    try {
      // Import the new fallback function
      const { generateCountryFlightsFallback } = await import('@/lib/fallback-data');
      
      // Generate comprehensive fallback data for the country
      const fallbackFlights = generateCountryFlightsFallback(countryCode);

      // Log that we're using fallback data
      logAmadeusEvent(
        LogLevel.WARNING,
        'country-flights-api',
        `Using fallback data due to API error [${requestId}]: ${countryCode}`,
        { 
          originalError: errorDetails.error,
          fallbackResultCount: fallbackFlights.length,
          source: 'comprehensive-fallback',
          countryCode
        }
      );

      return NextResponse.json(fallbackFlights);
    } catch (fallbackError) {
      // If even fallback fails, log it and return minimal error
      logAmadeusEvent(
        LogLevel.ERROR,
        'country-flights-api',
        `Fallback data generation failed [${requestId}]: ${countryCode}`,
        { 
          originalError: errorDetails.error,
          fallbackError: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
          countryCode
        }
      );

      return createErrorResponse(
        errorDetails.error,
        errorDetails.status,
        errorDetails.details
      );
    }
  }
} 