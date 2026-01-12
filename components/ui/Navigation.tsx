"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile-only phone number header - at the very top */}
      <div className="md:hidden bg-blue-800 text-white py-2 px-4 fixed w-full z-50" style={{ top: '0' }}>
        <div className="flex items-center justify-center">
          <a 
            href="tel:03330384142"
            className="flex items-center text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="text-sm font-semibold">Call us: 0333 038 4142</span>
          </a>
        </div>
      </div>

      <header className="fixed w-full bg-white shadow-md z-40">
        <style jsx global>{`
          @media (max-width: 767px) {
            header {
              top: 36px !important;
            }
            body {
              padding-top: 36px !important;
            }
          }
          @media (min-width: 768px) {
            header {
              top: 0 !important;
            }
            body {
              padding-top: '36px' !important;
            }
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
          <Link href="/" className="flex items-center space-x-4 group">
            <Image 
              src="/slt-logo.png"
              alt="Sky Limit Travels Logo"
              width={90}
              height={90}
              className="object-contain group-hover:scale-105 transition-transform duration-200"
              priority
            />
          </Link>
          
          <div className="hidden md:flex items-center justify-center flex-1 ml-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 text-[15px] font-medium text-gray-800 hover:text-blue-800 bg-white hover:bg-blue-50 data-[state=open]:bg-blue-50 data-[state=open]:text-blue-800 rounded-lg transition-colors">
                    Flights
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] lg:w-[600px] bg-white rounded-xl shadow-lg overflow-hidden">
                      {/* Embedded Header for Desktop Dropdown */}
                      <div className="bg-blue-800 p-4 text-center">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Flight Destinations
                        </h3>
                        <p className="text-sm text-blue-100">
                          Explore flights to popular destinations
                        </p>
                      </div>
                      
                      {/* Desktop Dropdown Content */}
                      <div className="grid grid-cols-2 gap-2 p-6">
                        <div>
                          <Link href="/flights/countries/france" legacyBehavior passHref>
                            <a className="group flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                                <img 
                                  src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                  alt="France" 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">France</h4>
                                <p className="text-sm text-gray-600">Paris, Nice, Lyon</p>
                              </div>
                            </a>
                          </Link>
                          
                          <Link href="/flights/countries/spain" legacyBehavior passHref>
                            <a className="group flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                                <img 
                                  src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                  alt="Spain" 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">Spain</h4>
                                <p className="text-sm text-gray-600">Barcelona, Madrid, Malaga</p>
                              </div>
                            </a>
                          </Link>
                        </div>
                        
                        <div>
                          <Link href="/flights/countries/italy" legacyBehavior passHref>
                            <a className="group flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                                <img 
                                  src="https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                  alt="Italy" 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">Italy</h4>
                                <p className="text-sm text-gray-600">Rome, Venice, Milan</p>
                              </div>
                            </a>
                          </Link>
                          
                          <Link href="/flights/countries/greece" legacyBehavior passHref>
                            <a className="group flex items-center gap-2 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 shrink-0">
                                <img 
                                  src="https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                                  alt="Greece" 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">Greece</h4>
                                <p className="text-sm text-gray-600">Athens, Santorini, Crete</p>
                              </div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink className="h-10 px-4 text-[15px] font-medium text-gray-800 hover:text-blue-800 bg-white hover:bg-blue-50 rounded-lg inline-flex items-center transition-colors">
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/contact" legacyBehavior passHref>
                    <NavigationMenuLink className="h-10 px-4 text-[15px] font-medium text-gray-800 hover:text-blue-800 bg-white hover:bg-blue-50 rounded-lg inline-flex items-center transition-colors">
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* Phone number for desktop */}
            <a 
              href="tel:03330384142"
              className="hidden md:flex h-10 px-4 items-center justify-center text-blue-800 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg text-[15px] font-semibold transition-all duration-200 hover:shadow-md border border-blue-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              0333 038 4142
            </a>
            
            <Link 
              href="/plan-trip"
              className="hidden md:flex h-10 px-6 items-center justify-center bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-[15px] font-medium transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              Plan Your Trip
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-blue-50 rounded-lg transition-colors relative z-50"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 bg-white z-30 md:hidden transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '116px' }}
        >
          <div className="px-6 h-full overflow-y-auto py-6">
            <nav className="space-y-6">
              {/* Simplified mobile navigation with only essential links */}
              <div className="space-y-3">
                <Link 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border-l-4 border-transparent hover:border-blue-500"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </Link>
                
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border-l-4 border-transparent hover:border-blue-500"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Us
                </Link>
                
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border-l-4 border-transparent hover:border-blue-500"
                >
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </Link>
              </div>

              <div className="pt-4">
                <Link 
                  href="/plan-trip"
                  className="flex items-center justify-center w-full px-4 py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors border border-gray-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Plan Your Trip
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
} 