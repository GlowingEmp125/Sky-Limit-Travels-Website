import Link from 'next/link';
import { Shield, ScrollText, Info, Wallet, Cookie } from 'lucide-react';

export const metadata = {
  title: 'Legal Information | Sky Limit Travels',
  description: 'Legal information, terms and conditions, privacy policy, refund policy, and cookie policy for Sky Limit Travels.',
}

export default function LegalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent mb-4">Legal Information</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Essential information about our policies, terms, and legal agreements.
        </p>
      </div>
      
      <div className="relative mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl transform -rotate-1 scale-105"></div>
        <div className="relative grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4 p-4 md:p-8">
          {/* Terms & Conditions */}
          <Link href="/legal/terms" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full hover:shadow-md hover:border-blue-100 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <ScrollText className="w-7 h-7 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Terms & Conditions</h2>
                <p className="text-gray-600 mb-4">
                  Our terms for using our services, booking trips, and the responsibilities of all parties.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Privacy Policy */}
          <Link href="/legal/privacy" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full hover:shadow-md hover:border-blue-100 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Shield className="w-7 h-7 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Privacy Policy</h2>
                <p className="text-gray-600 mb-4">
                  How we collect, use, and protect your personal information when using our services.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Refund Policy */}
          <Link href="/legal/refund" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full hover:shadow-md hover:border-blue-100 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Wallet className="w-7 h-7 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Refund Policy</h2>
                <p className="text-gray-600 mb-4">
                  Our policies regarding cancellations, refunds, and when you can expect your money back.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Cookie Policy */}
          <Link href="/legal/cookies" className="group">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full hover:shadow-md hover:border-blue-100 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full transform translate-x-8 -translate-y-8 group-hover:bg-blue-100 transition-colors duration-300"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                  <Cookie className="w-7 h-7 text-blue-700" />
                </div>
                <h2 className="text-xl font-semibold mb-3 text-blue-800">Cookie Policy</h2>
                <p className="text-gray-600 mb-4">
                  Information about how we use cookies and similar technologies on our website.
                </p>
                <div className="pt-2">
                  <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-50 rounded-2xl p-8 shadow-sm border border-blue-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm">
              <Info className="w-8 h-8 text-blue-700" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-800">Need further assistance?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 text-center">
            If you have any questions about our legal documents or need clarification on any points, our customer service team is here to help. We're committed to transparency and happy to provide any further information you might need.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 shadow-sm hover:shadow transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 