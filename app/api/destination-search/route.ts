import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';
import { LogLevel, logAmadeusEvent, handleAmadeusError, createErrorResponse } from '@/lib/amadeus-error-logger';
import { isRateLimited } from '@/lib/api-rate-limiter';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

export interface DestinationSearchResult {
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  address?: {
    cityName: string;
    countryName: string;
  };
  cityName?: string;
  countryName?: string;
  displayName: string;
  isAllAirports?: boolean;
}

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check rate limits
  const rateLimit = isRateLimited(request, 'destination-search');
  if (!rateLimit.allowed) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'destination-search-api',
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
    const { searchParams } = new URL(request.url);
    
    // Get search parameters
    const keyword = searchParams.get('keyword') || '';
    const subType = searchParams.get('subType') || ''; // AIRPORT, CITY, or blank for both
    
    if (!keyword || keyword.length < 2) {
      // Return an empty array instead of an error when the keyword is too short
      // This avoids showing suggestions when the user hasn't typed enough
      return NextResponse.json([]);
    }
    
    // Special handling for generic terms like "all airports" that might cause confusion
    if (keyword.toLowerCase() === "all airports" || 
        keyword.toLowerCase() === "all airport" ||
        keyword.toLowerCase() === "all" ||
        keyword.toLowerCase() === "alla" ||
        keyword.toLowerCase() === "allc") {
      // Return empty results to avoid confusion with the "All airports" option
      return NextResponse.json([]);
    }

    // Log search request
    logAmadeusEvent(
      LogLevel.INFO,
      'destination-search-api',
      `Destination search request [${requestId}]: ${keyword}`,
      null,
      { keyword, subType }
    );
    
    // Add timeout wrapper for Amadeus API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API_TIMEOUT')), 5000); // 5 second timeout for search
    });

    try {
      // Race between API call and timeout
      const response = await Promise.race([
        amadeus.referenceData.locations.get({
          keyword,
          subType: subType || 'AIRPORT,CITY', // Default to both if not specified
          'page[limit]': 20
        }),
        timeoutPromise
      ]);
      
      // Transform the data for easier consumption by the frontend
      const results: DestinationSearchResult[] = response.data.map((item: any) => {
        return {
          type: item.type,
          subType: item.subType,
          name: item.name,
          iataCode: item.iataCode,
          address: item.address,
          cityName: item.address?.cityName,
          countryName: item.address?.countryName,
          displayName: formatDisplayName(item)
        };
      });
      
      // Group airports by city to detect when we need to add "All" option
      const processedResults = processResultsWithAllOption(results);
      
      // Log successful results
      logAmadeusEvent(
        LogLevel.INFO,
        'destination-search-api',
        `Search completed [${requestId}]: Found ${processedResults.length} destinations`,
        { resultCount: processedResults.length }
      );
      
      return NextResponse.json(processedResults);
    } catch (timeoutError) {
      // If timeout, immediately fall back to local data
      throw new Error('API_TIMEOUT_FALLBACK');
    }
  } catch (error) {
    // Handle errors
    const errorDetails = handleAmadeusError(
      error,
      'destination-search-api',
      { requestId, url: request.url }
    );
    
    // For network errors or API unavailability, return local airport data
    if (errorDetails.status >= 500 || errorDetails.error.includes('network')) {
      try {
        // Import local airport data
        const { airports } = await import('@/data/airports');
        
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get('keyword') || '';
        
        // Return empty array if keyword is too short
        if (keyword.length < 2) {
          return NextResponse.json([]);
        }

        // Special handling for generic terms like "all airports" that might cause confusion
        if (keyword.toLowerCase() === "all airports" || 
            keyword.toLowerCase() === "all airport" ||
            keyword.toLowerCase() === "all" ||
            keyword.toLowerCase() === "alla" ||
            keyword.toLowerCase() === "allc") {
          // Return empty results to avoid confusion with the "All airports" option
          return NextResponse.json([]);
        }
        
        // Filter local airports based on the keyword
        const filteredAirports = airports.filter(airport => 
          airport.name.toLowerCase().includes(keyword.toLowerCase()) ||
          airport.city.toLowerCase().includes(keyword.toLowerCase()) ||
          airport.country.toLowerCase().includes(keyword.toLowerCase()) ||
          airport.iataCode.toLowerCase().includes(keyword.toLowerCase())
        ).map(airport => ({
          type: 'location',
          subType: 'AIRPORT',
          name: airport.name,
          iataCode: airport.iataCode,
          cityName: airport.city,
          countryName: airport.country,
          displayName: `${airport.city}, ${airport.country} - ${airport.name} (${airport.iataCode})`
        }));
        
        // Process the local results to add "All" options
        const processedLocalResults = processLocalResultsWithAllOption(filteredAirports.slice(0, 20));
        
        logAmadeusEvent(
          LogLevel.WARNING,
          'destination-search-api',
          `Falling back to local airport data [${requestId}]`,
          { resultsCount: processedLocalResults.length, originalError: errorDetails.error }
        );
        
        return NextResponse.json(processedLocalResults);
      } catch (fallbackError) {
        // If even the fallback fails, log it and return an empty array
        logAmadeusEvent(
          LogLevel.ERROR,
          'destination-search-api',
          `Fallback data error [${requestId}]: ${fallbackError.message}`,
          { originalError: errorDetails.error, fallbackError: fallbackError.message }
        );
        
        return NextResponse.json([]);
      }
    }
    
    // Return an empty array instead of an error for better user experience
    logAmadeusEvent(
      LogLevel.ERROR,
      'destination-search-api',
      `Returning empty results due to error [${requestId}]: ${errorDetails.error}`,
      { ...errorDetails.details }
    );
    
    return NextResponse.json([]);
  }
}

