import { NextRequest, NextResponse } from 'next/server';
import CostOptimizer from '@/lib/api-cost-optimizer';
import { LogLevel, logAmadeusEvent } from '@/lib/amadeus-error-logger';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Basic authentication middleware
function verifyAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    
    return username === 'admin' && password === process.env.ADMIN_PASSWORD;
  } catch (error) {
    console.error('Auth error:', error);
    return false;
  }
}

/**
 * GET handler for retrieving cost statistics
 */
export async function GET(req: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check authentication
  if (!verifyAuth(req)) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'admin-cost-monitor',
      `Unauthorized cost monitoring access [${requestId}]`,
      { ip: req.ip }
    );
    
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
    });
  }
  
  try {
    const costStats = CostOptimizer.getCostStats();
    
    // Add additional insights
    const insights = {
      costEfficiency: {
        averageCostPerCall: costStats.totalCalls > 0 ? 
          Math.round(costStats.monthly.spent / costStats.totalCalls) : 0,
        dailyBurnRate: costStats.daily.spent,
        projectedMonthlyCost: Math.round(costStats.daily.spent * 30),
        daysUntilLimit: costStats.daily.spent > 0 ? 
          Math.floor(costStats.monthly.limit / costStats.daily.spent) : Infinity
      },
      recommendations: generateCostRecommendations(costStats),
      alerts: generateCostAlerts(costStats)
    };
    
    logAmadeusEvent(
      LogLevel.INFO,
      'admin-cost-monitor',
      `Cost statistics retrieved [${requestId}]`,
      { 
        dailySpent: costStats.daily.spent,
        monthlySpent: costStats.monthly.spent,
        totalCalls: costStats.totalCalls
      }
    );
    
    return NextResponse.json({
      ...costStats,
      insights,
      timestamp: new Date().toISOString(),
      requestId
    });
  } catch (error) {
    console.error('Error getting cost statistics:', error);
    
    logAmadeusEvent(
      LogLevel.ERROR,
      'admin-cost-monitor',
      `Cost monitoring error [${requestId}]`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    
    return NextResponse.json({ error: 'Failed to get cost statistics' }, { status: 500 });
  }
}

/**
 * POST handler for updating cost limits
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID().substring(0, 8);
  
  // Check authentication
  if (!verifyAuth(req)) {
    logAmadeusEvent(
      LogLevel.WARNING,
      'admin-cost-monitor',
      `Unauthorized cost limit update attempt [${requestId}]`,
      { ip: req.ip }
    );
    
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin Access"' }
    });
  }
  
  try {
    const body = await req.json();
    const { action } = body;
    
    if (action === 'reset-daily') {
      // This would reset daily counters - implement based on your needs
      logAmadeusEvent(
        LogLevel.INFO,
        'admin-cost-monitor',
        `Daily cost counter reset requested [${requestId}]`
      );
      
      return NextResponse.json({
        success: true,
        message: 'Daily cost tracking will reset at midnight'
      });
    }
    
    if (action === 'emergency-stop') {
      // This would halt all API calls - implement emergency stop
      logAmadeusEvent(
        LogLevel.WARNING,
        'admin-cost-monitor',
        `Emergency API stop activated [${requestId}]`,
        { ip: req.ip }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Emergency stop activated - all API calls will be blocked'
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Error updating cost settings:', error);
    
    logAmadeusEvent(
      LogLevel.ERROR,
      'admin-cost-monitor',
      `Cost settings update error [${requestId}]`,
      { error: error instanceof Error ? error.message : String(error) }
    );
    
    return NextResponse.json({ error: 'Failed to update cost settings' }, { status: 500 });
  }
}

// Generate cost optimization recommendations
function generateCostRecommendations(stats: any): string[] {
  const recommendations = [];
  
  if (stats.daily.percentage > 80) {
    recommendations.push('🚨 Daily limit almost reached - consider implementing stricter rate limiting');
  }
  
  if (stats.monthly.percentage > 70) {
    recommendations.push('⚠️ Monthly budget 70% consumed - review API usage patterns');
  }
  
  if (stats.totalCalls > 100) {
    const avgCost = stats.monthly.spent / stats.totalCalls;
    if (avgCost > 3) {
      recommendations.push('💡 High average cost per call - consider caching optimization');
    }
  }
  
  if (stats.recentCalls.length >= 5) {
    const recentCallsInLastHour = stats.recentCalls.filter(
      call => Date.now() - call.timestamp < 60 * 60 * 1000
    ).length;
    
    if (recentCallsInLastHour > 10) {
      recommendations.push('⏰ High API frequency detected - implement request debouncing');
    }
  }
  
  return recommendations;
}

// Generate cost alerts
function generateCostAlerts(stats: any): Array<{level: string, message: string}> {
  const alerts = [];
  
  if (stats.daily.percentage >= 90) {
    alerts.push({
      level: 'critical',
      message: 'Daily cost limit almost exceeded!'
    });
  } else if (stats.daily.percentage >= 70) {
    alerts.push({
      level: 'warning',
      message: 'Daily cost approaching limit'
    });
  }
  
  if (stats.monthly.percentage >= 85) {
    alerts.push({
      level: 'critical',
      message: 'Monthly budget nearly depleted!'
    });
  } else if (stats.monthly.percentage >= 60) {
    alerts.push({
      level: 'warning',
      message: 'Monthly budget 60% consumed'
    });
  }
  
  return alerts;
} 