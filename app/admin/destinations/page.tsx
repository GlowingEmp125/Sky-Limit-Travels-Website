import { Metadata } from 'next';
import DestinationList from '@/components/sections/admin/DestinationList';

export const metadata: Metadata = {
  title: 'Admin | Manage Destinations',
  description: 'Admin panel to manage destinations',
};

export default function AdminDestinationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 md:ml-[15rem]">
      <DestinationList />
    </div>
  );
} 