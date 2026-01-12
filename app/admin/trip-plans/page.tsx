'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowUpDown, 
  Calendar, 
  Mail, 
  MapPin, 
  User
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type TripPlan = {
  id: string;
  destination: string;
  tripType: string;
  departureDate: Date;
  returnDate: Date;
  adults: number;
  children: number;
  infants: number;
  customerName: string;
  customerEmail: string;
  status: string;
  createdAt: Date;
  notes?: string;
  assignedTo?: string;
};

export default function TripPlansPage() {
  const router = useRouter();
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchTripPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/trip-plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trip plans');
        }
        
        const data = await response.json();
        setTripPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching trip plans:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTripPlans();
  }, []);
  
  const updateTripPlanStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/trip-plans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update local state to reflect the change
      setTripPlans(
        tripPlans.map((plan) => 
          plan.id === id ? { ...plan, status } : plan
        )
      );
    } catch (err) {
      console.error('Error updating trip plan status:', err);
      alert('Failed to update status. Please try again.');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredTripPlans = tripPlans.filter(plan => {
    // Apply status filter
    if (statusFilter !== 'ALL' && plan.status !== statusFilter) {
      return false;
    }
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        plan.customerName.toLowerCase().includes(searchLower) ||
        plan.customerEmail.toLowerCase().includes(searchLower) ||
        plan.destination.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Trip Plans</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => router.refresh()}
              className="flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              Refresh
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Trip Plans Management</CardTitle>
            <CardDescription>
              View and manage customer trip planning requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, email, or destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center">
                        <span>Customer</span>
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <div className="flex items-center">
                        <span>Destination</span>
                        <MapPin className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[150px]">
                      <div className="flex items-center">
                        <span>Dates</span>
                        <Calendar className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center">
                        <span>Travelers</span>
                        <User className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[120px]">Created</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTripPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No trip plans found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTripPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[180px]">{plan.customerName}</div>
                          <div className="text-sm text-gray-500 flex items-center truncate max-w-[180px]">
                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{plan.customerEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">{plan.destination}</TableCell>
                        <TableCell>
                          <div className="text-sm">{formatDate(plan.departureDate)}</div>
                          <div className="text-sm text-gray-500">{formatDate(plan.returnDate)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{plan.adults} Adult{plan.adults !== 1 ? 's' : ''}</span>
                            {(plan.children > 0 || plan.infants > 0) && (
                              <span className="text-xs text-gray-500">
                                {plan.children > 0 ? `${plan.children} Child${plan.children !== 1 ? 'ren' : ''}` : ''}
                                {plan.children > 0 && plan.infants > 0 ? ', ' : ''}
                                {plan.infants > 0 ? `${plan.infants} Infant${plan.infants !== 1 ? 's' : ''}` : ''}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(plan.status)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(plan.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/trip-plans/${plan.id}`)}
                              className="h-8 px-2 text-xs whitespace-nowrap"
                            >
                              View Details
                            </Button>
                            <Select
                              value={plan.status}
                              onValueChange={(status) => updateTripPlanStatus(plan.id, status)}
                            >
                              <SelectTrigger className="h-8 w-24 text-xs">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 