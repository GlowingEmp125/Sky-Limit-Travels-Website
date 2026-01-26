import { NextRequest, NextResponse } from 'next/server';
import { executeAsAdmin } from '@/lib/prisma-admin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// GET /api/admin/destination
export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated
        // const session = await getServerSession(authOptions);

        // if (!session) {
        //     return NextResponse.json(
        //         { error: 'Unauthorised' },
        //         { status: 401 }
        //     );
        // }

        const { searchParams } = new URL(request.url);

        const search = searchParams.get('slogan');

        const featured = searchParams.get('featured');

        const available = searchParams.get('available');
        const where: any = {};

        if (featured) {
            where.featured = featured === 'true';
        }

        if (available) {
            where.available = available === 'true';
        }

        if (search) {
            where.slogan = {
                contains: search,
                mode: 'insensitive',
            };
        }

        // Use executeAsAdmin for secure database access

        const destination = await executeAsAdmin(async (prisma) => {
            return await prisma.destination.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                }
            });
        })
        return NextResponse.json(destination);

    } catch (error) {
        console.error('Error fetching destination:', error);
        return NextResponse.json(
            { error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}

// POST /api/admin/destination
export async function POST(request: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorised' },
                { status: 401 }
            );
        }

        // Get destination data from request body
        const data = await request.json();

        // Use executeAsAdmin for secure database access
        const destination = await executeAsAdmin(async (prisma) => {
            return await prisma.destination.create({
                data: {
                    title: data.title,
                    description: data.description,
                    from: data.from,
                    popular: data.popular,
                    destination: data.destination,
                    duration: data.duration,
                    price: parseFloat(data.price),
                    slogan: data.slogan || null,
                    discountUpTo: data.discountUpTo ? parseFloat(data.discountUpTo) : null,
                    destinationImage: data.destinationImage || null,
                    featured: data.featured || false,
                    available: data.available || true,

                    // Create related landing page destinations
                    landingPageDestinations: {
                        create: data.landingPageDestinations?.map((lpd: any) => ({
                            from: lpd.from,
                            destination: lpd.destination,
                            duration: lpd.duration,
                            price: parseFloat(lpd.price),
                            date: new Date(lpd.date),
                            stops: parseInt(lpd.stops) || 1,
                            destinationImage: lpd.destinationImage || null
                        })) || []
                    },

                    // Create related landing page tips
                    landingPageTips: {
                        create: data.landingPageTips?.map((tip: any) => ({
                            title: tip.title,
                            description: tip.description
                        })) || []
                    }
                },
                include: {
                    landingPageDestinations: true,
                    landingPageTips: true
                }
            });
        });

        return NextResponse.json(destination, { status: 201 });
    } catch (error) {
        console.error('Error creating destination:', error);
        return NextResponse.json(
            { error: 'Failed to create destination' },
            { status: 500 }
        );
    }
}