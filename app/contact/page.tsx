'use client';

import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

// Define the form data type from the schema
type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formResponse, setFormResponse] = useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before showing interactive elements
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setFormResponse(null);
    
    console.log('Submitting contact form with data:', { 
      ...data, 
      message: data.message.substring(0, 30) + '...'
    });

    // Try up to 3 times to submit the form
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3 to submit form`);
        
        // Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            enquiryType: 'GENERAL'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server returned non-JSON response');
        }

        let result;
        try {
          result = await response.json();
        } catch (error) {
          console.error('Error parsing response JSON:', error);
          throw new Error('Invalid response from server');
        }

        console.log('Form submission response:', result);

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit the form');
        }

        // Form submitted successfully
        setFormResponse({
          status: 'success',
          message: result.message || 'Thank you for your enquiry. We will be in touch shortly!',
        });

        // Reset the form
        reset();
        
        // Exit the retry loop on success
        break;
      } catch (error) {
        console.error(`Error submitting form (attempt ${attempt}/3):`, error);
        
        // Handle specific error types
        let errorMessage = 'Our system is currently experiencing difficulties. Please try again later or contact us by phone.';
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = 'The request timed out. Please check your internet connection and try again.';
          } else if (error.message.includes('non-JSON response')) {
            errorMessage = 'Received an invalid response from the server. Please try again later.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
          }
        }
        
        // Only set error response on final attempt
        if (attempt === 3) {
          setFormResponse({
            status: 'error',
            message: errorMessage
          });
        } else {
          // Small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Increasing delay between retries
        }
      }
    }
    
    setIsSubmitting(false);
  };

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-blue-50/80">
        <div className="relative h-[300px]">
          <div className="absolute inset-0 bg-[url('/contact.jpg')] bg-cover bg-[center_70%]"></div>
          <div className="absolute inset-0 bg-blue-600/40"></div>
          <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Let us help you plan your perfect journey. Reach out to our travel advisors today.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-center">
            <div className="animate-pulse text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/80">
      {/* Hero Section */}
      <div className="relative h-[300px]">
        <div className="absolute inset-0 bg-[url('/contact.jpg')] bg-cover bg-[center_70%]"></div>
        <div className="absolute inset-0 bg-blue-600/40"></div>
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Let us help you plan your perfect journey. Reach out to our travel advisors today.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600">03330384142</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-lg">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">Flightbookings@skylimittravels.co.uk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-lg">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">61A Blagden St</p>
                    <p className="text-gray-600">Sheffield S2 5QS</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-400/10 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              {formResponse && (
                <div
                  className={`p-4 mb-6 rounded-lg ${
                    formResponse.status === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {formResponse.message}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-800 mb-2">
                      First Name
                    </label>
                    <input
                      {...register('firstName')}
                      type="text"
                      id="firstName"
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                        errors.firstName ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                      } focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-800 mb-2">
                      Last Name
                    </label>
                    <input
                      {...register('lastName')}
                      type="text"
                      id="lastName"
                      className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                        errors.lastName ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                      } focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                      errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                    } focus:ring-2 focus:ring-blue-200 outline-none transition-colors`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-800 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                    placeholder="+44 7123 456789"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-2">
                    Your Message
                  </label>
                  <textarea
                    {...register('message')}
                    id="message"
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                      errors.message ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
                    } focus:ring-2 focus:ring-blue-200 outline-none transition-colors resize-none`}
                    placeholder="Tell us about your travel plans..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 hover:shadow-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 