'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar, Clock, CreditCard, Globe, Luggage, MapPin, Plane, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FlightOffer } from '@/lib/amadeus';
import { getAirportByCode, getFormattedLocation, formatAirportDisplay, formatRouteDisplay } from '@/data/airports';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function FlightDetail() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flight, setFlight] = useState<FlightOffer | null>(null);

  useEffect(() => {
    // Special handling for country names that might be incorrectly routed
    const countryNames = ['italy', 'spain', 'france', 'greece', 'turkey', 'portugal', 'croatia'];
    
    if (params.id && typeof params.id === 'string' && countryNames.includes(params.id.toLowerCase())) {
      // Redirect to the correct country page
      console.log(`Redirecting from /flights/${params.id} to /flights/countries/${params.id}`);
      router.push(`/flights/countries/${params.id}`);
      return;
    }
    
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/flights/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch flight details');
        }
        
        const data = await response.json();
        setFlight(data);
      } catch (err) {
        console.error('Error fetching flight details:', err);
        setError('Unable to load flight details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchFlightDetails();
    }
  }, [params.id, router]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format day of week
  const formatDayOfWeek = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'long' });
  };

  // Format time with AM/PM
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Format duration from PT format
  const formatDuration = (duration: string) => {
    if (!duration) return '';
    return duration.replace('PT', '').replace('H', 'h ').replace('M', 'm');
  };

  // Get airline name
  const getAirlineName = (code: string): string => {
    const airlineMap: Record<string, string> = {
      'BA': 'British Airways',
      'AA': 'American Airlines',
      'LH': 'Lufthansa',
      'AF': 'Air France',
      'KL': 'KLM Royal Dutch Airlines',
      'DL': 'Delta Air Lines',
      'UA': 'United Airlines',
      'EK': 'Emirates',
      'QR': 'Qatar Airways',
      'SQ': 'Singapore Airlines',
      'CX': 'Cathay Pacific',
      'EY': 'Etihad Airways',
      'TK': 'Turkish Airlines',
      'VS': 'Virgin Atlantic',
      'IB': 'Iberia',
      'FR': 'Ryanair',
      'U2': 'easyJet',
      'LX': 'SWISS',
      'OS': 'Austrian Airlines',
      'AY': 'Finnair',
    };
    return airlineMap[code] || code;
  };

  // Helper function to calculate connection time
  const calculateConnectionTime = (arrivalTime: string, departureTime: string) => {
    const arrival = new Date(arrivalTime);
    const departure = new Date(departureTime);
    
    const diffMs = departure.getTime() - arrival.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  }; 

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <Plane className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mt-4">Loading flight details...</h2>
          <p className="text-muted-foreground mt-2">Please wait while we retrieve your flight information</p>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">Flight not found</h2>
          <p className="text-muted-foreground mt-2">{error || "We couldn't find this flight. It might have expired or been removed."}</p>
          <Button 
            className="mt-6" 
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Extract flight information for easier access
  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const isMultiSegment = outbound.segments.length > 1;
  const originCity = getFormattedLocation(firstSegment.departure.iataCode);
  const destinationCity = getFormattedLocation(lastSegment.arrival.iataCode);
  const outboundDate = formatDate(firstSegment.departure.at);
  const outboundDay = formatDayOfWeek(firstSegment.departure.at);

  // Handle return flight if exists
  const hasReturn = flight.itineraries.length > 1;
  let returnInfo = null;

  if (hasReturn) {
    const returnFlight = flight.itineraries[1];
    const returnFirstSegment = returnFlight.segments[0];
    const returnLastSegment = returnFlight.segments[returnFlight.segments.length - 1];
    
    returnInfo = {
      flight: returnFlight,
      firstSegment: returnFirstSegment,
      lastSegment: returnLastSegment,
      isMultiSegment: returnFlight.segments.length > 1,
      returnDate: formatDate(returnFirstSegment.departure.at),
      returnDay: formatDayOfWeek(returnFirstSegment.departure.at)
    };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and Back button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="px-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to search results
        </Button>
      </div>

      {/* Flight Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {formatRouteDisplay(firstSegment.departure.iataCode, lastSegment.arrival.iataCode)}
            </h1>
            <p className="text-muted-foreground">
              {outboundDay}, {outboundDate}
              {hasReturn && returnInfo && (
                <> • Return on {returnInfo.returnDay}, {returnInfo.returnDate}</>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-2xl font-bold text-primary">£{parseFloat(flight.price.total).toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">per passenger</div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Plane className="w-5 h-5 mr-3 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">Airline</div>
              <div className="font-medium">{getAirlineName(firstSegment.carrierCode)}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-3 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{formatDuration(outbound.duration)}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">Stops</div>
              <div className="font-medium">
                {isMultiSegment ? 
                  `${outbound.segments.length - 1} stop${outbound.segments.length > 2 ? 's' : ''}` : 
                  'Direct flight'
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Flight Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Outbound Journey */}
          <Card>
            <CardContent className="p-0">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Outbound Journey</h2>
                <p className="text-muted-foreground">
                  {formatDayOfWeek(firstSegment.departure.at)}, {formatDate(firstSegment.departure.at)}
                </p>
              </div>
              
              <div className="p-6">
                {outbound.segments.map((segment, idx) => (
                  <div key={idx} className="mb-6 last:mb-0">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 mr-3">
                        <span className="text-sm font-semibold text-blue-600">{segment.carrierCode}</span>
                      </div>
                      <div>
                        <div className="font-medium">{getAirlineName(segment.carrierCode)} - Flight {segment.number}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDuration(segment.duration)} • Aircraft: {segment.aircraft?.code || 'Not specified'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-stretch">
                      <div className="flex flex-col items-center mr-4">
                        <div className="h-5 w-5 rounded-full bg-blue-600 z-10"></div>
                        {idx < outbound.segments.length - 1 && (
                          <div className="flex-1 w-0.5 bg-blue-200 my-1"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="mb-6">
                          <div className="text-lg font-semibold">{formatTime(segment.departure.at)}</div>
                          <div>
                            <span className="font-medium">{formatAirportDisplay(segment.departure.iataCode)}</span>
                            <span className="mx-1">•</span>
                            <span className="text-muted-foreground">{getAirportByCode(segment.departure.iataCode)?.name || ''}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Terminal: {segment.departure.terminal || 'Not specified'}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-lg font-semibold">{formatTime(segment.arrival.at)}</div>
                          <div>
                            <span className="font-medium">{formatAirportDisplay(segment.arrival.iataCode)}</span>
                            <span className="mx-1">•</span>
                            <span className="text-muted-foreground">{getAirportByCode(segment.arrival.iataCode)?.name || ''}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Terminal: {segment.arrival.terminal || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show connection information if not the last segment */}
                    {idx < outbound.segments.length - 1 && (
                      <div className="mt-4 mb-4 ml-9 py-3 px-4 bg-blue-50 rounded-md border border-blue-100">
                        <div className="text-sm">
                          <span className="font-medium">Connection: </span>
                          {calculateConnectionTime(segment.arrival.at, outbound.segments[idx + 1].departure.at)} in {formatAirportDisplay(segment.arrival.iataCode)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Return Journey (if applicable) */}
          {hasReturn && returnInfo && (
            <Card>
              <CardContent className="p-0">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Return Journey</h2>
                  <p className="text-muted-foreground">
                    {returnInfo.returnDay}, {returnInfo.returnDate}
                  </p>
                </div>
                
                <div className="p-6">
                  {returnInfo.flight.segments.map((segment, idx) => (
                    <div key={idx} className="mb-6 last:mb-0">
                      <div className="flex items-center mb-4">
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 mr-3">
                          <span className="text-sm font-semibold text-blue-600">{segment.carrierCode}</span>
                        </div>
                        <div>
                          <div className="font-medium">{getAirlineName(segment.carrierCode)} - Flight {segment.number}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDuration(segment.duration)} • Aircraft: {segment.aircraft?.code || 'Not specified'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-stretch">
                        <div className="flex flex-col items-center mr-4">
                          <div className="h-5 w-5 rounded-full bg-blue-600 z-10"></div>
                          {idx < returnInfo.flight.segments.length - 1 && (
                            <div className="flex-1 w-0.5 bg-blue-200 my-1"></div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="mb-6">
                            <div className="text-lg font-semibold">{formatTime(segment.departure.at)}</div>
                            <div>
                              <span className="font-medium">{formatAirportDisplay(segment.departure.iataCode)}</span>
                              <span className="mx-1">•</span>
                              <span className="text-muted-foreground">{getAirportByCode(segment.departure.iataCode)?.name || ''}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Terminal: {segment.departure.terminal || 'Not specified'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-lg font-semibold">{formatTime(segment.arrival.at)}</div>
                            <div>
                              <span className="font-medium">{formatAirportDisplay(segment.arrival.iataCode)}</span>
                              <span className="mx-1">•</span>
                              <span className="text-muted-foreground">{getAirportByCode(segment.arrival.iataCode)?.name || ''}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Terminal: {segment.arrival.terminal || 'Not specified'}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Show connection information if not the last segment */}
                      {idx < returnInfo.flight.segments.length - 1 && (
                        <div className="mt-4 mb-4 ml-9 py-3 px-4 bg-blue-50 rounded-md border border-blue-100">
                          <div className="text-sm">
                            <span className="font-medium">Connection: </span>
                            {calculateConnectionTime(segment.arrival.at, returnInfo.flight.segments[idx + 1].departure.at)} in {formatAirportDisplay(segment.arrival.iataCode)}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Booking and Fare Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Base fare</span>
                  <span>
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: 'GBP'
                    }).format(parseFloat(flight.price.base))}
                  </span>
                </div>
                
                {flight.price.fees?.map((fee, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                    <span>{fee.type}</span>
                    <span>
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP'
                      }).format(parseFloat(fee.amount))}
                    </span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total per person</span>
                  <span className="text-primary">
                    {new Intl.NumberFormat('en-GB', {
                      style: 'currency',
                      currency: 'GBP'
                    }).format(parseFloat(flight.price.total))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Interested in this flight?</h2>
              <p className="text-muted-foreground mb-6">
                Contact our travel experts to book this flight or create a custom itinerary.
              </p>
              
              <div>
                <Link href="/contact">
                  <Button className="w-full h-12 text-base">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Enquire Now
                  </Button>
                </Link>
              </div>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <p>Our team will get back to you within 24 hours to assist with your booking.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Flight Details</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex">
                  <Luggage className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Baggage allowance:</span> 1 cabin bag, checked baggage available
                  </div>
                </div>
                
                <div className="flex">
                  <Clock className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Check-in:</span> Online check-in available 24-48 hours before departure
                  </div>
                </div>
                
                <div className="flex">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Changes:</span> Schedule changes may apply. Contact us for assistance
                  </div>
                </div>
                
                <div className="flex">
                  <Users className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Travel documents:</span> Passport, visa and other requirements may apply
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 