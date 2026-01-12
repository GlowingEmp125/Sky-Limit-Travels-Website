import { Metadata } from 'next';
import HolidayList from '@/components/sections/admin/HolidayList';

export const metadata: Metadata = {
  title: 'Admin | Manage Holidays',
  description: 'Admin panel to manage holiday packages',
};

export default function AdminHolidaysPage() {
  return (
    <div className="min-h-screen bg-gray-50 md:ml-[15rem]">
      <HolidayList />
    </div>
  );
} 