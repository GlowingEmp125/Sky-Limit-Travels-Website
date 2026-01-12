'use client';

import { useState, useMemo } from 'react';
import { 
  ArrowRight,
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Plane,
  Calendar,
  Users,
  Star,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CleanFlightOffer } from '@/lib/amadeus-new';
import { getAirlineName } from '@/lib/airlines';

interface GroupedFlightResultsProps {
  flights: CleanFlightOffer[];
  onSelectFlight: (flight: CleanFlightOffer) => void;
  formatDate: (dateString: string, format?: 'short' | 'long') => string;
  formatTime: (dateString: string) => string;
  formatDuration: (duration: string) => string;
  getLocationInfo: (iataCode: string) => {
    code: string;
    city: string;
    name: string;
    country: string;
  };
  totalPassengers: number;
}

interface FlightGroup {
  id: string;
  route: string;
  lowestPrice: number;
  currency: string;
  directAvailable: boolean;
  airlines: string[];
  flights: CleanFlightOffer[];
  averageDuration: string;
  departureTimeRange: string;
  priceRange: { min: number; max: number };
}

export default function GroupedFlightResults({
  flights,
  onSelectFlight,
  formatDate,
  formatTime,
  formatDuration,
  getLocationInfo,
  totalPassengers
}: GroupedFlightResultsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group flights by route and similar characteristics
  const groupedFlights = useMemo(() => {
    const groups = new Map<string, FlightGroup>();

    flights.forEach((flight) => {
      const outbound = flight.itineraries[0];
      const originInfo = getLocationInfo(outbound.segments[0].departure.iataCode);
      const destInfo = getLocationInfo(outbound.segments[outbound.segments.length - 1].arrival.iataCode);
      
      // Create a route key that includes return info if applicable
      const hasReturn = flight.itineraries.length > 1;
      const routeKey = hasReturn 
        ? `${originInfo.code}-${destInfo.code}-return`
        : `${originInfo.code}-${destInfo.code}-oneway`;

      const price = parseFloat(flight.price.total);
      const isDirect = outbound.segments.length === 1;
      const mainAirline = getAirlineName(outbound.segments[0].carrierCode);

      if (!groups.has(routeKey)) {
        groups.set(routeKey, {
          id: routeKey,
          route: `${originInfo.city} → ${destInfo.city}`,
          lowestPrice: price,
          currency: flight.price.currency,
          directAvailable: isDirect,
          airlines: [mainAirline],
          flights: [flight],
          averageDuration: outbound.duration,
          departureTimeRange: formatTime(outbound.segments[0].departure.at),
          priceRange: { min: price, max: price }
        });
      } else {
        const group = groups.get(routeKey)!;
        group.flights.push(flight);
        group.lowestPrice = Math.min(group.lowestPrice, price);
        group.priceRange.min = Math.min(group.priceRange.min, price);
        group.priceRange.max = Math.max(group.priceRange.max, price);
        group.directAvailable = group.directAvailable || isDirect;
        
        if (!group.airlines.includes(mainAirline)) {
          group.airlines.push(mainAirline);
        }

        // Update departure time range
        const earliestTime = Math.min(
          ...group.flights.map(f => new Date(f.itineraries[0].segments[0].departure.at).getTime())
        );
        const latestTime = Math.max(
          ...group.flights.map(f => new Date(f.itineraries[0].segments[0].departure.at).getTime())
        );
        
        group.departureTimeRange = earliestTime === latestTime 
          ? formatTime(new Date(earliestTime).toISOString())
          : `${formatTime(new Date(earliestTime).toISOString())} - ${formatTime(new Date(latestTime).toISOString())}`;
      }
    });

    // Sort groups by lowest price
    return Array.from(groups.values()).sort((a, b) => a.lowestPrice - b.lowestPrice);
  }, [flights, formatTime, getLocationInfo]);

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getStopsLabel = (segments: any[]) => {
    const numStops = segments.length - 1;
    if (numStops === 0) return { text: 'Direct', color: 'text-green-600', bg: 'bg-green-50' };
    if (numStops === 1) return { text: '1 stop', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: `${numStops} stops`, color: 'text-red-600', bg: 'bg-red-50' };
  };

  if (groupedFlights.length === 0) {
    return (
      <div className="text-center py-12">
        <Plane className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or dates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedFlights.map((group) => (
        <Card key={group.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-0">
            {/* Group Header - Always Visible */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{group.route}</h3>
                    {group.directAvailable && (
                      <Badge className="bg-green-50 text-green-700 border-green-200 self-start">
                        Direct flights available
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Departures: {group.departureTimeRange}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>{group.airlines.length} airline{group.airlines.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{group.flights.length} option{group.flights.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right sm:ml-6">
                  <div className="text-2xl font-bold text-blue-600">
                    £{group.lowestPrice.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    from per person
                  </div>
                  {group.priceRange.min !== group.priceRange.max && (
                    <div className="text-xs text-gray-400">
                      up to £{group.priceRange.max.toFixed(0)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    Airlines: {group.airlines.slice(0, 2).join(', ')}
                    {group.airlines.length > 2 && ` +${group.airlines.length - 2} more`}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {/* Primary Book Now Button for cheapest flight */}
                  <Button
                    onClick={() => onSelectFlight(group.flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total))[0])}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-sm"
                  >
                    Book Now - £{group.lowestPrice.toFixed(0)}
                  </Button>
                  
                  {/* Secondary View Options Button */}
                  {group.flights.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => toggleGroupExpansion(group.id)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50 text-sm px-4 py-2"
                    >
                      {expandedGroups.has(group.id) ? (
                        <>
                          Hide Options <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          View {group.flights.length - 1} More Option{group.flights.length - 1 > 1 ? 's' : ''} <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Flight Options */}
            {expandedGroups.has(group.id) && (
              <div className="border-t border-gray-100 bg-gray-25">
                <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  {group.flights.map((flight, index) => (
                    <div key={flight.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      {/* Header with price and booking - moved to top */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                            Option #{index + 1}
                          </div>
                          {parseFloat(flight.price.total) === group.lowestPrice && (
                            <div className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
                              Best Price
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Total: {formatDuration(flight.itineraries.reduce((acc, it) => {
                              const match = it.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
                              const hours = match?.[1] ? parseInt(match[1]) : 0;
                              const minutes = match?.[2] ? parseInt(match[2]) : 0;
                              return acc + (hours * 60) + minutes;
                            }, 0).toString() + 'M')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          <div className="text-right flex-1 sm:flex-initial">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                              £{parseFloat(flight.price.total).toFixed(0)}
                            </div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                          <Button 
                            onClick={() => onSelectFlight(flight)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 whitespace-nowrap shadow-sm"
                          >
                            Book This Option
                          </Button>
                        </div>
                      </div>

                      {/* Flight details */}
                      <div className="p-4 sm:p-5">
                        {flight.itineraries.map((itinerary, itineraryIndex) => (
                          <div key={itineraryIndex} className="mb-5 last:mb-0">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                                <Plane className="w-4 h-4 mr-2 flex-shrink-0" />
                                {itineraryIndex === 0 ? 'Outbound' : 'Return'} • {formatDate(itinerary.segments[0].departure.at)}
                              </h4>
                              <Badge className={`${getStopsLabel(itinerary.segments).bg} ${getStopsLabel(itinerary.segments).color} border-0 text-xs`}>
                                {getStopsLabel(itinerary.segments).text}
                              </Badge>
                            </div>
                            
                            {/* Mobile-optimized flight route display */}
                            <div className="space-y-4">
                              {itinerary.segments.map((segment, segmentIndex) => {
                                const depInfo = getLocationInfo(segment.departure.iataCode);
                                const arrInfo = getLocationInfo(segment.arrival.iataCode);
                                
                                return (
                                  <div key={segmentIndex}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                                      {/* Departure */}
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                                          <div>
                                            <div className="text-lg sm:text-xl font-bold text-gray-900">
                                              {formatTime(segment.departure.at)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 truncate">
                                              {depInfo.city}
                                            </div>
                                            <div className="text-xs text-gray-500">{segment.departure.iataCode}</div>
                                          </div>
                                          
                                          <ArrowRight className="h-4 w-4 text-gray-400 sm:hidden" />
                                          
                                          <div className="sm:hidden">
                                            <div className="text-lg sm:text-xl font-bold text-gray-900">
                                              {formatTime(segment.arrival.at)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-700 truncate">
                                              {arrInfo.city}
                                            </div>
                                            <div className="text-xs text-gray-500">{segment.arrival.iataCode}</div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Flight info - mobile centered, desktop in middle */}
                                      <div className="flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left py-2 sm:py-0">
                                        <div className="hidden sm:block">
                                          <ArrowRight className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 mb-1">
                                            {formatDuration(segment.duration)}
                                          </div>
                                          <div className="text-xs font-medium text-gray-700">
                                            {getAirlineName(segment.carrierCode)} {segment.number}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* Arrival - hidden on mobile (shown above) */}
                                      <div className="hidden sm:block flex-1">
                                        <div className="text-lg sm:text-xl font-bold text-gray-900">
                                          {formatTime(segment.arrival.at)}
                                        </div>
                                        <div className="text-sm font-medium text-gray-700 truncate">
                                          {arrInfo.city}
                                        </div>
                                        <div className="text-xs text-gray-500">{segment.arrival.iataCode}</div>
                                      </div>
                                    </div>
                                    
                                    {/* Connection time for layovers */}
                                    {segmentIndex < itinerary.segments.length - 1 && (
                                      <div className="mt-3 text-center">
                                        <div className="text-xs text-gray-500 bg-orange-50 border border-orange-200 text-orange-700 rounded px-3 py-2 inline-block">
                                          Layover: {Math.floor((new Date(itinerary.segments[segmentIndex + 1].departure.at).getTime() - new Date(segment.arrival.at).getTime()) / 60000)}m in {arrInfo.city}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Separator between outbound and return */}
                            {itineraryIndex === 0 && flight.itineraries.length > 1 && (
                              <div className="my-5 border-t border-gray-200 pt-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 