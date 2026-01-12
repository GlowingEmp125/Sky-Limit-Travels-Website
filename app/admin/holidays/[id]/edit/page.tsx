'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HolidayForm from '@/components/sections/admin/HolidayForm';
import { Loader2 } from 'lucide-react';

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
}

export default function EditHolidayPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoliday = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/holidays/${params.id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Holiday not found');
          }
          throw new Error('Failed to fetch holiday');
        }
        
        const data = await response.json();
        setHoliday(data);
      } catch (err) {
        console.error('Error fetching holiday:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoliday();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading holiday data...</p>
        </div>
      </div>
    );
  }

  if (error || !holiday) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Holiday Not Found</h1>
          <p className="text-gray-600 mt-2">
            {error || "The holiday you're trying to edit doesn't exist."}
          </p>
          <button
            onClick={() => router.push('/admin/holidays')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Holidays
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HolidayForm initialData={holiday} isEditing={true} />
    </div>
  );
} 