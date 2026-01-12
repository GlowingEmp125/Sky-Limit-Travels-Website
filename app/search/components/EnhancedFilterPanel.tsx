'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Clock, CreditCard } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EnhancedFilterPanelProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  durationRange: [number, number];
  setDurationRange: (range: [number, number]) => void;
  availableAirlines: string[];
  selectedAirlines: string[];
  setSelectedAirlines: (airlines: string[]) => void;
  maxStops: number;
  setMaxStops: (stops: number) => void;
  directOnly: boolean;
  setDirectOnly: (direct: boolean) => void;
  onReset: () => void;
  onAirlineChange: (airline: string, selected: boolean) => void;
}

export default function EnhancedFilterPanel({
  priceRange,
  setPriceRange,
  durationRange,
  setDurationRange,
  availableAirlines,
  selectedAirlines,
  setSelectedAirlines,
  maxStops,
  setMaxStops,
  directOnly,
  setDirectOnly,
  onReset,
  onAirlineChange
}: EnhancedFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    duration: true,
    stops: true,
    airlines: true
  });
  
  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Format duration in hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Toggle section expanded state
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold flex items-center">
          <Filter className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Filter Results
        </h2>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onReset}
          className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm"
        >
          Reset All
        </Button>
      </div>
      
      {/* Price Range */}
      <Collapsible 
        open={expandedSections.price} 
        onOpenChange={() => toggleSection('price')}
        className="mb-3 sm:mb-4 border-b pb-3 sm:pb-4"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer py-2">
            <div className="flex items-center">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
              <h3 className="text-sm font-medium">Price Range</h3>
            </div>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-3">
          <div className="px-1 sm:px-2">
            <Slider
              defaultValue={priceRange}
              min={priceRange[0]}
              max={priceRange[1]}
              step={10}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="my-4 sm:my-6"
            />
            
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <span>{formatPrice(priceRange[0])}</span>
              <span>to</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Flight Duration */}
      <Collapsible 
        open={expandedSections.duration} 
        onOpenChange={() => toggleSection('duration')}
        className="mb-3 sm:mb-4 border-b pb-3 sm:pb-4"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer py-2">
            <div className="flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" />
              <h3 className="text-sm font-medium">Flight Duration</h3>
            </div>
            {expandedSections.duration ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-3">
          <div className="px-1 sm:px-2">
            <Slider
              defaultValue={durationRange}
              min={durationRange[0]}
              max={durationRange[1]}
              step={15}
              value={[durationRange[0], durationRange[1]]}
              onValueChange={(value) => setDurationRange(value as [number, number])}
              className="my-4 sm:my-6"
            />
            
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <span>{formatDuration(durationRange[0])}</span>
              <span>to</span>
              <span>{formatDuration(durationRange[1])}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Stops */}
      <Collapsible 
        open={expandedSections.stops} 
        onOpenChange={() => toggleSection('stops')}
        className="mb-3 sm:mb-4 border-b pb-3 sm:pb-4"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer py-2">
            <div className="flex items-center">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12h-8m-10 0h6" />
                <circle cx="13" cy="12" r="2" />
                <circle cx="5" cy="12" r="2" />
              </svg>
              <h3 className="text-sm font-medium">Stops</h3>
            </div>
            {expandedSections.stops ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center cursor-pointer">
                <Switch
                  checked={directOnly}
                  onCheckedChange={setDirectOnly}
                  className="mr-2"
                />
                Direct flights only
              </label>
            </div>
            
            {!directOnly && (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Maximum stops: {maxStops}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((stops) => (
                    <button
                      key={stops}
                      onClick={() => setMaxStops(stops)}
                      className={`px-3 py-2 text-xs sm:text-sm rounded-md border transition-colors ${
                        maxStops === stops
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Airlines */}
      <Collapsible 
        open={expandedSections.airlines} 
        onOpenChange={() => toggleSection('airlines')}
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between cursor-pointer py-2">
            <div className="flex items-center">
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-2 0-4 0-5.5 1.5L11 7.8" />
                <path d="M3 21 12 12" />
                <path d="m16 16 4 4" />
                <path d="m22 22-4-4" />
                <path d="m14.5 13.5 2 2" />
              </svg>
              <h3 className="text-sm font-medium">Airlines</h3>
            </div>
            {expandedSections.airlines ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="pt-3">
          <div className="space-y-2">
            {availableAirlines.slice(0, 8).map((airline) => (
              <div key={airline} className="flex items-center justify-between">
                <label className="text-sm flex items-center cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedAirlines.includes(airline)}
                    onChange={(e) => onAirlineChange(airline, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="truncate">{airline}</span>
                </label>
              </div>
            ))}
            
            {availableAirlines.length > 8 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                {availableAirlines.length - 8} more airlines available
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
} 