// Process results to add "All" options for cities with multiple airports
function processResultsWithAllOption(results: DestinationSearchResult[]): DestinationSearchResult[] {
  // Group airports by city
  const cityAirports: Record<string, DestinationSearchResult[]> = {};
  // Group airports by country
  const countryAirports: Record<string, DestinationSearchResult[]> = {};
  
  // First, collect all airports by city and country
  results.forEach(item => {
    if (item.subType === 'AIRPORT' && item.cityName) {
      // Group by city
      const cityKey = `${item.cityName.toLowerCase()}-${item.countryName?.toLowerCase() || ''}`;
      if (!cityAirports[cityKey]) {
        cityAirports[cityKey] = [];
      }
      cityAirports[cityKey].push(item);
      
      // Group by country
      if (item.countryName) {
        const countryKey = item.countryName.toLowerCase();
        if (!countryAirports[countryKey]) {
          countryAirports[countryKey] = [];
        }
        countryAirports[countryKey].push(item);
      }
    }
  });
  
  // For cities with multiple airports, create an "All" option
  const additionalOptions: DestinationSearchResult[] = [];
  
  // Add country-level "All airports" options first
  Object.entries(countryAirports).forEach(([countryKey, airports]) => {
    if (airports.length > 0) {
      // Create an "All airports in Country" option
      const firstAirport = airports[0];
      additionalOptions.push({
        type: 'location',
        subType: 'COUNTRY',
        name: `${firstAirport.countryName} (All airports)`,
        iataCode: firstAirport.countryName?.substring(0, 3).toUpperCase() + 'C', // Create a pseudo code with C suffix for country
        countryName: firstAirport.countryName,
        displayName: `${firstAirport.countryName} (All airports)`,
        isAllAirports: true
      });
    }
  });
  
  // Then add city-level "All airports" options
  Object.entries(cityAirports).forEach(([cityKey, airports]) => {
    if (airports.length > 1) {
      // Create an "All" option for this city
      const firstAirport = airports[0];
      additionalOptions.push({
        type: 'location',
        subType: 'CITY',
        name: `${firstAirport.cityName} (All airports)`,
        iataCode: firstAirport.cityName?.substring(0, 3).toUpperCase() + 'A', // Create a pseudo code with A suffix for airports
        cityName: firstAirport.cityName,
        countryName: firstAirport.countryName,
        displayName: `${firstAirport.cityName}, ${firstAirport.countryName} (All airports)`,
        isAllAirports: true
      });
    }
  });
  
  // Prioritize "All" options by placing them at the top of the list
  return [...additionalOptions, ...results];
}

// Process local results to add "All" options for cities with multiple airports and countries
function processLocalResultsWithAllOption(results: any[]): DestinationSearchResult[] {
  // Group airports by city
  const cityAirports: Record<string, any[]> = {};
  // Group airports by country
  const countryAirports: Record<string, any[]> = {};
  
  // First, collect all airports by city and country
  results.forEach(item => {
    if (item.cityName) {
      // Group by city
      const cityKey = `${item.cityName.toLowerCase()}-${item.countryName?.toLowerCase() || ''}`;
      if (!cityAirports[cityKey]) {
        cityAirports[cityKey] = [];
      }
      cityAirports[cityKey].push(item);
      
      // Group by country
      if (item.countryName) {
        const countryKey = item.countryName.toLowerCase();
        if (!countryAirports[countryKey]) {
          countryAirports[countryKey] = [];
        }
        countryAirports[countryKey].push(item);
      }
    }
  });
  
  // For cities with multiple airports, create an "All" option
  const additionalOptions: DestinationSearchResult[] = [];
  
  // Add country-level "All airports" options first
  Object.entries(countryAirports).forEach(([countryKey, airports]) => {
    if (airports.length > 0) {
      // Create an "All airports in Country" option
      const firstAirport = airports[0];
      additionalOptions.push({
        type: 'location',
        subType: 'COUNTRY',
        name: `${firstAirport.countryName} (All airports)`,
        iataCode: firstAirport.countryName?.substring(0, 3).toUpperCase() + 'C', // Create a pseudo code with C suffix for country
        countryName: firstAirport.countryName,
        displayName: `${firstAirport.countryName} (All airports)`,
        isAllAirports: true
      });
    }
  });
  
  // Then add city-level "All airports" options
  Object.entries(cityAirports).forEach(([cityKey, airports]) => {
    if (airports.length > 1) {
      // Create an "All" option for this city
      const firstAirport = airports[0];
      additionalOptions.push({
        type: 'location',
        subType: 'CITY',
        name: `${firstAirport.cityName} (All airports)`,
        iataCode: firstAirport.cityName?.substring(0, 3).toUpperCase() + 'A', // Create a pseudo code with A suffix for airports
        cityName: firstAirport.cityName,
        countryName: firstAirport.countryName,
        displayName: `${firstAirport.cityName}, ${firstAirport.countryName} (All airports)`,
        isAllAirports: true
      });
    }
  });
  
  // Prioritize "All" options by placing them at the top of the list
  return [...additionalOptions, ...results];
}

// Helper function to format display names
function formatDisplayName(item: any): string {
  if (item.subType === 'AIRPORT') {
    return `${item.address?.cityName || ''}, ${item.address?.countryName || ''} - ${item.name} (${item.iataCode})`;
  } else if (item.subType === 'CITY') {
    return `${item.name}, ${item.address?.countryName || ''} (${item.iataCode})`;
  }
  return `${item.name} (${item.iataCode})`;
} 