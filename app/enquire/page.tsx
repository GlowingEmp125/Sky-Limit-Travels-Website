"use client";

import { Mail, Phone, MapPin, Clock, ArrowRight, Calendar, Plane, CalendarClock, User, Users } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { formatAirportDisplay, getCityAndCountry } from '@/data/airports';

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

// Define the form data type from the schema
type FormData = z.infer<typeof formSchema>;

// Flight details interface
interface FlightDetails {
  flightId: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  departureDate: string;
  returnDate?: string;
  price: string;
  airline: string;
  flightNumber: string;
}

// Holiday details interface
interface HolidayDetails {
  holidayId: string;
  title: string;
  destination: string;
  price: string;
  duration: string;
  departureDate?: string;
  travelers?: string;
}

// Package details interface
interface PackageDetails {
  packageId: string;
  title: string;
  destination: string;
  price: string;
  duration: string;
}

// Add airline mapping function to display full airline names
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

function EnquiryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const [flightDetails, setFlightDetails] = useState<FlightDetails | null>(null);
  const [holidayDetails, setHolidayDetails] = useState<HolidayDetails | null>(null);
  const [packageDetails, setPackageDetails] = useState<PackageDetails | null>(null);
  const [enquiryType, setEnquiryType] = useState<'flight' | 'holiday' | 'package' | null>(null);

  useEffect(() => {
    if (searchParams) {
      // Check which type of enquiry this is based on URL parameters
      if (searchParams.get('flightId')) {
        // Extract flight details from URL parameters
        const details: FlightDetails = {
          flightId: searchParams.get('flightId') || '',
          origin: searchParams.get('origin') || '',
          originCity: searchParams.get('originCity') || '',
          destination: searchParams.get('destination') || '',
          destinationCity: searchParams.get('destinationCity') || '',
          departureDate: searchParams.get('departureDate') || '',
          returnDate: searchParams.get('returnDate') || '',
          price: searchParams.get('price') || '',
          airline: searchParams.get('airline') || '',
          flightNumber: searchParams.get('flightNumber') || ''
        };
        
        setFlightDetails(details);
        setEnquiryType('flight');
      } 
      else if (searchParams.get('holidayId')) {
        // Extract holiday details from URL parameters
        const details: HolidayDetails = {
          holidayId: searchParams.get('holidayId') || '',
          title: searchParams.get('title') || '',
          destination: searchParams.get('destination') || '',
          price: searchParams.get('price') || '',
          duration: searchParams.get('duration') || '',
          departureDate: searchParams.get('departureDate') || '',
          travelers: searchParams.get('travelers') || '2'
        };
        
        setHolidayDetails(details);
        setEnquiryType('holiday');
      }
      else if (searchParams.get('packageId')) {
        // Extract package details from URL parameters
        const details: PackageDetails = {
          packageId: searchParams.get('packageId') || '',
          title: searchParams.get('title') || '',
          destination: searchParams.get('destination') || '',
          price: searchParams.get('price') || '',
          duration: searchParams.get('duration') || ''
        };
        
        setPackageDetails(details);
        setEnquiryType('package');
      }
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ''
    }
  });

  // Update the message when details change
  useEffect(() => {
    if (flightDetails) {
      try {
        const departureDate = new Date(flightDetails.departureDate);
        const formattedDepartureDate = format(departureDate, 'PPP');
        
        let message = `I'm interested in booking the following flight:\n\n` +
          `From: ${flightDetails.originCity || getCityAndCountry(flightDetails.origin)} to ${flightDetails.destinationCity || getCityAndCountry(flightDetails.destination)}\n` +
          `Route: ${formatAirportDisplay(flightDetails.origin)} to ${formatAirportDisplay(flightDetails.destination)}\n` +
          `Date: ${formattedDepartureDate}\n`;
        
        if (flightDetails.returnDate) {
          const returnDate = new Date(flightDetails.returnDate);
          const formattedReturnDate = format(returnDate, 'PPP');
          message += `Return: ${formattedReturnDate}\n`;
        }
        
        message += `Airline: ${getAirlineName(flightDetails.airline)} (${flightDetails.airline} ${flightDetails.flightNumber})\n` +
          `Price: £${parseFloat(flightDetails.price).toFixed(2)}\n\n` +
          `Please contact me with more information about booking this flight.`;
        
        setValue('message', message);
      } catch (error) {
        console.error('Error formatting flight details:', error);
        setValue('message', 'I would like to enquire about booking a flight.');
      }
    } 
    else if (holidayDetails) {
      let message = `I'm interested in booking the following holiday package:\n\n` +
        `Destination: ${holidayDetails.destination}\n` +
        `Package: ${holidayDetails.title}\n` +
        `Duration: ${holidayDetails.duration}\n` +
        `Price: £${holidayDetails.price}\n`;
      
      if (holidayDetails.departureDate) {
        message += `Preferred Departure Date: ${holidayDetails.departureDate}\n`;
      }
      
      message += `Number of Travelers: ${holidayDetails.travelers || '2'}\n\n` +
        `Please contact me with more information about booking this holiday.`;
      
      setValue('message', message);
    }
    else if (packageDetails) {
      let message = `I'm interested in the following tour package:\n\n` +
        `Package: ${packageDetails.title}\n` +
        `Destination: ${packageDetails.destination}\n` +
        `Duration: ${packageDetails.duration}\n` +
        `Price: £${packageDetails.price}\n\n` +
        `Please contact me with more information about this package.`;
      
      setValue('message', message);
    } else {
      setValue('message', 'I would like to enquire about travel options.');
    }
  }, [flightDetails, holidayDetails, packageDetails, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFormResponse(null);
  
    console.log('Submitting enquiry form with data:', { 
      ...data, 
      message: data.message.substring(0, 30) + '...',
      enquiryType,
      flightDetails: flightDetails ? '...' : null,
      holidayDetails: holidayDetails ? '...' : null,
      packageDetails: packageDetails ? '...' : null
    });
  
    // Try up to 3 times to submit the form
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3 to submit enquiry form`);
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            // Include the details based on enquiry type
            enquiryType,
            flightDetails: enquiryType === 'flight' ? flightDetails : null,
            holidayDetails: enquiryType === 'holiday' ? holidayDetails : null,
            packageDetails: enquiryType === 'package' ? packageDetails : null
          }),
        });
  
        const result = await response.json();
        console.log('Form submission response:', result);
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit the form');
        }
  
        // Form submitted successfully
        setFormResponse({
          status: 'success',
          message: result.message || 'Thank you for your enquiry. We will be in touch shortly!',
        });
  
        // Reset the form
        reset();
        
        // Exit the retry loop on success
        break;
      } catch (error) {
        console.error(`Error submitting form (attempt ${attempt}/3):`, error);
        
        // Only set error response on final attempt
        if (attempt === 3) {
          setFormResponse({
            status: 'error',
            message: error instanceof Error 
              ? error.message 
              : 'Our system is currently experiencing difficulties. Please try again later or contact us by phone.'
          });
        } else {
          // Small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    setIsSubmitting(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Make an Enquiry</h1>
          <p className="text-lg text-slate-600">We're here to help you plan your perfect trip</p>
        </div>
        
        {enquiryType === 'flight' && flightDetails && (
          <div className="bg-white border-l-4 border-blue-500 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Flight Enquiry Details</h2>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <ArrowRight className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Route</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <p className="font-bold text-slate-800 text-lg">{flightDetails.origin}</p>
                        <p className="text-sm text-slate-600">{flightDetails.originCity}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                      <div className="text-center">
                        <p className="font-bold text-slate-800 text-lg">{flightDetails.destination}</p>
                        <p className="text-sm text-slate-600">{flightDetails.destinationCity}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Travel Dates</span>
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">Departure: {formatDate(flightDetails.departureDate)}</p>
                      {flightDetails.returnDate && (
                        <p className="font-medium text-slate-800">Return: {formatDate(flightDetails.returnDate)}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Plane className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Airline</span>
                    </div>
                    <p className="font-medium text-slate-800">{getAirlineName(flightDetails.airline)}</p>
                    <p className="text-sm text-slate-600">Flight {flightDetails.airline} {flightDetails.flightNumber}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">💰</span>
                      <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Price</span>
                    </div>
                    <p className="font-bold text-2xl text-green-600">£{parseFloat(flightDetails.price).toFixed(2)}</p>
                    <p className="text-sm text-slate-600">Total price</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {enquiryType === 'holiday' && holidayDetails && (
          <div className="bg-white border-l-4 border-emerald-500 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-emerald-100 rounded-full p-2 mr-3">
                <CalendarClock className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Holiday Package Details</h2>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Package</p>
                    <p className="font-medium text-slate-800">{holidayDetails.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Destination</p>
                    <p className="font-medium text-slate-800">{holidayDetails.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Duration</p>
                    <p className="font-medium text-slate-800">{holidayDetails.duration}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {holidayDetails.departureDate && (
                    <div>
                      <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Preferred Departure</p>
                      <p className="font-medium text-slate-800">{holidayDetails.departureDate}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Price</p>
                    <p className="font-bold text-2xl text-green-600">£{holidayDetails.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Travellers</p>
                    <p className="font-medium text-slate-800">{holidayDetails.travelers || '2'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {enquiryType === 'package' && packageDetails && (
          <div className="bg-white border-l-4 border-purple-500 rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Tour Package Details</h2>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Package</p>
                    <p className="font-medium text-slate-800">{packageDetails.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Destination</p>
                    <p className="font-medium text-slate-800">{packageDetails.destination}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Duration</p>
                    <p className="font-medium text-slate-800">{packageDetails.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-1">Price</p>
                    <p className="font-bold text-2xl text-green-600">£{packageDetails.price}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form response message */}
        {formResponse && (
          <div 
            className={`mb-6 p-4 rounded-lg border-l-4 shadow-md ${
              formResponse.status === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : 'bg-red-50 border-red-400 text-red-800'
            }`}
          >
            <p className="font-medium">{formResponse.message}</p>
            {formResponse.status === 'success' && (
              <button
                onClick={() => router.push('/')}
                className="mt-4 inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Return to Home
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center">
              <User className="h-6 w-6 mr-3" />
              <h2 className="text-xl font-semibold">Your Contact Details</h2>
            </div>
            <p className="text-slate-300 mt-1">Please fill in your information so we can get back to you</p>
          </div>
          
          <div className="px-6 py-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-2 ${
                      errors.firstName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-slate-400'
                    }`}
                    placeholder="Enter your first name"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-2 ${
                      errors.lastName 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-slate-400'
                    }`}
                    placeholder="Enter your last name"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-2 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-slate-400'
                    }`}
                    placeholder="your.email@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="block w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    placeholder="+44 123 456 7890"
                    {...register('phone')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={`block w-full px-4 py-3 rounded-lg border-2 transition-colors focus:ring-2 focus:ring-offset-2 resize-none ${
                    errors.message 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white hover:border-slate-400'
                  }`}
                  placeholder="Tell us about your travel requirements..."
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 font-medium">{errors.message.message}</p>
                )}
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white transition-all duration-200 ${
                    isSubmitting 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mt-8 bg-white rounded-lg shadow-lg border border-slate-200">
          <div className="bg-slate-800 text-white px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Get in Touch</h2>
            <p className="text-slate-300 mt-1">Prefer to contact us directly? Here's how</p>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start p-4 bg-slate-50 rounded-lg">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">Email</p>
                  <a href="mailto:flightbookings@skylimittravels.co.uk" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    flightbookings@skylimittravels.co.uk
                  </a>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-slate-50 rounded-lg">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">Phone</p>
                  <a href="tel:03330384142" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                    03330384142
                  </a>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-slate-50 rounded-lg">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-slate-700 font-medium">
                    61A Blagden St<br />
                    Sheffield S2 5QS<br />
                    United Kingdom
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4 bg-slate-50 rounded-lg">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-1">Business Hours</p>
                  <p className="text-slate-700 font-medium">
                    Monday - Friday: 9am - 6pm<br />
                    Saturday: 10am - 4pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnquiryPageContent />
    </Suspense>
  );
} 