import { NextResponse } from 'next/server';

// Error logging levels
export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// Define types for error logging
export interface AmadeusErrorLog {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: any;
  params?: any;
}

// Server-side only imports and variables
let fs: any;
let path: any;
let LOG_DIR: string;
let AMADEUS_LOG_FILE: string;
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB

// Only import and use fs in a server context
if (typeof window === 'undefined') {
  // We're on the server
  fs = require('fs');
  path = require('path');
  LOG_DIR = path.join(process.cwd(), 'logs');
  AMADEUS_LOG_FILE = path.join(LOG_DIR, 'amadeus-api.log');
}

/**
 * Ensures log directory exists
 */
function ensureLogDirectory() {
  if (typeof window !== 'undefined') return; // Skip on client-side
  
  if (!fs.existsSync(LOG_DIR)) {
    try {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating log directory:', error);
    }
  }
}

/**
 * Rotate log file if it gets too large
 */
function rotateLogFileIfNeeded() {
  if (typeof window !== 'undefined') return; // Skip on client-side
  
  ensureLogDirectory();
  
  if (fs.existsSync(AMADEUS_LOG_FILE)) {
    try {
      const stats = fs.statSync(AMADEUS_LOG_FILE);
      if (stats.size > MAX_LOG_SIZE) {
        const date = new Date().toISOString().replace(/:/g, '-');
        fs.renameSync(
          AMADEUS_LOG_FILE,
          path.join(LOG_DIR, `amadeus-api-${date}.log`)
        );
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
  }
}

/**
 * Log Amadeus API errors to a dedicated log file
 */
export function logAmadeusEvent(
  level: LogLevel,
  source: string,
  message: string,
  details?: any,
  params?: any
) {
  if (typeof window !== 'undefined') {
    // Client-side: just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${source}: ${message}`);
      if (details) console.log('Details:', details);
      if (params) console.log('Params:', params);
    }
    return;
  }
  
  // Server-side: log to console immediately, file operations async
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${level}] ${source}: ${message}`);
    if (details) console.log('Details:', details);
    if (params) console.log('Params:', params);
  }
  
  // Make file operations non-blocking to prevent API timeouts
  setImmediate(() => {
    try {
      rotateLogFileIfNeeded();
      
      const logEntry: AmadeusErrorLog = {
        timestamp: new Date().toISOString(),
        level,
        source,
        message,
        details,
        params
      };
      
      // Write to log file asynchronously
      const logString = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(AMADEUS_LOG_FILE, logString);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  });
}

/**
 * Helper to format Amadeus API errors for logging
 */
export function handleAmadeusError(
  error: any,
  source: string,
  params?: any
): { status: number; error: string; details?: any } {
  const errorDetails = {
    message: error?.message || 'Unknown error',
    code: error?.code || 'UNKNOWN',
    status: 500
  };
  
  // Handle specific API error responses
  if (error?.response?.data?.errors) {
    const apiErrors = error.response.data.errors;
    errorDetails.message = apiErrors[0]?.detail || apiErrors[0]?.title || errorDetails.message;
    errorDetails.code = apiErrors[0]?.code || apiErrors[0]?.status || errorDetails.code;
    errorDetails.status = parseInt(apiErrors[0]?.status, 10) || 500;
  }
  
  // Log the error
  logAmadeusEvent(
    LogLevel.ERROR,
    source,
    errorDetails.message,
    {
      code: errorDetails.code,
      fullError: error?.toString?.(),
      responseData: error?.response?.data
    },
    params
  );
  
  return {
    status: errorDetails.status,
    error: errorDetails.message,
    details: {
      code: errorDetails.code,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json(
    {
      error: message,
      details
    },
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    }
  );
}

/**
 * Get the contents of the log file (for admin purposes)
 * This should only be called from server components or API routes
 */
export function getAmadeusLogs(maxLines: number = 100): string[] {
  if (typeof window !== 'undefined') {
    console.error('getAmadeusLogs can only be called from server-side code');
    return [];
  }
  
  ensureLogDirectory();
  
  if (!fs.existsSync(AMADEUS_LOG_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(AMADEUS_LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    
    // Return most recent logs first
    return lines.reverse().slice(0, maxLines);
  } catch (error) {
    console.error('Error reading log file:', error);
    return [];
  }
}

/**
 * Parse and filter logs
 */
export function parseAndFilterLogs(
  logs: string[],
  options?: {
    level?: LogLevel;
    source?: string;
    startDate?: Date;
    endDate?: Date;
  }
): AmadeusErrorLog[] {
  const parsedLogs: AmadeusErrorLog[] = logs
    .map(line => {
      try {
        return JSON.parse(line) as AmadeusErrorLog;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean) as AmadeusErrorLog[];
  
  if (!options) return parsedLogs;
  
  return parsedLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    
    if (options.level && log.level !== options.level) return false;
    if (options.source && log.source !== options.source) return false;
    if (options.startDate && logDate < options.startDate) return false;
    if (options.endDate && logDate > options.endDate) return false;
    
    return true;
  });
} 