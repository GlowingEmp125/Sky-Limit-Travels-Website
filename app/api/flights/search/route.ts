import { NextRequest, NextResponse } from 'next/server';
import { searchFlightOffers as searchAmadeusFlights } from '@/lib/amadeus-new';
import { searchFlights as searchTravelpayoutsFlights } from '@/lib/travelpayouts';
import { normalizeAmadeusResponse, normalizeTravelpayoutsResponse } from '@/lib/flight-search-normalizer';
import { airports } from '@/data/airports';

// Enable dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Helper function to convert special codes to actual airport codes
function resolveAirportCode(code: string): string {
  // Handle special "All airports" codes
  if (code.endsWith('C')) {
    // Country code - find the main airport for that country
    const countryPrefix = code.substring(0, code.length - 1);
    
    // Map of country prefixes to main airports
    const countryAirports: Record<string, string> = {
      'SPA': 'MAD', // Spain -> Madrid
      'ITA': 'FCO', // Italy -> Rome
      'FRA': 'CDG', // France -> Paris
      'GER': 'FRA', // Germany -> Frankfurt
      'GRE': 'ATH', // Greece -> Athens
      'POR': 'LIS', // Portugal -> Lisbon
      'CRO': 'ZAG', // Croatia -> Zagreb
      'TUR': 'IST', // Turkey -> Istanbul
      'NET': 'AMS', // Netherlands -> Amsterdam
      'UNI': 'LHR', // United Kingdom -> London Heathrow
      'BEL': 'BRU', // Belgium -> Brussels
      'AUS': 'VIE', // Austria -> Vienna
      'SWI': 'ZUR', // Switzerland -> Zurich
      'CZE': 'PRG', // Czech Republic -> Prague
      'HUN': 'BUD', // Hungary -> Budapest
      'POL': 'WAW', // Poland -> Warsaw
      'DEN': 'CPH', // Denmark -> Copenhagen
      'SWE': 'ARN', // Sweden -> Stockholm
      'NOR': 'OSL', // Norway -> Oslo
      'FIN': 'HEL', // Finland -> Helsinki
      'IRE': 'DUB', // Ireland -> Dublin
      'LUX': 'LUX', // Luxembourg -> Luxembourg
    };
    
    // Try direct mapping first
    if (countryAirports[countryPrefix]) {
      return countryAirports[countryPrefix];
    }
    
    // If no direct mapping, find airports by country name
    const countryName = getCountryName(countryPrefix);
    const countryAirportsList = airports.filter(airport => 
      airport.country.toLowerCase().includes(countryName.toLowerCase())
    );
    
    if (countryAirportsList.length > 0) {
      // Return the first (usually main) airport
      return countryAirportsList[0].iataCode;
    }
    
    // Fallback to the original code without 'C'
    return countryPrefix;
  }
  
  if (code.endsWith('A')) {
    // City code - find the main airport for that city
    const cityPrefix = code.substring(0, code.length - 1);
    
    // Map of city prefixes to main airports
    const cityAirports: Record<string, string> = {
      'LON': 'LHR', // London -> Heathrow
      'PAR': 'CDG', // Paris -> Charles de Gaulle
      'ROM': 'FCO', // Rome -> Fiumicino
      'MAD': 'MAD', // Madrid -> Madrid
      'BCN': 'BCN', // Barcelona -> Barcelona
      'MIL': 'MXP', // Milan -> Malpensa
      'IST': 'IST', // Istanbul -> Istanbul
    };
    
    // Try direct mapping first
    if (cityAirports[cityPrefix]) {
      return cityAirports[cityPrefix];
    }
    
    // If no direct mapping, find airports by city name
    const cityName = getCityName(cityPrefix);
    const cityAirportsList = airports.filter(airport => 
      airport.city.toLowerCase().includes(cityName.toLowerCase())
    );
    
    if (cityAirportsList.length > 0) {
      // Return the first (usually main) airport
      return cityAirportsList[0].iataCode;
    }
    
    // Fallback to the original code without 'A'
    return cityPrefix;
  }
  
  // Regular airport code - return as is
  return code;
}

