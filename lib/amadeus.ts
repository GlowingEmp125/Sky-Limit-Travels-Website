import Amadeus from 'amadeus';
import fs from 'fs';
import path from 'path';

// Token management system
interface TokenCache {
  access_token: string;
  expires_at: number; // Timestamp when token expires
  token_type: string;
}

let tokenCache: TokenCache | null = null;
const TOKEN_BUFFER_TIME = 60 * 1000; // Refresh token 1 minute before expiry

// Function to get a valid access token (with automatic refresh)
async function getValidAccessToken(): Promise<string> {
  console.log('🔐 Token check: Checking token validity...');
  
  // Check if we have a cached token that's still valid
  if (tokenCache && tokenCache.expires_at > Date.now() + TOKEN_BUFFER_TIME) {
    console.log('✅ Using cached access token (expires in', Math.floor((tokenCache.expires_at - Date.now()) / 1000), 'seconds)');
    return tokenCache.access_token;
  }

  console.log('🔄 Fetching new Amadeus access token...');
  
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error('Missing Amadeus API credentials: AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET are required');
  }

  try {
    const tokenResponse = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': process.env.AMADEUS_CLIENT_ID,
        'client_secret': process.env.AMADEUS_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('❌ Token request failed:', tokenResponse.status, errorData);
      throw new Error(`Failed to authenticate with Amadeus API: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('❌ No access token in response:', tokenData);
      throw new Error('Failed to authenticate with Amadeus API: No access token received');
    }

    // Cache the token with expiry time
    tokenCache = {
      access_token: tokenData.access_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000), // Convert seconds to milliseconds
      token_type: tokenData.token_type || 'Bearer'
    };

    console.log(`✅ New access token cached, expires in ${tokenData.expires_in} seconds`);
    return tokenCache.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    throw new Error(`Failed to authenticate with Amadeus API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to make authenticated API calls with automatic token refresh
async function makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
  console.log('🌐 Making authenticated request to:', url.split('?')[0]);
  
  const token = await getValidAccessToken();
  
  const authenticatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await fetch(url, authenticatedOptions);
  
  console.log('📡 API Response status:', response.status, response.statusText);
  
  // If we get a 401 (unauthorized), the token might have expired
  // Try once more with a fresh token
  if (response.status === 401) {
    console.log('🔄 Received 401, refreshing token and retrying...');
    
    // Force token refresh by clearing cache
    tokenCache = null;
    const newToken = await getValidAccessToken();
    
    const retryOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      }
    };
    
    const retryResponse = await fetch(url, retryOptions);
    console.log('🔁 Retry response status:', retryResponse.status, retryResponse.statusText);
    return retryResponse;
  }
  
  return response;
}

// Initialize Amadeus client with production environment
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
    grandTotal?: string;
    base?: string;
    fees?: any[];
  };
  cityName?: string;
  itineraries: {
    segments: {
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      duration: string;
    }[];
  }[];
}

// Cache durations in milliseconds
const CACHE_DURATIONS = {
  POPULAR_FLIGHTS: 60 * 60 * 1000,        // 1 hour for popular flights
  FLIGHT_SEARCH: 6 * 60 * 60 * 1000,      // 6 hours for specific searches
  COUNTRY_FLIGHTS: 12 * 60 * 60 * 1000,   // 12 hours for country-specific flights
  DEFAULT: 24 * 60 * 60 * 1000            // 24 hours default fallback
};

// Cache management
const CACHE_FILE = path.join(process.cwd(), 'public', 'cache', 'flight-cache.json');
const COUNTRY_CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'countries');
// Get cache duration from environment variable or use default 1 day
const CACHE_DURATION_DAYS = parseInt(process.env.CACHE_DURATION_DAYS || '1', 10);
const CACHE_DURATION_MS = CACHE_DURATION_DAYS * 24 * 60 * 60 * 1000; // Convert days to milliseconds

// Maximum results to return from API to reduce costs
const MAX_FLIGHT_RESULTS = 10; // Increased from 5 to get more options

// Ensure cache directory exists
function ensureCacheDirectory() {
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const countryCacheDir = path.join(process.cwd(), 'public', 'cache', 'countries');
  
  if (!fs.existsSync(cacheDir)) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating cache directory:', error);
    }
  }
  
  if (!fs.existsSync(countryCacheDir)) {
    try {
      fs.mkdirSync(countryCacheDir, { recursive: true });
    } catch (error) {
      console.error('Error creating country cache directory:', error);
    }
  }
}

