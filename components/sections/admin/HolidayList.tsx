"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Holiday {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  imageUrl: string | null;
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HolidayList() {

  const router = useRouter();
  
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState<string | null>(null);

  // Fetch holidays from API
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/holidays');
        
        if (!response.ok) {
          throw new Error('Failed to fetch holidays');
        }
        
        const data = await response.json();
        setHolidays(data);
      } catch (err) {
        console.error('Error fetching holidays:', err);
        setError('Failed to load holidays. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // Handle holiday deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/holidays/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete holiday');
      }
      
      // Remove holiday from state
      setHolidays(holidays.filter(holiday => holiday.id !== id));
      
      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error('Error deleting holiday:', err);
      alert('Failed to delete holiday. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Holidays</h1>
          <p className="text-gray-600 mt-1">Create and manage your holiday packages</p>
        </div>
        <Link href="/admin/holidays/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Holiday
          </Button>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
            <p>Loading holidays...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p>{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : holidays.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">No holidays found. Create your first holiday package!</p>
            <Link href="/admin/holidays/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Holiday
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {holiday.imageUrl ? (
                          <img
                            src={holiday.imageUrl}
                            alt={holiday.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                            No img
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">{holiday.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {holiday.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{holiday.destination}</TableCell>
                    <TableCell>{holiday.duration}</TableCell>
                    <TableCell>£{holiday.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          holiday.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {holiday.available ? 'Available' : 'Unavailable'}
                      </span>
                      {holiday.featured && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/holidays/${holiday.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/holidays/${holiday.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(holiday.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
} 