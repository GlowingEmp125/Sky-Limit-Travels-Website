import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ],
  legal: [
    { name: 'Terms & Conditions', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Refund Policy', href: '/legal/refund' },
    { name: 'Cookie Policy', href: '/legal/cookies' }
  ]
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="space-y-4 md:space-y-6">
            <Link href="/" className="flex items-center space-x-4">
              <Image 
                src="/slt-logo.png"
                alt="Sky Limit Travels Logo"
                width={147}
                height={147}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Elevating your travel dreams to new heights. Discover the world with Sky Limit Travels.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm">03330384142</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm break-all">flightbookings@skylimittravels.co.uk</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">61A Blagden St, Sheffield S2 5QS</span>
              </div>
            </div>
          </div>

          {/* Links Columns with better mobile layout */}
          <div className="grid grid-cols-2 gap-8 md:gap-4 col-span-1 md:col-span-2">
            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4">Company</h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4">Legal</h3>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 md:mt-12 md:pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {/* Visa */}
              <div className="flex flex-col items-center">
                <div className="bg-[#1434CB] text-white px-4 md:px-6 py-2 rounded h-8 md:h-10 flex items-center justify-center">
                  <span className="font-bold italic text-lg md:text-xl tracking-tight">VISA</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Visa</span>
              </div>
              
              {/* Mastercard */}
              <div className="flex flex-col items-center">
                <div className="h-8 md:h-10 w-12 md:w-14 relative rounded overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 md:w-6 h-8 md:h-10 bg-[#EB001B] rounded-full absolute left-1"></div>
                    <div className="w-5 md:w-6 h-8 md:h-10 bg-[#F79E1B] rounded-full absolute right-1"></div>
                    <div className="w-3 md:w-4 h-8 md:h-10 bg-[#FF5F00] absolute mx-auto left-0 right-0 z-10"></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1">Mastercard</span>
              </div>
              
              {/* American Express */}
              <div className="flex flex-col items-center">
                <div className="bg-[#006FCF] text-white px-2 py-1 md:py-2 rounded h-8 md:h-10 flex items-center justify-center">
                  <span className="font-bold text-xs md:text-sm">American Express</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Amex</span>
              </div>
              
              {/* PayPal */}
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 px-3 md:px-4 py-1 md:py-2 rounded h-8 md:h-10 flex items-center justify-center">
                  <span className="font-bold text-[#253B80]">Pay</span>
                  <span className="font-bold text-[#179BD7]">Pal</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">PayPal</span>
              </div>
              
              {/* Apple Pay */}
              <div className="flex flex-col items-center">
                <div className="bg-black text-white px-3 md:px-4 py-1 md:py-2 rounded h-8 md:h-10 flex items-center justify-center">
                  <span className="font-medium text-sm">Apple Pay</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Apple Pay</span>
              </div>
              
              {/* Google Pay */}
              <div className="flex flex-col items-center">
                <div className="bg-white border border-gray-200 px-3 md:px-4 py-1 md:py-2 rounded h-8 md:h-10 flex items-center justify-center">
                  <span className="font-medium text-[#4285F4]">G</span>
                  <span className="font-medium text-[#EA4335]">o</span>
                  <span className="font-medium text-[#FBBC05]">o</span>
                  <span className="font-medium text-[#4285F4]">g</span>
                  <span className="font-medium text-[#34A853]">l</span>
                  <span className="font-medium text-[#EA4335]">e</span>
                  <span className="font-medium text-gray-600 ml-1">Pay</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Google Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 md:mt-12 md:pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600 text-center">
              © 2024 Sky Limit Travels. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center">
              Website built by{' '}
              <Link 
                href="https://www.devora.co.uk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Devora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 