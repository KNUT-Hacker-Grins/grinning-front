'use client';

import BottomNav from '@/components/BottomNav';
import ItemMap from '@/components/ItemMap';
import RegisterHeader from '@/components/RegisterHeader'; // Reusing header

export default function MapPage() {
  return (
        <div className="w-full mx-auto bg-white flex flex-col h-screen border-x" style={{ maxWidth: '390px' }}>
      <RegisterHeader title="지도에서 찾기" />
      <div className="flex-1 relative">
        <ItemMap />
      </div>
    <BottomNav />
      
    </div>
  );
}