'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Users,
  Plane,
  ArrowRight,
  Clock,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Briefcase,
  CheckCircle2,
  XCircle,
  Filter,
  Grid3X3,
  List,
  X,
  Building,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { UnifiedFlightOffer, UnifiedSegment } from '@/lib/flight-search-normalizer';
import { getAirportByCode } from '@/data/airports';
import { getAirlineName } from '@/lib/airlines';
import { cn } from '@/lib/utils';
import EnhancedFilterPanel from './EnhancedFilterPanel';
import GroupedFlightResults from './GroupedFlightResults';

// Types
interface SearchDetails {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: string;
  children: string;
  infants: string;
  tripClass: string;
}

interface LocationInfo {
  code: string;
  city: string;
  name: string;
  country: string;
}

// Main Component
function SearchClientContent() {
  
  const searchParams = useSearchParams();
  
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  
  const [flights, setFlights] = useState<UnifiedFlightOffer[]>([]);
  
  const [searchDetails, setSearchDetails] = useState<SearchDetails | null>(null);
  
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 1440]);
  
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  
  const [maxStops, setMaxStops] = useState<number>(2);
  
  const [directOnly, setDirectOnly] = useState<boolean>(false);

  useEffect(() => {
    const origin = searchParams.get('departureAirport') || searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';
    const departureDate = searchParams.get('departureDate') || '';
    const returnDate = searchParams.get('returnDate') || '';
    const adults = searchParams.get('adults') || '1';
    const children = searchParams.get('children') || '0';
    const infants = searchParams.get('infants') || '0';
    const tripClass = searchParams.get('tripClass') || 'Y';

    if (origin && destination && departureDate) {
      const details: SearchDetails = { origin, destination, departureDate, returnDate, adults, children, infants, tripClass };
      setSearchDetails(details);
      fetchFlights(details);
    } else {
      setError('Missing required search parameters. Please start a new search.');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchFlights = async (params: SearchDetails) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        adults: params.adults,
        children: params.children,
        infants: params.infants,
        tripClass: params.tripClass,
      });
      if (params.returnDate) query.append('returnDate', params.returnDate);

      const response = await fetch(`/api/flights/search?${query.toString()}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success || !data.data) throw new Error('Invalid API response');
      setFlights(data.data);
      if (data.data.length === 0) setError('No flights found for this route. Try adjusting your dates or airports.');
    } catch (e) {
      console.error('Flight search error:', e);
      setFlights([]);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string, format: 'short' | 'long' = 'short') => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (format === 'long') return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDuration = (duration: string) => {
    if (!duration) return 'N/A';
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours} ${minutes}`.trim() || '0m';
  };

  const getLocationInfo = (iataCode: string): LocationInfo => {
    const airport = getAirportByCode(iataCode);
    if (airport) return { city: airport.city, country: airport.country, code: iataCode, name: airport.name };
    return { city: iataCode, country: 'Unknown', code: iataCode, name: 'Unknown Airport' };
  };

  const getDisplayLocation = (code: string): LocationInfo => {
    if (code.endsWith('C') || code.endsWith('A')) {
      const cityOrCountry = code.substring(0, code.length - 1);
      const type = code.endsWith('C') ? 'All airports' : 'All airports';
      return { city: cityOrCountry, country: '', name: `${cityOrCountry} (${type})`, code: code };
    }
    return getLocationInfo(code);
  };

  const getTotalPassengers = useMemo(() => {
    if (!searchDetails) return 0;
    return parseInt(searchDetails.adults) + parseInt(searchDetails.children) + parseInt(searchDetails.infants);
  }, [searchDetails]);

  const flightMetrics = useMemo(() => {
    if (flights.length === 0) return { priceRange: [0, 5000], durationRange: [0, 1440], availableAirlines: [] };

    const prices = flights.map(f => f.price);
    const durations = flights.flatMap(f => f.itineraries.map(i => {
      const match = i.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      const hours = match?.[1] ? parseInt(match[1]) : 0;
      const minutes = match?.[2] ? parseInt(match[2]) : 0;
      return (hours * 60) + minutes;
    }));

    const airlines = Array.from(new Set(
      flights.flatMap(f => f.itineraries.flatMap(i => i.segments.map(s => getAirlineName(s.carrierCode))))
    )).sort();

    return {
      priceRange: [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] as [number, number],
      durationRange: [Math.floor(Math.min(...durations)), Math.ceil(Math.max(...durations))] as [number, number],
      availableAirlines: airlines
    };
  }, [flights]);

  useEffect(() => {
    if (flightMetrics.priceRange[1] > 0) setPriceRange(flightMetrics.priceRange);
    if (flightMetrics.durationRange[1] > 0) setDurationRange(flightMetrics.durationRange);
  }, [flightMetrics]);

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => {
      if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false;

      const flightDuration = Math.max(...flight.itineraries.map(i => {
        const match = i.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        const hours = match?.[1] ? parseInt(match[1]) : 0;
        const minutes = match?.[2] ? parseInt(match[2]) : 0;
        return (hours * 60) + minutes;
      }));
      if (flightDuration < durationRange[0] || flightDuration > durationRange[1]) return false;

      if (selectedAirlines.length > 0) {
        const flightAirlines = new Set(flight.itineraries.flatMap(i => i.segments.map(s => getAirlineName(s.carrierCode))));
        if (![...flightAirlines].some(a => selectedAirlines.includes(a))) return false;
      }

      const maxFlightStops = Math.max(...flight.itineraries.map(i => i.segments.length - 1));
      if (directOnly) {
        if (maxFlightStops > 0) return false;
      } else {
        if (maxFlightStops > maxStops) return false;
      }

      return true;
    });
  }, [flights, priceRange, durationRange, selectedAirlines, maxStops, directOnly]);

  const handleAirlineChange = (airline: string, selected: boolean) => {
    setSelectedAirlines(prev => selected ? [...prev, airline] : prev.filter(a => a !== airline));
  };

  const handleResetFilters = () => {
    setPriceRange(flightMetrics.priceRange);
    setDurationRange(flightMetrics.durationRange);
    setSelectedAirlines([]);
    setMaxStops(2);
    setDirectOnly(false);
  };

  const handleNewSearch = () => router.push('/');
  const handleEnquireFlight = (flight: UnifiedFlightOffer) => {
    const origin = getLocationInfo(searchDetails!.origin);
    const destination = getLocationInfo(searchDetails!.destination);
    
    const primarySegment = flight.itineraries[0].segments[0];
    
    const params = new URLSearchParams({
      flightId: flight.id,
      origin: searchDetails!.origin,
      originCity: origin.city,
      destination: searchDetails!.destination,
      destinationCity: destination.city,
      departureDate: searchDetails!.departureDate,
      price: flight.price.toString(),
      airline: primarySegment.carrierCode,
      flightNumber: primarySegment.flightNumber,
      source: flight.source,
    });
    
    if (searchDetails!.returnDate) params.append('returnDate', searchDetails!.returnDate);
    
    router.push(`/enquire?${params.toString()}`);
  };

  const toggleFlightDetails = (flightId: string) => {
    setExpandedFlightId(current => current === flightId ? null : flightId);
  };

  if (loading || !searchDetails) return <LoadingFullPage />;
  if (error && flights.length === 0) return <ErrorDisplay error={error} onRetry={handleNewSearch} />;
  
  const originLocation = getDisplayLocation(searchDetails.origin);
  const destinationLocation = getDisplayLocation(searchDetails.destination);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-2 sm:p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{originLocation.city} → {destinationLocation.city}</h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /><span className="text-xs sm:text-sm">{formatDate(searchDetails!.departureDate, 'long')}</span>
                  {searchDetails!.returnDate && <><ArrowRight className="h-3 w-3 mx-1" /><span className="text-xs sm:text-sm">{formatDate(searchDetails!.returnDate, 'long')}</span></>}
                </div>
                <div className="flex items-center gap-1"><Users className="h-4 w-4" /><span className="text-xs sm:text-sm">{getTotalPassengers} passenger{getTotalPassengers !== 1 ? 's' : ''}</span></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleNewSearch} className="border-slate-300 text-sm"><Search className="mr-2 h-4 w-4" />New Search</Button>
              <Button variant="outline" onClick={() => setShowMobileFilters(true)} className="sm:hidden border-slate-300 text-sm"><Filter className="mr-2 h-4 w-4" />Filters</Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-4 lg:gap-6">
          <div className="hidden lg:block lg:col-span-1"><div className="sticky top-6">
            <EnhancedFilterPanel 
            {...{ priceRange, durationRange, selectedAirlines, maxStops, directOnly, onPriceRangeChange: setPriceRange, onDurationRangeChange: setDurationRange, onAirlineChange: handleAirlineChange, onMaxStopsChange: setMaxStops, onDirectOnlyChange: setDirectOnly, onResetFilters: handleResetFilters, availableAirlines: flightMetrics.availableAirlines, maxPriceRange: flightMetrics.priceRange, maxDurationRange: flightMetrics.durationRange }} />
            </div>
            </div>
          {showMobileFilters && <MobileFilterPanel 
          {...{ priceRange, durationRange, selectedAirlines, maxStops, directOnly, onPriceRangeChange: setPriceRange, onDurationRangeChange: setDurationRange, onAirlineChange: handleAirlineChange, onMaxStopsChange: setMaxStops, onDirectOnlyChange: setDirectOnly, onResetFilters: handleResetFilters, availableAirlines: flightMetrics.availableAirlines, maxPriceRange: flightMetrics.priceRange, maxDurationRange: flightMetrics.durationRange, onClose: () => setShowMobileFilters(false) }} />}
          
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{filteredFlights.length} flight{filteredFlights.length !== 1 ? 's' : ''} found</h2>
                <div className="text-sm text-slate-500 sm:text-right">Sorted by price (low to high)</div>
              </div>
            </div>
            
            {filteredFlights.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {filteredFlights.map((flight) => (
                  <FlightCard key={flight.id} {...{ flight, originLocation, destinationLocation, isExpanded: expandedFlightId === flight.id, onToggleExpand: () => toggleFlightDetails(flight.id), onEnquire: () => handleEnquireFlight(flight), formatDate, formatTime, formatDuration, getAirlineName, getLocationInfo, totalPassengers: getTotalPassengers }} />
                ))}
              </div>
            ) : <NoResultsDisplay onReset={handleResetFilters} onNewSearch={handleNewSearch} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
