"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  PackageOpen,
  Mail,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  Map,
  PlaneTakeoff
} from 'lucide-react';

export default function AdminSidebar() {

  const pathname = usePathname();

  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  // Handle initial state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    // Just navigate to the logout page which handles all signout logic
    router.push('/admin/logout');
  };

  const routes = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Holidays', path: '/admin/holidays', icon: <PackageOpen size={20} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <Mail size={20} /> },
    { name: 'Trip Plans', path: '/admin/trip-plans', icon: <PlaneTakeoff size={20} /> },
    { name: 'Destinations', path: '/admin/destinations', icon: <Map size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  // Prevent rendering until client-side to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-0 left-0 z-50 md:hidden p-4 ">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:shadow-xl
  `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-800">
            <h1 className="text-xl font-bold">Sky Limit Admin</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${isActive(route.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{route.icon}</span>
                <span>{route.name}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
} 