interface PendingRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

interface DebounceCache {
  [key: string]: {
    data: any;
    timestamp: number;
    promise?: Promise<any>;
  };
}

class RequestDebouncer {
  private pendingRequests: { [key: string]: PendingRequest[] } = {};
  private timeouts: { [key: string]: NodeJS.Timeout } = {};
  private cache: DebounceCache = {};
  private readonly defaultDelay: number = 500; // 500ms delay
  private readonly cacheTimeout: number = 30000; // 30 seconds cache

  /**
   * Debounce API requests to prevent excessive calls
   * @param key Unique identifier for the request type
   * @param requestFn Function that makes the actual API call
   * @param delay Debounce delay in milliseconds (default: 500ms)
   * @returns Promise that resolves with the API response
   */
  public debounce<T>(
    key: string,
    requestFn: () => Promise<T>,
    delay: number = this.defaultDelay
  ): Promise<T> {
    // Check cache first
    const cached = this.cache[key];
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log(`🎯 Using debounced cache for: ${key}`);
      return Promise.resolve(cached.data);
    }

    // If there's already a pending promise for this key, return it
    if (cached && cached.promise) {
      console.log(`⏳ Reusing pending request for: ${key}`);
      return cached.promise;
    }

    return new Promise<T>((resolve, reject) => {
      // Clear existing timeout for this key
      if (this.timeouts[key]) {
        clearTimeout(this.timeouts[key]);
      }

      // Initialize pending requests array if it doesn't exist
      if (!this.pendingRequests[key]) {
        this.pendingRequests[key] = [];
      }

      // Add this request to pending
      this.pendingRequests[key].push({ resolve, reject, timestamp: Date.now() });

      // Set new timeout
      this.timeouts[key] = setTimeout(async () => {
        const requests = this.pendingRequests[key] || [];
        delete this.pendingRequests[key];
        delete this.timeouts[key];

        if (requests.length === 0) return;

        console.log(`🚀 Executing debounced request: ${key} (${requests.length} pending)`);

        try {
          // Create the promise and cache it
          const promise = requestFn();
          this.cache[key] = {
            data: null,
            timestamp: Date.now(),
            promise
          };

          const result = await promise;
          
          // Update cache with result
          this.cache[key] = {
            data: result,
            timestamp: Date.now()
          };

          // Resolve all pending requests
          requests.forEach(request => request.resolve(result));

        } catch (error) {
          // Remove failed promise from cache
          delete this.cache[key];
          
          // Reject all pending requests
          requests.forEach(request => request.reject(error));
        }
      }, delay);
    });
  }

  /**
   * Cancel all pending requests for a specific key
   * @param key Request key to cancel
   */
  public cancel(key: string): void {
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]);
      delete this.timeouts[key];
    }

    const requests = this.pendingRequests[key];
    if (requests) {
      requests.forEach(request => 
        request.reject(new Error('Request cancelled'))
      );
      delete this.pendingRequests[key];
    }

    // Remove from cache
    delete this.cache[key];
  }

  /**
   * Clear all pending requests and cache
   */
  public clear(): void {
    Object.keys(this.timeouts).forEach(key => {
      clearTimeout(this.timeouts[key]);
    });
    
    Object.values(this.pendingRequests).flat().forEach(request => 
      request.reject(new Error('All requests cancelled'))
    );

    this.timeouts = {};
    this.pendingRequests = {};
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  public getStats() {
    const now = Date.now();
    const cacheKeys = Object.keys(this.cache);
    const validCache = cacheKeys.filter(key => 
      now - this.cache[key].timestamp < this.cacheTimeout
    );

    return {
      totalCached: cacheKeys.length,
      validCached: validCache.length,
      pendingRequests: Object.keys(this.pendingRequests).length,
      activeTimeouts: Object.keys(this.timeouts).length
    };
  }

  /**
   * Create a search-specific debounced function
   * @param baseUrl API endpoint base URL
   * @param delay Debounce delay
   */
  public createSearchDebouncer(baseUrl: string, delay: number = 800) {
    return (params: Record<string, string>) => {
      // Create a unique key based on search parameters
      const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
      
      const key = `search-${Buffer.from(sortedParams).toString('base64').substring(0, 20)}`;
      
      return this.debounce(
        key,
        async () => {
          const url = new URL(baseUrl);
          Object.entries(params).forEach(([key, value]) => {
            if (value) url.searchParams.set(key, value);
          });

          console.log(`🔍 Making API call: ${url.pathname}${url.search}`);
          
          const response = await fetch(url.toString());
          
          if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
          }
          
          return response.json();
        },
        delay
      );
    };
  }
}

// Create a singleton instance
const debouncer = new RequestDebouncer();

// Export convenience functions
export const searchDebouncer = debouncer.createSearchDebouncer('/api/flight-search', 800);
export const destinationDebouncer = debouncer.createSearchDebouncer('/api/destination-search', 600);
export const popularFlightsDebouncer = debouncer.createSearchDebouncer('/api/popular-flights', 1000);

// Export the debouncer instance for custom usage
export default debouncer;

// Export types for TypeScript users
export type { PendingRequest, DebounceCache }; 