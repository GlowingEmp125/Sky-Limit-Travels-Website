import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats, clearCache } from '@/lib/amadeus';
import { isRateLimited } from '@/lib/api-rate-limiter';
import { LogLevel, logAmadeusEvent } from '@/lib/amadeus-error-logger';

// Basic authentication middleware
function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  try {
    // Extract the credentials from the Basic auth header
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    // Verify username/password (simple version for now)
    return username === 'admin' && password === process.env.ADMIN_PASSWORD;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}

/**
 * GET handler for retrieving cache statistics
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Track API usage 
  isRateLimited(req, 'admin-cache-stats');
  
  // Check authentication
  if (!verifyAuth(req)) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'admin-api',
      `Unauthorized cache stats access [${requestId}]`,
      { ip: req.ip }
    );
    
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
    });
  }
  
  try {
    const stats = getCacheStats();
    
    logAmadeusEvent(
      LogLevel.INFO,
      'admin-api',
      `Cache stats retrieved [${requestId}]`,
      { 
        cacheFiles: stats.cacheFiles,
        totalSize: stats.totalSize 
      }
    );
    
    return NextResponse.json({
      cacheFiles: stats.cacheFiles,
      totalSize: stats.totalSize,
      oldestCache: new Date(stats.oldestCache).toISOString(),
      newestCache: new Date(stats.newestCache).toISOString(),
      files: stats.files.map(file => ({
        name: file.name,
        size: file.size,
        date: new Date(file.date).toISOString(),
      }))
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    
    logAmadeusEvent(
      LogLevel.ERROR,
      'admin-api',
      `Cache stats error [${requestId}]`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    
    return NextResponse.json({ error: 'Failed to get cache statistics' }, { status: 500 });
  }
}

/**
 * POST handler for clearing cache
 * Query params:
 * - all: if 'true', clears all cache files regardless of expiry
 * - days: number of days to consider for expiry (defaults to 7)
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Track API usage
  isRateLimited(req, 'admin-cache-clear');
  
  // Check authentication
  if (!verifyAuth(req)) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'admin-api',
      `Unauthorized cache clear attempt [${requestId}]`,
      { ip: req.ip }
    );
    
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
    });
  }
  
  try {
    // Parse query parameters for clearing options
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    const days = parseInt(searchParams.get('days') || '7', 10);
    
    const result = clearCache(all, days);
    
    logAmadeusEvent(
      LogLevel.INFO,
      'admin-api',
      `Cache cleared [${requestId}]`,
      { 
        all,
        days,
        deletedCount: result.deletedCount
      }
    );
    
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: all 
        ? `Cleared all cache files (${result.deletedCount} files)`
        : `Cleared cache files older than ${days} days (${result.deletedCount} files)`
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    
    logAmadeusEvent(
      LogLevel.ERROR,
      'admin-api',
      `Cache clear error [${requestId}]`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
} 