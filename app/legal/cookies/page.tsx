import Link from 'next/link';
import { ChevronLeft, Cookie as CookieIcon, InfoIcon, Settings, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | Sky Limit Travels',
  description: 'Learn about how Sky Limit Travels uses cookies and similar technologies on our website.',
}

export default function CookiePolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="mb-10">
        <div className="flex items-center mb-2">
          <Link href="/legal" className="text-blue-700 hover:text-blue-900 inline-flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            <span>Back to Legal Information</span>
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Cookie Policy</h1>
        <p className="text-gray-600 italic">
          Last updated: 30 June 2024
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-blue-50 p-6 border-b border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            This Cookie Policy explains how Sky Limit Travels ("we", "us", or "our") uses cookies and similar technologies on our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="prose prose-blue prose-headings:text-blue-800 prose-headings:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-700 prose-a:no-underline hover:prose-a:text-blue-900 hover:prose-a:underline max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">1</span>
                  What Are Cookies?
                </h2>
                <div className="pl-11">
                  <div className="flex items-start gap-6 mb-6 mt-2">
                    <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center shrink-0">
                      <CookieIcon className="w-12 h-12 text-blue-700" />
                    </div>
                    <p className="text-gray-700">
                      Cookies are small text files placed on your device when you visit a website. They help websites work efficiently, remember your preferences, and provide personalised content and advertisements.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">2</span>
                  Types of Cookies We Use
                </h2>
                <div className="pl-11">
                  <p className="mb-4">
                    We use different types of cookies on our website:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-blue-800 mb-2">Essential Cookies</h3>
                      <p className="text-gray-700">
                        Necessary for core website functionality, security, and account access.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-blue-800 mb-2">Performance Cookies</h3>
                      <p className="text-gray-700">
                        Collect information about how visitors use our website to help us improve it.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-blue-800 mb-2">Functionality Cookies</h3>
                      <p className="text-gray-700">
                        Remember your preferences and choices to enhance your experience.
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-blue-800 mb-2">Advertising Cookies</h3>
                      <p className="text-gray-700">
                        Deliver relevant advertisements and measure campaign effectiveness.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-blue-50 rounded-lg p-4 border border-blue-100 mb-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-blue-200">
                          <th className="px-4 py-2 text-left text-blue-800 font-semibold">Category</th>
                          <th className="px-4 py-2 text-left text-blue-800 font-semibold">Purpose</th>
                          <th className="px-4 py-2 text-left text-blue-800 font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-blue-100">
                          <td className="px-4 py-3 font-medium text-gray-800">Essential</td>
                          <td className="px-4 py-3 text-gray-700">Website functionality, security</td>
                          <td className="px-4 py-3 text-gray-700">Session to 2 years</td>
                        </tr>
                        <tr className="border-b border-blue-100">
                          <td className="px-4 py-3 font-medium text-gray-800">Analytics</td>
                          <td className="px-4 py-3 text-gray-700">Improving website performance</td>
                          <td className="px-4 py-3 text-gray-700">Session to 2 years</td>
                        </tr>
                        <tr className="border-b border-blue-100">
                          <td className="px-4 py-3 font-medium text-gray-800">Functionality</td>
                          <td className="px-4 py-3 text-gray-700">Remembering preferences</td>
                          <td className="px-4 py-3 text-gray-700">Session to 1 year</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-800">Advertising</td>
                          <td className="px-4 py-3 text-gray-700">Delivering relevant advertisements</td>
                          <td className="px-4 py-3 text-gray-700">Session to 2 years</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">3</span>
                  Third-Party Cookies
                </h2>
                <div className="pl-11">
                  <p className="mb-4">
                    We also use third-party services that may set cookies on your device:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Google Analytics</h4>
                        <p className="text-gray-700 text-sm">Website analytics</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Facebook Pixel</h4>
                        <p className="text-gray-700 text-sm">Advertising and remarketing</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Payment processors</h4>
                        <p className="text-gray-700 text-sm">Secure transactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Booking systems</h4>
                        <p className="text-gray-700 text-sm">Travel bookings and reservations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">4</span>
                  How to Control Cookies
                </h2>
                <div className="pl-11">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="mt-1">
                      <Settings className="w-6 h-6 text-blue-700" />
                    </div>
                    <p>
                      You can control cookies through browser settings or our cookie preference tool. Removing cookies may affect your user experience.
                    </p>
                  </div>

                  <h3 className="font-semibold text-gray-800 mt-4 mb-2">Browser Controls</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-1 border-b border-gray-100 pb-1">Chrome</h4>
                      <p className="text-gray-700 text-sm">Settings → Privacy and security → Cookies</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-1 border-b border-gray-100 pb-1">Firefox</h4>
                      <p className="text-gray-700 text-sm">Options → Privacy & Security → Cookies</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-1 border-b border-gray-100 pb-1">Safari</h4>
                      <p className="text-gray-700 text-sm">Preferences → Privacy → Cookies</p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                      <h4 className="font-medium text-gray-800 mb-1 border-b border-gray-100 pb-1">Edge</h4>
                      <p className="text-gray-700 text-sm">Settings → Cookies and site permissions</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">Cookie Preference Tool</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                    <p className="text-gray-700">
                      You can change your cookie preferences at any time by clicking "Cookie Settings" in our website footer.
                    </p>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">Opting Out of Advertising Cookies</h3>
                  <p className="mb-2">
                    You can opt out of targeted advertising through:
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li>
                      <a href="http://www.aboutads.info/choices/" className="text-blue-700 hover:text-blue-900">Digital Advertising Alliance (DAA)</a>
                    </li>
                    <li>
                      <a href="http://www.networkadvertising.org/choices/" className="text-blue-700 hover:text-blue-900">Network Advertising Initiative (NAI)</a>
                    </li>
                    <li>
                      <a href="http://www.youronlinechoices.eu/" className="text-blue-700 hover:text-blue-900">European Interactive Digital Advertising Alliance (EDAA)</a>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">5</span>
                  Updates to This Policy
                </h2>
                <div className="pl-11">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      <InfoIcon className="w-6 h-6 text-blue-700" />
                    </div>
                    <p>
                      We may update this Cookie Policy from time to time. Any changes will be posted on this page. We encourage you to review this policy periodically.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full mr-3 text-sm flex items-center justify-center">6</span>
                  Contact Us
                </h2>
                <div className="pl-11">
                  <p className="mb-4">
                    If you have any questions about our Cookie Policy, please contact our Data Protection Team at:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
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

      <div className="mt-10 flex justify-between items-center flex-wrap gap-4">
        <Link href="/legal" className="inline-flex items-center text-blue-700 hover:text-blue-900">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Legal Information
        </Link>
        <Link 
          href="/contact" 
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-blue-700 hover:bg-blue-800 shadow-sm"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
} 