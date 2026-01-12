import { NextRequest, NextResponse } from 'next/server';
import { getAmadeusAccessToken, FlightOffer } from '@/lib/amadeus';
import { getFlightById } from '@/lib/search-sessions';
import { isRateLimited } from '@/lib/api-rate-limiter';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// This would ideally come from a database, but for demonstration purposes
// we'll simulate retrieving from cache or session storage
const FLIGHT_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
let flightCache: Map<string, { flight: FlightOffer, timestamp: number }> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check rate limits (now disabled but still tracks usage)
  const rateLimit = isRateLimited(request, 'flight-details');
  if (!rateLimit.allowed) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'flight-details-api',
      `Rate limit exceeded [${requestId}]: ${rateLimit.reason}`,
      { ip: request.ip, reason: rateLimit.reason }
    );
    
    return createErrorResponse(
      `Rate limit exceeded: ${rateLimit.reason}`,
      429,
      { requestId }
    );
  }
  
  try {
    const flightId = params.id;
    
    if (!flightId) {
      return NextResponse.json(
        { error: 'Flight ID is required' },
        { status: 400 }
      );
    }
    
    // Log the request
    logAmadeusEvent(
      LogLevel.INFO,
      'flight-details-api',
      `Flight details request [${requestId}]: ${flightId}`,
      { url: request.url }
    );

    // Check if flight is in cache and not expired
    const cachedFlight = flightCache.get(flightId);
    if (cachedFlight && Date.now() - cachedFlight.timestamp < FLIGHT_CACHE_DURATION) {
      return NextResponse.json(cachedFlight.flight);
    }

    // Try to find the flight in search sessions
    const flightFromSession = getFlightById(flightId);

    if (flightFromSession) {
      // Add to cache
      flightCache.set(flightId, {
        flight: flightFromSession,
        timestamp: Date.now()
      });
      
      return NextResponse.json(flightFromSession);
    }
    
    // If we still don't have the flight, return the mock data
    // In a real app, we would fetch from the Amadeus API with the ID
    
    // Mock flight data structure (simplified)
    const mockFlight: FlightOffer = {
      id: flightId,
      itineraries: [
        {
          duration: 'PT3H20M',
          segments: [
            {
              departure: {
                iataCode: 'LHR',
                terminal: '5',
                at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              },
              arrival: {
                iataCode: 'MAD',
                terminal: '4',
                at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString()
              },
              carrierCode: 'BA',
              number: '462',
              aircraft: {
                code: '32N'
              },
              duration: 'PT3H20M'
            }
          ]
        }
      ],
      price: {
        currency: 'GBP',
        total: '198.00',
        base: '120.00',
        fees: [
          {
            amount: '38.00',
            type: 'SUPPLIER'
          },
          {
            amount: '40.00',
            type: 'TICKETING'
          }
        ]
      }
    };

    // Add to cache
    flightCache.set(flightId, {
      flight: mockFlight,
      timestamp: Date.now()
    });

    return NextResponse.json(mockFlight);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight details' },
      { status: 500 }
    );
  }
} 