const FlightCard = ({ flight, isExpanded, onToggleExpand, onEnquire, formatDate, formatTime, formatDuration, getAirlineName, getLocationInfo, totalPassengers }: any) => {
    const renderSegment = (segment: UnifiedSegment) => {
        const dep = getLocationInfo(segment.departure.iataCode);
        const arr = getLocationInfo(segment.arrival.iataCode);
        const airline = getAirlineName(segment.carrierCode);
        return (
            <div className="py-3 sm:py-4 border-b border-slate-100 last:border-b-0">
                <div className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0 mt-1"><img src={`https://images.kiwi.com/airlines/64/${segment.carrierCode}.png`} alt={airline} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" /></div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2"><div className="min-w-0 flex-1"><div className="text-xs sm:text-sm text-slate-500 truncate">{airline}</div><div className="font-medium text-sm sm:text-base text-slate-900">Flight {segment.carrierCode}{segment.flightNumber}</div></div><div className="text-right ml-2"><div className="text-xs sm:text-sm font-medium text-slate-900">{formatDuration(segment.duration)}</div></div></div>
                        <div className="hidden sm:flex items-center"><div className="text-right mr-3"><div className="font-semibold text-lg text-slate-900">{formatTime(segment.departure.at)}</div><div className="text-sm text-slate-600">{dep.code}</div></div><div className="flex-1 px-2"><div className="relative"><div className="border-t border-slate-300 w-full absolute top-1/2"></div><div className="absolute w-2 h-2 rounded-full bg-slate-400 -left-1 top-1/2 transform -translate-y-1/2"></div><div className="absolute w-2 h-2 rounded-full bg-slate-400 -right-1 top-1/2 transform -translate-y-1/2"></div></div></div><div className="text-left ml-3"><div className="font-semibold text-lg text-slate-900">{formatTime(segment.arrival.at)}</div><div className="text-sm text-slate-600">{arr.code}</div></div></div>
                        <div className="hidden sm:flex mt-2 justify-between text-sm"><div className="text-slate-600">{dep.city}</div><div className="text-slate-600">{arr.city}</div></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200">
            <div className="p-4 sm:grid sm:grid-cols-5 sm:gap-4">
                <div className="sm:col-span-4">
                    {flight.itineraries.map((itinerary: any, itinIndex: number) => (
                        <div key={itinIndex} className={cn(itinIndex > 0 && "mt-4 pt-4 border-t border-slate-200")}>
                            <div className="flex items-center justify-between mb-3"><div className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{itinIndex === 0 ? 'Outbound' : 'Return'}</div><div className="flex items-center gap-2"><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">{itinerary.segments.length === 1 ? 'Direct' : `${itinerary.segments.length - 1} stop${itinerary.segments.length > 2 ? 's' : ''}`}</Badge><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">{formatDuration(itinerary.duration)}</Badge></div></div>
                            <div className="flex justify-between items-center"><div className="text-center"><div className="text-lg font-bold text-slate-900">{formatTime(itinerary.segments[0].departure.at)}</div><div className="text-xs text-slate-600">{getLocationInfo(itinerary.segments[0].departure.iataCode).city}</div></div><div className="text-center flex-1 px-3"><Plane className="h-4 w-4 text-blue-600 mx-auto mb-1" /><div className="text-xs text-slate-500">{getAirlineName(itinerary.segments[0].carrierCode)}</div></div><div className="text-center"><div className="text-lg font-bold text-slate-900">{formatTime(itinerary.segments[itinerary.segments.length - 1].arrival.at)}</div><div className="text-xs text-slate-600">{getLocationInfo(itinerary.segments[itinerary.segments.length - 1].arrival.iataCode).city}</div></div></div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 flex flex-col justify-between text-center sm:text-right">
                    <div>
                        <div className="text-2xl font-bold text-slate-900">£{flight.price.toFixed(2)}</div>
                        <div className="text-sm text-slate-500">Total for {totalPassengers}</div>
                        <div className="text-xs text-slate-400">via {flight.source}</div>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                        <Button onClick={onEnquire} className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                        <Button onClick={onToggleExpand} variant="outline" size="sm" className="w-full">{isExpanded ? 'Hide Details' : 'View Details'}</Button>
                    </div>
                </div>
            </div>
            {isExpanded && (
                <div className="border-t border-slate-200 p-4 sm:p-5">
                    {flight.itineraries.map((itinerary: any, itinIndex: number) => (
                        <div key={itinIndex}><div className="mb-3 px-3 py-1 inline-block rounded-full bg-blue-50 text-blue-700 text-xs font-medium">{itinIndex === 0 ? 'Outbound' : 'Return'}</div><div className="space-y-1">{itinerary.segments.map((s: UnifiedSegment) => renderSegment(s))}</div></div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MobileFilterPanel = ({ onClose, ...props }: any) => (
    <div className="fixed inset-0 z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-semibold">Filters</h2><Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button></div>
            <div className="p-4 overflow-y-auto h-full pb-20"><EnhancedFilterPanel {...props} /></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t"><Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">Apply Filters</Button></div>
        </div>
    </div>
);

const NoResultsDisplay = ({ onReset, onNewSearch }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
        <Filter className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No flights match your filters</h3>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">Try adjusting your filter criteria or reset all filters.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center"><Button onClick={onReset} variant="outline" className="border-slate-300">Reset All Filters</Button><Button onClick={onNewSearch} className="bg-blue-600 hover:bg-blue-700"><Search className="mr-2 h-4 w-4" />New Search</Button></div>
    </div>
);

const LoadingFullPage = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Plane className="h-12 w-12 text-blue-600 animate-pulse mb-4" />
        <p className="text-lg text-slate-700 font-medium">Searching for flights...</p>
        <p className="text-slate-500">Please wait while we find the best deals for you.</p>
    </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong.</h2>
        <p className="text-slate-600 mb-6 max-w-md">{error}</p>
        <Button onClick={onRetry}><Search className="mr-2 h-4 w-4" />Start New Search</Button>
    </div>
);

export default function SearchClient() {
  return (
    <Suspense>
      <SearchClientContent />
    </Suspense>
  );
} 