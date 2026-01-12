import { Metadata } from 'next';
import HolidayForm from '@/components/sections/admin/HolidayForm';

export const metadata: Metadata = {
  title: 'Admin | Add New Holiday',
  description: 'Create a new holiday package',
};

export default function AddNewHolidayPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <HolidayForm />
    </div>
  );
} 