import fs from 'fs';
import path from 'path';
import { POPULAR_DESTINATIONS } from './fallback-data';

interface CachedDestination {
  code: string;
  city: string;
  country: string;
  basePrice: number;
  priceUpdated: number;
  popularity: number;
}

interface CachedDateRange {
  label: string;
  startOffset: number;
  duration: number;
  popularity: number;
}

interface SmartSearchCache {
  timestamp: number;
  destinations: CachedDestination[];
  dateRanges: CachedDateRange[];
  airportMappings: Record<string, CachedDestination[]>;
}

const CACHE_FILE = path.join(process.cwd(), 'public', 'cache', 'smart-search-cache.json');
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get cached popular destinations for smart search
 * Uses cached data to avoid API calls until user makes final selection
 */
export function getCachedDestinations(origin?: string): CachedDestination[] {
  try {
    // Read cached data
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData: SmartSearchCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      
      // Check if cache is still valid
      if (Date.now() - cacheData.timestamp < CACHE_DURATION) {
        if (origin && cacheData.airportMappings[origin]) {
          return cacheData.airportMappings[origin];
        }
        return cacheData.destinations;
      }
    }
  } catch (error) {
    console.error('Error reading smart search cache:', error);
  }

  // Fallback to static popular destinations
  return POPULAR_DESTINATIONS.map((dest, index) => ({
    ...dest,
    priceUpdated: Date.now(),
    popularity: 100 - index * 5 // Decreasing popularity
  }));
}

/**
 * Get cached popular date ranges
 */
export function getCachedDateRanges(): CachedDateRange[] {
  const defaultRanges: CachedDateRange[] = [
    { label: 'This Weekend', startOffset: 5, duration: 2, popularity: 90 },
    { label: 'Next Weekend', startOffset: 12, duration: 2, popularity: 85 },
    { label: 'Long Weekend', startOffset: 19, duration: 3, popularity: 80 },
    { label: 'Week Holiday', startOffset: 30, duration: 7, popularity: 95 },
    { label: 'Summer Break', startOffset: 60, duration: 14, popularity: 75 },
  ];

  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData: SmartSearchCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      
      if (Date.now() - cacheData.timestamp < CACHE_DURATION && cacheData.dateRanges) {
        return cacheData.dateRanges;
      }
    }
  } catch (error) {
    console.error('Error reading date ranges cache:', error);
  }

  return defaultRanges;
}

/**
 * Update cache with fresh destination data
 * This would be called periodically or after API calls
 */
export function updateDestinationCache(destinations: CachedDestination[], origin?: string) {
  try {
    // Ensure cache directory exists
    const cacheDir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    let cacheData: SmartSearchCache;

    // Read existing cache or create new
    if (fs.existsSync(CACHE_FILE)) {
      try {
        cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      } catch {
        cacheData = {
          timestamp: Date.now(),
          destinations: [],
          dateRanges: getCachedDateRanges(),
          airportMappings: {}
        };
      }
    } else {
      cacheData = {
        timestamp: Date.now(),
        destinations: [],
        dateRanges: getCachedDateRanges(),
        airportMappings: {}
      };
    }

    // Update destinations
    if (origin) {
      cacheData.airportMappings[origin] = destinations;
    } else {
      cacheData.destinations = destinations;
    }

    cacheData.timestamp = Date.now();

    // Write back to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log(`Updated smart search cache for ${origin || 'general destinations'}`);
  } catch (error) {
    console.error('Error updating destination cache:', error);
  }
}

/**
 * Get price estimate for a destination without API call
 * Uses cached data and basic calculation
 */
export function getEstimatedPrice(
  origin: string,
  destination: string,
  dateOffset: number = 30
): number {
  const cachedDests = getCachedDestinations(origin);
  const dest = cachedDests.find(d => d.code === destination);
  
  if (!dest) {
    // Fallback calculation based on distance/popularity
    return 150; // Default estimate
  }

  let price = dest.basePrice;

  // Adjust for date offset (closer dates more expensive)
  if (dateOffset < 7) {
    price *= 1.5; // 50% premium for last minute
  } else if (dateOffset < 14) {
    price *= 1.3; // 30% premium for short notice
  } else if (dateOffset < 30) {
    price *= 1.1; // 10% premium for moderate notice
  }
  // No premium for 30+ days advance booking

  // Add some randomness to make it feel more realistic
  const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
  price *= (1 + variation);

  return Math.round(price);
}

