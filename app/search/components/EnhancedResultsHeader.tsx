'use client';

import { ArrowRight, Calendar, ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFormattedLocation } from '@/data/airports';
import { useRouter } from 'next/navigation';

interface EnhancedResultsHeaderProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  totalResults: number;
  adults: string;
  children: string;
}

export default function EnhancedResultsHeader({
  origin,
  destination,
  departureDate,
  returnDate,
  totalResults,
  adults,
  children
}: EnhancedResultsHeaderProps) {
  const router = useRouter();
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' });
    return `${weekday}, ${day}/${month}/${year}`;
  };
  
  // Handle back button click
  const handleBackClick = () => {
    router.back();
  };
  
  // Handle modify search click
  const handleModifySearch = () => {
    router.push('/');
  };
  
  // Get formatted location names
  const originName = getFormattedLocation(origin);
  const destinationName = getFormattedLocation(destination);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          className="flex items-center text-blue-600" 
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleModifySearch}
        >
          Modify Search
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              {originName} <ArrowRight className="inline-block h-4 w-4 mx-2" /> {destinationName}
            </h1>
          </div>
          
          <div className="text-sm text-gray-500 mt-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(departureDate)}
                {returnDate && (
                  <>
                    <ArrowRight className="mx-1 h-3 w-3" />
                    {formatDate(returnDate)}
                  </>
                )}
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {adults} {parseInt(adults) === 1 ? 'adult' : 'adults'}
                {parseInt(children) > 0 && `, ${children} ${parseInt(children) === 1 ? 'child' : 'children'}`}
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 font-medium">
          {totalResults} {totalResults === 1 ? 'flight' : 'flights'} found
        </div>
      </div>
    </div>
  );
} 