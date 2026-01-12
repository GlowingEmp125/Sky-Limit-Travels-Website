import { NextRequest, NextResponse } from 'next/server';
import { getAmadeusLogs, parseAndFilterLogs } from '@/lib/amadeus-error-logger';

// Admin API key - in a real app, use environment variables
const ADMIN_API_KEY = 'skylimit-admin-dev';

/**
 * Retrieve API logs for admin panel
 * 
 * Query parameters:
 * - level: Filter by log level (INFO, WARNING, ERROR, DEBUG)
 * - source: Filter by source system
 * - maxLines: Number of lines to return (default 100)
 * - format: 'json' or 'raw' (default json)
 * - apiKey: Admin API key for authentication
 */
export async function GET(request: NextRequest) {
  // Check API key
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get('apiKey');
  
  if (apiKey !== ADMIN_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // Parse query parameters
    const maxLines = parseInt(searchParams.get('maxLines') || '100', 10);
    const format = searchParams.get('format') || 'json';
    
    // Get logs
    const rawLogs = getAmadeusLogs(maxLines);
    
    // Parse logs if JSON format is requested
    if (format === 'json') {
      const parsedLogs = parseAndFilterLogs(rawLogs);
      return NextResponse.json({ logs: parsedLogs });
    }
    
    // Return raw logs as text
    return NextResponse.json({ logs: rawLogs });
  } catch (error) {
    console.error('Error retrieving logs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
} 