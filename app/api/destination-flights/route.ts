import { NextResponse } from 'next/server';
import Amadeus from 'amadeus';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Initialize Amadeus client with production environment
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

// Cache settings
const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'destination-flights');
// Get cache duration from environment variable or use default 3 days
const CACHE_DURATION_DAYS = parseInt(process.env.CACHE_DURATION_DAYS || '3', 10);
const CACHE_DURATION = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds

// Ensure cache directory exists
function ensureCacheDirectory() {
  if (!fs.existsSync(CACHE_DIR)) {
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating destination flights cache directory:', error);
    }
  }
}

// Create a cache key from search parameters
function createCacheKey(destination: string, origin: string): string {
  return `${origin}-${destination}`;
}

// Check if cache exists and is valid
function getFromCache(cacheKey: string): any | null {
  try {
    ensureCacheDirectory();
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
    
    if (fs.existsSync(cacheFile)) {
      const cacheContent = fs.readFileSync(cacheFile, 'utf-8');
      const cache = JSON.parse(cacheContent);
      
      // Check if cache is still valid
      const now = Date.now();
      if (now - cache.timestamp < CACHE_DURATION) {
        console.log(`Using cached destination flights for ${cacheKey} from`, new Date(cache.timestamp));
        return cache.data;
      }
      console.log(`Cache for ${cacheKey} expired, fetching fresh data`);
    }
  } catch (error) {
    console.error(`Error reading cache for ${cacheKey}:`, error);
  }
  return null;
}

// Write data to cache
function writeToCache(cacheKey: string, data: any) {
  try {
    ensureCacheDirectory();
    const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
    
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
    console.log(`Destination flights for ${cacheKey} cached at`, new Date());
  } catch (error) {
    console.error(`Error writing cache for ${cacheKey}:`, error);
  }
}

// Helper function for getting future dates
function getFutureDateString(daysAhead = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

export async function GET(request: Request) {
  try {
    // Get destination from URL
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination') || '';
    const departureAirport = searchParams.get('origin') || 'LHR';

    console.log('Destination flight search parameters:', {
      destination, departureAirport
    });
    
    // If no destination specified, return error
    if (!destination) {
      return NextResponse.json(
        { error: 'Missing destination parameter' },
        { status: 400 }
      );
    }
    
    // Create a cache key and check cache first
    const cacheKey = createCacheKey(destination, departureAirport);
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Ensure we have a valid 3-letter IATA code
    // Use JFK for New York if the destination matches
    const destinationCode = destination.toUpperCase() === 'NYC' ? 'JFK' : destination.toUpperCase();
    
    if (destinationCode.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid destination code. Please use a 3-letter IATA airport code.' },
        { status: 400 }
      );
    }
    
    try {
      // Make a minimal API call to keep costs down
      // Use the first date as today + 1 month
      const departureDate = getFutureDateString(30);
      const returnDate = getFutureDateString(37);
      
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: departureAirport,
        destinationLocationCode: destinationCode,
        departureDate: departureDate,
        returnDate: returnDate,
        adults: '1',
        max: 5 // Limit to 5 results to reduce API usage
      });
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Use the real API response data
        writeToCache(cacheKey, response.data);
        return NextResponse.json(response.data);
      } else {
        console.log('No destination flights found');
        return NextResponse.json(
          { error: `No flights found from ${departureAirport} to ${destinationCode}` },
          { status: 404 }
        );
      }
    } catch (apiError) {
      console.error('Amadeus API error:', apiError);
      
      // Provide fallback data instead of error response
      try {
        // Import fallback function
        const { generateFlightSearchFallback } = await import('@/lib/fallback-data');
        
        // Define dates for fallback (in case they weren't defined above)
        const fallbackDepartureDate = getFutureDateString(30);
        const fallbackReturnDate = getFutureDateString(37);
        
        // Generate fallback flight data
        const fallbackFlights = generateFlightSearchFallback(
          departureAirport,
          destinationCode,
          fallbackDepartureDate,
          fallbackReturnDate
        );
        
        console.log(`Generated ${fallbackFlights.length} fallback flights for ${departureAirport} → ${destinationCode}`);
        
        // Cache the fallback data
        writeToCache(cacheKey, fallbackFlights);
        
        return NextResponse.json(fallbackFlights);
      } catch (fallbackError) {
        console.error('Fallback data generation failed:', fallbackError);
        return NextResponse.json(
          { error: 'Unable to fetch flights', details: apiError instanceof Error ? apiError.message : String(apiError) },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error in destination flights route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 