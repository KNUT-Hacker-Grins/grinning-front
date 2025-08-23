'use client';

import { Suspense } from 'react';
import PoliceLostItemDetailContent from './PoliceLostItemDetailContent';

export default function PoliceLostItemDetailPage() {
  return (
    <Suspense fallback={<div>Loading police item details...</div>}>
      <PoliceLostItemDetailContent />
    </Suspense>
  );
}