// Read from cache
function readCache() {
  ensureCacheDirectory();
  
  if (!fs.existsSync(CACHE_FILE)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf8');
    const cache = JSON.parse(data);
    
    // Check if cache is still valid
    if (cache.timestamp && (Date.now() - cache.timestamp < CACHE_DURATION_MS)) {
      return cache;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading flight cache:', error);
    return null;
  }
}

// Write to cache
function writeCache(data: any) {
  ensureCacheDirectory();
  
  try {
    const cache = {
      timestamp: Date.now(),
      data: data
    };
    
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    console.log('Flight cache updated');
  } catch (error) {
    console.error('Error writing flight cache:', error);
  }
}

// Read country-specific cache
function readCountryCache(countryCode: string) {
  ensureCacheDirectory();
  
  const cacheFile = path.join(COUNTRY_CACHE_DIR, `${countryCode.toLowerCase()}.json`);
  
  if (!fs.existsSync(cacheFile)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(cacheFile, 'utf8');
    const cache = JSON.parse(data);
    
    // Check if cache is still valid
    if (cache.timestamp && (Date.now() - cache.timestamp < CACHE_DURATION_MS)) {
      return cache;
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading country cache for ${countryCode}:`, error);
    return null;
  }
}

// Write country-specific cache
function writeCountryCache(countryCode: string, data: any) {
  ensureCacheDirectory();
  
  try {
    const cache = {
      timestamp: Date.now(),
      data: data
    };
    
    const cacheFile = path.join(COUNTRY_CACHE_DIR, `${countryCode.toLowerCase()}.json`);
    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    console.log(`Country cache updated for ${countryCode}`);
  } catch (error) {
    console.error(`Error writing country cache for ${countryCode}:`, error);
  }
}

// Helper function for getting future dates
function getFutureDateString(daysAhead = 30) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

// Create mock flight data for a country as fallback
function createMockFlightsForCountry(countryCode: string): FlightOffer[] {
  // Format dates for mock data
  const departureDate = getFutureDateString();
  const returnDate = getFutureDateString(7);
  
  // Map country codes to display names
  const countryNames: {[key: string]: string} = {
    'FR': 'France',
    'IT': 'Italy',
    'ES': 'Spain',
    'GR': 'Greece',
    'DE': 'Germany',
    'US': 'United States',
    'GB': 'United Kingdom',
    'PT': 'Portugal',
    'HR': 'Croatia',
    'TR': 'Turkey',
    'NL': 'Netherlands',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'CA': 'Canada',
    'AU': 'Australia',
    'JP': 'Japan',
    'SG': 'Singapore',
    'AE': 'United Arab Emirates',
  };
  
  // Map country codes to multiple popular airports
  const countryAirports: {[key: string]: {code: string, city: string, terminal: string}[]} = {
    'FR': [
      {code: 'CDG', city: 'Paris', terminal: '2E'},
      {code: 'ORY', city: 'Paris', terminal: '1'},
      {code: 'NCE', city: 'Nice', terminal: '2'},
      {code: 'LYS', city: 'Lyon', terminal: '1A'},
      {code: 'MRS', city: 'Marseille', terminal: '1'},
      {code: 'TLS', city: 'Toulouse', terminal: '1'},
    ],
    'IT': [
      {code: 'FCO', city: 'Rome', terminal: '3'},
      {code: 'MXP', city: 'Milan', terminal: '1'},
      {code: 'VCE', city: 'Venice', terminal: '1'},
      {code: 'NAP', city: 'Naples', terminal: '1'},
      {code: 'CTA', city: 'Catania', terminal: 'A'},
      {code: 'FLR', city: 'Florence', terminal: '1'},
    ],
    'ES': [
      {code: 'MAD', city: 'Madrid', terminal: '4'},
      {code: 'BCN', city: 'Barcelona', terminal: '1'},
      {code: 'AGP', city: 'Malaga', terminal: '3'},
      {code: 'PMI', city: 'Palma', terminal: 'C'},
      {code: 'LPA', city: 'Gran Canaria', terminal: 'A'},
      {code: 'TFS', city: 'Tenerife', terminal: 'S'},
    ],
    'GR': [
      {code: 'ATH', city: 'Athens', terminal: 'B'},
      {code: 'JTR', city: 'Santorini', terminal: '1'},
      {code: 'HER', city: 'Heraklion', terminal: '1'},
      {code: 'RHO', city: 'Rhodes', terminal: '1'},
      {code: 'CFU', city: 'Corfu', terminal: '1'},
      {code: 'JMK', city: 'Mykonos', terminal: '1'},
    ],
    'PT': [
      {code: 'LIS', city: 'Lisbon', terminal: '1'},
      {code: 'OPO', city: 'Porto', terminal: '1'},
      {code: 'FAO', city: 'Faro', terminal: '1'},
      {code: 'FNC', city: 'Funchal', terminal: '1'},
      {code: 'PDL', city: 'Ponta Delgada', terminal: '1'},
    ],
    'HR': [
      {code: 'ZAG', city: 'Zagreb', terminal: '1'},
      {code: 'DBV', city: 'Dubrovnik', terminal: 'B'},
      {code: 'SPU', city: 'Split', terminal: '1'},
      {code: 'ZAD', city: 'Zadar', terminal: '1'},
      {code: 'PUY', city: 'Pula', terminal: '1'},
    ],
    'TR': [
      {code: 'IST', city: 'Istanbul', terminal: 'I'},
      {code: 'AYT', city: 'Antalya', terminal: '1'},
      {code: 'ADB', city: 'Izmir', terminal: 'I'},
      {code: 'BJV', city: 'Bodrum', terminal: 'I'},
      {code: 'DLM', city: 'Dalaman', terminal: 'I'},
    ],
    'DE': [
      {code: 'FRA', city: 'Frankfurt', terminal: '1'},
      {code: 'MUC', city: 'Munich', terminal: '2'},
      {code: 'BER', city: 'Berlin', terminal: '1'},
      {code: 'DUS', city: 'Dusseldorf', terminal: 'A'},
      {code: 'HAM', city: 'Hamburg', terminal: '1'},
    ],
    'NL': [
      {code: 'AMS', city: 'Amsterdam', terminal: '2'},
      {code: 'RTM', city: 'Rotterdam', terminal: '1'},
      {code: 'EIN', city: 'Eindhoven', terminal: '1'},
    ],
    // Default for any other country
    'XX': [
      {code: 'XXX', city: 'Unknown', terminal: '1'}
    ]
  };
  
  // UK airports (origins)
  const ukAirports = [
    {code: 'LHR', city: 'London', terminal: '5'},
    {code: 'LGW', city: 'London', terminal: 'S'},
    {code: 'STN', city: 'London', terminal: '1'},
    {code: 'MAN', city: 'Manchester', terminal: '1'},
    {code: 'BHX', city: 'Birmingham', terminal: '1'},
    {code: 'EDI', city: 'Edinburgh', terminal: '1'},
    {code: 'GLA', city: 'Glasgow', terminal: '1'},
  ];
  
  // Airlines that typically fly to these destinations
  const airlines = [
    {code: 'BA', name: 'British Airways'},
    {code: 'LH', name: 'Lufthansa'},
    {code: 'AF', name: 'Air France'},
    {code: 'U2', name: 'easyJet'},
    {code: 'FR', name: 'Ryanair'},
    {code: 'IB', name: 'Iberia'},
    {code: 'AZ', name: 'Alitalia'},
    {code: 'TK', name: 'Turkish Airlines'},
    {code: 'LX', name: 'Swiss'},
    {code: 'EY', name: 'Etihad Airways'},
  ];
  
  const countryName = countryNames[countryCode.toUpperCase()] || countryCode;
  
  // Get airports for this country, defaulting to a general list if not found
  const destinationAirports = countryAirports[countryCode.toUpperCase()] || countryAirports['XX'];
  
  // Create mock flight offers for this country
  const mockFlights: FlightOffer[] = [];
  
  // The number of mock flights to generate
  const numberOfFlights = 10;
  
  // Create flights to different cities in the country
  for (let i = 0; i < numberOfFlights; i++) {
    // Select an airport from the country (cycling through all available)
    const destinationAirport = destinationAirports[i % destinationAirports.length];
    
    // Select a UK departure airport (occasionally vary for realism)
    const ukAirport = ukAirports[i % 3];
    
    // Vary departure dates slightly
    const depDateVariation = new Date(departureDate);
    depDateVariation.setDate(depDateVariation.getDate() + (i % 14)); // Vary within 2 weeks
    
    // Vary return dates for a realistic mix of trip durations
    const retDateVariation = new Date(depDateVariation);
    retDateVariation.setDate(retDateVariation.getDate() + 7 + (i % 7)); // 1-2 week trips
    
    // Select an airline (vary by route)
    const airline = airlines[(i + (countryCode.charCodeAt(0) % 5)) % airlines.length];
    
    // Generate realistic flight number
    const flightNumber = `${100 + i + (countryCode.charCodeAt(0) % 900)}`;
    
    // Calculate price based on destination and date variations
    // More expensive for peak dates, more exotic destinations
    const basePriceMultiplier = Math.min(2, 0.8 + (i % 5) * 0.3); 
    
    // Different countries have different base price ranges
    let basePrice = 150;
    if (['FR', 'NL', 'BE'].includes(countryCode)) basePrice = 120; // Closer to UK
    if (['IT', 'ES', 'PT', 'DE'].includes(countryCode)) basePrice = 150;
    if (['GR', 'HR', 'TR'].includes(countryCode)) basePrice = 180; // Further from UK
    if (['US', 'CA', 'JP', 'AU'].includes(countryCode)) basePrice = 500; // Long haul
    
    const finalPrice = (basePrice * basePriceMultiplier) + (Math.random() * 50);
    
    // Different flight durations based on distance
    let flightDuration = 'PT2H30M'; // Default for Europe
    if (['FR', 'BE', 'NL'].includes(countryCode)) {
      flightDuration = 'PT1H45M'; // Shorter flights
    } else if (['GR', 'TR'].includes(countryCode)) {
      flightDuration = 'PT4H00M'; // Longer European flights
    } else if (['US', 'CA', 'JP', 'AU'].includes(countryCode)) {
      flightDuration = 'PT8H30M'; // Long haul
    }
    
    // Generate departure and return dates with varied times
    const depTime = new Date(depDateVariation);
    depTime.setHours(6 + (i % 12), 30 + (i % 30), 0); // Vary departure times
    
    const retTime = new Date(retDateVariation);
    retTime.setHours(10 + (i % 10), 45 + (i % 15), 0); // Vary return times
    
    // Create the flight offer
    mockFlights.push({
      id: `mock-${countryCode}-${i}-${destinationAirport.code}`,
      price: {
        total: finalPrice.toFixed(2),
        currency: 'EUR'
      },
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: ukAirport.code,
                terminal: ukAirport.terminal,
                at: depTime.toISOString()
              },
              arrival: {
                iataCode: destinationAirport.code,
                terminal: destinationAirport.terminal,
                at: new Date(depTime.getTime() + (parseInt(flightDuration.replace(/PT(\d+)H.*/, '$1')) * 60 * 60 * 1000)).toISOString()
              },
              carrierCode: airline.code,
              number: flightNumber,
              duration: flightDuration
            }
          ]
        },
        {
          segments: [
            {
              departure: {
                iataCode: destinationAirport.code,
                terminal: destinationAirport.terminal,
                at: retTime.toISOString()
              },
              arrival: {
                iataCode: ukAirport.code,
                terminal: ukAirport.terminal,
                at: new Date(retTime.getTime() + (parseInt(flightDuration.replace(/PT(\d+)H.*/, '$1')) * 60 * 60 * 1000)).toISOString()
              },
              carrierCode: airline.code,
              number: (parseInt(flightNumber) + 10).toString(),
              duration: flightDuration
            }
          ]
        }
      ]
    });
  }
  
  // Sort by price for better user experience
  mockFlights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
  
  return mockFlights;
}

export async function getPopularFlights() {
  // Check if we have valid cached data
  const cachedData = readCache();
  if (cachedData && cachedData.data) {
    // Use 1-hour cache for popular flights
    if (Date.now() - cachedData.timestamp < CACHE_DURATIONS.POPULAR_FLIGHTS) {
      console.log('Using cached popular flights data');
      return cachedData.data;
    }
  }
  
  try {
    console.log('Starting flight search with Amadeus API...');
    
    // Define multiple departure dates to get a more comprehensive view of prices
    // This provides better options for users while still being efficient with API calls
    const departureOffsets = [14, 30, 60]; // 2 weeks, 1 month, 2 months ahead
    const stayDuration = 7; // 1 week stay
    
    const today = new Date();
    
    // Get formatted dates for different departure times
    const departureDates = departureOffsets.map(offset => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    });
    
    // Expanded list of popular destinations with city names
    const popularDestinations = [
      { code: 'CDG', city: 'Paris' },      // Paris
      { code: 'BCN', city: 'Barcelona' },  // Barcelona
      { code: 'FCO', city: 'Rome' },       // Rome
      { code: 'AMS', city: 'Amsterdam' },  // Amsterdam
      { code: 'LIS', city: 'Lisbon' },     // Lisbon
      { code: 'ATH', city: 'Athens' },     // Athens
      { code: 'MAD', city: 'Madrid' },     // Madrid
      { code: 'DUB', city: 'Dublin' },     // Dublin
      { code: 'VIE', city: 'Vienna' },     // Vienna
      { code: 'PRG', city: 'Prague' },     // Prague
      { code: 'BUD', city: 'Budapest' },   // Budapest
      { code: 'CPH', city: 'Copenhagen' }  // Copenhagen
    ];
    
    // We'll query each destination with the first departure date
    // This gives us broad coverage of destinations while managing API usage
    const destinationPromises = popularDestinations.map(async (destination) => {
      try {
        // For each destination, use the first departure date
        const departureDate = departureDates[0];
        const returnDate = new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + stayDuration))
          .toISOString().split('T')[0];
        
        const response = await makeAuthenticatedRequest(
          `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LON&destinationLocationCode=${destination.code}&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&max=2&currencyCode=EUR`
        );
        
        const data = await response.json();
        
        if (!response.ok || !data.data || !data.data.length) {
          console.log(`No results for ${destination.city} (${destination.code})`);
          return null;
        }
        
        // Add the city name for display purposes
        data.data[0].cityName = destination.city;
        
        console.log(`Found flights to ${destination.city} for €${data.data[0].price.total}`);
        return data.data[0]; // Return the first flight offer
      } catch (err) {
        console.error(`Error fetching flight to ${destination.code}:`, err);
        return null;
      }
    });
    
    // For a few select destinations, get multiple departure dates to show price variety
    // We'll do this for only 3 top destinations to balance API usage
    const topDestinations = popularDestinations.slice(0, 3);
    
    const multiDatePromises = topDestinations.flatMap(destination => 
      departureDates.slice(1).map(async (departureDate) => {
        try {
          const returnDate = new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + stayDuration))
            .toISOString().split('T')[0];
          
          const response = await makeAuthenticatedRequest(
            `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LON&destinationLocationCode=${destination.code}&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&max=1&currencyCode=EUR`
          );
          
          const data = await response.json();
          
          if (!response.ok || !data.data || !data.data.length) {
            return null;
          }
          
          // Add the city name and mark as alternative date
          data.data[0].cityName = destination.city;
          data.data[0].isAlternativeDate = true;
          
          return data.data[0];
        } catch (err) {
          return null;
        }
      })
    );
    
    // Wait for all requests to complete
    const [mainResults, altDateResults] = await Promise.all([
      Promise.all(destinationPromises),
      Promise.all(multiDatePromises)
    ]);
    
    // Combine and filter out null results
    let validResults = [...mainResults, ...altDateResults].filter(Boolean);
    
    if (validResults.length === 0) {
      console.log('No flight data returned from API');
      return createStaticPopularFlights();
    }
    
    // Sort by price for better user experience
    validResults.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
    
    // Cache and return the data
    writeCache(validResults);
    return validResults;
  } catch (error) {
    console.error('Error fetching popular flights:', error);
    
    // Add more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = {
      message: errorMessage,
      timestamp: new Date().toISOString(),
      type: 'popular-flights-error'
    };
    
    console.error('Detailed error:', errorDetails);
    
    // Return static data instead of throwing an error
    return createStaticPopularFlights();
  }
}

// Create reliable static popular flight data
function createStaticPopularFlights(): FlightOffer[] {
  console.log('Creating static popular flight data');
  
  // Popular destinations with realistic data
  const destinations = [
    { code: 'CDG', city: 'Paris', price: 99, departureOffset: 14, returnOffset: 21 },
    { code: 'BCN', city: 'Barcelona', price: 119, departureOffset: 21, returnOffset: 28 },
    { code: 'FCO', city: 'Rome', price: 129, departureOffset: 30, returnOffset: 37 },
    { code: 'AMS', city: 'Amsterdam', price: 89, departureOffset: 7, returnOffset: 14 },
    { code: 'LIS', city: 'Lisbon', price: 149, departureOffset: 45, returnOffset: 52 },
    { code: 'ATH', city: 'Athens', price: 179, departureOffset: 60, returnOffset: 67 },
    { code: 'MAD', city: 'Madrid', price: 129, departureOffset: 17, returnOffset: 24 },
    { code: 'DUB', city: 'Dublin', price: 69, departureOffset: 10, returnOffset: 17 },
    { code: 'VIE', city: 'Vienna', price: 139, departureOffset: 26, returnOffset: 33 },
    { code: 'PRG', city: 'Prague', price: 110, departureOffset: 35, returnOffset: 42 },
    { code: 'BUD', city: 'Budapest', price: 129, departureOffset: 40, returnOffset: 47 },
    { code: 'CPH', city: 'Copenhagen', price: 119, departureOffset: 28, returnOffset: 35 }
  ];
  
  const staticFlights: any[] = destinations.map((dest, index) => {
    // Calculate future dates
    const now = new Date();
    const departureDate = new Date(now);
    departureDate.setDate(departureDate.getDate() + dest.departureOffset);
    
    const returnDate = new Date(now);
    returnDate.setDate(returnDate.getDate() + dest.returnOffset);
    
    // Create a flight that matches our API data structure
    const flight: any = {
      id: `static-${dest.code}-${index}`,
      price: {
        total: dest.price.toString(),
        currency: 'EUR'
      },
      cityName: dest.city, // Add city name property to match live API data
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: 'LHR',
                terminal: '5',
                at: departureDate.toISOString()
              },
              arrival: {
                iataCode: dest.code,
                at: new Date(departureDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
              },
              carrierCode: 'BA',
              number: `${1000 + index}`,
              duration: 'PT2H30M'
            }
          ]
        },
        {
          segments: [
            {
              departure: {
                iataCode: dest.code,
                at: returnDate.toISOString()
              },
              arrival: {
                iataCode: 'LHR',
                terminal: '5',
                at: new Date(returnDate.getTime() + 2 * 60 * 60 * 1000).toISOString()
              },
              carrierCode: 'BA',
              number: `${2000 + index}`,
              duration: 'PT2H30M'
            }
          ]
        }
      ]
    };
    
    // Add some variation by using different airlines for some flights
    if (index % 3 === 1) {
      flight.itineraries[0].segments[0].carrierCode = 'LH';
      flight.itineraries[1].segments[0].carrierCode = 'LH';
    } else if (index % 3 === 2) {
      flight.itineraries[0].segments[0].carrierCode = 'AF';
      flight.itineraries[1].segments[0].carrierCode = 'AF';
    }
    
    return flight;
  });
  
  return staticFlights;
}

// Create mock popular destinations
function createMockPopularFlights(): any[] {
  // Popular European destinations
  const popularDestinations = [
    { city: 'Paris', code: 'CDG', country: 'France', price: 89 },
    { city: 'Barcelona', code: 'BCN', country: 'Spain', price: 99 },
    { city: 'Rome', code: 'FCO', country: 'Italy', price: 120 },
    { city: 'Amsterdam', code: 'AMS', country: 'Netherlands', price: 79 },
    { city: 'Lisbon', code: 'LIS', country: 'Portugal', price: 129 },
    { city: 'Athens', code: 'ATH', country: 'Greece', price: 150 },
    { city: 'Berlin', code: 'BER', country: 'Germany', price: 89 },
    { city: 'Dublin', code: 'DUB', country: 'Ireland', price: 69 },
    { city: 'Prague', code: 'PRG', country: 'Czech Republic', price: 110 },
    { city: 'Vienna', code: 'VIE', country: 'Austria', price: 130 }
  ];

  // Create mock data in the format expected by the frontend
  const mockData = popularDestinations.map((dest, index) => {
    // Calculate random dates within the next 3 months
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7 + Math.floor(Math.random() * 80));
    
    const returnDate = new Date(departureDate);
    returnDate.setDate(returnDate.getDate() + 3 + Math.floor(Math.random() * 7));
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    return {
      type: 'flight-destination',
      origin: 'LON',
      destination: dest.code,
      departureDate: formatDate(departureDate),
      returnDate: formatDate(returnDate),
      price: {
        total: dest.price.toString()
      },
      links: {
        flightDates: `/flights/dates?origin=LON&destination=${dest.code}`,
        flightOffers: `/flights?origin=LON&destination=${dest.code}&departureDate=${formatDate(departureDate)}&returnDate=${formatDate(returnDate)}&adults=1&nonStop=false`
      }
    };
  });
  
  return mockData;
}

export async function getFlightsToCountry(countryCode: string) {
  // Check country-specific cache first
  const cachedData = readCountryCache(countryCode);
  if (cachedData && cachedData.data) {
    // Use 12-hour cache for country flights
    if (Date.now() - cachedData.timestamp < CACHE_DURATIONS.COUNTRY_FLIGHTS) {
      console.log(`Using cached flight data for ${countryCode}`);
      return cachedData.data;
    }
  }
  
  try {
    console.log(`Fetching flights to ${countryCode}...`);
    
    // In a production environment:
    // Instead of querying just one city, we'll fetch multiple key destinations for the country
    // This provides more comprehensive results while still being efficient with API usage
    const countryCities: {[key: string]: string[]} = {
      'FR': ['CDG', 'NCE', 'LYS'], // Paris, Nice, Lyon
      'IT': ['FCO', 'MXP', 'VCE'], // Rome, Milan, Venice
      'ES': ['MAD', 'BCN', 'AGP'], // Madrid, Barcelona, Malaga
      'GR': ['ATH', 'JTR', 'HER'], // Athens, Santorini, Heraklion
      'DE': ['FRA', 'MUC', 'TXL'], // Frankfurt, Munich, Berlin
      'US': ['JFK', 'LAX', 'MIA'], // New York, Los Angeles, Miami
      'GB': ['LHR', 'MAN', 'EDI'], // London, Manchester, Edinburgh
      'PT': ['LIS', 'OPO', 'FAO'], // Lisbon, Porto, Faro
      'HR': ['ZAG', 'DBV', 'SPU'], // Zagreb, Dubrovnik, Split
      'TR': ['IST', 'AYT', 'ADB'], // Istanbul, Antalya, Izmir
      'NL': ['AMS'], // Amsterdam
      'BE': ['BRU'], // Brussels
      'AT': ['VIE'], // Vienna
      'CH': ['ZRH'], // Zurich
      'CA': ['YYZ', 'YVR'], // Toronto, Vancouver
      'AU': ['SYD', 'MEL'], // Sydney, Melbourne
      'JP': ['NRT', 'KIX'], // Tokyo, Osaka
      'SG': ['SIN'], // Singapore
      'AE': ['DXB'], // Dubai
    };
    
    // Get the airports for this country
    const destinationAirports = countryCities[countryCode.toUpperCase()] || [];
    
    if (!destinationAirports.length) {
      console.error(`No airports defined for country code: ${countryCode}`);
      
      // Generate mock data instead of throwing an error
      console.log(`Generating mock data for ${countryCode}`);
      const mockFlights = createMockFlightsForCountry(countryCode);
      
      // Cache the mock data
      writeCountryCache(countryCode, mockFlights);
      return mockFlights;
    }
    
    // Use future dates for flight search
    const departureDate = getFutureDateString();
    const returnDate = getFutureDateString(7);

    // Call the flight offers search API for multiple destinations using the new token management system
    // To balance API usage, we'll fetch data for up to 3 destinations and 
    // limit results per destination
    console.log(`Fetching flights to ${countryCode} destinations...`);
    
    // Number of results to fetch per destination (3-5 is reasonable to keep API usage in check)
    const RESULTS_PER_DESTINATION = 4;
    
    // We'll use Promise.all to run queries in parallel
    const destinationPromises = destinationAirports.slice(0, 3).map(async (airportCode) => {
      try {
        const flightResponse = await makeAuthenticatedRequest(
          `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LHR&destinationLocationCode=${airportCode}&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&max=${RESULTS_PER_DESTINATION}&currencyCode=EUR`
        );
        
        if (!flightResponse.ok) {
          console.log(`Error fetching flights to ${airportCode}, status: ${flightResponse.status}`);
          return [];
        }
        
        const flightData = await flightResponse.json();
        
        if (!flightData.data || !Array.isArray(flightData.data)) {
          console.log(`No flight data returned for ${airportCode}`);
          return [];
        }
        
        console.log(`Found ${flightData.data.length} flights to ${airportCode}`);
        return flightData.data;
      } catch (err) {
        console.error(`Error fetching flights to ${airportCode}:`, err);
        return [];
      }
    });
    
    // Combine all results
    const results = await Promise.all(destinationPromises);
    const allFlights = results.flat();
    
    if (allFlights.length === 0) {
      console.log(`No flights found for any destination in ${countryCode}`);
      
      // Use mock data as fallback
      console.log(`Using mock data fallback for ${countryCode}`);
      const mockFlights = createMockFlightsForCountry(countryCode);
      
      // Cache the mock data
      writeCountryCache(countryCode, mockFlights);
      return mockFlights;
    }
    
    // Sort flights by price for better user experience
    allFlights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
    
    // Cache and return the data
    writeCountryCache(countryCode, allFlights);
    return allFlights;
  } catch (error) {
    console.error(`Error fetching flights to ${countryCode}:`, error);
    
    // Fallback to mock data in case of API errors
    console.log(`Falling back to mock data for ${countryCode} due to API error`);
    const mockFlights = createMockFlightsForCountry(countryCode);
    
    // Cache the mock data
    writeCountryCache(countryCode, mockFlights);
    return mockFlights;
  }
}

// Search for flights with specific parameters
export async function searchFlights(params: any) {
  const cacheKey = `search-${params.originLocationCode}-${params.destinationLocationCode}-${params.departureDate}-${params.returnDate}-${params.adults}-${params.children || '0'}`;
  const cacheFile = path.join(process.cwd(), 'public', 'cache', `${cacheKey}.json`);
  
  // Check for cached results
  if (fs.existsSync(cacheFile)) {
    try {
      const data = fs.readFileSync(cacheFile, 'utf8');
      const cache = JSON.parse(data);
      
      // Use 6-hour cache for specific searches
      if (cache.timestamp && (Date.now() - cache.timestamp < CACHE_DURATIONS.FLIGHT_SEARCH)) {
        console.log(`Using cached search results for ${cacheKey}`);
        return cache.data;
      }
    } catch (error) {
      console.error('Error reading search cache:', error);
    }
  }
  
  try {
    console.log('Executing flight search with parameters:', JSON.stringify(params));
    
    // Validate important parameters
    if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
      console.error('Missing required parameters for flight search');
      throw new Error('Missing required flight search parameters');
    }
    
    // Clean up IATA codes
    const originCode = params.originLocationCode.toUpperCase().trim();
    const destCode = params.destinationLocationCode.toUpperCase().trim();
    
    // Special handling for country-level codes (ending with 'C') and city-level codes (ending with 'A')
    const isOriginCountry = originCode.endsWith('C');
    const isOriginCity = originCode.endsWith('A');
    const isDestCountry = destCode.endsWith('C');
    const isDestCity = destCode.endsWith('A');
    
    // Handle special codes by looking up airports from the proper country/city
    if (isOriginCountry || isOriginCity || isDestCountry || isDestCity) {
      console.log('Special airport code detected, generating multi-airport search');
      
      // Import airports data to get all airports for country/city
      const { airports } = await import('@/data/airports');
      
      // Find matching airports for origin if it's a special code
      let originAirports: string[] = [originCode]; // Default to the original code
      
      if (isOriginCountry) {
        // For country code (e.g. "FRAC"), get the country name from the first 3 characters
        const countryCode = originCode.substring(0, 3);
        const countryName = getCountryNameFromCode(countryCode);
        
        if (countryName) {
          // Get all airports for that country
          originAirports = airports
            .filter(airport => airport.country.toLowerCase().includes(countryName.toLowerCase()))
            .map(airport => airport.iataCode)
            .slice(0, 5); // Limit to top 5 airports to avoid excessive API calls
          
          console.log(`Found ${originAirports.length} airports in ${countryName}`);
        }
      } else if (isOriginCity) {
        // For city code (e.g. "LONA"), get the city name from the first 3 characters
        const cityCode = originCode.substring(0, 3);
        const cityName = getCityNameFromCode(cityCode);
        
        if (cityName) {
          // Get all airports for that city
          originAirports = airports
            .filter(airport => airport.city.toLowerCase().includes(cityName.toLowerCase()))
            .map(airport => airport.iataCode);
          
          console.log(`Found ${originAirports.length} airports in ${cityName}`);
        }
      }
      
      // Find matching airports for destination if it's a special code
      let destAirports: string[] = [destCode]; // Default to the original code
      
      if (isDestCountry) {
        // For country code (e.g. "FRAC"), get the country name from the first 3 characters
        const countryCode = destCode.substring(0, 3);
        const countryName = getCountryNameFromCode(countryCode);
        
        if (countryName) {
          // Get all airports for that country
          destAirports = airports
            .filter(airport => airport.country.toLowerCase().includes(countryName.toLowerCase()))
            .map(airport => airport.iataCode)
            .slice(0, 5); // Limit to top 5 airports to avoid excessive API calls
          
          console.log(`Found ${destAirports.length} airports in ${countryName}`);
        }
      } else if (isDestCity) {
        // For city code (e.g. "LONA"), get the city name from the first 3 characters
        const cityCode = destCode.substring(0, 3);
        const cityName = getCityNameFromCode(cityCode);
        
        if (cityName) {
          // Get all airports for that city
          destAirports = airports
            .filter(airport => airport.city.toLowerCase().includes(cityName.toLowerCase()))
            .map(airport => airport.iataCode);
          
          console.log(`Found ${destAirports.length} airports in ${cityName}`);
        }
      }
      
      // Now we need to search for each combination
      let allFlights: any[] = [];
      
      // For each origin-destination combination, use the new token management system
      console.log('Searching multiple airport combinations...');
      
      // Limit the number of airport combinations to avoid excessive API calls
      const maxCombinations = 5;
      let combinationsSearched = 0;
      
      // Search for each origin-destination combination
      for (const origin of originAirports) {
        // Skip special codes, only use actual IATA codes
        if (origin.endsWith('A') || origin.endsWith('C')) continue;
        
        for (const destination of destAirports) {
          // Skip special codes, only use actual IATA codes
          if (destination.endsWith('A') || destination.endsWith('C')) continue;
          
          // Limit the number of API calls
          if (combinationsSearched >= maxCombinations) break;
          combinationsSearched++;
          
          // Ensure IATA codes are valid format (3 letters)
          if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
            console.log(`Skipping invalid airport codes: ${origin} - ${destination}`);
            continue;
          }
          
          // Prepare search parameters for this combination
          const searchParams = new URLSearchParams({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: params.departureDate,
            adults: params.adults || '1',
            currencyCode: 'EUR',
            max: '5' // Limit results per combination to avoid excessive data
          });
          
          // Add optional parameters if present
          if (params.returnDate) searchParams.append('returnDate', params.returnDate);
          if (params.children) searchParams.append('children', params.children);
          if (params.travelClass) searchParams.append('travelClass', params.travelClass);
          if (params.nonStop !== undefined) searchParams.append('nonStop', params.nonStop.toString());
          
          console.log(`Searching flights from ${origin} to ${destination}...`);
          
          try {
            // Call the flight offers search API for this combination with automatic token management
            const flightResponse = await makeAuthenticatedRequest(
              `https://api.amadeus.com/v2/shopping/flight-offers?${searchParams.toString()}`
            );
            
            if (flightResponse.ok) {
              const flightData = await flightResponse.json();
              
              if (flightData.data && Array.isArray(flightData.data) && flightData.data.length > 0) {
                console.log(`Found ${flightData.data.length} flights from ${origin} to ${destination}`);
                allFlights = [...allFlights, ...flightData.data];
              }
            }
          } catch (err) {
            console.error(`Error searching flights from ${origin} to ${destination}:`, err);
            // Continue with other combinations even if one fails
          }
        }
        
        if (combinationsSearched >= maxCombinations) break;
      }
      
      if (allFlights.length === 0) {
        throw new Error('No flights found for the specified locations');
      }
      
      // Sort flights by price
      allFlights.sort((a: any, b: any) => parseFloat(a.price.total) - parseFloat(b.price.total));
      
      // Cache the results
      try {
        ensureCacheDirectory();
        const cache = {
          timestamp: Date.now(),
          data: allFlights.slice(0, MAX_FLIGHT_RESULTS) // Limit the number of results
        };
        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
        console.log(`Search results cached as ${cacheKey}`);
      } catch (error) {
        console.error('Error caching search results:', error);
      }
      
      return allFlights.slice(0, MAX_FLIGHT_RESULTS);
    }
    
    // Regular search for standard IATA codes
    // Ensure IATA codes are valid format (3 letters)
    if (!/^[A-Z]{3}$/.test(originCode) || !/^[A-Z]{3}$/.test(destCode)) {
      console.error('Invalid airport codes:', originCode, destCode);
      throw new Error('Invalid airport codes provided');
    }

    // Step 1: Prepare search parameters for main search
    console.log('Building flight search URL...');
    const searchParams = new URLSearchParams({
      originLocationCode: originCode,
      destinationLocationCode: destCode,
      departureDate: params.departureDate,
      adults: params.adults || '1',
      currencyCode: 'EUR',
      max: (MAX_FLIGHT_RESULTS * 1.5).toString() // Increase the maximum results to provide more choices
    });
    
    // Add optional parameters if present
    if (params.returnDate) searchParams.append('returnDate', params.returnDate);
    if (params.children) searchParams.append('children', params.children);
    if (params.travelClass) searchParams.append('travelClass', params.travelClass);
    if (params.nonStop !== undefined) searchParams.append('nonStop', params.nonStop.toString());
    
    // Step 2: Call the flight offers search API with automatic token management
    console.log('Fetching flight offers...');
    const flightResponse = await makeAuthenticatedRequest(
      `https://api.amadeus.com/v2/shopping/flight-offers?${searchParams.toString()}`
    );
    
    const flightData = await flightResponse.json();
    
    if (!flightResponse.ok) {
      console.error('Error from flight offers API:', flightData);
      throw new Error('Error from flight offers API: ' + (flightData.errors?.[0]?.detail || 'Unknown error'));
    }
    
    if (!flightData.data || !Array.isArray(flightData.data) || flightData.data.length === 0) {
      console.log('No search results returned from API');
      throw new Error('No flights found for the specified route');
    }
    
    let allFlights = flightData.data;
    
    // Step 3: Optionally fetch alternative dates (±1 day) if the main search didn't return enough results
    // This gives more options without consuming too many API calls
    if (allFlights.length < 6 && params.returnDate) {
      console.log('Limited results found, fetching alternative dates...');
      
      try {
        // Create a date +1 day from the original
        const altDepartureDate = new Date(params.departureDate);
        altDepartureDate.setDate(altDepartureDate.getDate() + 1);
        const altDepartureDateStr = altDepartureDate.toISOString().split('T')[0];
        
        // Alternative date search params
        const altSearchParams = new URLSearchParams({
          originLocationCode: originCode,
          destinationLocationCode: destCode,
          departureDate: altDepartureDateStr,
          adults: params.adults || '1',
          currencyCode: 'EUR',
          max: '6' // Limit the number of alternative date results
        });
        
        if (params.returnDate) {
          // Also adjust return date
          const altReturnDate = new Date(params.returnDate);
          altReturnDate.setDate(altReturnDate.getDate() + 1);
          altSearchParams.append('returnDate', altReturnDate.toISOString().split('T')[0]);
        }
        
        // Optional parameters
        if (params.children) altSearchParams.append('children', params.children);
        if (params.travelClass) altSearchParams.append('travelClass', params.travelClass);
        if (params.nonStop !== undefined) altSearchParams.append('nonStop', params.nonStop.toString());
        
        // Execute alternative date search with automatic token management
        const altFlightResponse = await makeAuthenticatedRequest(
          `https://api.amadeus.com/v2/shopping/flight-offers?${altSearchParams.toString()}`
        );
        
        if (altFlightResponse.ok) {
          const altFlightData = await altFlightResponse.json();
          
          if (altFlightData.data && Array.isArray(altFlightData.data) && altFlightData.data.length > 0) {
            console.log(`Found ${altFlightData.data.length} flights for alternative dates`);
            
            // Mark these flights as alternative date options
            altFlightData.data.forEach((flight: any) => {
              flight.isAlternativeDate = true;
            });
            
            // Combine with main results
            allFlights = [...allFlights, ...altFlightData.data];
          }
        }
      } catch (err) {
        console.error('Error fetching alternative dates, continuing with main results:', err);
      }
    }
    
    // Sort flights by price for better user experience
    allFlights.sort((a: any, b: any) => parseFloat(a.price.total) - parseFloat(b.price.total));
    
    // Cache the results
    try {
      ensureCacheDirectory();
      const cache = {
        timestamp: Date.now(),
        data: allFlights
      };
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
      console.log(`Search results cached as ${cacheKey}`);
    } catch (error) {
      console.error('Error caching search results:', error);
    }
    
    return allFlights;
  } catch (error) {
    console.error('Error searching flights:', error);
    
    // Only use fallback data for specific critical errors
    // For other errors, let them bubble up to be handled by the API route
    if (error instanceof Error) {
      // Critical authentication or credential errors - use fallback
      if (error.message.includes('Failed to authenticate with Amadeus API') || 
          error.message.includes('Missing credentials') ||
          error.message.includes('AMADEUS_CLIENT_ID') ||
          error.message.includes('AMADEUS_CLIENT_SECRET')) {
        
        console.log('Critical authentication error detected, generating fallback flight data...');
        
        try {
          const fallbackFlights = createMockFlightsWithRoute(
            params.originLocationCode,
            params.destinationLocationCode,
            params.departureDate,
            params.returnDate || params.departureDate
          );
          
          // Cache the fallback data with a shorter expiry
          try {
            ensureCacheDirectory();
            const cache = {
              timestamp: Date.now(),
              data: fallbackFlights,
              isFallback: true // Mark as fallback data
            };
            fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
            console.log(`Fallback search results cached as ${cacheKey}`);
          } catch (cacheError) {
            console.error('Error caching fallback search results:', cacheError);
          }
          
          console.log(`Generated ${fallbackFlights.length} fallback flights for ${params.originLocationCode} → ${params.destinationLocationCode}`);
          return fallbackFlights;
        } catch (fallbackError) {
          console.error('Error generating fallback data:', fallbackError);
          throw error; // Throw the original error
        }
      }
    }
    
    // For all other errors (API timeouts, rate limits, network issues etc.), 
    // throw the error so it can be handled properly by the API route
    throw error;
  }
}

