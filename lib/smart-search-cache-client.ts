// Client-safe version of smart search cache utilities
// This version doesn't use 'fs' and works in the browser

import { POPULAR_DESTINATIONS } from './fallback-data';

interface CachedDestination {
  code: string;
  city: string;
  country: string;
  basePrice: number;
  priceUpdated?: number;
  popularity?: number;
}

interface CachedDateRange {
  label: string;
  startOffset: number;
  duration: number;
  popularity: number;
}

/**
 * Get cached popular destinations for smart search (client-side)
 * Uses static data since we can't access fs in the browser
 */
export function getCachedDestinations(origin?: string): CachedDestination[] {
  // Return static popular destinations as fallback
  return POPULAR_DESTINATIONS.map((dest, index) => ({
    ...dest,
    priceUpdated: Date.now(),
    popularity: 100 - index * 5 // Decreasing popularity
  }));
}

/**
 * Get cached popular date ranges (client-side)
 */
export function getCachedDateRanges(): CachedDateRange[] {
  return [
    { label: 'This Weekend', startOffset: 5, duration: 2, popularity: 90 },
    { label: 'Next Weekend', startOffset: 12, duration: 2, popularity: 85 },
    { label: 'Long Weekend', startOffset: 19, duration: 3, popularity: 80 },
    { label: 'Week Holiday', startOffset: 30, duration: 7, popularity: 95 },
    { label: 'Summer Break', startOffset: 60, duration: 14, popularity: 75 },
  ];
}

/**
 * Get price estimate for a destination without API call (client-side)
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
 * Track search selection (client-side version)
 * For client-side, we'll send this to an API endpoint
 */
export function trackSearchSelection(
  origin: string,
  destination: string,
  dateRange?: string
) {
  // In the client, we can send this data to a tracking API
  // For now, just log it to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Search selection tracked:', { origin, destination, dateRange });
  }
  
  // TODO: Send to analytics API endpoint
  // fetch('/api/track-search', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ origin, destination, dateRange })
  // }).catch(console.error);
}

/**
 * Get optimized suggestions based on analytics (client-side version)
 * For client-side, we return the static popular destinations
 */
export function getOptimizedSuggestions(origin?: string): CachedDestination[] {
  // In client-side, we can't access the analytics files
  // So we return the standard cached destinations
  return getCachedDestinations(origin);
} 