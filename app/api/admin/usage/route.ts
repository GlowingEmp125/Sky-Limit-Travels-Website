import { NextRequest, NextResponse } from 'next/server';
import { getUsageStats, isValidApiKey } from '@/lib/api-rate-limiter';
import { LogLevel, logAmadeusEvent } from '@/lib/amadeus-error-logger';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check for admin API key
  const apiKey = request.headers.get('x-api-key');
  
  if (!isValidApiKey(apiKey)) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'admin-usage-api',
      `Unauthorized access attempt [${requestId}]`,
      { ip: request.ip }
    );
    
    return NextResponse.json(
      { error: 'Unauthorized: Invalid API key' },
      { status: 401 }
    );
  }
  
  // Log the request
  logAmadeusEvent(
    LogLevel.INFO,
    'admin-usage-api',
    `API usage stats request [${requestId}]`,
    { ip: request.ip }
  );
  
  try {
    // Get usage statistics
    const usageStats = getUsageStats();
    
    return NextResponse.json({
      status: 'success',
      requestId,
      data: usageStats
    });
  } catch (error) {
    logAmadeusEvent(
      LogLevel.ERROR,
      'admin-usage-api',
      `Error retrieving API usage stats [${requestId}]`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to retrieve API usage statistics',
        requestId
      },
      { status: 500 }
    );
  }
} 