'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Mail,
  PlaneTakeoff,
  Calendar,
  User,
  LogOut,
  Plus,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const [stats, setStats] = useState({
    totalEnquiries: 5,
    newEnquiries: 2,
    totalHolidays: 8,
    totalTripPlans: 3,
    pendingTripPlans: 1
  });

  const [recentEnquiries, setRecentEnquiries] = useState([
    {
      id: '1',
      customerName: 'John Smith',
      email: 'john@example.com',
      subject: 'Holiday Package',
      status: 'NEW',
      date: new Date('2023-08-15')
    },
    {
      id: '2',
      customerName: 'Emma Wilson',
      email: 'emma@example.com',
      subject: 'Flight Booking',
      status: 'IN_PROGRESS',
      date: new Date('2023-08-14')
    },
    {
      id: '3',
      customerName: 'Michael Brown',
      email: 'michael@example.com',
      subject: 'Travel Advice',
      status: 'RESOLVED',
      date: new Date('2023-08-12')
    }
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const handleSignOut = () => {
    router.push('/admin/logout');
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'NEW':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>New</span>;
      case 'IN_PROGRESS':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>In Progress</span>;
      case 'RESOLVED':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Resolved</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="p-6 md:ml-[15rem]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <button 
            onClick={refreshData}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={() => router.push('/admin/holidays/new')}
            className="flex items-center px-3 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Holiday
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome, {session?.user?.name || 'Admin'}</h2>
            <p className="text-gray-700">You are logged in as: {session?.user?.email}</p>
            <p className="text-gray-700">Role: {session?.user?.role}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Enquiries</h3>
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-500 mr-2" />
            <p className="text-3xl font-bold text-blue-600">{stats.totalEnquiries}</p>
            <span className="ml-2 text-sm text-gray-500">({stats.newEnquiries} new)</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Holidays</h3>
          <div className="flex items-center">
            <Package className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-3xl font-bold text-green-600">{stats.totalHolidays}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Trip Plans</h3>
          <div className="flex items-center">
            <PlaneTakeoff className="h-5 w-5 text-purple-500 mr-2" />
            <p className="text-3xl font-bold text-purple-600">{stats.totalTripPlans}</p>
            <span className="ml-2 text-sm text-yellow-600">({stats.pendingTripPlans} pending)</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Users</h3>
          <div className="flex items-center">
            <User className="h-5 w-5 text-orange-500 mr-2" />
            <p className="text-3xl font-bold text-orange-600">1</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => router.push('/admin/enquiries')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <Mail className="h-8 w-8 mb-2 text-blue-500" />
          <span className="font-medium">View Enquiries</span>
        </button>
        
        <button 
          onClick={() => router.push('/admin/holidays')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <Package className="h-8 w-8 mb-2 text-green-500" />
          <span className="font-medium">Manage Holidays</span>
        </button>
        
        <button 
          onClick={() => router.push('/admin/trip-plans')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <PlaneTakeoff className="h-8 w-8 mb-2 text-purple-500" />
          <span className="font-medium">Manage Trip Plans</span>
        </button>
      </div>
      
      {/* Recent Enquiries */}
      <h2 className="text-xl font-semibold mb-4">Recent Enquiries</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{enquiry.customerName}</div>
                    <div className="text-sm text-gray-500">{enquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {enquiry.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(enquiry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(enquiry.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => router.push(`/admin/enquiries/${enquiry.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-right">
          <button 
            onClick={() => router.push('/admin/enquiries')}
            className="text-sm font-medium text-blue-600 hover:text-blue-900"
          >
            View All Enquiries
          </button>
        </div>
      </div>
    </div>
  );
} 