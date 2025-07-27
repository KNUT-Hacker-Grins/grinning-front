'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RegisterHeader from '@/components/RegisterHeader';
import SectionTitle from '@/components/SectionTitle';

export default function AIClassificationResult() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto bg-white p-4">
      {/* 상단 헤더 */}
      <RegisterHeader title="AI 분류 결과" />

      {/* 이미지 영역 */}
      <div className="rounded-lg border border-dotted border-gray-300 overflow-hidden mb-4 mt-4">
        <Image
          src="/button (1).png" // 실제 이미지 경로로 변경 가능
          alt="분류된 이미지"
          width={512}
          height={400}
          className="w-full h-auto"
        />
      </div>

      {/* 분류 정보 박스 */}
      <div className="bg-blue-50 rounded-xl p-4 mb-3">
        <div className="flex items-center gap-2 mb-2 font-semibold text-blue-700">
          <span>🤖</span>
          <span>AI 자동 분류</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <div>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-md">전자제품</span>
          </div>
          <div className="text-green-600 font-semibold">정확도 95%</div>
        </div>
        <div className="text-sm text-gray-700">
          세부 분류: <b>스마트폰 · 휴대폰</b>
        </div>
      </div>

      {/* AI 추천 정보 */}
      <div className="bg-yellow-50 text-sm text-gray-800 border-l-4 border-yellow-400 p-3 rounded-md mb-4">
        <div className="font-semibold mb-1">
          <SectionTitle title="AI 추천 정보" />
        </div>
        <div>
          스마트폰의 경우 모델명, 색상, 케이스 유무 등을 추가로 입력하시면 찾을 확률이 높아집니다.
        </div>
      </div>

      {/* 버튼 */}
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
