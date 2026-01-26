'use client';

import DestinationForm from '@/components/sections/admin/DestinationForm';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function EditDestinationPage({ params }: { params: { id: string } }) {

    const router = useRouter();

    const [destination, setDestination] = useState<any | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const formatDateForInput = (date:Date) => {
            if (!date) return '';
            return new Date(date).toISOString().split('T')[0];
        };
        const fetchDestination = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/admin/destination/${params.id}`);


                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Destination not found');
                    }
                    throw new Error('Failed to fetch destination');
                }

                let data = await response.json();

                let landingPageDestinations = data?.landingPageDestinations.map((item: any) => ({
                    ...item,
                    date: formatDateForInput(item.date),

                }))

                data = {
                    ...data,
                    landingPageDestinations
                }
                setDestination(data);
            } catch (err) {
                console.error('Error fetching destination:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDestination();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
                    <p className="mt-4 text-gray-600">Loading destination data...</p>
                </div>
            </div>
        );
    }

    if (error || !destination) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Destination Not Found</h1>
                    <p className="text-gray-600 mt-2">
                        {error || "The destination you're trying to edit doesn't exist."}
                    </p>
                    <button
                        onClick={() => router.push('/admin/destination')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Destinations
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <DestinationForm initialData={destination} isEditing={true} />
        </div>
    );
} 