// Helper function to get country name from prefix
function getCountryName(prefix: string): string {
  const countryNames: Record<string, string> = {
    'SPA': 'spain',
    'ITA': 'italy', 
    'FRA': 'france',
    'GER': 'germany',
    'GRE': 'greece',
    'POR': 'portugal',
    'CRO': 'croatia',
    'TUR': 'turkey',
    'NET': 'netherlands',
    'UNI': 'united kingdom',
    'BEL': 'belgium',
    'AUS': 'austria',
    'SWI': 'switzerland',
    'CZE': 'czech republic',
    'HUN': 'hungary',
    'POL': 'poland',
    'DEN': 'denmark',
    'SWE': 'sweden',
    'NOR': 'norway',
    'FIN': 'finland',
    'IRE': 'ireland',
    'LUX': 'luxembourg',
  };
  
  return countryNames[prefix] || prefix.toLowerCase();
}

// Helper function to get city name from prefix
function getCityName(prefix: string): string {
  const cityNames: Record<string, string> = {
    'LON': 'london',
    'PAR': 'paris',
    'ROM': 'rome',
    'MAD': 'madrid',
    'BCN': 'barcelona',
    'MIL': 'milan',
    'IST': 'istanbul',
  };
  
  return cityNames[prefix] || prefix.toLowerCase();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const originRaw = searchParams.get('origin');
    const destinationRaw = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = searchParams.get('adults') || '1';
    const children = searchParams.get('children') || '0';
    const infants = searchParams.get('infants') || '0';
    const tripClass = (searchParams.get('tripClass') || 'Y').toUpperCase() as 'Y' | 'C';

    // Validate required parameters
    if (!originRaw || !destinationRaw || !departureDate) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          message: 'Origin, destination, and departure date are required',
          details: {
            origin: originRaw ? '✓' : '✗ Missing',
            destination: destinationRaw ? '✓' : '✗ Missing',
            departureDate: departureDate ? '✓' : '✗ Missing',
          }
        },
        { status: 400 }
      );
    }

    // Resolve special airport codes to actual IATA codes
    const origin = resolveAirportCode(originRaw);
    const destination = resolveAirportCode(destinationRaw);

    console.log(`🔍 Flight search: ${originRaw}${originRaw !== origin ? ` (${origin})` : ''} → ${destinationRaw}${destinationRaw !== destination ? ` (${destination})` : ''} on ${departureDate}${returnDate ? ` returning ${returnDate}` : ''}`);

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departureDate)) {
      return NextResponse.json(
        { 
          error: 'Invalid date format',
          message: 'Departure date must be in YYYY-MM-DD format',
        },
        { status: 400 }
      );
    }

    if (returnDate && !dateRegex.test(returnDate)) {
      return NextResponse.json(
        { 
          error: 'Invalid date format',
          message: 'Return date must be in YYYY-MM-DD format',
        },
        { status: 400 }
      );
    }

    // Validate that departure date is in the future
    const today = new Date();
    const depDate = new Date(departureDate);
    if (depDate < today) {
      return NextResponse.json(
        { 
          error: 'Invalid departure date',
          message: 'Departure date must be in the future',
        },
        { status: 400 }
      );
    }

    // Validate return date is after departure date
    if (returnDate) {
      const retDate = new Date(returnDate);
      if (retDate <= depDate) {
        return NextResponse.json(
          { 
            error: 'Invalid return date',
            message: 'Return date must be after departure date',
          },
          { status: 400 }
        );
      }
    }

    // Prepare parameters for both APIs
    const amadeusParams = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      returnDate: returnDate || undefined,
      adults,
      children: children !== '0' ? children : undefined,
      infants: infants !== '0' ? infants : undefined,
      max: 20,
      travelClass: tripClass === 'Y' ? 'ECONOMY' : 'BUSINESS',
    };

    const travelpayoutsSegments = [{
        origin,
        destination,
        date: departureDate,
    }];
    if (returnDate) {
        travelpayoutsSegments.push({
            origin: destination,
            destination: origin,
            date: returnDate,
        });
    }

    const travelpayoutsParams = {
        segments: travelpayoutsSegments,
        adults: parseInt(adults),
        children: parseInt(children),
        infants: parseInt(infants),
        trip_class: tripClass,
    };
    
    const userIp = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    // Search flights from both providers in parallel
    const [amadeusResult, travelpayoutsResult] = await Promise.allSettled([
      searchAmadeusFlights(amadeusParams),
      searchTravelpayoutsFlights(travelpayoutsParams, userIp),
    ]);

    let combinedFlights: any[] = [];

    // Process Amadeus results (support array or { data: [...] })
    if (amadeusResult.status === 'fulfilled' && amadeusResult.value) {
      const amadeusData = Array.isArray(amadeusResult.value)
        ? amadeusResult.value
        : (amadeusResult.value as any).data ?? [];

      const normalized = normalizeAmadeusResponse(amadeusData);
      combinedFlights = combinedFlights.concat(normalized);
      console.log(`✅ Found and normalized ${normalized.length} flights from Amadeus`);
    } else if (amadeusResult.status === 'rejected') {
      console.error('Amadeus search failed:', amadeusResult.reason);
    }

    // Process Travelpayouts results
    if (travelpayoutsResult.status === 'fulfilled' && travelpayoutsResult.value) {
      const normalized = normalizeTravelpayoutsResponse(travelpayoutsResult.value);
      combinedFlights = combinedFlights.concat(normalized);
      console.log(`✅ Found and normalized ${normalized.length} flights from Travelpayouts`);
    } else if (travelpayoutsResult.status === 'rejected') {
      console.error('Travelpayouts search failed:', travelpayoutsResult.reason);
    }
    
    // Sort combined results by price
    combinedFlights.sort((a, b) => a.price - b.price);

    console.log(`✅ Found a total of ${combinedFlights.length} flights`);

    return NextResponse.json({
      success: true,
      data: combinedFlights,
      searchParams: {
        origin: originRaw,
        destination: destinationRaw,
        resolvedOrigin: origin,
        resolvedDestination: destination,
        departureDate,
        returnDate,
        adults,
        children,
        infants,
        tripClass,
      },
      count: combinedFlights.length,
    });

  } catch (error) {
    console.error('❌ Flight search error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Return appropriate error response based on error type
    if (errorMessage.includes('Missing Amadeus API credentials')) {
      return NextResponse.json(
        { 
          error: 'Service configuration error',
          message: 'Flight search service is not properly configured',
        },
        { status: 503 }
      );
    }

    if (errorMessage.includes('Invalid search parameters')) {
      return NextResponse.json(
        { 
          error: 'Invalid search parameters',
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    if (errorMessage.includes('Authentication failed')) {
      return NextResponse.json(
        { 
          error: 'Service authentication error',
          message: 'Unable to authenticate with flight search service',
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Flight search failed',
        message: 'An error occurred while searching for flights. Please try again.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

// Handle POST requests (for form submissions)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert POST body to query parameters and call GET handler
    const searchParams = new URLSearchParams({
      origin: body.origin || '',
      destination: body.destination || '',
      departureDate: body.departureDate || '',
      ...(body.returnDate && { returnDate: body.returnDate }),
      adults: body.adults || '1',
      children: body.children || '0',
      infants: body.infants || '0',
      tripClass: body.tripClass || 'Y',
    });

    const url = new URL(request.url);
    url.search = searchParams.toString();

    // Create a new request with query parameters
    const newRequest = new NextRequest(url.toString(), {
      method: 'GET',
      headers: request.headers,
    });

    return GET(newRequest);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Invalid request body',
        message: 'Request body must be valid JSON',
      },
      { status: 400 }
    );
  }
} 