/**
 * Check if we should make an API call
 * Only makes API calls when user has locked in all parameters
 */
export function shouldMakeApiCall(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string
): boolean {
  // Only make API call if all required fields are provided
  if (!origin || !destination || !departureDate) {
    return false;
  }

  // Check if we have very recent cached data for this exact combination
  const cacheKey = `${origin}-${destination}-${departureDate}${returnDate ? `-${returnDate}` : ''}`;
  const specificCacheFile = path.join(
    process.cwd(), 
    'public', 
    'cache', 
    'flight-searches',
    `${cacheKey}.json`
  );

  if (fs.existsSync(specificCacheFile)) {
    try {
      const cacheData = JSON.parse(fs.readFileSync(specificCacheFile, 'utf-8'));
      // If we have data from within the last 6 hours, don't call API
      if (Date.now() - cacheData.timestamp < 6 * 60 * 60 * 1000) {
        return false;
      }
    } catch (error) {
      // If cache read fails, make API call
      return true;
    }
  }

  return true;
}

/**
 * Smart search analytics - track what users are selecting
 * This helps optimize the cached suggestions
 */
export function trackSearchSelection(
  origin: string,
  destination: string,
  dateRange?: string
) {
  try {
    const analyticsFile = path.join(process.cwd(), 'public', 'cache', 'search-analytics.json');
    
    let analytics: Record<string, any> = {};
    if (fs.existsSync(analyticsFile)) {
      analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf-8'));
    }

    const today = new Date().toISOString().split('T')[0];
    
    if (!analytics[today]) {
      analytics[today] = {
        origins: {},
        destinations: {},
        dateRanges: {},
        routes: {}
      };
    }

    // Track popular origins
    analytics[today].origins[origin] = (analytics[today].origins[origin] || 0) + 1;
    
    // Track popular destinations
    analytics[today].destinations[destination] = (analytics[today].destinations[destination] || 0) + 1;
    
    // Track popular date ranges
    if (dateRange) {
      analytics[today].dateRanges[dateRange] = (analytics[today].dateRanges[dateRange] || 0) + 1;
    }
    
    // Track popular routes
    const route = `${origin}-${destination}`;
    analytics[today].routes[route] = (analytics[today].routes[route] || 0) + 1;

    // Keep only last 30 days of analytics
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    
    Object.keys(analytics).forEach(date => {
      if (new Date(date) < cutoffDate) {
        delete analytics[date];
      }
    });

    fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
  } catch (error) {
    console.error('Error tracking search selection:', error);
  }
}

/**
 * Get optimized suggestions based on analytics
 */
export function getOptimizedSuggestions(origin?: string): CachedDestination[] {
  try {
    const analyticsFile = path.join(process.cwd(), 'public', 'cache', 'search-analytics.json');
    
    if (fs.existsSync(analyticsFile)) {
      const analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf-8'));
      
      // Get last 7 days of data
      const recentDates = Object.keys(analytics)
        .filter(date => {
          const dateObj = new Date(date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return dateObj >= weekAgo;
        });

      // Aggregate destination popularity
      const destinationCounts: Record<string, number> = {};
      recentDates.forEach(date => {
        Object.entries(analytics[date].destinations).forEach(([dest, count]) => {
          destinationCounts[dest] = (destinationCounts[dest] || 0) + (count as number);
        });
      });

      // Get base destinations and sort by popularity
      const destinations = getCachedDestinations(origin);
      return destinations.sort((a, b) => {
        const aCount = destinationCounts[a.code] || 0;
        const bCount = destinationCounts[b.code] || 0;
        
        if (aCount !== bCount) {
          return bCount - aCount; // Sort by popularity
        }
        
        return a.basePrice - b.basePrice; // Then by price
      });
    }
  } catch (error) {
    console.error('Error getting optimized suggestions:', error);
  }

  // Fallback to standard cached destinations
  return getCachedDestinations(origin);
} 