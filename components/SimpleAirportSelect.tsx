"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plane, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { airports } from '@/data/airports';

interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

interface SimpleAirportSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function SimpleAirportSelect({
  value,
  onChange,
  placeholder = "Search for airports...",
  className = "",
  error = ""
}: SimpleAirportSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      const airport = airports.find(a => a.iataCode === value);
      if (airport) {
        setDisplayValue(`${airport.city} (${airport.iataCode})`);
      } else {
        setDisplayValue(value);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Filter airports based on search query
  const filteredAirports = searchQuery
    ? airports.filter(airport =>
        airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.iataCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 50) // Limit results for performance
    : airports.slice(0, 50); // Show first 50 airports by default

  // Group filtered airports by country
  const groupedAirports = filteredAirports.reduce((acc, airport) => {
    if (!acc[airport.country]) {
      acc[airport.country] = [];
    }
    acc[airport.country].push(airport);
    return acc;
  }, {} as Record<string, Airport[]>);

  // Sort countries alphabetically
  const sortedCountries = Object.keys(groupedAirports).sort();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport.iataCode);
    setIsOpen(false);
    setSearchQuery('');
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsOpen(true);
    
    // If user clears the input, also clear the selection
    if (!query) {
      onChange('');
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const clearSelection = () => {
    onChange('');
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input Field */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery || displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={`pr-10 ${error ? 'border-red-500' : ''}`}
        />
        
        {/* Clear button when there's a value */}
        {value && !isOpen && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Dropdown toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-80 overflow-hidden">
          {/* Search hint */}
          {!searchQuery && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center text-sm text-gray-600">
                <Search className="h-4 w-4 mr-2" />
                Type to search airports, cities, or countries...
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-64 overflow-y-auto">
            {sortedCountries.length > 0 ? (
              <div className="py-2">
                {sortedCountries.map((country) => (
                  <div key={country}>
                    {/* Country Header */}
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                      {country} ({groupedAirports[country].length} airports)
                    </div>
                    
                    {/* Airports in this country */}
                    {groupedAirports[country].map((airport) => (
                      <button
                        key={airport.id}
                        onClick={() => handleSelect(airport)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <Plane className="h-4 w-4 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {airport.city}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {airport.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {airport.iataCode}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <div className="text-sm">No airports found</div>
                <div className="text-xs">Try searching for a city name or airport code</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 