// Helper function to convert a 3-letter country code to a name
// This is an estimation based on the first 3 letters of the country name
function getCountryNameFromCode(code: string): string | null {
  // Airport country code (first 3 letters) to full name mapping
  const countryMap: Record<string, string> = {
    'UNI': 'United Kingdom',
    'FRA': 'France',
    'ITA': 'Italy',
    'SPA': 'Spain',
    'GRE': 'Greece',
    'GER': 'Germany',
    'USA': 'USA',
    'POR': 'Portugal',
    'CRO': 'Croatia',
    'TUR': 'Turkey',
    'NET': 'Netherlands',
    'BEL': 'Belgium',
    // Add more as needed
  };
  
  return countryMap[code] || null;
}

// Helper function to convert a 3-letter city code to a name
// This is an estimation based on the first 3 letters of the city name
function getCityNameFromCode(code: string): string | null {
  // Airport city code (first 3 letters) to full name mapping
  const cityMap: Record<string, string> = {
    'LON': 'London',
    'PAR': 'Paris',
    'ROM': 'Rome',
    'MAD': 'Madrid',
    'BAR': 'Barcelona',
    'MIL': 'Milan',
    'BER': 'Berlin',
    'NYC': 'New York',
    'LAS': 'Las Vegas',
    'DUB': 'Dubai',
    'IST': 'Istanbul',
    'AMS': 'Amsterdam',
    // Add more as needed
  };
  
  return cityMap[code] || null;
}

