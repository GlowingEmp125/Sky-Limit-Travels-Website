"use client";

import { Search, Plane, Users, Calendar, ArrowRight, ArrowRightLeft, Info, FolderPen, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SimpleAirportSelect from '@/components/SimpleAirportSelect';
import EnhancedAirportSelect from '@/components/EnhancedAirportSelect';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  destination: any
}
const SearchHero: FC<Props> = ({ destination: destinationData }) => {

  const router = useRouter();

  const [destination, setDestination] = useState('');

  const [departureAirport, setDepartureAirport] = useState('LHR');

  const [departureDate, setDepartureDate] = useState('');

  const [returnDate, setReturnDate] = useState('');

  const [adults, setAdults] = useState('1');

  const [children, setChildren] = useState('0');

  const [name, setName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [infants, setInfants] = useState('0');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [tripType, setTripType] = useState<'return' | 'one-way'>('return');

  const [tripClass, setTripClass] = useState<'Y' | 'C'>('Y');

  const [mounted, setMounted] = useState(false);

  const [destinations, setDestinations] = useState([]);


  useEffect(() => {
    const fetchDestinations = async () => {
      try {

        const params = new URLSearchParams({
          featured: 'true',
          available: 'true',
        });

        const response = await fetch(`/api/admin/destination?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }

        const data = await response.json();

        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      }
    };
    fetchDestinations();
  }, []);



  useEffect(() => {
    if (destinationData) {
      setDepartureAirport(destinationData.from);
      setDestination(destinationData.destination);
    }

  }, [destinationData]);

  // Calculate total passengers
  const totalPassengers = parseInt(adults) + parseInt(children) + parseInt(infants);

  // Set default dates on component mount
  useEffect(() => {
    setMounted(true);

    // Set default departure date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDepartureDate(tomorrow.toISOString().split('T')[0]);

    // Set default return date to 7 days after departure
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    setReturnDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  // Get tomorrow's date in YYYY-MM-DD format for min date attribute
  const getTomorrowDate = () => {
    if (!mounted) return '';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

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
    if (!phone) {
      errors.phone = 'Please enter your phone number';
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

    const destinationId: any = destinations.find((destination: any) =>
      destination?.from?.includes(departureAirport) ||
      destination?.destination?.includes(destination))


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
      tripClass,
      id: destinationId?.id
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

  return (
    <div className="relative w-full min-h-[650px] flex flex-col items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-900/70 to-blue-950/80 overflow-hidden">
        <Image
          src="/assets/images/hero-bg.jpg"
          alt="Travel background"
          fill
          priority
          className="object-cover opacity-60 mix-blend-overlay"
        />
      </div>

      <div className="relative flex flex-col items-center justify-start pt-6 md:pt-14 px-4 pb-6 z-10 w-full max-w-5xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            Find Your Perfect Flight
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            Search and compare flights to hundreds of destinations worldwide
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            {!mounted ? (
              // Show loading skeleton while component mounts
              <div className="p-8 animate-pulse">
                <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-14 bg-gray-200 rounded-lg"></div>
              </div>
            ) : (
              <>
                {/* Trip Type Selector */}
                <div className="p-4 border-b border-gray-200">
                  <Tabs
                    defaultValue="return"
                    onValueChange={(value) => setTripType(value as 'return' | 'one-way')}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100">
                      <TabsTrigger
                        value="return"
                        className="rounded-md text-sm md:text-base py-2 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Return
                      </TabsTrigger>
                      <TabsTrigger
                        value="one-way"
                        className="rounded-md text-sm md:text-base py-2 transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        One Way
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Form Content */}
                <div className="p-5 md:p-6 space-y-5">
                  {/* From and To - Side by Side on Larger Screens */}




                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From - Departure Airport */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Plane className="w-4 h-4 mr-2 text-blue-600 -rotate-45" />
                        Flying from
                      </label>
                      <EnhancedAirportSelect
                        value={departureAirport}
                        onChange={handleDepartureAirportChange}
                        placeholder="Search departure city or airport..."
                        error={formErrors.departureAirport}
                        destinations={destinations}
                        className="w-full h-12"
                      />
                    </div>

                    {/* To - Destination */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Plane className="w-4 h-4 mr-2 text-blue-600" />
                        Flying to
                      </label>
                      <EnhancedAirportSelect
                        value={destination}
                        onChange={handleDestinationChange}
                        placeholder="Search destination city or airport..."
                        error={formErrors.destination}
                        destinations={destinations}
                        className="w-full h-12"
                      />
                    </div>
                  </div>

                  {/* Dates - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Departure Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        Departure Date
                      </label>
                      <Input
                        type="date"
                        className={`w-full h-12 bg-white border-gray-300 text-gray-900 ${formErrors.departureDate ? 'border-red-500 focus:ring-red-200' : ''
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

                    {/* Return Date - Only show for return trips */}
                    {tripType === 'return' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          Return Date
                        </label>
                        <Input
                          type="date"
                          className={`w-full h-12 bg-white border-gray-300 text-gray-900 ${formErrors.returnDate ? 'border-red-500 focus:ring-red-200' : ''
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

                    <div className="grid grid-cols-3 gap-4">
                      {/* Adults */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Adults (12+)
                        </label>
                        <select
                          className="w-full h-12 bg-white border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={adults}
                          onChange={(e) => setAdults(e.target.value)}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>

                      {/* Children */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Children (2-11)
                        </label>
                        <select
                          className="w-full h-12 bg-white border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={children}
                          onChange={(e) => setChildren(e.target.value)}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>

                      {/* Infants */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Infants (0-1)
                        </label>
                        <select
                          className="w-full h-12 bg-white border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Departure Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <FolderPen className="w-4 h-4 mr-2 text-blue-600" />
                        Name
                      </label>
                      <Input
                        type="text"
                        placeholder='Enter Full Name'
                        className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder='Enter Email'
                        className={`w-full h-12 bg-white border-gray-300 text-gray-900`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />

                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        Phone No
                      </label>
                      <Input
                        type="text"
                        placeholder='Enter Phone No'
                        className={`w-full h-12 bg-white border-gray-300 text-gray-900
                           ${formErrors.phone ? 'border-red-500 focus:ring-red-200' : ''}
                          `}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                      {formErrors.phone && (
                        <div className="text-xs text-red-500 flex items-center mt-1">
                          <Info className="w-3 h-3 mr-1" />
                          {formErrors.phone}
                        </div>
                      )}

                    </div>


                  </div>

                  {/* Cabin Class */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Info className="w-4 h-4 mr-2 text-blue-600" />
                      Cabin Class
                    </label>
                    <select
                      className="w-full h-12 bg-white border border-gray-300 rounded-md px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Search className="mr-2 h-5 w-5" />
                      Search Flights
                    </Button>
                  </div>

                  {/* Help Text */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      We'll search for the best deals from top airlines
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchHero;