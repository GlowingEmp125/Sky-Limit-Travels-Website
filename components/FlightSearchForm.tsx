'use client';

import { Search, Plane, Users, Calendar, Info, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimpleAirportSelect from './SimpleAirportSelect';
import EnhancedAirportSelect from './EnhancedAirportSelect';

interface FlightSearchFormProps {
  variant?: 'default' | 'featured';
  className?: string;
}

export default function FlightSearchForm({ variant = 'default', className = '' }: FlightSearchFormProps) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [departureAirport, setDepartureAirport] = useState('LHR');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [infants, setInfants] = useState('0');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tripType, setTripType] = useState<'one-way' | 'return'>('return');
  const [tripClass, setTripClass] = useState<'Y' | 'C'>('Y');

  // Set default dates on component mount
  useEffect(() => {
    // Set default departure date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartureDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default return date to 7 days after departure
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    setReturnDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  // Calculate total passengers
  const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!destination) {
      errors.destination = 'Please select a destination';
    }
    
    if (!departureAirport) {
      errors.departureAirport = 'Please select a departure airport';
    }
    
    if (!departureDate) {
      errors.departureDate = 'Please select a departure date';
    }
    
    // Check if return date is before departure date
    if (tripType === 'return' && returnDate && new Date(returnDate) < new Date(departureDate)) {
      errors.returnDate = 'Return date must be after departure date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = () => {
    if (!validateForm()) {
      return;
    }

    console.log(`Searching for flights: ${departureAirport} → ${destination}`);

    // Use dates directly without additional formatting
    const searchParams = new URLSearchParams({
      type: 'flight',
      departureAirport,
      destination,
      departureDate,
      ...(tripType === 'return' && returnDate && { returnDate }),
      adults,
      children,
      infants,
      tripClass
    });
    
    router.push(`/search?${searchParams.toString()}`);
  };

  // Handle departure airport selection
  const handleDepartureAirportChange = (value: string) => {
    setDepartureAirport(value);
    
    if (formErrors.departureAirport) {
      setFormErrors({ ...formErrors, departureAirport: '' });
    }
  };

  // Handle destination selection
  const handleDestinationChange = (value: string) => {
    setDestination(value);
    
    if (formErrors.destination) {
      setFormErrors({ ...formErrors, destination: '' });
    }
  };

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Different styles based on variant
  const containerStyles = variant === 'featured' 
    ? 'bg-white/95 rounded-2xl shadow-lg border border-white/20'
    : 'bg-white rounded-lg shadow-md';

  return (
    <div className={`w-full ${className}`} id="search">
      <div className={containerStyles}>
        {/* Form Header */}
        <div className={`bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 ${variant === 'featured' ? 'text-center' : ''} rounded-t-2xl sm:rounded-t-lg`}>
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 flex items-center justify-center">
            <Plane className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Find Your Perfect Flight
          </h2>
          {variant === 'featured' && (
            <p className="text-xs sm:text-sm md:text-base text-blue-100">
              Search, compare and book flights to worldwide destinations
            </p>
          )}
        </div>

        {/* Form Content */}
        <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
          {/* Trip Type Selection */}
          <div className="flex items-center gap-3 sm:gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value="return"
                checked={tripType === 'return'}
                onChange={() => setTripType('return')}
                className="text-blue-600 focus:ring-blue-200"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Return</span>
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
              <span className="text-xs sm:text-sm font-medium text-gray-700">One Way</span>
            </label>
          </div>

          {/* Airport Selection */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {/* From - Departure Airport */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                <Plane className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600 -rotate-45" /> From
              </label>
              <EnhancedAirportSelect
                value={departureAirport}
                onChange={handleDepartureAirportChange}
                placeholder="Search departure city or airport..."
                error={formErrors.departureAirport}
                className="w-full text-sm sm:text-base"
              />
            </div>

            {/* To - Destination */}
            <div className="space-y-1">
              <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                <Plane className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-600" /> To
              </label>
              <EnhancedAirportSelect
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Search destination city or airport..."
                error={formErrors.destination}
                className="w-full text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            {/* Departure Date */}
            <div className="space-y-1">
              <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Departure Date
              </label>
              <Input
                type="date"
                className={`w-full bg-white border-gray-200 text-gray-900 h-9 sm:h-10 text-sm sm:text-base ${
                  formErrors.departureDate ? 'border-red-500 focus:ring-red-200' : ''
                }`}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={getTomorrowDate()}
              />
              {formErrors.departureDate && (
                <div className="text-xs text-red-500 flex items-center mt-1">
                  <Info className="w-3 h-3 mr-1" />
                  {formErrors.departureDate}
                </div>
              )}
            </div>

            {/* Return Date */}
            {tripType === 'return' && (
              <div className="space-y-1">
                <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Return Date
                </label>
                <Input
                  type="date"
                  className={`w-full bg-white border-gray-200 text-gray-900 h-9 sm:h-10 text-sm sm:text-base ${
                    formErrors.returnDate ? 'border-red-500 focus:ring-red-200' : ''
                  }`}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || getTomorrowDate()}
                />
                {formErrors.returnDate && (
                  <div className="text-xs text-red-500 flex items-center mt-1">
                    <Info className="w-3 h-3 mr-1" />
                    {formErrors.returnDate}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Passengers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Users className="w-4 h-4 mr-2" /> Passengers
              </h3>
              <div className="text-sm text-blue-600 font-medium">
                Total: {totalPassengers} {totalPassengers === 1 ? 'passenger' : 'passengers'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* Adults */}
              <div className="space-y-1">
                <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                  Adults (12+)
                </label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 h-9 sm:h-10 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Children */}
              <div className="space-y-1">
                <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                  Children (2-11)
                </label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 h-9 sm:h-10 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Infants */}
              <div className="space-y-1">
                <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
                  Infants (0-1)
                </label>
                <select
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 h-9 sm:h-10 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={infants}
                  onChange={(e) => setInfants(e.target.value)}
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cabin Class */}
          <div className="space-y-1">
            <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700">
              <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Cabin Class
            </label>
            <select
              className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 h-9 sm:h-10 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={tripClass}
              onChange={(e) => setTripClass(e.target.value as 'Y' | 'C')}
            >
              <option value="Y">Economy</option>
              <option value="C">Business</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="pt-2">
            <Button 
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 text-sm sm:text-base h-auto"
            >
              <Search className="mr-2 h-4 w-4" />
              Search Flights
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              We'll search for the best deals from top airlines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 