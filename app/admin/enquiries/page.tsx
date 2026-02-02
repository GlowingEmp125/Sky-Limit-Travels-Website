'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Briefcase, LogOut, Menu, X, Filter, Search, ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import { formatAirportDisplay, getCityAndCountry } from '@/data/airports';

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
  type?: string;
};

// Define the pagination type
type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function EnquiriesPage() {

  const { data: session, status } = useSession();

  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch enquiries
  const fetchEnquiries = async (page = 1, status = '') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', '10');
      if (status) {
        queryParams.append('status', status);
      }

      const response = await fetch(`/api/admin/enquiries?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch enquiries');
      }

      const data = await response.json();
      setEnquiries(data.enquiries);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update enquiry status
  const updateEnquiryStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update enquiry status');
      }

      // Refresh the enquiries list
      fetchEnquiries(pagination.page, statusFilter);
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchEnquiries(newPage, statusFilter);
    }
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    fetchEnquiries(1, status);
  };

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }

    if (status === 'authenticated') {
      fetchEnquiries();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  // Parse and format flight route for display
  const getFlightRouteDisplay = (enquiry: Enquiry): string | null => {
    if (!enquiry.flightDetails) return null;

    try {
      const flightDetails = JSON.parse(enquiry.flightDetails);
      const origin = flightDetails.originCity || getCityAndCountry(flightDetails.origin);
      const destination = flightDetails.destinationCity || getCityAndCountry(flightDetails.destination);
      return `${origin} → ${destination}`;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="font-semibold text-lg">Sky Limit Travels</div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="text-xl font-bold text-gray-800 ">Sky Limit Travels</div>
          <div className="text-sm text-gray-600">Admin Panel</div>
        </div>

        <nav className="mt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main
          </div>
          <Link
            href="/admin/dashboard"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-100"
          >
            <Users className="w-5 h-5 mr-3" />
            Enquiries
          </Link>
          <Link
            href="/admin/holidays"
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <Briefcase className="w-5 h-5 mr-3" />
            Holidays
          </Link>

          <div className="px-4 py-2 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          <button
            onClick={() => {
              // Sign out logic will be implemented later
              router.push('/admin/login');
            }}
            className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-gray-100 text-left"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="text-gray-600">Manage customer enquiries</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 text-gray-500 mr-2" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESPONDED">Responded</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search enquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-md px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Route/Subject</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No enquiries found
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enquiry: any) => {
                      const flightRoute = getFlightRouteDisplay(enquiry);

                      return (
                        <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {enquiry.firstName} {enquiry.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{enquiry.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {enquiry.type === 'FLIGHT' && <Plane className="w-4 h-4 mr-1 text-blue-600" />}
                              <span className="text-sm font-medium">
                                {enquiry.type || 'General'}
                              </span>
                            </div>
                          </td>
                          {/* <td className="py-3 px-4">
                            {flightRoute ? (
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{flightRoute}</div>
                                <div className="text-gray-500 truncate max-w-xs">Flight enquiry</div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {enquiry.message.substring(0, 50)}...
                              </div>
                            )}
                          </td> */}
                          <div className="font-medium text-gray-900 pt-3 px-4">{`${enquiry.from} -> ${enquiry.destination}`}</div>
                          {enquiry.returnFrom && <div className="text-medium text-gray-900  px-4">{`${enquiry.returnFrom} -> ${enquiry.returnDestination}`}</div>}
                          <td className="py-3 px-4 text-sm text-gray-500">
                            {formatDate(enquiry.createdAt)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${getStatusBadgeColor(
                                enquiry.status
                              )}`}
                            >
                              {enquiry.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Link
                                href={`/admin/enquiries/${enquiry.id}`}
                                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                              >
                                View
                              </Link>
                              <select
                                value={enquiry.status}
                                onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="NEW">New</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESPONDED">Responded</option>
                                <option value="CLOSED">Closed</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === pagination.totalPages
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}