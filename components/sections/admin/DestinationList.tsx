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

interface destination {
  id: string;
  title: string;
  from: string;
  description: string;
  destination: string;
  duration: string;
  price: number;
  imageUrl: string | null;
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  slogan?: string
  popular: string
}

export default function DestinationList() {

  const router = useRouter();

  const [destinations, setDestinations] = useState<destination[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  // Fetch destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/destination');

        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }

        const data = await response.json();

        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Handle destination deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Destination?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/destination/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete destination');
      }

      // Remove destination from state
      setDestinations(destinations.filter(destination => destination.id !== id));

      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error('Error deleting destination:', err);
      alert('Failed to delete destination. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Destination</h1>
          <p className="text-gray-600 mt-1">Create and manage Destination</p>
        </div>
        <Link href="/admin/destinations/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Destination
          </Button>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-2" />
            <p>Loading Destinations...</p>
          </div>
        ) :
          error ? (
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
          ) : destinations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No Destinations found. Create your first Destination!</p>
              <Link href="/admin/destinations/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Destination
                </Button>
              </Link>
            </div>
          ) :
            (
              <div className="overflow-x-auto">
                <Table className='min-w-full divide-y divide-gray-200'>
                  <TableHeader className='bg-gray-50'>
                    <TableRow className='border-b border-gray-200'>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Image</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Title</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>From</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Destination</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Available</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Featured</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700  truncate max-w-[200px] '>Popular (%)</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700'>Slogan</TableHead>
                      <TableHead className='text-left py-3 px-4 font-semibold text-gray-700  truncate max-w-[200px] '>Discount upto (%)</TableHead>
                      <TableHead className="text-center  py-3 px-4 font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {destinations.map((destination: any) => (
                      <TableRow key={destination.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {destination.destinationImage ? (
                              <img
                                src={destination.destinationImage}
                                alt={destination.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                                No img
                              </div>
                            )}

                          </div>
                        </TableCell>

                        <TableCell className='truncate max-w-[200px] '>
                          {destination.title.length > 30 ? destination.title.slice(0, 30) + "..." : destination.title}</TableCell>

                        <TableCell className='truncate max-w-[200px] '>{destination.from.length > 30 ? destination.from.slice(0, 30) + "..." : destination.from}</TableCell>

                        <TableCell className='truncate max-w-[200px] '>{destination.destination.length > 30 ? destination.destination.slice(0, 30) + "..." : destination.destination}</TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${destination.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {destination.available ? 'Available' : 'Unavailable'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {destination.featured ? (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Featured
                            </span>
                          ) : "--"}
                        </TableCell>
                       
                        <TableCell className='text-center truncate max-w-[200px] '>{destination.popular} </TableCell>
                       
                        <TableCell className='truncate max-w-[200px]'>{destination?.slogan?.length > 30 ? destination?.slogan?.slice(0, 30) + "..." : destination?.slogan}</TableCell>
                       
                        <TableCell className='text-center'>{destination.discountUpTo}</TableCell>
                       
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/destinations/${destination.id}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/destinations/${destination.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(destination.id)}
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