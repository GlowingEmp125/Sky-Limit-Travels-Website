import fs from 'fs';
import path from 'path';

// Enhanced cache durations - much longer to reduce API calls
const CACHE_DURATIONS = {
  POPULAR_FLIGHTS: 24 * 60 * 60 * 1000,      // 24 hours for popular flights
  FLIGHT_SEARCH: 12 * 60 * 60 * 1000,        // 12 hours for specific searches
  COUNTRY_FLIGHTS: 48 * 60 * 60 * 1000,      // 48 hours for country flights
  DESTINATION_SEARCH: 72 * 60 * 60 * 1000,   // 72 hours for destination searches
  USER_SESSION: 30 * 60 * 1000,              // 30 minutes for user session cache
};

// API call tracking
interface ApiCallRecord {
  timestamp: number;
  endpoint: string;
  ip: string;
  params: string;
  cost: number; // Estimated cost
}

const API_USAGE_FILE = path.join(process.cwd(), 'logs', 'api-cost-tracking.json');
const SESSION_CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'sessions');

// Estimated costs per API call (in cents)
const API_COSTS = {
  'flight-search': 5,      // 5 cents per search
  'popular-flights': 3,    // 3 cents per popular flights call
  'country-flights': 4,    // 4 cents per country search
  'destination-search': 2, // 2 cents per destination search
};

// Daily/monthly limits to prevent overspending
const COST_LIMITS = {
  DAILY_LIMIT_CENTS: 500,    // $5 per day
  MONTHLY_LIMIT_CENTS: 10000, // $100 per month
  USER_DAILY_LIMIT: 10,       // 10 API calls per user per day
  USER_SESSION_LIMIT: 5,      // 5 API calls per session
};

interface CostTracker {
  dailyCost: number;
  monthlyCost: number;
  lastResetDate: string;
  totalCalls: number;
  records: ApiCallRecord[];
}