// Create mock flights between specific airports
export function createMockFlightsWithRoute(
  originCode: string, 
  destinationCode: string, 
  departureDate: string,
  returnDate: string
): FlightOffer[] {
  // Map some common airports to their display info
  const airportInfo: Record<string, {city: string, country: string, terminal: string}> = {
    // UK
    'LHR': {city: 'London', country: 'United Kingdom', terminal: '5'},
    'LGW': {city: 'London', country: 'United Kingdom', terminal: '1'},
    'MAN': {city: 'Manchester', country: 'United Kingdom', terminal: '1'},
    'EDI': {city: 'Edinburgh', country: 'United Kingdom', terminal: '1'},
    // France
    'CDG': {city: 'Paris', country: 'France', terminal: '2E'},
    'ORY': {city: 'Paris', country: 'France', terminal: '1'},
    'NCE': {city: 'Nice', country: 'France', terminal: '1'},
    // Spain
    'MAD': {city: 'Madrid', country: 'Spain', terminal: '4'},
    'BCN': {city: 'Barcelona', country: 'Spain', terminal: '1'},
    'AGP': {city: 'Malaga', country: 'Spain', terminal: '3'},
    // Italy
    'FCO': {city: 'Rome', country: 'Italy', terminal: '3'},
    'MXP': {city: 'Milan', country: 'Italy', terminal: '1'},
    'VCE': {city: 'Venice', country: 'Italy', terminal: '1'},
    // Greece
    'ATH': {city: 'Athens', country: 'Greece', terminal: '2'},
    'HER': {city: 'Heraklion', country: 'Greece', terminal: '1'},
    'SKG': {city: 'Thessaloniki', country: 'Greece', terminal: '1'},
    // Germany
    'FRA': {city: 'Frankfurt', country: 'Germany', terminal: '1'},
    'MUC': {city: 'Munich', country: 'Germany', terminal: '2'},
    'TXL': {city: 'Berlin', country: 'Germany', terminal: '1'},
    // Default for unknown airports
    'XXX': {city: 'Unknown', country: 'Unknown', terminal: '1'},
  };
  
  // Get airport info with fallbacks
  const origin = airportInfo[originCode] || {city: 'Unknown', country: 'Unknown', terminal: '1'};
  const destination = airportInfo[destinationCode] || {city: 'Unknown', country: 'Unknown', terminal: '1'};
  
  // Calculate approximate flight duration based on airport locations (very rough approximation)
  // For demonstration, we'll categorize flights into short, medium and long haul
  let flightDuration = 'PT2H30M'; // Default medium-haul duration
  
  // European short-haul (default)
  if (
    (originCode.startsWith('L') && destinationCode.startsWith('L')) ||
    ['CDG', 'ORY', 'BRU', 'AMS', 'LUX', 'DUB'].includes(destinationCode)
  ) {
    flightDuration = 'PT1H45M'; // Short haul
  } else if (
    ['JFK', 'LAX', 'MIA', 'YYZ', 'DXB', 'DOH', 'SIN', 'HKG', 'NRT', 'SYD'].includes(destinationCode)
  ) {
    flightDuration = 'PT8H30M'; // Long haul
  }
  
  // Create mock flight offers
  const mockFlights: FlightOffer[] = [];
  
  // Create different airlines for variety
  const airlines = [
    {code: 'BA', name: 'British Airways'},
    {code: 'LH', name: 'Lufthansa'},
    {code: 'AF', name: 'Air France'},
    {code: 'EZ', name: 'EasyJet'},
    {code: 'FR', name: 'Ryanair'}
  ];
  
  // Create 5 mock flights with different prices and times
  for (let i = 1; i <= 5; i++) {
    const basePrice = 200 + (i * 75) + (Math.random() * 50); // Different price tiers with small random variation
    const hourOffset = i * 2; // Different departure times
    const airline = airlines[i % airlines.length];
    
    // Generate departure and return dates with time
    const depTime = new Date(departureDate);
    depTime.setHours(6 + hourOffset, 30, 0);
    
    const retTime = new Date(returnDate);
    retTime.setHours(10 + hourOffset, 45, 0);
    
    mockFlights.push({
      id: `mock-${originCode}-${destinationCode}-${i}`,
      price: {
        total: basePrice.toFixed(2),
        currency: 'EUR'
      },
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: originCode,
                terminal: origin.terminal,
                at: depTime.toISOString()
              },
              arrival: {
                iataCode: destinationCode,
                terminal: destination.terminal,
                at: new Date(depTime.getTime() + 3 * 60 * 60 * 1000).toISOString() // Rough flight time
              },
              carrierCode: airline.code,
              number: `${100 + i}`,
              duration: flightDuration
            }
          ]
        },
        {
          segments: [
            {
              departure: {
                iataCode: destinationCode,
                terminal: destination.terminal,
                at: retTime.toISOString()
              },
              arrival: {
                iataCode: originCode,
                terminal: origin.terminal,
                at: new Date(retTime.getTime() + 3 * 60 * 60 * 1000).toISOString() // Rough flight time 
              },
              carrierCode: airline.code,
              number: `${200 + i}`,
              duration: flightDuration
            }
          ]
        }
      ]
    });
  }
  
  return mockFlights;
}

