"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Plane, Search, X, Globe, MapPin, Building, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { airports } from '@/data/airports';

interface EnhancedAirportSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
}

interface DestinationResult {
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  cityName?: string;
  countryName?: string;
  displayName: string;
  isAllAirports?: boolean;
}

export default function EnhancedAirportSelect({
  value,
  onChange,
  placeholder = "Search airports, cities, or countries...",
  className = "",
  error = "",
  label,
  disabled = false
}: EnhancedAirportSelectProps) {

  const [isOpen, setIsOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const [displayValue, setDisplayValue] = useState('');
  
  const [results, setResults] = useState<DestinationResult[]>([]);
  
  const [loading, setLoading] = useState(false);
  
  const [focused, setFocused] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      // Handle special codes
      if (value.endsWith('C')) {
        // Country code - display as "Country (All airports)"
        const countryCode = value.substring(0, value.length - 1);
        const countryAirports = airports.filter(a => 
          a.country.toLowerCase().includes(countryCode.toLowerCase())
        );
        if (countryAirports.length > 0) {
          setDisplayValue(`${countryAirports[0].country} (All airports)`);
        } else {
          setDisplayValue(value);
        }
      } else if (value.endsWith('A')) {
        // City code - display as "City (All airports)"
        const cityCode = value.substring(0, value.length - 1);
        const cityAirports = airports.filter(a => 
          a.city.toLowerCase().includes(cityCode.toLowerCase())
        );
        if (cityAirports.length > 0) {
          setDisplayValue(`${cityAirports[0].city} (All airports)`);
        } else {
          setDisplayValue(value);
        }
      } else {
        // Regular airport code
        const airport = airports.find(a => a.iataCode === value);
        if (airport) {
          setDisplayValue(`${airport.city} (${airport.iataCode})`);
        } else {
          setDisplayValue(value);
        }
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Debounced search function
  const debouncedSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/destination-search?keyword=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        
        // Add popular UK airports to the top if no specific search
        let enhancedResults = [...data];
        
        if (query.length === 2) {
          const popularUKAirports = airports
            .filter(a => 
              a.country === 'United Kingdom' && 
              ['LHR', 'LGW', 'STN', 'LTN', 'MAN', 'BHX', 'EDI', 'GLA'].includes(a.iataCode)
            )
            .map(airport => ({
              type: 'location',
              subType: 'AIRPORT',
              name: airport.name,
              iataCode: airport.iataCode,
              cityName: airport.city,
              countryName: airport.country,
              displayName: `${airport.city}, ${airport.country} - ${airport.name} (${airport.iataCode})`
            }));
          
          enhancedResults = [...popularUKAirports, ...data];
        }
        
        setResults(enhancedResults);
      } else {
        // Fallback to local search
        performLocalSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local search
      performLocalSearch(query);
    }

    setLoading(false);
  }, []);

  // Local search fallback
  const performLocalSearch = (query: string) => {
    const localResults = airports
      .filter(airport =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.iataCode.toLowerCase().includes(query.toLowerCase()) ||
        airport.country.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 15)
      .map(airport => ({
        type: 'location',
        subType: 'AIRPORT',
        name: airport.name,
        iataCode: airport.iataCode,
        cityName: airport.city,
        countryName: airport.country,
        displayName: `${airport.city}, ${airport.country} - ${airport.name} (${airport.iataCode})`
      }));

    // Group by country and add "All airports" options
    const countryGroups: Record<string, DestinationResult[]> = {};
    localResults.forEach(result => {
      if (result.countryName) {
        if (!countryGroups[result.countryName]) {
          countryGroups[result.countryName] = [];
        }
        countryGroups[result.countryName].push(result);
      }
    });

    // Add "All airports" options for countries with multiple airports
    const enhancedResults: DestinationResult[] = [...localResults];
    Object.entries(countryGroups).forEach(([country, countryResults]) => {
      if (countryResults.length > 1) {
        enhancedResults.unshift({
          type: 'location',
          subType: 'COUNTRY',
          name: `${country} (All airports)`,
          iataCode: country.substring(0, 3).toUpperCase() + 'C',
          countryName: country,
          displayName: `${country} (All airports)`,
          isAllAirports: true
        });
      }
    });

    setResults(enhancedResults);
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(true);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    // If user clears the input, also clear the selection
    if (!query) {
      onChange('');
      setResults([]);
    }
  };

  // Handle selection
  const handleSelect = (result: DestinationResult) => {
    onChange(result.iataCode);
    setIsOpen(false);
    setSearchQuery('');
    setResults([]);
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleInputFocus = () => {
    setFocused(true);
    setIsOpen(true);
    
    // If no search query, show popular airports
    if (!searchQuery && results.length === 0) {
      const popularAirports = airports
        .filter(a => 
          ['LHR', 'LGW', 'STN', 'LTN', 'MAN', 'BHX', 'EDI', 'GLA', 'CDG', 'AMS', 'FCO', 'BCN'].includes(a.iataCode)
        )
        .map(airport => ({
          type: 'location',
          subType: 'AIRPORT',
          name: airport.name,
          iataCode: airport.iataCode,
          cityName: airport.city,
          countryName: airport.country,
          displayName: `${airport.city}, ${airport.country} - ${airport.name} (${airport.iataCode})`
        }));
      
      setResults(popularAirports);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    setFocused(false);
    // Delay closing to allow for clicks
    setTimeout(() => {
      if (!focused) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }, 200);
  };

  // Clear selection
  const clearSelection = () => {
    onChange('');
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Get icon for destination type
  const getDestinationIcon = (subType: string, isAllAirports?: boolean) => {
    if (isAllAirports) {
      return <Globe className="h-4 w-4 text-blue-600" />;
    }
    
    switch (subType) {
      case 'AIRPORT':
        return <Plane className="h-4 w-4 text-blue-600" />;
      case 'CITY':
        return <Building className="h-4 w-4 text-green-600" />;
      case 'COUNTRY':
        return <Globe className="h-4 w-4 text-purple-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  // Group results for better display
  const groupedResults = results.reduce((acc, result) => {
    const key = result.isAllAirports ? 'All Airports' : 
                result.subType === 'AIRPORT' ? 'Airports' :
                result.subType === 'CITY' ? 'Cities' : 'Other';
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {} as Record<string, DestinationResult[]>);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery || displayValue}
          onChange={handleSearchChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          disabled={disabled}
          className={`pr-10 transition-all duration-200 ${
            focused ? 'ring-2 ring-blue-200 border-blue-500' : ''
          } ${error ? 'border-red-500 focus:ring-red-200' : ''} ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : ''
          }`}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          </div>
        )}
        
        {/* Clear button */}
        {value && !loading && !disabled && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Dropdown toggle */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
            disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center">
          <X className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-[9999] w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-hidden transform transition-all duration-200 ease-out scale-100 opacity-100">
          {/* Search hint */}
          {!searchQuery && results.length > 0 && (
            <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center text-sm text-gray-600">
                <Search className="h-4 w-4 mr-2 text-blue-600" />
                Popular destinations and airports
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center text-sm text-gray-600">
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : `Results for "${searchQuery}"`}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {Object.keys(groupedResults).length > 0 ? (
              <div className="py-1">
                {Object.entries(groupedResults).map(([groupName, groupResults]) => (
                  <div key={groupName}>
                    {/* Group header */}
                    {Object.keys(groupedResults).length > 1 && (
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        {groupName} ({groupResults.length})
                      </div>
                    )}
                    
                    {/* Group items */}
                    {groupResults.map((result, index) => (
                      <button
                        key={`${result.iataCode}-${index}`}
                        onClick={() => handleSelect(result)}
                        className="w-full text-left px-3 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 flex items-center justify-between border-b border-gray-50 last:border-b-0 group"
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <div className="flex-shrink-0 mr-3 transition-transform duration-150 group-hover:scale-110">
                            {getDestinationIcon(result.subType, result.isAllAirports)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate group-hover:text-blue-900 transition-colors">
                              {result.cityName || result.name}
                              {result.isAllAirports && (
                                <span className="text-blue-600 font-normal"> (All airports)</span>
                              )}
                            </div>
                            {result.subType === 'AIRPORT' && !result.isAllAirports && (
                              <div className="text-sm text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                                {result.name}
                              </div>
                            )}
                            {result.countryName && (
                              <div className="text-xs text-gray-400 truncate group-hover:text-gray-500 transition-colors">
                                {result.countryName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          <div className="text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                            {result.isAllAirports ? (
                              <span className="text-xs px-2 py-1 bg-blue-100 group-hover:bg-blue-200 rounded-full transition-colors">ALL</span>
                            ) : (
                              result.iataCode
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <div className="text-sm">Searching destinations...</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Search className="h-8 w-8 text-gray-300 mb-2" />
                    <div className="text-sm font-medium">No destinations found</div>
                    <div className="text-xs mt-1">Try searching for a city name, airport code, or country</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 