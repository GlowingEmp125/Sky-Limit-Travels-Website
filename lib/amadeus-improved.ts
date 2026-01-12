import Amadeus from 'amadeus';

// Proper SDK initialisation - let it handle authentication automatically
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID!,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET!,
  hostname: 'production'
});

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  currencyCode?: string;
  max?: number;
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: any[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: any[];
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: any[];
}

export interface FlightSearchResponse {
  data: FlightOffer[];
  meta?: {
    count: number;
    links?: {
      self: string;
    };
  };
  dictionaries?: {
    locations: Record<string, any>;
    aircraft: Record<string, any>;
    currencies: Record<string, any>;
    carriers: Record<string, any>;
  };
}

/**
 * Search for flight offers using the official Amadeus SDK
 * This is much more reliable than manual API calls
 */
export async function searchFlightOffers(params: FlightSearchParams): Promise<FlightSearchResponse> {
  try {
    console.log('🔍 Searching flights with params:', params);
    
    // Use the official SDK method - it handles authentication, retries, and error handling
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults,
      children: params.children || 0,
      infants: params.infants || 0,
      travelClass: params.travelClass || 'ECONOMY',
      currencyCode: params.currencyCode || 'GBP',
      max: params.max || 50
    });

    console.log('✅ Flight search successful:', {
      resultCount: response.data?.length || 0,
      statusCode: response.statusCode
    });

    return {
      data: response.data || [],
      meta: response.meta,
      dictionaries: response.dictionaries
    };

  } catch (error: any) {
    console.error('❌ Flight search failed:', {
      error: error.message,
      code: error.code,
      description: error.description
    });

    // Return empty results instead of throwing - let the API route handle fallbacks
    return {
      data: [],
      meta: { count: 0 }
    };
  }
}

/**
 * Get airport and city information
 * Much simpler than the complex custom logic
 */
export async function getLocationInfo(keyword: string, subType: string[] = ['AIRPORT', 'CITY']) {
  try {
    const response = await amadeus.referenceData.locations.get({
      keyword,
      subType
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Location search failed:', error.message);
    return [];
  }
}

/**
 * Get popular flight destinations
 * Simplified version without complex caching
 */
export async function getPopularDestinations(origin: string) {
  try {
    const response = await amadeus.travel.analytics.airTraffic.traveled.get({
      originCityCode: origin,
      period: '2024-01'
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Popular destinations search failed:', error.message);
    return [];
  }
}

/**
 * Simple retry wrapper for any Amadeus API call
 * The SDK already has some retry logic, but this adds an extra layer
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (attempt <= maxRetries) {
        console.log(`⏳ Retry attempt ${attempt}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw lastError;
}

export default amadeus; 