import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  SearchSession, 
  searchSessions, 
  cleanupSessions,
  SESSION_EXPIRY
} from '@/lib/search-sessions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.searchParams) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Clean up expired sessions
    cleanupSessions();
    
    // Generate a unique ID
    const sessionId = uuidv4();
    
    // Store the search session
    const session: SearchSession = {
      id: sessionId,
      timestamp: Date.now(),
      searchParams: body.searchParams,
      results: body.results || []
    };
    
    searchSessions.set(sessionId, session);
    
    return NextResponse.json({
      success: true,
      sessionId
    });
  } catch (error) {
    console.error('Search session API error:', error);
    return NextResponse.json(
      { error: 'Failed to store search session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    const session = searchSessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // Check if the session has expired
    if (Date.now() - session.timestamp > SESSION_EXPIRY) {
      searchSessions.delete(sessionId);
      return NextResponse.json(
        { error: 'Session has expired' },
        { status: 410 }
      );
    }
    
    return NextResponse.json(session);
  } catch (error) {
    console.error('Search session API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve search session' },
      { status: 500 }
    );
  }
} 