"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MapPin, Plane, Building, X, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Destination {
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  cityName?: string;
  countryName?: string;
  displayName: string;
  isAllAirports?: boolean;
}

interface EnhancedDestinationSearchProps {
  placeholder?: string;
  onSelect: (destination: Destination) => void;
  value?: string;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  error?: string;
  label?: string;
  autoFocus?: boolean;
  allowCities?: boolean;
  allowAirports?: boolean;
}

export default function EnhancedDestinationSearch({
  placeholder = "Search destinations...",
  onSelect,
  value,
  defaultValue = '',
  className = '',
  inputClassName = '',
  error,
  label,
  autoFocus = false,
  allowCities = true,
  allowAirports = true,
}: EnhancedDestinationSearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>(defaultValue);
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    }
  }, [value]);

  // Handle document clicks to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for destinations when the search term changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Determine what types to search for
        let subType = '';
        if (allowAirports && allowCities) {
          subType = 'AIRPORT,CITY';
        } else if (allowAirports) {
          subType = 'AIRPORT';
        } else if (allowCities) {
          subType = 'CITY';
        }

        const response = await fetch(
          `/api/destination-search?keyword=${encodeURIComponent(searchTerm)}&subType=${subType}`
        );
        
        if (response.ok) {
          try {
            const data = await response.json();
            
            // Validate that data is an array before setting results
            if (Array.isArray(data)) {
              setResults(data);
            } else {
              console.error('API returned invalid data format (not an array):', data);
              setResults([]);
            }
          } catch (jsonError) {
            console.error('Failed to parse JSON response:', jsonError);
            setResults([]);
          }
        } else {
          console.error('Error fetching destinations:', response.status, response.statusText);
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
  }, [searchTerm, allowAirports, allowCities]);

  const handleSelectDestination = (destination: Destination) => {
    setSelectedDestination(destination);
    setSearchTerm(destination.displayName);
    setFocused(false);
    onSelect(destination);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedDestination(null);
    setResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    onSelect({
      type: '',
      subType: '',
      name: '',
      iataCode: '',
      displayName: ''
    });
  };

  // Get the appropriate icon for the destination type
  const getDestinationIcon = (subType: string, isAllAirports?: boolean) => {
    if (isAllAirports) {
      if (subType === 'COUNTRY') {
        return <Globe className="h-4 w-4 mr-2 text-green-600" />;
      }
      return <Globe className="h-4 w-4 mr-2 text-blue-600" />;
    }
    
    switch (subType) {
      case 'AIRPORT':
        return <Plane className="h-4 w-4 mr-2" />;
      case 'CITY':
        return <Building className="h-4 w-4 mr-2" />;
      default:
        return <MapPin className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setFocused(true)}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-10",
            error ? "border-red-500 focus:ring-red-500" : "",
            inputClassName
          )}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      
      {focused && (loading || results.length > 0) && (
        <div 
          ref={resultsRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-72 overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span className="text-sm text-gray-500">Searching...</span>
            </div>
          ) : (
            <ul className="py-1">
              {results.map((destination, index) => (
                <li key={`${destination.iataCode}-${index}`}>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors duration-150 flex items-center",
                      destination.isAllAirports && destination.subType === 'COUNTRY' ? "bg-green-50/50" : (destination.isAllAirports ? "bg-blue-50/50" : "")
                    )}
                    onClick={() => handleSelectDestination(destination)}
                  >
                    {getDestinationIcon(destination.subType, destination.isAllAirports)}
                    <div>
                      <div className="font-medium text-gray-800">
                        {destination.isAllAirports 
                          ? (destination.subType === 'COUNTRY'
                            ? destination.countryName + ' (All airports)'
                            : destination.cityName + ' (All airports)')
                          : destination.subType === 'AIRPORT' 
                            ? destination.name 
                            : destination.cityName || destination.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {destination.countryName || destination.name}
                        <Badge 
                          variant={destination.isAllAirports 
                            ? (destination.subType === 'COUNTRY' ? "secondary" : "outline") 
                            : "outline"}
                          className={cn(
                            "ml-2 text-xs py-0 h-5",
                            destination.isAllAirports && destination.subType === 'COUNTRY'
                              ? "bg-green-100 text-green-800 border-green-200"
                              : (destination.isAllAirports 
                                  ? "bg-blue-100 text-blue-800 border-blue-200" 
                                  : "")
                          )}
                        >
                          {destination.subType === 'COUNTRY' && destination.isAllAirports
                            ? "Country"
                            : destination.subType === 'CITY' && destination.isAllAirports
                              ? "City" 
                              : destination.iataCode}
                        </Badge>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 