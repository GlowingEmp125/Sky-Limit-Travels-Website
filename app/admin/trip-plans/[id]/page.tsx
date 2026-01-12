'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Calendar, 
  Mail, 
  MapPin, 
  User,
  Plane,
  Clock,
  PlaneTakeoff
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

export default function TripPlanDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchTripPlan = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/trip-plans/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch trip plan details');
        }
        
        const data = await response.json();
        setTripPlan(data);
        setNotes(data.notes || '');
        setStatus(data.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching trip plan details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchTripPlan();
    }
  }, [id]);
  
  const updateTripPlan = async () => {
    if (!tripPlan) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/admin/trip-plans/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes,
          status,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update trip plan');
      }
      
      const updatedTripPlan = await response.json();
      setTripPlan(updatedTripPlan);
      alert('Trip plan updated successfully');
    } catch (err) {
      console.error('Error updating trip plan:', err);
      alert('Failed to update trip plan. Please try again.');
    } finally {
      setIsSaving(false);
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
  
  const calculateDuration = (departureDate: Date, returnDate: Date) => {
    const start = new Date(departureDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (error || !tripPlan) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
            {error || 'Trip plan not found'}
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/trip-plans')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trip Plans
          </Button>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/trip-plans')}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Trip Plan Details</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={updateTripPlan}
              disabled={isSaving}
              className="whitespace-nowrap"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-xl md:text-2xl">{tripPlan.destination} Trip</CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        {tripPlan.destination}
                      </div>
                    </CardDescription>
                  </div>
                  <div>{getStatusBadge(tripPlan.status)}</div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full mb-4 grid grid-cols-3">
                    <TabsTrigger value="details">Trip Details</TabsTrigger>
                    <TabsTrigger value="customer">Customer Info</TabsTrigger>
                    <TabsTrigger value="notes">Admin Notes</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700 flex items-center mb-3">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          Travel Dates
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Departure:</span>
                            <span className="font-medium">{formatDate(tripPlan.departureDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Return:</span>
                            <span className="font-medium">{formatDate(tripPlan.returnDate)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Duration:</span>
                            <span className="font-medium">
                              {calculateDuration(tripPlan.departureDate, tripPlan.returnDate)} days
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700 flex items-center mb-3">
                          <User className="h-4 w-4 mr-2 flex-shrink-0" />
                          Travelers
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Adults:</span>
                            <span className="font-medium">{tripPlan.adults}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Children:</span>
                            <span className="font-medium">{tripPlan.children}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Infants:</span>
                            <span className="font-medium">{tripPlan.infants}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700 flex items-center mb-3">
                          <PlaneTakeoff className="h-4 w-4 mr-2 flex-shrink-0" />
                          Trip Type
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">Request:</span>
                            <span className="font-medium capitalize">{tripPlan.tripType}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="font-medium text-gray-700 flex items-center mb-3">
                          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                          Request Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Created:</span>
                            <span className="font-medium">{formatDate(tripPlan.createdAt)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Reference:</span>
                            <span className="font-medium text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {tripPlan.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customer">
                    <div className="bg-gray-50 p-6 rounded-md">
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-700 flex items-center mb-1">
                            <User className="h-4 w-4 mr-2 flex-shrink-0" />
                            Customer Name
                          </h3>
                          <p className="text-lg">{tripPlan.customerName}</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-700 flex items-center mb-1">
                            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                            Email Address
                          </h3>
                          <p className="text-lg break-all">{tripPlan.customerEmail}</p>
                        </div>
                        
                        <div className="pt-4">
                          <Button
                            variant="outline"
                            onClick={() => window.location.href = `mailto:${tripPlan.customerEmail}?subject=Your Trip to ${tripPlan.destination}`}
                            className="flex items-center"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Contact Customer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                          Internal Notes
                        </label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes about this trip plan..."
                          className="min-h-[200px]"
                        />
                      </div>
                      
                      <Button
                        onClick={updateTripPlan}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving Notes...' : 'Save Notes'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => window.location.href = `mailto:${tripPlan.customerEmail}?subject=Your Trip to ${tripPlan.destination}`}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email Customer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const updatedStatus = status === 'PENDING' ? 'IN_PROGRESS' : status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
                    setStatus(updatedStatus);
                  }}
                >
                  <span className="mr-2 h-4 w-4">📋</span>
                  Update Status
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Support Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-700">Destination Guide</h3>
                  <p className="text-sm text-blue-600">Access travel guides for {tripPlan.destination}</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md">
                  <h3 className="font-medium text-green-700">Customer Support</h3>
                  <p className="text-sm text-green-600">Access FAQs and support templates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 