'use client';

import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaEllipsisV, FaMapMarkerAlt, FaComments, FaCheck, FaFlag } from 'react-icons/fa';
import BottomNav from '@/components/BottomNav';

// 임시 분실물 데이터 
// DB 연동 TODO

const mockLostItems = {
  '1': {
    id: '1',
    title: '갈색 가죽 지갑',
    category: '지갑',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    timeAgo: '2시간 전',
    location: '서울시 강남구 역삼동 테헤란로 427 지하철 2호선 역삼역 3번 출구 근처',
    registrationDate: '2024년 1월 15일',
    reward: '50,000원',
    categoryDetail: '지갑 · 개인용품',
    status: '찾는 중',
    description: '갈색 가죽 지갑을 분실했습니다. 크기는 가로 10cm, 세로 8cm 정도이며, 안에 신분증과 카드들이 들어있습니다. 지갑 앞면에 작은 금속 로고가 있습니다. 찾아주시면 정말 감사하겠습니다.'
  },
  '2': {
    id: '2',
    title: '검은색 지갑',
    category: '지갑',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
    timeAgo: '5시간 전',
    location: '홍대입구역 2번 출구 근처',
    registrationDate: '2024년 1월 15일',
    reward: '30,000원',
    categoryDetail: '지갑 · 개인용품',
    status: '진행 중',
    description: '검은색 가죽 지갑을 분실했습니다. 작은 크기이며 카드와 현금이 들어있었습니다.'
  }
};

export default function LostItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  
  const item = mockLostItems[itemId as keyof typeof mockLostItems];

  if (!item) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">분실물을 찾을 수 없습니다</h2>
            <button 
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-800"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleChat = () => {
    console.log('채팅 시작');
    // TODO 채팅 기능 구현       
  };

  const handleFound = () => {
    console.log('분실물 찾음');
    // TODO 분실물 찾음 기능        
  };

  const handleReport = () => {
    console.log('신고하기');
    // TODO 신고 기능 
  };

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md bg-white" style={{maxWidth: '390px'}}>
        {/* 헤더 */}
        <header className="flex justify-between items-center px-4 py-4 bg-white border-b border-gray-200">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <FaArrowLeft className="text-gray-600" size={18} />
          </button>
          
          <h1 className="text-lg font-medium text-gray-900">분실물 상세 정보</h1>
          
          <button className="p-2 -mr-2 rounded-lg transition-colors hover:bg-gray-100">
            <FaEllipsisV className="text-gray-600" size={18} />
          </button>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="pb-20">
          {/* 이미지 섹션 */}
          <section className="px-4 pt-6">
            <div className="overflow-hidden w-full h-64 bg-gray-100 rounded-2xl">
              <img 
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            </div>
          </section>

          {/* 제목 및 메타정보 */}
          <section className="px-4 pt-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium text-gray-900">{item.title}</h2>
                <div className="flex gap-3 items-center mt-2">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500">{item.timeAgo}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 분실 위치 */}
          <section className="px-4 pt-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex gap-3">
                <div className="mt-1">
                  <FaMapMarkerAlt className="text-gray-400" size={14} />
                </div>
                <div>
                  <h3 className="mb-1 text-base font-medium text-gray-900">분실 위치</h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {item.location}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 정보 테이블 */}
          <section className="px-4 pt-6">
            <div className="space-y-0">
              {/* 등록일 */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-base text-gray-600">등록일</span>
                <span className="text-base text-gray-900">{item.registrationDate}</span>
              </div>
              
              {/* 현상금 */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-base text-gray-600">현상금</span>
                <span className="text-base font-medium text-green-600">{item.reward}</span>
              </div>
              
              {/* 카테고리 */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-base text-gray-600">카테고리</span>
                <span className="text-base text-gray-900">{item.categoryDetail}</span>
              </div>
              
              {/* 상태 */}
              <div className="flex justify-between items-center py-3">
                <span className="text-base text-gray-600">상태</span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
                  {item.status}
                </span>
              </div>
            </div>
          </section>

          {/* 상세 설명 */}
          <section className="px-4 pt-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="mb-4 text-base font-medium text-gray-900">상세 설명</h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {item.description}
              </p>
            </div>
          </section>

          {/* 액션 버튼들 */}
          <section className="px-4 pt-8">
            <div className="grid grid-cols-3 gap-3">
              {/* 채팅 시작 */}
              <button 
                onClick={handleChat}
                className="flex flex-col gap-2 items-center p-4 text-white bg-indigo-600 rounded-xl transition-colors hover:bg-indigo-700"
              >
                <FaComments size={18} />
                <span className="text-sm font-medium">채팅 시작</span>
              </button>
              
              {/* 분실물 찾음 */}
              <button 
                onClick={handleFound}
                className="flex flex-col gap-2 items-center p-4 text-white bg-green-500 rounded-xl transition-colors hover:bg-green-600"
              >
                <FaCheck size={18} />
                <span className="text-sm font-medium">분실물 찾음</span>
              </button>
              
              {/* 신고하기 */}
              <button 
                onClick={handleReport}
                className="flex flex-col gap-2 items-center p-4 text-white bg-red-500 rounded-xl transition-colors hover:bg-red-600"
              >
                <FaFlag size={18} />
                <span className="text-sm font-medium">신고하기</span>
              </button>
            </div>
          </section>
        </div>

        {/* 하단 네비게이션 */}
        <BottomNav />
      </div>
    </main>
  );
} 