'use client';

import { Calendar, Users, Globe2, Plane, Hotel, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type TripType = 'flight' | 'hotel' | 'both';
type Step = 1 | 2 | 3;

export default function PlanTripPage() {
  // Form state
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState<TripType>('both');
  const [dates, setDates] = useState({ departure: '', return: '' });
  const [travelers, setTravelers] = useState({
    adults: 2,
    children: 0,
    infants: 0
  });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // Progress bar width based on current step
  const progressWidth = currentStep === 1 ? 'w-1/3' : 
                       currentStep === 2 ? 'w-2/3' : 
                       'w-full';

  // Popular destinations
  const popularDestinations = [
    'Paris, France',
    'Bali, Indonesia',
    'Tokyo, Japan',
    'New York, USA'
  ];

  // Handle destination selection
  const handleDestinationSelect = (city: string) => {
    setDestination(city);
  };

  // Handle trip type selection
  const handleTripTypeSelect = (type: TripType) => {
    setTripType(type);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => (prev + 1) as Step);
    }
  };

  // Handle back step
  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as Step);
    }
  };

  // Handle traveler count updates
  const updateTravelerCount = (type: 'adults' | 'children' | 'infants', operation: 'add' | 'subtract') => {
    setTravelers(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  return (
    <div className="h-full min-h-screen bg-white">
      <div className="absolute inset-0 bg-[url('/planning.jpg')] bg-cover bg-center opacity-15 pointer-events-none bg-black/50 bg-blend-overlay"></div>
      
      <div className="relative h-screen flex flex-col items-center justify-center p-4">
        {/* Main Form Container */}
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-100 p-6">
          {/* Progress Bar */}
          <div className="w-full mb-6">
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all duration-500 ease-out ${progressWidth}`}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
              <span className={currentStep >= 1 ? 'font-semibold text-blue-700' : ''}>Destination</span>
              <span className={currentStep >= 2 ? 'font-semibold text-blue-700' : ''}>Dates</span>
              <span className={currentStep >= 3 ? 'font-semibold text-blue-700' : ''}>Travelers</span>
            </div>
          </div>

          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Where would you like to go?</h1>
                <p className="text-sm text-gray-600 mt-1">Choose your destination and trip type</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-base rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                      placeholder="Enter city or country"
                    />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleTripTypeSelect('flight')}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                        tripType === 'flight' 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Plane className="w-5 h-5" />
                      <span className="font-medium">Flight</span>
                    </button>
                    <button 
                      onClick={() => handleTripTypeSelect('hotel')}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                        tripType === 'hotel' 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Hotel className="w-5 h-5" />
                      <span className="font-medium">Hotel + Flight</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-base text-gray-900 mb-2">Popular Destinations</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {popularDestinations.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleDestinationSelect(city)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          destination === city 
                            ? 'border-blue-600 bg-blue-50 text-blue-700' 
                            : 'border-gray-300 hover:border-blue-600 hover:bg-blue-50'
                        } text-left text-sm`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleNextStep}
                  disabled={!destination || !tripType}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Travel Dates */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">When are you traveling?</h1>
                <p className="text-sm text-gray-500 mt-1">Select your travel dates</p>
              </div>

              <div className="grid gap-4">
                <div>
                  <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    id="departure"
                    value={dates.departure}
                    onChange={(e) => setDates(prev => ({ ...prev, departure: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="return" className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    id="return"
                    value={dates.return}
                    onChange={(e) => setDates(prev => ({ ...prev, return: e.target.value }))}
                    min={dates.departure || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBackStep}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!dates.departure || !dates.return}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Travelers */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Who's traveling?</h1>
                <p className="text-sm text-gray-500 mt-1">Select number of travelers</p>
              </div>

              <div className="space-y-3">
                {/* Adults */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-blue-200 transition-all">
                  <div>
                    <h3 className="font-medium text-gray-900">Adults</h3>
                    <p className="text-xs text-gray-500">Age 13+</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTravelerCount('adults', 'subtract')}
                      disabled={travelers.adults <= 1}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">{travelers.adults}</span>
                    <button
                      onClick={() => updateTravelerCount('adults', 'add')}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-blue-200 transition-all">
                  <div>
                    <h3 className="font-medium text-gray-900">Children</h3>
                    <p className="text-xs text-gray-500">Age 2-12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTravelerCount('children', 'subtract')}
                      disabled={travelers.children <= 0}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">{travelers.children}</span>
                    <button
                      onClick={() => updateTravelerCount('children', 'add')}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-blue-200 transition-all">
                  <div>
                    <h3 className="font-medium text-gray-900">Infants</h3>
                    <p className="text-xs text-gray-500">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTravelerCount('infants', 'subtract')}
                      disabled={travelers.infants <= 0}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">{travelers.infants}</span>
                    <button
                      onClick={() => updateTravelerCount('infants', 'add')}
                      className="w-7 h-7 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-4 pt-4 border-t-2 border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-3">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-colors"
                        placeholder="Your email address"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={handleBackStep}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    try {
                      setIsSubmitting(true);
                      
                      // Create trip plan object
                      const tripPlanData = {
                        destination,
                        tripType,
                        departureDate: dates.departure,
                        returnDate: dates.return,
                        adults: travelers.adults,
                        children: travelers.children,
                        infants: travelers.infants,
                        customerName: name,
                        customerEmail: email,
                        // status is now handled by the enum default in the schema
                      };
                      
                      // Send to backend API
                      const response = await fetch('/api/trip-plans', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tripPlanData),
                      });
                      
                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to submit trip plan');
                      }
                      
                      // Show success state
                      setSubmitted(true);
                      
                      // Redirect to thank you page
                      router.push('/thank-you?type=trip-planning');
                      
                    } catch (error) {
                      console.error('Error submitting trip plan:', error);
                      alert(`Sorry, there was a problem: ${error instanceof Error ? error.message : 'Please try again.'}`);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting || !name || !email}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : submitted ? 'Submitted!' : 'Plan My Trip'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 