import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Sky Limit Travels',
  description: 'Terms and conditions for Sky Limit Travels services, bookings, payments, and liability.',
}

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <Link href="/legal" className="text-blue-600 hover:text-blue-800 inline-flex items-center group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Legal Information</span>
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-3">Terms & Conditions</h1>
        <p className="text-gray-500 italic">
          Last updated: 30 June 2024
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            Please read these Terms and Conditions carefully before using the services offered by Sky Limit Travels. These terms establish the rules and regulations for the use of our services.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="prose prose-blue prose-headings:text-blue-800 prose-headings:font-semibold prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">1</span>
                  Definitions
                </h2>
                <div className="pl-11">
                  <p>
                    In these Terms and Conditions:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span><strong className="text-gray-800">"Sky Limit Travels", "we", "our", and "us"</strong> refers to Sky Limit Travels, its employees, and representatives.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span><strong className="text-gray-800">"Client", "you", and "your"</strong> refers to the person or entity booking travel arrangements through Sky Limit Travels.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span><strong className="text-gray-800">"Services"</strong> means the travel arrangements, consultations, bookings, and other travel-related services offered by Sky Limit Travels.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span><strong className="text-gray-800">"Supplier"</strong> means any third-party provider of travel services, including but not limited to airlines, hotels, tour operators, and transfer companies.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">2</span>
                  Acceptance of Terms
                </h2>
                <div className="pl-11">
                  <p>
                    By using our website or services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">3</span>
                  Booking Process
                </h2>
                <div className="pl-11">
                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">3.1 Enquiries and Quotations</h3>
                  <p>
                    Enquiries and quotations do not constitute a booking. Prices quoted are subject to change until a booking is confirmed with payment.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">3.2 Booking Confirmation</h3>
                  <p>
                    A booking is confirmed only when:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span>You have provided all required information;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span>You have agreed to these Terms and Conditions;</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span>We have received the required deposit or full payment; and</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-800 mr-2">•</span>
                      <span>We have issued a written confirmation.</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">4</span>
                  Payments
                </h2>
                <div className="pl-11">
                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">4.1 Deposits</h3>
                  <p>
                    A non-refundable deposit of 25% of the total booking cost is required to confirm most bookings. Some suppliers may require a higher deposit, which will be specified at the time of booking.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">4.2 Final Payment</h3>
                  <p>
                    Full payment is typically required 60 days before the departure date. For bookings made within 60 days of departure, full payment is required at the time of booking.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">4.3 Payment Methods</h3>
                  <p>
                    We accept payments by major credit cards, bank transfers, and other methods specified on our website. Payment processing fees may apply.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">5</span>
                  Prices and Surcharges
                </h2>
                <div className="pl-11">
                  <p>
                    All prices are quoted in GBP (British Pounds) and include applicable taxes unless otherwise stated. Prices are subject to change until full payment is received. We reserve the right to impose surcharges for increases in transportation costs, government taxes, or exchange rate fluctuations.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">6</span>
                  Changes and Cancellations
                </h2>
                <div className="pl-11">
                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">6.1 Changes by You</h3>
                  <p>
                    If you wish to change any part of your booking after confirmation, we will make reasonable efforts to accommodate your request. An administration fee of £50 per change may apply, plus any additional costs imposed by suppliers.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">6.2 Cancellations by You</h3>
                  <p>
                    Cancellations must be made in writing. Cancellation fees depend on when the cancellation is made:
                  </p>
                  
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <ul className="space-y-2">
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">More than 60 days before departure:</span>
                        <span className="text-gray-600">Loss of deposit</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">60-31 days before departure:</span>
                        <span className="text-gray-600">50% of total booking cost</span>
                      </li>
                      <li className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700">30-15 days before departure:</span>
                        <span className="text-gray-600">75% of total booking cost</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium text-gray-700">14 days or less before departure:</span>
                        <span className="text-gray-600">100% of total booking cost</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="mt-4">
                    Please refer to our <Link href="/legal/refund" className="text-blue-600 hover:text-blue-800 underline">Refund Policy</Link> for more details.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">6.3 Changes or Cancellations by Us</h3>
                  <p>
                    We reserve the right to change or cancel your booking in certain circumstances, including but not limited to force majeure events, safety concerns, or insufficient participants for a tour. In such cases, we will offer an alternative service of comparable standard or a refund.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">7</span>
                  Travel Insurance
                </h2>
                <div className="pl-11">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200 my-4">
                    <p className="text-gray-700 font-medium">
                      We strongly recommend that all clients purchase comprehensive travel insurance at the time of booking. Your insurance should cover cancellation, medical expenses, repatriation, personal injury, and other risks. Proof of insurance may be required before departure.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">8</span>
                  Passports, Visas, and Health Requirements
                </h2>
                <div className="pl-11">
                  <p>
                    You are responsible for ensuring you have valid travel documents, visas, and meet health requirements for your destination. We can provide general information, but it is your responsibility to verify requirements with the relevant authorities.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">9</span>
                  Liability
                </h2>
                <div className="pl-11">
                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">9.1 Our Liability</h3>
                  <p>
                    We act as an agent for various travel suppliers. While we select suppliers with reasonable care, we cannot accept liability for the acts or omissions of these third-party suppliers. Our liability is limited to issues directly under our control.
                  </p>

                  <h3 className="font-semibold text-gray-800 mt-6 mb-2">9.2 Force Majeure</h3>
                  <p>
                    We cannot accept liability for any loss, damage, or additional expense where the performance of our obligations is prevented by circumstances amounting to force majeure, including but not limited to war, threat of war, riot, civil strife, terrorist activity, natural disaster, fire, technical problems with transport, closure of airports, and similar events beyond our control.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">10</span>
                  Complaints
                </h2>
                <div className="pl-11">
                  <p>
                    If you encounter any issues during your travel, please inform us and the relevant supplier as soon as possible to allow us to address the matter. Complaints should be made in writing within 28 days of returning from your trip.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">11</span>
                  Data Protection
                </h2>
                <div className="pl-11">
                  <p>
                    Your personal information will be processed in accordance with our <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</Link>.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">12</span>
                  Governing Law
                </h2>
                <div className="pl-11">
                  <p>
                    These Terms and Conditions are governed by and construed in accordance with the laws of the United Kingdom.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">13</span>
                  Updates to Terms and Conditions
                </h2>
                <div className="pl-11">
                  <p>
                    We may update these Terms and Conditions from time to time. The latest version will be posted on our website with the date it was last updated.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="flex items-center justify-center bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm">14</span>
                  Contact Us
                </h2>
                <div className="pl-11">
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us at:
                  </p>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 mb-1">Email: <a href="mailto:Flightbookings@skylimittravels.co.uk" className="text-blue-700 hover:text-blue-900">Flightbookings@skylimittravels.co.uk</a></p>
                    <p className="text-gray-700">Phone: 03330384142</p>
                    <p className="text-gray-700">Address: 61A Blagden St, Sheffield S2 5QS</p>
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