// Export functions for cache management
export function getCacheStats() {
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const stats = {
    cacheFiles: 0,
    totalSize: 0,
    oldestCache: Date.now(),
    newestCache: 0,
    files: [] as {name: string, size: number, date: number}[]
  };
  
  if (!fs.existsSync(cacheDir)) {
    return stats;
  }
  
  try {
    const files = fs.readdirSync(cacheDir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isDirectory() && file.name === 'countries') {
        // Handle country cache directory
        const countryFiles = fs.readdirSync(path.join(cacheDir, 'countries'), { withFileTypes: true });
        for (const countryFile of countryFiles) {
          if (countryFile.isFile() && countryFile.name.endsWith('.json')) {
            const filePath = path.join(cacheDir, 'countries', countryFile.name);
            const stat = fs.statSync(filePath);
            stats.cacheFiles++;
            stats.totalSize += stat.size;
            stats.oldestCache = Math.min(stats.oldestCache, stat.mtimeMs);
            stats.newestCache = Math.max(stats.newestCache, stat.mtimeMs);
            stats.files.push({
              name: `countries/${countryFile.name}`,
              size: stat.size,
              date: stat.mtimeMs
            });
          }
        }
      } else if (file.isFile() && file.name.endsWith('.json')) {
        const filePath = path.join(cacheDir, file.name);
        const stat = fs.statSync(filePath);
        stats.cacheFiles++;
        stats.totalSize += stat.size;
        stats.oldestCache = Math.min(stats.oldestCache, stat.mtimeMs);
        stats.newestCache = Math.max(stats.newestCache, stat.mtimeMs);
        stats.files.push({
          name: file.name,
          size: stat.size,
          date: stat.mtimeMs
        });
      }
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return stats;
  }
}

export function clearCache(all: boolean = false, days: number = 7) {
  const cacheDir = path.join(process.cwd(), 'public', 'cache');
  const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
  let deletedCount = 0;
  
  if (!fs.existsSync(cacheDir)) {
    return { deletedCount };
  }
  
  try {
    const clearFile = (filePath: string) => {
      if (all) {
        fs.unlinkSync(filePath);
        deletedCount++;
        return;
      }
      
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs < cutoffDate) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    };
    
    const files = fs.readdirSync(cacheDir, { withFileTypes: true });
    
    for (const file of files) {
      if (file.isDirectory() && file.name === 'countries') {
        // Handle country cache directory
        const countryFiles = fs.readdirSync(path.join(cacheDir, 'countries'), { withFileTypes: true });
        for (const countryFile of countryFiles) {
          if (countryFile.isFile() && countryFile.name.endsWith('.json')) {
            clearFile(path.join(cacheDir, 'countries', countryFile.name));
          }
        }
      } else if (file.isFile() && file.name.endsWith('.json')) {
        clearFile(path.join(cacheDir, file.name));
      }
    }
    
    return { deletedCount };
  } catch (error) {
    console.error('Error clearing cache:', error);
    return { deletedCount, error: String(error) };
  }
} 