'use client';

import { useEffect, useMemo, useState } from 'react';

export type AIResult = {
  category: string;
  subcategory: string;
  confidence: number;   // 0~1
  tips?: string[];
  // 백엔드가 내려주는 원본 키들은 추가로 여기에 확장
  [key: string]: any;
};

export function useAIResult(imageId?: string) {
  const [data, setData] = useState<AIResult | null>(null);
  const [raw, setRaw]   = useState<any>(null);            // 원본 그대로 보기용
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<Error | null>(null);

  const apiBase = useMemo(() => process.env.NEXT_PUBLIC_API_BASE ?? '', []);

  useEffect(() => {
    if (!imageId) return;
    const ctrl = new AbortController();

    async function run() {
      try {
        setLoading(true);
        setError(null);

        // “그대로 받기” 포인트
        const res = await fetch(
          `${apiBase}/api/ai/classify?image_url=${encodeURIComponent(imageId)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            cache: 'no-store',           // 항상 최신
            credentials: 'include',      // 쿠키 기반 인증이면 포함
            signal: ctrl.signal,
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
        }

        const json = await res.json();
        setRaw(json);                    // 원본 그대로 저장

        // 화면에서 쓰기 편한 최소 가공 (필드명이 다르면 매핑)
        setData({
          category: json.category ?? json.top_category ?? '미분류',
          subcategory: json.subcategory ?? json.label ?? '알 수 없음',
          confidence: typeof json.confidence === 'number'
            ? json.confidence
            : (typeof json.score === 'number' ? json.score : 0),
          tips: json.tips ?? [],
          ...json,                       // 필요 시 원본 필드도 그대로 함께 넣기
        });
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e);
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => ctrl.abort();
  }, [apiBase, imageId]);

  return { data, raw, loading, error };
}
