'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AIResult } from '@/types/airesult';

export function useAIResult(imageUrl?: string) {
  const [data, setData] = useState<AIResult | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // POST /api/classify
        const json = await api.classify.image(imageUrl);
        if (cancelled) return;

        setRaw(json);
        // outputs 배열 그대로 담기
        setData({ outputs: json });
      } catch (e: any) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return { data, raw, loading, error };
}
