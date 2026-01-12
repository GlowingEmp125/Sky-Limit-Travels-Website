'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Calendar, CheckCircle, Loader2, Plane, MapPin } from 'lucide-react';
import { formatAirportDisplay, getCityAndCountry } from '@/data/airports';
import { getAirlineName } from '@/lib/airlines';

// Define the Enquiry type
type Enquiry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  flightDetails?: string;
  holidayDetails?: string;
  packageDetails?: string;
  type?: string;
};

// Define parsed flight details type
type ParsedFlightDetails = {
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
};

export default function EnquiryDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);

  // Fetch enquiry details
  const fetchEnquiry = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/enquiries/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch enquiry details');
      }

      const data = await response.json();
      setEnquiry(data);
    } catch (error) {
      console.error('Error fetching enquiry details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update enquiry status
  const updateEnquiryStatus = async (status: string) => {
    try {
      setUpdateStatus('loading');
      const response = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.id, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update enquiry status');
      }

      // Refresh the enquiry data
      await fetchEnquiry();
      setUpdateStatus('success');
      
      // Reset success status after 3 seconds
      setTimeout(() => {
        setUpdateStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      setUpdateStatus('error');
    }
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (sessionStatus === 'unauthenticated') {
      router.push('/admin/login');
    }

    if (sessionStatus === 'authenticated') {
      fetchEnquiry();
    }
  }, [sessionStatus, router, params.id]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Parse flight details from JSON string
  const parseFlightDetails = (flightDetailsString: string): ParsedFlightDetails | null => {
    try {
      return JSON.parse(flightDetailsString);
    } catch (error) {
      console.error('Error parsing flight details:', error);
      return null;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading enquiry details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/admin/enquiries" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Enquiries
          </Link>
        </div>

        {enquiry ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  Enquiry from {enquiry.firstName} {enquiry.lastName}
                </h1>
                <div className="mt-2 sm:mt-0">
                  <span
                    className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getStatusBadgeColor(
                      enquiry.status
                    )}`}
                  >
                    {enquiry.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Contact information */}
                <div className="md:col-span-1 space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h2>
                  
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href={`mailto:${enquiry.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {enquiry.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">
                        {enquiry.phone ? (
                          <a href={`tel:${enquiry.phone}`} className="text-blue-600 hover:text-blue-800">
                            {enquiry.phone}
                          </a>
                        ) : (
                          <span className="text-gray-500">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitted On</p>
                      <p className="text-sm text-gray-600">{formatDate(enquiry.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Flight Details Section */}
                {enquiry.flightDetails && (() => {
                  const flightDetails = parseFlightDetails(enquiry.flightDetails);
                  if (!flightDetails) return null;
                  
                  return (
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Plane className="w-5 h-5 mr-2 text-blue-600" />
                        Flight Enquiry Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Route</span>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="flex items-center space-x-3">
                              <div className="text-center">
                                <p className="font-bold text-gray-800">{formatAirportDisplay(flightDetails.origin)}</p>
                                <p className="text-xs text-gray-600">{flightDetails.originCity || getCityAndCountry(flightDetails.origin)}</p>
                              </div>
                              <div className="text-blue-600">→</div>
                              <div className="text-center">
                                <p className="font-bold text-gray-800">{formatAirportDisplay(flightDetails.destination)}</p>
                                <p className="text-xs text-gray-600">{flightDetails.destinationCity || getCityAndCountry(flightDetails.destination)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Travel Dates</span>
                          </div>
                          <div className="bg-white p-3 rounded space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Departure:</span> {new Date(flightDetails.departureDate).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                            </p>
                            {flightDetails.returnDate && (
                              <p className="text-sm">
                                <span className="font-medium">Return:</span> {new Date(flightDetails.returnDate).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <Plane className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Flight Details</span>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="text-sm">
                              <span className="font-medium">Airline:</span> {getAirlineName(flightDetails.airline)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Flight {flightDetails.airline} {flightDetails.flightNumber}
                            </p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Price</span>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="text-lg font-bold text-green-600">
                              £{parseFloat(flightDetails.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Enquiry message */}
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Enquiry Message</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Actions</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="mr-3">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status:
                  </label>
                  <select
                    id="status"
                    value={enquiry.status}
                    onChange={(e) => updateEnquiryStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={updateStatus === 'loading'}
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESPONDED">Responded</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                
                {updateStatus === 'loading' && (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Updating...</span>
                  </div>
                )}
                
                {updateStatus === 'success' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Status updated successfully</span>
                  </div>
                )}
                
                {updateStatus === 'error' && (
                  <div className="text-red-600">
                    <span>Failed to update status</span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Enquiry not found or error loading details</p>
            <Link 
              href="/admin/enquiries" 
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Enquiries
            </Link>
          </div>
        )}
      </main>
    </div>
  );
} 