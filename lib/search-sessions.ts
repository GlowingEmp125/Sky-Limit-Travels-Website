// In a real app, this would be stored in a database
// For demo purposes, we'll use an in-memory cache
export type SearchSession = {
  id: string;
  timestamp: number;
  searchParams: Record<string, string>;
  results?: any[];
};

// Export searchSessions so it can be used by other modules
export const searchSessions: Map<string, SearchSession> = new Map();

// Maximum number of sessions to store in memory
export const MAX_SESSIONS = 100;
// Sessions expire after 24 hours
export const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

// Helper function to clean up expired sessions
export function cleanupSessions() {
  const now = Date.now();
  
  // Remove expired sessions
  for (const [id, session] of searchSessions.entries()) {
    if (now - session.timestamp > SESSION_EXPIRY) {
      searchSessions.delete(id);
    }
  }
  
  // If we still have too many sessions, remove the oldest ones
  if (searchSessions.size > MAX_SESSIONS) {
    const sortedSessions = Array.from(searchSessions.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
    const sessionsToRemove = sortedSessions.length - MAX_SESSIONS;
    
    for (let i = 0; i < sessionsToRemove; i++) {
      searchSessions.delete(sortedSessions[i][0]);
    }
  }
}

// Get a flight by ID from all stored search sessions
export function getFlightById(flightId: string) {
  for (const [sessionId, session] of searchSessions.entries()) {
    if (session.results && Array.isArray(session.results)) {
      const found = session.results.find(flight => flight.id === flightId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
} 