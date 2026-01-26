import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Calendar, Clock, MapPin, DollarSign, Star, Check, ChevronLeft,
    Award, Edit, Trash2, Plus, Eye, Package, Tag, Users, Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";

const adminUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;

if (!adminUrl) {
    throw new Error('No database URL configured. Please set DATABASE_URL or POSTGRES_URL_NON_POOLING');
}

const adapter = new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL });
const prisma = new PrismaClient({ adapter });

// Fetch destination data
async function getDestination(id: string) {
    try {
        const destination = await prisma.destination.findUnique({
            where: { id },
            include: {
                landingPageDestinations: {
                    orderBy: { date: 'asc' }
                },
                landingPageTips: {
                    orderBy: { createdAt: 'asc' }
                },
            },
        });
        return destination;
    } catch (error) {
        console.error('Error fetching destination:', error);
        return null;
    }
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const destination = await getDestination(id);

    if (!destination) {
        return {
            title: 'Destination Not Found | Admin',
            description: 'The requested destination information could not be found.'
        };
    }

    return {
        title: `${destination.title} - Admin View | Sky Limit Traveler`,
        description: `Admin view for ${destination.title} destination management`,
        robots: {
            index: false,
            follow: false,
        },
    };
}

// Main admin destination detail component
export default async function AdminDestinationDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const destination = await getDestination(id);

    console.log("destination==========>", destination);

    if (!destination) {
        notFound();
    }


    return (
        <div className="min-h-screen bg-gray-50  ">
            {/* Admin Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-0">
                <div className="max-w-[1250px] ml-auto px-4 sm:px-6 lg:px-8 py-4 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/destinations" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                <ChevronLeft className="w-5 h-5 mr-1" />
                                Back to Destinations
                            </Link>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <h1 className="text-xl font-semibold text-gray-900">Destination Details</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href={`/admin/destinations/${id}/edit`}>
                                <Button size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Destination
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-[1250px] ml-auto p-6 ">

                {/* Status Banner */}
                <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border">
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${destination.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {destination.available ? '● Available' : '● Unavailable'}
                        </div>
                        {destination.featured && (
                            <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                ⭐ Featured
                            </div>
                        )}
                        <div className="text-sm text-gray-600">
                            Created: {new Date(destination.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                            Updated: {new Date(destination.updatedAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Destination Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-6">
                        {destination.destinationImage && (
                            <div className="w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={destination.destinationImage}
                                    alt={destination.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{destination.title}</h2>
                                    {destination.slogan && (
                                        <p className="text-lg text-gray-600 italic">"{destination.slogan}"</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mt-6">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                                    <p className="text-sm text-gray-600">Destination</p>
                                    <p className="text-lg font-semibold text-gray-900">{destination.destination}</p>
                                </div>
                                <div className="bg-cyan-50 rounded-lg p-4">
                                    <Clock className="w-6 h-6 text-cyan-600 mb-2" />
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="text-lg font-semibold text-gray-900">{destination.duration}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                                    <p className="text-sm text-gray-600">Base Price</p>
                                    <p className="text-lg font-semibold text-gray-900">${destination.price}</p>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <Tag className="w-6 h-6 text-purple-600 mb-2" />
                                    <p className="text-sm text-gray-600">Discount</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {destination.discountUpTo ? `${destination.discountUpTo}%` : 'None'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{destination.description}</p>
                </div>

                {/* Available Flights */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Plane className="w-5 h-5 mr-2" />
                            Available Flights ({destination.landingPageDestinations.length})
                        </h3>
                    </div>

                    {destination.landingPageDestinations.length > 0 ? (
                        <div className="space-y-3">
                            {destination.landingPageDestinations.map((flight) => (
                                <div key={flight.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {flight.destinationImage && (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                    <img src={flight.destinationImage} alt="Flight" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900">{flight.from} → {flight.destination}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {new Date(flight.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {flight.duration}
                                                    </span>
                                                    <span>{flight.stops} Stop{flight.stops !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right mr-4">
                                                <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                                                <p className="text-sm text-gray-600">per person</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Plane className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No flights added yet</p>
                        </div>
                    )}
                </div>

                {/* Travel Tips */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            Travel Tips & Insights ({destination.landingPageTips.length})
                        </h3>

                    </div>

                    {destination.landingPageTips.length > 0 ? (
                        <div className="space-y-3">
                            {destination.landingPageTips.map((tip) => (
                                <div key={tip.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                                            <p className="text-gray-700 text-sm">{tip.description}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Created: {new Date(tip.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Star className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p>No travel tips added yet</p>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Destination ID</p>
                            <p className="font-mono text-gray-900">{destination.id}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Image URL</p>
                            <p className="font-mono text-gray-900 truncate">{destination.destinationImage || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Created At</p>
                            <p className="text-gray-900">{new Date(destination.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Last Updated</p>
                            <p className="text-gray-900">{new Date(destination.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}