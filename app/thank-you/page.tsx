'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ThankYouPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messageType, setMessageType] = useState<string | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    setMessageType(type);
    
    // If no type is specified, redirect to home
    if (!type) {
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 py-8 px-4 sm:px-10 text-center">
          <CheckCircle2 className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Thank You!</h1>
        </div>

        <div className="px-4 py-8 sm:px-10 text-center">
          {messageType === 'trip-planning' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Trip Plan Request Has Been Submitted
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We've received your travel plans and one of our travel advisors will be in touch with you shortly to discuss the details and help create your perfect holiday.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 text-blue-600 mr-2 flex-shrink-0">1</span>
                    <span>Our team will review your travel preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 text-blue-600 mr-2 flex-shrink-0">2</span>
                    <span>A travel advisor will contact you within 24 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-200 text-blue-600 mr-2 flex-shrink-0">3</span>
                    <span>We'll create a tailored itinerary based on your preferences</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {messageType === 'contact' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your Message Has Been Sent
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for reaching out to us. Our team will respond to your enquiry as soon as possible.
              </p>
            </>
          )}

          {messageType === 'newsletter' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                You're Now Subscribed!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for subscribing to our newsletter. You'll now receive updates on our latest offers, travel tips, and destination guides.
              </p>
            </>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouPageContent />
    </Suspense>
  );
} 