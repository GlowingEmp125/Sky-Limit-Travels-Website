"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, MapPin, Building, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Interface for search results
interface Destination {
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  cityName?: string;
  countryName?: string;
  displayName: string;
  isAllAirports?: boolean;
}

export function DestinationSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Search API when query changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setIsSearching(true);
      
      try {
        const response = await fetch(
          `/api/destination-search?keyword=${encodeURIComponent(searchQuery)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.error('Error fetching destinations');
          setResults([]);
        }
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    // If something is already selected, route to it directly
    if (results.length === 1) {
      handleResultClick(results[0]);
    }
  };

  const handleResultClick = (destination: Destination) => {
    // Determine where to route based on destination type
    let routePath = '';
    
    if (destination.subType === 'CITY') {
      // Route to a city
      const cityName = destination.name.toLowerCase();
      const countryName = destination.countryName?.toLowerCase() || '';
      
      // First try to find a matching continent or country page
      if (countryName.includes('france')) {
        routePath = '/flights/countries/france';
      } else if (countryName.includes('italy')) {
        routePath = '/flights/countries/italy';
      } else if (countryName.includes('spain')) {
        routePath = '/flights/countries/spain';
      } else if (countryName.includes('greece')) {
        routePath = '/flights/countries/greece';
      } else if (countryName.includes('portugal')) {
        routePath = '/flights/countries/portugal';
      } else if (countryName.includes('croatia')) {
        routePath = '/flights/countries/croatia';
      } else if (countryName.includes('turkey')) {
        routePath = '/flights/countries/turkey';
      } else if (
        countryName.includes('france') || 
        countryName.includes('italy') || 
        countryName.includes('spain') ||
        countryName.includes('germany') ||
        countryName.includes('netherlands') ||
        countryName.includes('belgium') ||
        countryName.includes('austria') ||
        countryName.includes('switzerland') ||
        countryName.includes('denmark') ||
        countryName.includes('sweden') ||
        countryName.includes('portugal') ||
        countryName.includes('greece')
      ) {
        routePath = '/destinations/europe';
      } else if (
        countryName.includes('usa') || 
        countryName.includes('canada') || 
        countryName.includes('mexico') ||
        countryName.includes('brazil') ||
        countryName.includes('argentina')
      ) {
        routePath = '/destinations/americas';
      } else if (
        countryName.includes('japan') || 
        countryName.includes('china') || 
        countryName.includes('india') ||
        countryName.includes('thailand') ||
        countryName.includes('singapore') ||
        countryName.includes('malaysia')
      ) {
        routePath = '/destinations/asia';
      } else if (
        countryName.includes('australia') || 
        countryName.includes('new zealand')
      ) {
        routePath = '/destinations/oceania';
      } else if (
        countryName.includes('egypt') || 
        countryName.includes('south africa') || 
        countryName.includes('morocco') ||
        countryName.includes('kenya') ||
        countryName.includes('nigeria')
      ) {
        routePath = '/destinations/africa';
      } else {
        // If we can't find a match, go to search page
        routePath = `/search?type=flight&destination=${destination.iataCode}&departureAirport=LHR`;
      }
    } else {
      // For airports, go to flight search page
      routePath = `/search?type=flight&destination=${destination.iataCode}&departureAirport=LHR`;
    }
    
    // Clear search state and navigate
    router.push(routePath);
    setResults([]);
    setSearchQuery('');
    setIsSearching(false);
  };

  // Get the appropriate icon for the destination type
  const getDestinationIcon = (subType: string, isAllAirports?: boolean) => {
    if (isAllAirports) {
      return <Globe className="h-4 w-4 mr-2 text-blue-600" />;
    }
    
    switch (subType) {
      case 'AIRPORT':
        return <MapPin className="h-4 w-4 mr-2" />;
      case 'CITY':
        return <Building className="h-4 w-4 mr-2" />;
      default:
        return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-5 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Search destinations worldwide..."
            aria-label="Search destinations"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 p-2"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </form>

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
              <span className="text-sm text-gray-500">Searching destinations...</span>
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-80 overflow-auto">
              {results.map((destination, index) => (
                <li key={`${destination.iataCode}-${index}`}>
                  <button
                    onClick={() => handleResultClick(destination)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-150 flex items-center",
                      destination.isAllAirports && "bg-blue-50/50"
                    )}
                  >
                    {getDestinationIcon(destination.subType, destination.isAllAirports)}
                    <div>
                      <div className="font-medium text-gray-800">
                        {destination.isAllAirports 
                          ? destination.cityName + ' (All airports)'
                          : destination.subType === 'AIRPORT' 
                            ? destination.name 
                            : destination.cityName || destination.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {destination.countryName || destination.name}
                        <Badge 
                          variant={destination.isAllAirports ? "secondary" : "outline"}
                          className={cn(
                            "ml-2 text-xs py-0 h-5",
                            destination.isAllAirports && "bg-blue-100 text-blue-800 border-blue-200"
                          )}
                        >
                          {destination.isAllAirports ? "All" : destination.iataCode}
                        </Badge>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No destinations found. Try a different search term.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 