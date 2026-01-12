// New, simplified Amadeus implementation
// This replaces the complex existing implementation with a clean, reliable approach

interface AmadeusToken {
  access_token: string;
  expires_at: number;
  token_type: string;
}

interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: string;
  children?: string;
  infants?: string;
  max?: number;
  travelClass?: 'ECONOMY' | 'BUSINESS';
}

export interface CleanFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: {
    duration: string;
    segments: {
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      duration: string;
    }[];
  }[];
  validatingAirlineCodes: string[];
}

// Token cache - simple in-memory storage
let tokenCache: AmadeusToken | null = null;

/**
 * Get a valid access token from Amadeus API
 */
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expires_at > Date.now() + 60000) { // 1 minute buffer
    return tokenCache.access_token;
  }

  // Validate environment variables
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Amadeus API credentials. Please check AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables.');
  }

  try {
    const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.access_token) {
      throw new Error('No access token received from Amadeus API');
    }

    // Cache the token
    tokenCache = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in * 1000),
      token_type: data.token_type || 'Bearer',
    };

    return data.access_token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Amadeus token: ${error.message}`);
    }
    throw new Error('Failed to get Amadeus token: Unknown error');
  }
}

/**
 * Make an authenticated request to Amadeus API
 */
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Search for flights using Amadeus API
 */
export async function searchFlights(params: FlightSearchParams): Promise<CleanFlightOffer[]> {
  try {
    // Validate required parameters
    if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
      throw new Error('Missing required parameters: origin, destination, and departure date are required');
    }

    // Build query parameters
    const queryParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults || '1',
      max: (params.max || 20).toString(),
    });

    // Add optional parameters
    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }
    
    if (params.children && params.children !== '0') {
      queryParams.append('children', params.children);
    }
    if (params.infants && params.infants !== '0') {
      queryParams.append('infants', params.infants);
    }
    if (params.travelClass) {
      queryParams.append('travelClass', params.travelClass);
    }

    const url = `https://api.amadeus.com/v2/shopping/flight-offers?${queryParams.toString()}`;

    const response = await makeAuthenticatedRequest(url);

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 400) {
        throw new Error(`Invalid search parameters: ${errorText}`);
      } else if (response.status === 401) {
        // Clear token cache and retry once
        tokenCache = null;
        const retryResponse = await makeAuthenticatedRequest(url);
        
        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse.text();
          throw new Error(`Authentication failed after retry: ${retryResponse.status} - ${retryErrorText}`);
        }
        
        const retryData = await retryResponse.json();
        return transformFlightData(retryData.data || []);
      } else {
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from Amadeus API');
    }

    return transformFlightData(data.data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred while searching flights');
  }
}

/**
 * Transform Amadeus API response to our clean format
 */
function transformFlightData(flights: any[]): CleanFlightOffer[] {
  return flights.map((flight, index) => {
    try {
      return {
        id: flight.id || `flight-${index}`,
        price: {
          total: flight.price?.total || '0',
          currency: flight.price?.currency || 'GBP',
        },
        itineraries: flight.itineraries?.map((itinerary: any) => ({
          duration: itinerary.duration || 'PT0H0M',
          segments: itinerary.segments?.map((segment: any) => ({
            departure: {
              iataCode: segment.departure?.iataCode || '',
              at: segment.departure?.at || '',
            },
            arrival: {
              iataCode: segment.arrival?.iataCode || '',
              at: segment.arrival?.at || '',
            },
            carrierCode: segment.carrierCode || '',
            number: segment.number || '',
            duration: segment.duration || 'PT0H0M',
          })) || [],
        })) || [],
        validatingAirlineCodes: flight.validatingAirlineCodes || [],
      };
    } catch (transformError) {
      console.error('Error transforming flight data:', transformError);
      // Return a minimal valid flight object
      return {
        id: `flight-${index}`,
        price: { total: '0', currency: 'GBP' },
        itineraries: [],
        validatingAirlineCodes: [],
      };
    }
  }).filter(flight => flight.itineraries.length > 0); // Remove invalid flights
}

/**
 * Get airport suggestions (basic implementation)
 */
export async function getAirportSuggestions(keyword: string): Promise<any[]> {
  try {
    if (!keyword || keyword.length < 2) {
      return [];
    }

    const token = await getAccessToken();
    const url = `https://api.amadeus.com/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(keyword)}&page[limit]=10`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Airport search failed:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting airport suggestions:', error);
    return [];
  }
}

export { searchFlights as searchFlightOffers }; 