'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import RegisterHeader from '@/components/RegisterHeader';
import SectionTitle from '@/components/SectionTitle';
import { Suspense, useState } from 'react';

// Suspense의 fallback으로 보여줄 로딩 컴포넌트
function LoadingState() {
  return (
    <div className="max-w-md mx-auto bg-white p-4">
      <RegisterHeader title="AI 분류 결과" />
      <div className="bg-gray-50 text-gray-600 p-3 rounded my-4">AI 분류 결과를 불러오는 중…</div>
    </div>
  );
}

// useSearchParams를 사용하는 실제 페이지 컨텐츠
function AIClassificationResultContent() {
  const router = useRouter();
  const q = useSearchParams();
  const imageId = q.get('image_id') || '';

  // TODO: 빌드 오류 해결을 위해 임시 주석 처리. useAIResult 훅 구현 필요.
  // const { data, raw, loading, error } = useAIResult(imageId);

  // TODO: 임시 하드코딩 데이터. useAIResult 훅 구현 후 삭제 필요.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [data, setData] = useState({
    category: '전자제품',
    subcategory: '스마트폰 · 휴대폰',
    confidence: 0.95
  });
  const [raw, setRaw] = useState({});

  return (
    <div className="max-w-md mx-auto bg-white p-4">
      <RegisterHeader title="AI 분류 결과" />

      <div className="rounded-lg border border-dotted border-gray-300 overflow-hidden mb-4 mt-4">
        <Image
          src="/button (1).png" // 실제 이미지 경로로 변경 가능
          alt="분류된 이미지"
          width={512}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {loading && (
        <div className="bg-gray-50 text-gray-600 p-3 rounded mb-3">분류 결과 불러오는 중…</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded mb-3">
          불러오기 실패: {error.message}
        </div>
      )}

      <div className="bg-blue-50 rounded-xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-2 font-semibold text-blue-700">
          <span>🤖</span>
          <span>AI 자동 분류</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <div>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
              {data.category}
            </span>
          </div>
          <div className="text-green-600 font-semibold">
            정확도: {Math.round((data.confidence ?? 0) * 100)}%
          </div>
        </div>
        <div className="text-sm text-gray-700">
          세부 분류: <b>{data.subcategory}</b>
        </div>
      </div>

      <div className="bg-yellow-50 text-sm text-gray-800 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
        <div className="font-semibold mb-1">
          <SectionTitle title="AI 추천 정보" />
        </div>
        <div>
          스마트폰의 경우 모델명, 색상, 케이스 유무 등을 추가로 입력하시면 찾을 확률이 높아집니다.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="bg-blue-600 text-white font-semibold py-2 rounded-lg shadow">
          ✓ 이대로 등록하기
        </button>
        <button className="bg-gray-100 text-gray-700 font-medium py-2 rounded-lg border border-gray-300">
          ✎ 카테고리 수정하기
        </button>
      </div>
    </div>
  );
}

// Suspense로 컨텐츠를 감싸는 페이지 컴포넌트
export default function AIClassificationResultPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AIClassificationResultContent />
    </Suspense>
  );
}