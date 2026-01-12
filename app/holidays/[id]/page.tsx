import { Metadata } from 'next';
import { holidaysData } from '@/data/holidays';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Hardcoded destinations for demonstration
const destinations = [
  { id: '1', name: 'Santorini, Greece' },
  { id: '2', name: 'Bali, Indonesia' },
  { id: '3', name: 'Maldives' },
  { id: '4', name: 'Swiss Alps' }
];

export function generateStaticParams() {
  // Return hardcoded IDs for demonstration
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ];
}

// Generate metadata for each page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const destination = destinations.find(d => d.id === params.id);
  
  if (!destination) {
    return {
      title: 'Destination Not Found',
      description: 'The requested destination information could not be found.'
    };
  }

  return {
    title: `${destination.name} | Destination Guide`,
    description: `Travel guide for ${destination.name} with flight information, local attractions, and travel tips.`,
    openGraph: {
      title: `${destination.name} | Destination Guide`,
      description: `Travel guide for ${destination.name} with flight information, local attractions, and travel tips.`,
      images: ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff'],
    },
  };
}

// Simple destination information component
function DestinationInfo({ id }: { id: string }) {
  const destination = destinations.find(d => d.id === id);
  
  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Destination Not Found</h1>
        <p className="text-gray-600 mb-6">The requested destination information could not be found.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">{destination.name}</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">
          Information about {destination.name} is currently being updated. Please check back soon for more details.
        </p>
        <div className="text-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DestinationPage({ params }: { params: { id: string } }) {
  return <DestinationInfo id={params.id} />;
} 