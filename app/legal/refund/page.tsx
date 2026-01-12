import Link from 'next/link';
import { ChevronLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Refund Policy | Sky Limit Travels',
  description: 'Learn about Sky Limit Travels refund and cancellation policies for travel services.',
}

export default function RefundPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <Link href="/legal" className="text-blue-600 hover:text-blue-800 inline-flex items-center group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Legal Information</span>
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3">Refund Policy</h1>
        <p className="text-gray-500 italic">
          Last updated: 30 June 2024
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            At Sky Limit Travels, we understand that plans can change. This Refund Policy outlines when and how you can cancel your booking and receive a refund.
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Quick Reference Guide */}
          <div className="mb-12 bg-gradient-to-r from-blue-50 via-blue-50 to-white rounded-xl overflow-hidden shadow-sm">
            <div className="bg-blue-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Quick Reference Guide
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-4 border-b border-blue-100 pb-2">Cancellation Timeframes</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">60+ days before departure:</span>
                        <p className="text-gray-600 text-sm mt-1">Deposit only (typically 25%)</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">60-31 days:</span>
                        <p className="text-gray-600 text-sm mt-1">50% of booking cost</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">30-15 days:</span>
                        <p className="text-gray-600 text-sm mt-1">75% of booking cost</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">14 days or less:</span>
                        <p className="text-gray-600 text-sm mt-1">100% of booking cost (no refund)</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-4 border-b border-blue-100 pb-2">Refund Processing Times</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">Standard refund:</span>
                        <p className="text-gray-600 text-sm mt-1">7-14 business days after approval</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">Credit card refunds:</span>
                        <p className="text-gray-600 text-sm mt-1">1-2 billing cycles to appear on statement</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <div>
                        <span className="font-medium text-gray-800">Bank transfers:</span>
                        <p className="text-gray-600 text-sm mt-1">3-5 business days to process</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-blue prose-headings:text-blue-800 prose-headings:font-semibold prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">1</span>
                  Cancellation by You
                </h2>
                <div className="pl-11">
                  <p>
                    If you need to cancel your booking, please notify us in writing as soon as possible. The amount refundable depends on when you cancel in relation to your departure date:
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">1.1 Refundable Amounts</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span><strong className="text-gray-800">More than 60 days before departure:</strong> Full refund minus the non-refundable deposit (typically 25% of the total booking cost)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span><strong className="text-gray-800">60-31 days before departure:</strong> 50% of the total booking cost will be refunded</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span><strong className="text-gray-800">30-15 days before departure:</strong> 25% of the total booking cost will be refunded</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span><strong className="text-gray-800">14 days or less before departure:</strong> No refund</span>
                    </li>
                  </ul>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">1.2 Special Promotional Bookings</h3>
                  <p>
                    Certain promotional fares and special offers may have different cancellation policies. These will be clearly communicated to you at the time of booking.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">2</span>
                  Cancellation by Suppliers
                </h2>
                <div className="pl-11">
                  <p>
                    In the event that a supplier (airline, hotel, tour operator, etc.) cancels a service:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>We will inform you as soon as possible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>We will attempt to find a suitable alternative of equal or higher quality at no additional cost</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>If no suitable alternative is available or acceptable to you, we will provide a full refund for the affected service</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">3</span>
                  Cancellation by Sky Limit Travels
                </h2>
                <div className="pl-11">
                  <p>
                    In the rare event that we need to cancel your booking:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>We will notify you as soon as possible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>We will offer an alternative service of comparable standard if available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span>If the alternative is not acceptable to you, we will provide a full refund of all monies paid to us</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">4</span>
                  Force Majeure
                </h2>
                <div className="pl-11">
                  <div className="bg-amber-50 border-l-4 border-amber-300 p-4 my-4 rounded-r-lg">
                    <div className="flex">
                      <AlertTriangle className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" />
                      <p className="text-amber-800 text-sm">
                        Force majeure events are unusual and unforeseeable circumstances beyond our control, the consequences of which could not have been avoided even with all due care.
                      </p>
                    </div>
                  </div>
                  
                  <p>
                    If your booking is affected by events beyond our control (force majeure), including but not limited to war, threat of war, civil unrest, terrorist activity, natural disaster, adverse weather conditions, or health emergencies:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>We will make reasonable efforts to provide alternative arrangements</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>If it is not possible to provide the service at all, refunds will be determined on a case-by-case basis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>We strongly recommend comprehensive travel insurance to cover such situations</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">5</span>
                  Refund Process
                </h2>
                <div className="pl-11">
                  <p>
                    When a refund has been approved:
                  </p>
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 my-4">
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-blue-700 text-sm">1</span>
                        </div>
                        <span>Refunds will be processed to the original payment method where possible</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-blue-700 text-sm">2</span>
                        </div>
                        <span>Standard refunds are typically processed within 7-14 business days of approval</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-blue-700 text-sm">3</span>
                        </div>
                        <span>Credit card refunds may take 1-2 billing cycles to appear on your statement</span>
                      </li>
                      <li className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-blue-700 text-sm">4</span>
                        </div>
                        <span>Bank transfer refunds typically take 3-5 business days to process</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">6</span>
                  Unused Services
                </h2>
                <div className="pl-11">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 mb-2 font-medium">No refunds will be given for services that are booked and paid for but not used during your trip. This includes:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>Accommodation check-in no-shows</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>Missed flights or transfers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>Early departure from accommodation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        <span>Skipped tours or activities</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">7</span>
                  Changes to Bookings
                </h2>
                <div className="pl-11">
                  <p>
                    If you wish to change your booking rather than cancel it:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>An administration fee of £50 per change may apply</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>Additional costs imposed by suppliers will be passed on to you</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>Changes are subject to availability and rate differences</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">8</span>
                  Travel Insurance
                </h2>
                <div className="pl-11">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-300 my-4">
                    <p className="text-blue-800 font-medium">
                      We strongly recommend that all clients purchase comprehensive travel insurance at the time of booking. A good travel insurance policy can provide coverage for trip cancellation, interruption, medical emergencies, and other unforeseen circumstances.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">9</span>
                  Exceptions and Special Circumstances
                </h2>
                <div className="pl-11">
                  <p>
                    We recognise that sometimes cancellations are unavoidable due to serious circumstances. In cases of:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>Serious illness or injury requiring hospitalisation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>Death of a traveller or immediate family member</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-700 mr-2">•</span>
                      <span>Government-issued travel advisories against travel to your destination</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    We may, at our discretion, offer more generous refund terms. Supporting documentation will be required.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">10</span>
                  Contact Us
                </h2>
                <div className="pl-11">
                  <p>
                    If you need to cancel a booking or have questions about our refund policy, please contact us as soon as possible at:
                  </p>
                  <div className="mt-4 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-700">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="mb-1">
                        <strong className="text-gray-800">Sky Limit Travels</strong>
                      </p>
                      <p className="text-gray-600 mb-1">Email: <a href="mailto:Flightbookings@skylimittravels.co.uk" className="text-blue-600 hover:text-blue-800">Flightbookings@skylimittravels.co.uk</a></p>
                      <p className="text-gray-600">Phone: 03330384142</p>
                      <p className="text-gray-600">Address: 61A Blagden St, Sheffield S2 5QS</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center flex-wrap gap-4">
        <Link href="/legal" className="inline-flex items-center text-blue-600 hover:text-blue-800 group">
          <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Legal Information
        </Link>
        <Link 
          href="/contact" 
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-sm transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
} 