// Initialize cost tracking
function initializeCostTracker(): CostTracker {
  const today = new Date().toDateString();
  
  if (fs.existsSync(API_USAGE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(API_USAGE_FILE, 'utf8'));
      
      // Reset daily costs if it's a new day
      if (data.lastResetDate !== today) {
        data.dailyCost = 0;
        data.lastResetDate = today;
        
        // Reset monthly costs if it's a new month
        const currentMonth = new Date().getMonth();
        const lastResetMonth = new Date(data.lastResetDate).getMonth();
        if (currentMonth !== lastResetMonth) {
          data.monthlyCost = 0;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cost tracker:', error);
    }
  }
  
  return {
    dailyCost: 0,
    monthlyCost: 0,
    lastResetDate: today,
    totalCalls: 0,
    records: []
  };
}

// Save cost tracking data
function saveCostTracker(tracker: CostTracker) {
  try {
    // Keep only last 30 days of records
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    tracker.records = tracker.records.filter(record => record.timestamp >= thirtyDaysAgo);
    
    const dir = path.dirname(API_USAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(API_USAGE_FILE, JSON.stringify(tracker, null, 2));
  } catch (error) {
    console.error('Error saving cost tracker:', error);
  }
}

// Enhanced session-based caching
function getSessionCache(sessionId: string, cacheKey: string): any | null {
  try {
    if (!fs.existsSync(SESSION_CACHE_DIR)) {
      fs.mkdirSync(SESSION_CACHE_DIR, { recursive: true });
    }
    
    const sessionFile = path.join(SESSION_CACHE_DIR, `${sessionId}.json`);
    
    if (fs.existsSync(sessionFile)) {
      const data = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      
      if (data[cacheKey] && Date.now() - data[cacheKey].timestamp < CACHE_DURATIONS.USER_SESSION) {
        console.log(`🎯 Using session cache for ${cacheKey}`);
        return data[cacheKey].data;
      }
    }
  } catch (error) {
    console.error('Error reading session cache:', error);
  }
  
  return null;
}

// Save to session cache
function setSessionCache(sessionId: string, cacheKey: string, data: any) {
  try {
    if (!fs.existsSync(SESSION_CACHE_DIR)) {
      fs.mkdirSync(SESSION_CACHE_DIR, { recursive: true });
    }
    
    const sessionFile = path.join(SESSION_CACHE_DIR, `${sessionId}.json`);
    let sessionData = {};
    
    if (fs.existsSync(sessionFile)) {
      sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    }
    
    sessionData[cacheKey] = {
      timestamp: Date.now(),
      data
    };
    
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
    console.log(`💾 Saved to session cache: ${cacheKey}`);
  } catch (error) {
    console.error('Error saving session cache:', error);
  }
}

// Check if API call is allowed based on cost limits
export function isApiCallAllowed(endpoint: string, ip: string, sessionId?: string): {
  allowed: boolean;
  reason?: string;
  cost?: number;
} {
  const tracker = initializeCostTracker();
  const estimatedCost = API_COSTS[endpoint] || 1;
  
  // Check daily cost limit
  if (tracker.dailyCost + estimatedCost > COST_LIMITS.DAILY_LIMIT_CENTS) {
    return {
      allowed: false,
      reason: `Daily cost limit reached ($${COST_LIMITS.DAILY_LIMIT_CENTS / 100})`,
      cost: estimatedCost
    };
  }
  
  // Check monthly cost limit
  if (tracker.monthlyCost + estimatedCost > COST_LIMITS.MONTHLY_LIMIT_CENTS) {
    return {
      allowed: false,
      reason: `Monthly cost limit reached ($${COST_LIMITS.MONTHLY_LIMIT_CENTS / 100})`,
      cost: estimatedCost
    };
  }
  
  // Check user IP daily limit
  const today = new Date().toDateString();
  const todayRecords = tracker.records.filter(
    record => new Date(record.timestamp).toDateString() === today && record.ip === ip
  );
  
  if (todayRecords.length >= COST_LIMITS.USER_DAILY_LIMIT) {
    return {
      allowed: false,
      reason: 'Daily API limit per user reached',
      cost: estimatedCost
    };
  }
  
  // Check session limit if sessionId provided
  if (sessionId) {
    const sessionRecords = tracker.records.filter(
      record => record.ip === ip && 
      Date.now() - record.timestamp < CACHE_DURATIONS.USER_SESSION
    );
    
    if (sessionRecords.length >= COST_LIMITS.USER_SESSION_LIMIT) {
      return {
        allowed: false,
        reason: 'Session API limit reached',
        cost: estimatedCost
      };
    }
  }
  
  return { allowed: true, cost: estimatedCost };
}

// Track API call for cost monitoring
export function trackApiCall(endpoint: string, ip: string, params: any, success: boolean) {
  try {
    const tracker = initializeCostTracker();
    const cost = API_COSTS[endpoint] || 1;
    
    if (success) {
      tracker.dailyCost += cost;
      tracker.monthlyCost += cost;
      tracker.totalCalls += 1;
      
      tracker.records.push({
        timestamp: Date.now(),
        endpoint,
        ip,
        params: JSON.stringify(params),
        cost
      });
      
      saveCostTracker(tracker);
      
      console.log(`💰 API call tracked: ${endpoint} - ${cost}¢ (Daily: ${tracker.dailyCost}¢)`);
    }
  } catch (error) {
    console.error('Error tracking API call:', error);
  }
}

// Enhanced search validation to prevent unnecessary API calls
export function validateSearchParams(params: any): { valid: boolean; error?: string } {
  // Check required fields
  if (!params.originLocationCode || !params.destinationLocationCode || !params.departureDate) {
    return { valid: false, error: 'Missing required parameters' };
  }
  
  // Validate IATA codes
  const iataRegex = /^[A-Z]{3}$/;
  if (!iataRegex.test(params.originLocationCode) || !iataRegex.test(params.destinationLocationCode)) {
    return { valid: false, error: 'Invalid airport codes' };
  }
  
  // Validate dates
  const departureDate = new Date(params.departureDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (departureDate < today) {
    return { valid: false, error: 'Departure date cannot be in the past' };
  }
  
  // Check if departure date is too far in the future (more than 330 days)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 330);
  
  if (departureDate > maxDate) {
    return { valid: false, error: 'Departure date too far in the future' };
  }
  
  // Validate return date if provided
  if (params.returnDate) {
    const returnDate = new Date(params.returnDate);
    if (returnDate < departureDate) {
      return { valid: false, error: 'Return date must be after departure date' };
    }
  }
  
  // Check for same origin and destination
  if (params.originLocationCode === params.destinationLocationCode) {
    return { valid: false, error: 'Origin and destination cannot be the same' };
  }
  
  return { valid: true };
}

// Intelligent search optimization
export function optimizeSearchParams(params: any): any {
  const optimized = { ...params };
  
  // Limit results to reduce API costs
  optimized.max = Math.min(params.max || 10, 10);
  
  // Default to EUR for better caching (most flights priced in EUR)
  if (!optimized.currencyCode) {
    optimized.currencyCode = 'EUR';
  }
  
  // Default to economy class for better caching
  if (!optimized.travelClass) {
    optimized.travelClass = 'ECONOMY';
  }
  
  return optimized;
}

// Get cost statistics
export function getCostStats() {
  const tracker = initializeCostTracker();
  
  return {
    daily: {
      spent: tracker.dailyCost,
      limit: COST_LIMITS.DAILY_LIMIT_CENTS,
      percentage: Math.round((tracker.dailyCost / COST_LIMITS.DAILY_LIMIT_CENTS) * 100)
    },
    monthly: {
      spent: tracker.monthlyCost,
      limit: COST_LIMITS.MONTHLY_LIMIT_CENTS,
      percentage: Math.round((tracker.monthlyCost / COST_LIMITS.MONTHLY_LIMIT_CENTS) * 100)
    },
    totalCalls: tracker.totalCalls,
    lastResetDate: tracker.lastResetDate,
    recentCalls: tracker.records.slice(-10)
  };
}

// Enhanced cache utilities with session support
export const CostOptimizer = {
  getSessionCache,
  setSessionCache,
  isApiCallAllowed,
  trackApiCall,
  validateSearchParams,
  optimizeSearchParams,
  getCostStats,
  CACHE_DURATIONS
};

export default CostOptimizer; 