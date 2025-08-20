'use client';

import { Suspense } from 'react';
import PoliceItemDetailContent from './PoliceItemDetailContent';

export default function PoliceItemDetailPage() {
  return (
    <Suspense fallback={<div>Loading police item details...</div>}>
      <PoliceItemDetailContent />
    </Suspense>
  );
}
