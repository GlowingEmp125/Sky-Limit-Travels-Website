import { NextRequest, NextResponse } from 'next/server';
import { searchFlightOffers, withRetry, FlightSearchParams } from '@/lib/amadeus-improved';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Rate limiting setup - make Redis optional
let ratelimit: Ratelimit | null = null;

// Only initialize Redis if environment variables are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  });
}

// Fallback data (keep your existing fallback data)
const fallbackFlights = [
  {
    id: "fallback-1",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2025-12-31",
    numberOfBookableSeats: 9,
    itineraries: [
      {
        duration: "PT3H15M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "2",
              at: "2025-05-29T08:30:00"
            },
            arrival: {
              iataCode: "DBV",
              terminal: "1",
              at: "2025-05-29T13:45:00"
            },
            carrierCode: "BA",
            number: "2692",
            aircraft: {
              code: "320"
            },
            operating: {
              carrierCode: "BA"
            },
            duration: "PT3H15M",
            id: "1",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      },
      {
        duration: "PT3H20M",
        segments: [
          {
            departure: {
              iataCode: "DBV",
              terminal: "1",
              at: "2025-06-05T14:30:00"
            },
            arrival: {
              iataCode: "LHR",
              terminal: "2",
              at: "2025-06-05T16:50:00"
            },
            carrierCode: "BA",
            number: "2693",
            aircraft: {
              code: "320"
            },
            operating: {
              carrierCode: "BA"
            },
            duration: "PT3H20M",
            id: "2",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      }
    ],
    price: {
      currency: "GBP",
      total: "285.00",
      base: "220.00",
      fees: [
        {
          amount: "65.00",
          type: "SUPPLIER"
        }
      ],
      grandTotal: "285.00"
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: true
    },
    validatingAirlineCodes: ["BA"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "GBP",
          total: "285.00",
          base: "220.00"
        }
      }
    ]
  },
  {
    id: "fallback-2",
    source: "GDS",
    instantTicketingRequired: false,
    nonHomogeneous: false,
    oneWay: false,
    lastTicketingDate: "2025-12-31",
    numberOfBookableSeats: 5,
    itineraries: [
      {
        duration: "PT5H45M",
        segments: [
          {
            departure: {
              iataCode: "LHR",
              terminal: "5",
              at: "2025-05-29T11:20:00"
            },
            arrival: {
              iataCode: "ZAG",
              terminal: "1",
              at: "2025-05-29T15:05:00"
            },
            carrierCode: "BA",
            number: "848",
            aircraft: {
              code: "320"
            },
            operating: {
              carrierCode: "BA"
            },
            duration: "PT2H45M",
            id: "3",
            numberOfStops: 0,
            blacklistedInEU: false
          },
          {
            departure: {
              iataCode: "ZAG",
              terminal: "1",
              at: "2025-05-29T16:30:00"
            },
            arrival: {
              iataCode: "DBV",
              terminal: "1",
              at: "2025-05-29T17:35:00"
            },
            carrierCode: "OU",
            number: "664",
            aircraft: {
              code: "DH4"
            },
            operating: {
              carrierCode: "OU"
            },
            duration: "PT1H05M",
            id: "4",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      },
      {
        duration: "PT5H30M",
        segments: [
          {
            departure: {
              iataCode: "DBV",
              terminal: "1",
              at: "2025-06-05T09:15:00"
            },
            arrival: {
              iataCode: "ZAG",
              terminal: "1",
              at: "2025-06-05T10:20:00"
            },
            carrierCode: "OU",
            number: "661",
            aircraft: {
              code: "DH4"
            },
            operating: {
              carrierCode: "OU"
            },
            duration: "PT1H05M",
            id: "5",
            numberOfStops: 0,
            blacklistedInEU: false
          },
          {
            departure: {
              iataCode: "ZAG",
              terminal: "1",
              at: "2025-06-05T12:45:00"
            },
            arrival: {
              iataCode: "LHR",
              terminal: "5",
              at: "2025-06-05T14:45:00"
            },
            carrierCode: "BA",
            number: "849",
            aircraft: {
              code: "320"
            },
            operating: {
              carrierCode: "BA"
            },
            duration: "PT3H00M",
            id: "6",
            numberOfStops: 0,
            blacklistedInEU: false
          }
        ]
      }
    ],
    price: {
      currency: "GBP",
      total: "195.00",
      base: "145.00",
      fees: [
        {
          amount: "50.00",
          type: "SUPPLIER"
        }
      ],
      grandTotal: "195.00"
    },
    pricingOptions: {
      fareType: ["PUBLISHED"],
      includedCheckedBagsOnly: false
    },
    validatingAirlineCodes: ["BA", "OU"],
    travelerPricings: [
      {
        travelerId: "1",
        fareOption: "STANDARD",
        travelerType: "ADULT",
        price: {
          currency: "GBP",
          total: "195.00",
          base: "145.00"
        }
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`🚀 [${requestId}] Flight search request started`);

  try {
    // Rate limiting check - only if Redis is available
    const ip = request.ip ?? '127.0.0.1';
    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      
      if (!success) {
        console.log(`🚫 [${requestId}] Rate limit exceeded for IP: ${ip}`);
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    } else {
      console.log(`⚠️ [${requestId}] Redis not configured, skipping rate limiting`);
    }

    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = parseInt(searchParams.get('adults') || '1');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    const travelClass = searchParams.get('travelClass') as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' || 'ECONOMY';

    // Validate required parameters
    if (!origin || !destination || !departureDate) {
      console.log(`❌ [${requestId}] Missing required parameters`);
      return NextResponse.json(
        { error: 'Missing required parameters: origin, destination, and departureDate are required.' },
        { status: 400 }
      );
    }

    console.log(`📋 [${requestId}] Search parameters:`, {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass
    });

    // Prepare search parameters
    const searchRequest: FlightSearchParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children,
      infants,
      travelClass,
      currencyCode: 'GBP',
      max: 50
    };

    // Add timeout wrapper for API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API_TIMEOUT')), 8000); // 8 second timeout
    });

    try {
      // Race between API call and timeout
      const flightData = await Promise.race([
        withRetry(
          () => searchFlightOffers(searchRequest),
          2, // Max 2 retries
          1000 // Start with 1 second delay
        ),
        timeoutPromise
      ]);

      // Check if we got results
      if (!flightData.data || flightData.data.length === 0) {
        console.log(`⚠️ [${requestId}] No flights found, using fallback data`);
        return NextResponse.json({
          data: fallbackFlights,
          meta: { count: fallbackFlights.length },
          source: 'fallback',
          requestId
        });
      }

      console.log(`✅ [${requestId}] Flight search successful:`, {
        resultCount: flightData.data.length,
        source: 'amadeus'
      });

      return NextResponse.json({
        ...flightData,
        source: 'amadeus',
        requestId
      });
    } catch (timeoutError) {
      // If timeout, immediately return fallback data
      console.log(`⏰ [${requestId}] API timeout, using fallback data`);
      return NextResponse.json({
        data: fallbackFlights,
        meta: { count: fallbackFlights.length },
        source: 'fallback-timeout',
        requestId
      });
    }

  } catch (error: any) {
    console.error(`❌ [${requestId}] Flight search error:`, {
      message: error.message,
      stack: error.stack
    });

    // Return fallback data on any error
    return NextResponse.json({
      data: fallbackFlights,
      meta: { count: fallbackFlights.length },
      source: 'fallback',
      error: 'Flight search temporarily unavailable',
      requestId
    });
  }
} 