'use client';

import BottomNav from '@/components/BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-grow">{children}</main>
      <BottomNav />
    </>
  );
}
