'use client';

import { useState } from 'react';
import { 
  ArrowRight,
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CreditCard, 
  Luggage, 
  Plane,
  MapPin,
  Calendar,
  Users,
  Wifi,
  Coffee,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { getAirportByCode, getFormattedLocation } from '@/data/airports';
import { getAirlineInfo, getAirlineName, getAirlineRating } from '@/lib/airlines';
import { FlightOffer } from '@/lib/amadeus';

interface EnhancedFlightCardProps {
  flight: FlightOffer;
  detailed?: boolean;
  getAirlineName: (code: string) => string;
}

export default function EnhancedFlightCard({ 
  flight, 
  detailed = false,
  getAirlineName: legacyGetAirlineName
}: EnhancedFlightCardProps) {
  const [expanded, setExpanded] = useState(detailed);
  const router = useRouter();
  
  // Format time with hours and minutes
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };
  
  // Format date in a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };
  
  // Format duration from PT format to more readable
  const formatDuration = (duration: string) => {
    if (!duration) return '';
    const hours = parseInt(duration.match(/(\d+)H/)?.[1] || '0', 10);
    const minutes = parseInt(duration.match(/(\d+)M/)?.[1] || '0', 10);
    
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };
  
  // Calculate stops label with better formatting
  const getStopsLabel = (segments: any[]) => {
    const numStops = segments.length - 1;
    if (numStops === 0) return { text: 'Direct', color: 'text-green-600', bg: 'bg-green-50' };
    if (numStops === 1) return { text: '1 stop', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: `${numStops} stops`, color: 'text-red-600', bg: 'bg-red-50' };
  };
  
  // Get connection time between segments
  const calculateConnectionTime = (arrivalTime: string, departureTime: string) => {
    const arrive = new Date(arrivalTime);
    const depart = new Date(departureTime);
    const diffMs = depart.getTime() - arrive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    return hours > 0 
      ? `${hours}h ${mins}m`
      : `${mins}m`;
  };

  // Get city name from airport code
  const getCityName = (iataCode: string): string => {
    const airport = getAirportByCode(iataCode);
    return airport ? airport.city : iataCode;
  };
  
  // Handle book button click
  const handleBookClick = () => {
    router.push(`/flights/${flight.id}`);
  };
  
  // Get departure, arrival, and journey info for the first (outbound) segment
  const outbound = flight.itineraries[0];
  const outboundDeparture = outbound.segments[0].departure;
  const outboundArrival = outbound.segments[outbound.segments.length - 1].arrival;
  
  // Check if this is a return flight
  const hasReturn = flight.itineraries.length > 1;
  
  // Get return journey info if it exists
  let returnDeparture, returnArrival;
  if (hasReturn) {
    const returnJourney = flight.itineraries[1];
    returnDeparture = returnJourney.segments[0].departure;
    returnArrival = returnJourney.segments[returnJourney.segments.length - 1].arrival;
  }
  
  // Get enhanced carrier info from the first segment
  const mainCarrier = outbound.segments[0].carrierCode;
  const airlineInfo = getAirlineInfo(mainCarrier);
  const outboundStops = getStopsLabel(outbound.segments);
  const returnStops = hasReturn ? getStopsLabel(flight.itineraries[1].segments) : null;
  
  // Calculate price per person
  const pricePerPerson = parseFloat(flight.price.total);
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(pricePerPerson);
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Main flight information */}
      <div className="p-6">
        {/* Header with airline and price */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              {mainCarrier}
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{airlineInfo.name}</div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Flight {mainCarrier}{outbound.segments[0].number}</span>
                {airlineInfo.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">{airlineInfo.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{formattedPrice}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>
        
        {/* Outbound flight */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Plane className="w-4 h-4 mr-2" />
              Outbound • {formatDate(outboundDeparture.at)}
            </h3>
            <Badge className={`${outboundStops.bg} ${outboundStops.color} border-0`}>
              {outboundStops.text}
            </Badge>
          </div>
          
          <div className="grid grid-cols-5 gap-4 items-center">
            {/* Departure */}
            <div className="col-span-2">
              <div className="text-2xl font-bold text-gray-900">{formatTime(outboundDeparture.at)}</div>
              <div className="text-lg font-medium text-gray-700">{getCityName(outboundDeparture.iataCode)}</div>
              <div className="text-sm text-gray-500">{outboundDeparture.iataCode}</div>
              {outboundDeparture.terminal && (
                <div className="text-xs text-gray-400">Terminal {outboundDeparture.terminal}</div>
              )}
            </div>
            
            {/* Flight path */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">{formatDuration(outbound.duration)}</div>
              <div className="w-full flex items-center">
                <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-200 to-blue-400"></div>
                <div className="mx-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-4 h-4 text-blue-600" />
                </div>
                <div className="h-0.5 flex-grow bg-gradient-to-r from-blue-400 to-blue-200"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{outboundStops.text}</div>
            </div>
            
            {/* Arrival */}
            <div className="col-span-2 text-right">
              <div className="text-2xl font-bold text-gray-900">{formatTime(outboundArrival.at)}</div>
              <div className="text-lg font-medium text-gray-700">{getCityName(outboundArrival.iataCode)}</div>
              <div className="text-sm text-gray-500">{outboundArrival.iataCode}</div>
              {outboundArrival.terminal && (
                <div className="text-xs text-gray-400">Terminal {outboundArrival.terminal}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Return flight (if applicable) */}
        {hasReturn && returnDeparture && returnArrival && (
          <>
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Plane className="w-4 h-4 mr-2 transform rotate-180" />
                  Return • {formatDate(returnDeparture.at)}
                </h3>
                {returnStops && (
                  <Badge className={`${returnStops.bg} ${returnStops.color} border-0`}>
                    {returnStops.text}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-5 gap-4 items-center">
                {/* Departure */}
                <div className="col-span-2">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(returnDeparture.at)}</div>
                  <div className="text-lg font-medium text-gray-700">{getCityName(returnDeparture.iataCode)}</div>
                  <div className="text-sm text-gray-500">{returnDeparture.iataCode}</div>
                  {returnDeparture.terminal && (
                    <div className="text-xs text-gray-400">Terminal {returnDeparture.terminal}</div>
                  )}
                </div>
                
                {/* Flight path */}
                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">{formatDuration(flight.itineraries[1].duration)}</div>
                  <div className="w-full flex items-center">
                    <div className="h-0.5 flex-grow bg-gradient-to-r from-green-200 to-green-400"></div>
                    <div className="mx-2 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-green-600 transform rotate-180" />
                    </div>
                    <div className="h-0.5 flex-grow bg-gradient-to-r from-green-400 to-green-200"></div>
                  </div>
                  {returnStops && (
                    <div className="text-xs text-gray-500 mt-1">{returnStops.text}</div>
                  )}
                </div>
                
                {/* Arrival */}
                <div className="col-span-2 text-right">
                  <div className="text-2xl font-bold text-gray-900">{formatTime(returnArrival.at)}</div>
                  <div className="text-lg font-medium text-gray-700">{getCityName(returnArrival.iataCode)}</div>
                  <div className="text-sm text-gray-500">{returnArrival.iataCode}</div>
                  {returnArrival.terminal && (
                    <div className="text-xs text-gray-400">Terminal {returnArrival.terminal}</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                View details
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleBookClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Select Flight
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded details */}
      {expanded && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="p-6 space-y-6">
            {/* Detailed itinerary */}
            {flight.itineraries.map((itinerary, itineraryIndex) => (
              <div key={itineraryIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Plane className={`mr-2 h-5 w-5 ${itineraryIndex === 0 ? 'text-blue-600' : 'text-green-600 transform rotate-180'}`} />
                  {itineraryIndex === 0 ? 'Outbound Journey' : 'Return Journey'}
                </h3>
                
                <div className="space-y-4">
                  {itinerary.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex}>
                      {/* Connection time between segments */}
                      {segmentIndex > 0 && (
                        <div className="flex items-center justify-center py-3 text-sm text-gray-500 bg-gray-50 rounded-lg mb-4">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Layover: {calculateConnectionTime(
                            itinerary.segments[segmentIndex - 1].arrival.at,
                            segment.departure.at
                          )} in {getCityName(segment.departure.iataCode)}</span>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        {/* Departure info */}
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Departure</div>
                          <div className="text-xl font-bold text-gray-900">{formatTime(segment.departure.at)}</div>
                          <div className="text-sm font-medium text-gray-700">{getCityName(segment.departure.iataCode)}</div>
                          <div className="text-sm text-gray-500">
                            {segment.departure.iataCode}
                            {segment.departure.terminal && ` • Terminal ${segment.departure.terminal}`}
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(segment.departure.at)}</div>
                        </div>
                        
                        {/* Flight info */}
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Flight</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {getAirlineName(segment.carrierCode)}
                          </div>
                          <div className="text-sm text-gray-500">{segment.carrierCode}{segment.number}</div>
                          <div className="text-sm text-gray-500">{formatDuration(segment.duration)}</div>
                        </div>
                        
                        {/* Arrival info */}
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Arrival</div>
                          <div className="text-xl font-bold text-gray-900">{formatTime(segment.arrival.at)}</div>
                          <div className="text-sm font-medium text-gray-700">{getCityName(segment.arrival.iataCode)}</div>
                          <div className="text-sm text-gray-500">
                            {segment.arrival.iataCode}
                            {segment.arrival.terminal && ` • Terminal ${segment.arrival.terminal}`}
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(segment.arrival.at)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Additional information cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price breakdown */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                  Price Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base fare</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP'
                      }).format(parseFloat(flight.price.base || flight.price.total) * 0.8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP'
                      }).format(parseFloat(flight.price.total) * 0.2)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formattedPrice}</span>
                  </div>
                </div>
              </div>
              
              {/* Baggage & amenities */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Luggage className="mr-2 h-5 w-5 text-blue-600" />
                  What's Included
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Luggage className="w-4 h-4 mr-2" />
                    <span>Cabin bag included</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Seat selection available</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Coffee className="w-4 h-4 mr-2" />
                    <span>In-flight refreshments</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Additional services available during booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 