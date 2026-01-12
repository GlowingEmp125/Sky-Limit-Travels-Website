"use client";

import { Search, Plane, Users, Calendar, Info, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import cached popular destinations
import { POPULAR_DESTINATIONS } from '@/lib/fallback-data';
import { 
  getCachedDestinations, 
  getCachedDateRanges, 
  getEstimatedPrice, 
  trackSearchSelection,
  getOptimizedSuggestions 
} from '@/lib/smart-search-cache-client';

interface SmartFlightSearchFormProps {
  variant?: 'default' | 'featured';
  className?: string;
}

interface PopularDestination {
  code: string;
  city: string;
  country: string;
  basePrice: number;
  terminal?: string;
}

// Common UK departure airports
const UK_AIRPORTS = [
  { code: 'LHR', name: 'Heathrow', city: 'London' },
  { code: 'LGW', name: 'Gatwick', city: 'London' },
  { code: 'STN', name: 'Stansted', city: 'London' },
  { code: 'LTN', name: 'Luton', city: 'London' },
  { code: 'MAN', name: 'Manchester', city: 'Manchester' },
  { code: 'BHX', name: 'Birmingham', city: 'Birmingham' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh' },
  { code: 'GLA', name: 'Glasgow', city: 'Glasgow' },
];

// Popular date ranges (cached options)
const POPULAR_DATE_RANGES = [
  { label: 'This Weekend', days: [5, 2] },
  { label: 'Next Weekend', days: [12, 2] },
  { label: 'Long Weekend', days: [19, 3] },
  { label: 'Week Holiday', days: [30, 7] },
  { label: 'Summer Break', days: [60, 14] },
];

export default function SmartFlightSearchForm({ variant = 'default', className = '' }: SmartFlightSearchFormProps) {
  const router = useRouter();
  
  // Form state
  const [departureAirport, setDepartureAirport] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [tripType, setTripType] = useState<'return' | 'one-way'>('return');
  
  // Smart search state
  const [searchStep, setSearchStep] = useState<'origin' | 'destination' | 'dates' | 'ready'>('origin');
  const [showDestinations, setShowDestinations] = useState(false);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);

  // Form validation
  const [formErrors, setFormErrors] = useState({
    departureAirport: '',
    destination: '',
    departureDate: ''
  });

  // Get cached data
  const cachedDestinations = useMemo(() => {
    return getOptimizedSuggestions(departureAirport || undefined);
  }, [departureAirport]);

  const cachedDateRanges = useMemo(() => {
    return getCachedDateRanges();
  }, []);

  // Filtered destinations based on selection
  const filteredDestinations = useMemo(() => {
    return cachedDestinations.slice(0, 8); // Show top 8 for cleaner UI
  }, [cachedDestinations]);

  // Convert cached date ranges to component format
  const popularDateRanges = useMemo(() => {
    return cachedDateRanges.map(range => ({
      label: range.label,
      days: [range.startOffset, range.duration]
    }));
  }, [cachedDateRanges]);

  // Calculate dates based on selected range
  const calculateDatesFromRange = (range: { days: number[] }) => {
    const today = new Date();
    const departure = new Date(today);
    departure.setDate(today.getDate() + range.days[0]);
    
    const returnDateObj = new Date(departure);
    returnDateObj.setDate(departure.getDate() + range.days[1]);
    
    return {
      departureDate: departure.toISOString().split('T')[0],
      returnDate: returnDateObj.toISOString().split('T')[0]
    };
  };

  // Handle origin selection
  const handleDepartureAirportChange = (airport: typeof UK_AIRPORTS[0]) => {
    setDepartureAirport(airport.code);
    setSearchStep('destination');
    setShowDestinations(true);
    
    // Track origin selection
    trackSearchSelection(airport.code, '', undefined);
    
    if (formErrors.departureAirport) {
      setFormErrors({ ...formErrors, departureAirport: '' });
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destination: any) => {
    setDestination(destination.code);
    setSearchStep('dates');
    setShowDestinations(false);
    setShowDateOptions(true);
    
    // Track destination selection
    trackSearchSelection(departureAirport, destination.code, undefined);
  };

  // Handle date range selection
  const handleDateRangeSelect = (range: any) => {
    const dates = calculateDatesFromRange(range);
    setDepartureDate(dates.departureDate);
    setReturnDate(dates.returnDate);
    setSelectedDateRange(range);
    setSearchStep('ready');
    setShowDateOptions(false);
    
    // Track date range selection
    trackSearchSelection(departureAirport, destination, range.label);
  };

  // Handle custom date selection
  const handleCustomDateChange = (field: 'departure' | 'return', value: string) => {
    if (field === 'departure') {
      setDepartureDate(value);
    } else {
      setReturnDate(value);
    }
    setSelectedDateRange(null);
    
    if (departureDate && (tripType === 'one-way' || returnDate)) {
      setSearchStep('ready');
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = { departureAirport: '', destination: '', departureDate: '' };
    let isValid = true;

    if (!departureAirport) {
      errors.departureAirport = 'Please select departure airport';
      isValid = false;
    }

    if (!destination) {
      errors.destination = 'Please select destination';
      isValid = false;
    }

    if (!departureDate) {
      errors.departureDate = 'Please select departure date';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle search - this is where the API call happens
  const handleSearch = () => {
    if (!validateForm()) {
      return;
    }

    console.log(`Smart search: ${departureAirport} → ${destination}`);

    // Track the final search
    trackSearchSelection(
      departureAirport, 
      destination, 
      selectedDateRange?.label
    );

    // Use the smart search API endpoint
    const searchParams = new URLSearchParams({
      type: 'flight',
      departureAirport,
      destination,
      departureDate,
      ...(tripType === 'return' && returnDate && { returnDate }),
      adults,
      children,
      searchType: 'full' // This triggers the API call
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  // Get airport name
  const getAirportName = (code: string) => {
    const airport = UK_AIRPORTS.find(a => a.code === code);
    return airport ? `${airport.name} (${airport.code})` : code;
  };

  // Get destination name
  const getDestinationName = (code: string) => {
    const dest = POPULAR_DESTINATIONS.find(d => d.code === code);
    return dest ? `${dest.city}, ${dest.country}` : code;
  };

  // Get tomorrow's date for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get estimated price for destination
  const getDestinationPrice = (destCode: string) => {
    if (!departureDate) return null;
    
    const depDate = new Date(departureDate);
    const today = new Date();
    const daysDifference = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return getEstimatedPrice(departureAirport, destCode, daysDifference);
  };

  // Different styles based on variant
  const containerStyles = variant === 'featured' 
    ? 'bg-white/95 rounded-2xl shadow-lg border border-white/20'
    : 'bg-white rounded-lg shadow-md';

  return (
    <div className={`w-full ${className}`} id="smart-search">
      <div className={containerStyles}>
        {/* Form Header */}
        <div className={`bg-gradient-to-r from-blue-600 to-blue-700 p-3 md:p-4 ${variant === 'featured' ? 'text-center' : ''}`}>
          <h2 className="text-lg md:text-xl font-bold text-white mb-1 flex items-center justify-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Smart Flight Search
          </h2>
          {variant === 'featured' && (
            <p className="text-sm md:text-base text-blue-100">
              Pick your preferences first, then we'll find precise matches
            </p>
          )}
        </div>

        {/* Form Content */}
        <div className="p-3 md:p-6 space-y-4">
          {/* Trip Type Selection */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="return"
                checked={tripType === 'return'}
                onChange={() => setTripType('return')}
                className="text-blue-600 focus:ring-blue-200"
              />
              <span className="text-sm font-medium text-gray-700">Return</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="one-way"
                checked={tripType === 'one-way'}
                onChange={() => setTripType('one-way')}
                className="text-blue-600 focus:ring-blue-200"
              />
              <span className="text-sm font-medium text-gray-700">One Way</span>
            </label>
          </div>

          {/* Step 1: Origin Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <Plane className="w-4 h-4 mr-2 text-blue-600 -rotate-45" /> From
            </label>
            
            {!departureAirport ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {UK_AIRPORTS.slice(0, 8).map((airport) => (
                  <Button
                    key={airport.code}
                    variant="outline"
                    className="h-auto p-3 text-left border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => handleDepartureAirportChange(airport)}
                  >
                    <div>
                      <div className="font-semibold text-sm">{airport.city}</div>
                      <div className="text-xs text-gray-500">{airport.code}</div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">{getAirportName(departureAirport)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDepartureAirport('');
                    setDestination('');
                    setSearchStep('origin');
                    setShowDestinations(false);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </Button>
              </div>
            )}
            {formErrors.departureAirport && (
              <p className="text-red-500 text-sm">{formErrors.departureAirport}</p>
            )}
          </div>

          {/* Step 2: Destination Selection */}
          {showDestinations && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Plane className="w-4 h-4 mr-2 text-blue-600" /> To
              </label>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Popular destinations from {getAirportName(departureAirport)}:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {filteredDestinations.map((dest) => (
                    <Button
                      key={dest.code}
                      variant="outline"
                      className="h-auto p-3 text-left justify-between border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                      onClick={() => handleDestinationSelect(dest)}
                    >
                      <div>
                        <div className="font-semibold text-sm">{dest.city}</div>
                        <div className="text-xs text-gray-500">{dest.country}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">from £{dest.basePrice}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Destination Display */}
          {destination && !showDestinations && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Plane className="w-4 h-4 mr-2 text-blue-600" /> To
              </label>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-800">{getDestinationName(destination)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDestination('');
                    setSearchStep('destination');
                    setShowDestinations(true);
                    setShowDateOptions(false);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Date Selection */}
          {showDateOptions && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" /> When?
              </label>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Popular date ranges:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {popularDateRanges.map((range) => (
                    <Button
                      key={range.label}
                      variant="outline"
                      className="h-auto p-3 text-center border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                      onClick={() => handleDateRangeSelect(range)}
                    >
                      <div>
                        <div className="font-semibold text-sm">{range.label}</div>
                        <div className="text-xs text-gray-500">{range.days[1]} days</div>
                      </div>
                    </Button>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">Or choose specific dates:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="date"
                        value={departureDate}
                        onChange={(e) => handleCustomDateChange('departure', e.target.value)}
                        min={getTomorrowDate()}
                        className="w-full"
                        placeholder="Departure date"
                      />
                    </div>
                    {tripType === 'return' && (
                      <div>
                        <Input
                          type="date"
                          value={returnDate}
                          onChange={(e) => handleCustomDateChange('return', e.target.value)}
                          min={departureDate || getTomorrowDate()}
                          className="w-full"
                          placeholder="Return date"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Dates Display */}
          {(departureDate || selectedDateRange) && !showDateOptions && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" /> Dates
              </label>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-blue-800">
                  {selectedDateRange ? (
                    <span className="font-medium">{selectedDateRange.label}</span>
                  ) : (
                    <span className="font-medium">
                      {new Date(departureDate).toLocaleDateString('en-GB')}
                      {returnDate && ` - ${new Date(returnDate).toLocaleDateString('en-GB')}`}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDepartureDate('');
                    setReturnDate('');
                    setSelectedDateRange(null);
                    setSearchStep('dates');
                    setShowDateOptions(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </Button>
              </div>
            </div>
          )}

          {/* Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 mr-2" /> Adults (12y+)
              </label>
              <select
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Users className="w-4 h-4 mr-2" /> Children (0-11y)
              </label>
              <select
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={children}
                onChange={(e) => setChildren(e.target.value)}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="button"
            className={`w-full py-2 rounded-md transition-all duration-200 flex items-center justify-center gap-2 ${
              searchStep === 'ready' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleSearch}
            disabled={searchStep !== 'ready'}
          >
            <Search className="w-5 h-5" />
            {searchStep === 'ready' ? 'Search Flights Now' : 'Complete Selection Above'}
          </Button>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            <div className={`w-2 h-2 rounded-full ${departureAirport ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${destination ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`w-2 h-2 rounded-full ${departureDate ? 'bg-blue-600' : 'bg-gray-300'}`} />
          </div>

          {/* Informational text */}
          <div className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center">
            <Info className="w-3 h-3 mr-1" />
            Select your preferences above, then we'll search for live prices
          </div>
        </div>
      </div>
    </div>
  );
} 