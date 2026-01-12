import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// Configure usage limits - set to extremely high values for testing
const MONTHLY_LIMIT = 1000000; // 1 million calls per month for testing
const DAILY_LIMIT = 100000;    // 100,000 calls per day
const HOURLY_LIMIT = 10000;    // 10,000 calls per hour

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

// Rate limit configurations - set very high for testing
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  global: { windowMs: 60 * 60 * 1000, maxRequests: HOURLY_LIMIT }, 
  byIP: { windowMs: 15 * 60 * 1000, maxRequests: 1000 },         // 1000 requests per 15 minutes
  byEndpoint: { windowMs: 30 * 60 * 1000, maxRequests: 500 }     // 500 requests per endpoint
};

// Usage tracking file
const USAGE_FILE = path.join(process.cwd(), 'logs', 'amadeus-usage.json');

interface UsageRecord {
  timestamp: number;
  ip: string;
  endpoint: string;
  userAgent?: string;
  query?: string;
}

interface UsageData {
  currentMonth: string;
  totalCalls: number;
  records: UsageRecord[];
}

// Ensure log directory exists
function ensureLogDirectory() {
  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir, { recursive: true });
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }
}

// Load current usage data
function loadUsageData(): UsageData {
  ensureLogDirectory();
  
  if (!fs.existsSync(USAGE_FILE)) {
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
    return { currentMonth, totalCalls: 0, records: [] };
  }
  
  try {
    const data = fs.readFileSync(USAGE_FILE, 'utf8');
    const usageData = JSON.parse(data) as UsageData;
    
    // If it's a new month, reset the counter
    const currentMonth = new Date().toISOString().substring(0, 7);
    if (usageData.currentMonth !== currentMonth) {
      return { currentMonth, totalCalls: 0, records: [] };
    }
    
    return usageData;
  } catch (error) {
    console.error('Error reading API usage data:', error);
    const currentMonth = new Date().toISOString().substring(0, 7);
    return { currentMonth, totalCalls: 0, records: [] };
  }
}

// Save usage data
function saveUsageData(usageData: UsageData) {
  ensureLogDirectory();
  
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usageData, null, 2));
  } catch (error) {
    console.error('Error saving API usage data:', error);
  }
}

// Track a new API call
function trackApiCall(request: NextRequest, endpoint: string) {
  // Make tracking non-blocking to prevent API timeouts
  setImmediate(() => {
    try {
      const usageData = loadUsageData();
      
      // Add new record
      usageData.records.push({
        timestamp: Date.now(),
        ip: request.ip || 'unknown',
        endpoint,
        userAgent: request.headers.get('user-agent') || undefined,
        query: request.url.split('?')[1]
      });
      
      // Update total calls
      usageData.totalCalls += 1;
      
      // Trim old records (keep last 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      usageData.records = usageData.records.filter(record => record.timestamp >= thirtyDaysAgo);
      
      // Save updated data
      saveUsageData(usageData);
    } catch (error) {
      console.error('Error tracking API call:', error);
    }
  });
  
  // Return immediately without waiting for file operations
  return { tracked: true };
}

// Check if request is allowed under rate limits
// MODIFIED FOR TESTING: Always returns allowed=true to disable rate limiting
export function isRateLimited(request: NextRequest, endpoint: string): { allowed: boolean; reason?: string } {
  // For testing purposes, we're still tracking usage but not limiting anything
  // Track asynchronously to prevent blocking
  trackApiCall(request, endpoint);
  
  // Always allow all requests
  return { allowed: true };
  
  /* Original implementation - commented out for testing
  const usageData = loadUsageData();
  const now = Date.now();
  
  // Check if monthly limit reached
  if (usageData.totalCalls >= MONTHLY_LIMIT) {
    return { allowed: false, reason: 'Monthly API limit reached' };
  }
  
  // Check global rate limit
  const globalWindow = now - RATE_LIMITS.global.windowMs;
  const recentGlobalCalls = usageData.records.filter(r => r.timestamp >= globalWindow).length;
  
  if (recentGlobalCalls >= RATE_LIMITS.global.maxRequests) {
    return { allowed: false, reason: 'Hourly API limit reached' };
  }
  
  // Check IP-based rate limit
  const ip = request.ip || 'unknown';
  const ipWindow = now - RATE_LIMITS.byIP.windowMs;
  const recentIPCalls = usageData.records.filter(
    r => r.timestamp >= ipWindow && r.ip === ip
  ).length;
  
  if (recentIPCalls >= RATE_LIMITS.byIP.maxRequests) {
    return { allowed: false, reason: 'Too many requests from this IP address' };
  }
  
  // Check endpoint-specific rate limit
  const endpointWindow = now - RATE_LIMITS.byEndpoint.windowMs;
  const recentEndpointCalls = usageData.records.filter(
    r => r.timestamp >= endpointWindow && r.endpoint === endpoint && r.ip === ip
  ).length;
  
  if (recentEndpointCalls >= RATE_LIMITS.byEndpoint.maxRequests) {
    return { allowed: false, reason: `Too many requests to ${endpoint}` };
  }
  
  // Request is allowed
  trackApiCall(request, endpoint);
  */
  
  return { allowed: true };
}

// Get current usage statistics
export function getUsageStats() {
  const usageData = loadUsageData();
  const now = Date.now();
  
  // Calculate period stats
  const lastHour = usageData.records.filter(r => r.timestamp >= now - (60 * 60 * 1000)).length;
  const lastDay = usageData.records.filter(r => r.timestamp >= now - (24 * 60 * 60 * 1000)).length;
  const lastWeek = usageData.records.filter(r => r.timestamp >= now - (7 * 24 * 60 * 60 * 1000)).length;
  
  // Get unique IPs
  const uniqueIPs = new Set(usageData.records.map(r => r.ip)).size;
  
  // Get endpoint usage
  const endpointUsage: Record<string, number> = {};
  usageData.records.forEach(record => {
    endpointUsage[record.endpoint] = (endpointUsage[record.endpoint] || 0) + 1;
  });
  
  return {
    currentMonth: usageData.currentMonth,
    totalCalls: usageData.totalCalls,
    monthlyLimit: MONTHLY_LIMIT,
    percentUsed: Math.round((usageData.totalCalls / MONTHLY_LIMIT) * 100),
    periodStats: {
      lastHour,
      lastDay,
      lastWeek,
    },
    uniqueIPs,
    endpointUsage,
    limits: RATE_LIMITS
  };
}

// Create secure API key for protected endpoints
const API_KEY_SECRET = process.env.API_KEY_SECRET || 'skylimit-default-secret-key';

// Validate API key for admin endpoints
export function isValidApiKey(apiKey: string | null): boolean {
  if (!apiKey) return false;
  
  // The API key should be a hash of the secret and the current date (YYYY-MM-DD)
  // This makes the key expire daily and requires a new key each day
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Simple hash function for demo purposes
  // In production, use a proper crypto hash
  function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  const expectedKey = simpleHash(`${API_KEY_SECRET}-${today}`);
  return apiKey === expectedKey;
}

// Add 'destination-search' to the endpoint configurations
const ENDPOINT_CONFIGS = {
  // ... existing endpoints
  'destination-search': {
    tokensPerInterval: 10,
    interval: 60 * 1000, // 1 minute
    maxBurst: 5
  },
  // ... other endpoints
}; 