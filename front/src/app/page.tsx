'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface LostItem {
  id: number;
  title: string;
  lost_location: string;
  created_at: string;
  image_urls: string[];
  user: {
    name: string;
  };
  status: 'searching' | 'found' | 'cancelled';
}

// 시간 차이 계산 함수
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return '방금 전';
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

export default function Home() {
  const [foundItems, setFoundItems] = useState<LostItem[]>([]);
  const [wantedItems, setWantedItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 분실물 데이터 가져오기
  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 백엔드에서 분실물 목록 가져오기
        const response = await api.lostItems.getAll();
        
        if (response && Array.isArray(response)) {
          // 찾은 물건 (found 상태)과 찾는 물건 (searching 상태)으로 분리
          const foundItemsList = response.filter((item: LostItem) => item.status === 'found');
          const searchingItemsList = response.filter((item: LostItem) => item.status === 'searching');
          
          setFoundItems(foundItemsList);
          setWantedItems(searchingItemsList);
        } else {
          // 백엔드에서 데이터가 없을 경우 빈 배열로 설정
          setFoundItems([]);
          setWantedItems([]);
        }
      } catch (error) {
        console.error('분실물 데이터 가져오기 실패:', error);
        setError('분실물 데이터를 불러오는데 실패했습니다.');
        
        // 에러 발생 시 빈 배열로 설정
        setFoundItems([]);
        setWantedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const [activeTab, setActiveTab] = useState<'found' | 'wanted'>('found');

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">분실물 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="flex flex-col mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
        {/* 헤더 */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">찾아줘!</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5l-5-5h5v-12" />
              </svg>
            </button>
            <button className="p-2">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* 검색바 */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="어떤 물건을 찾고 계세요?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 탭 버튼 */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'found'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('found')}
          >
            찾은 물건 ({foundItems.length})
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'wanted'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('wanted')}
          >
            찾는 물건 ({wantedItems.length})
          </button>
        </div>

        {/* 아이템 리스트 */}
        <div className="flex-1 p-4 space-y-4">
          {(activeTab === 'found' ? foundItems : wantedItems)
            .filter(item => 
              searchQuery === '' || 
              item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.lost_location.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item) => (
              <Link key={item.id} href={`/lost-item/${item.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className="w-[124px] h-[124px] bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img 
                          src={item.image_urls[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/api/placeholder/124/124';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{item.lost_location}</p>
                      <p className="text-sm text-gray-500">{getTimeAgo(item.created_at)}</p>
                      {item.user && (
                        <p className="text-xs text-gray-400 mt-1">등록자: {item.user.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* 하단 네비게이션 - 기존 코드 유지 */}
        <div className="relative px-6 pt-16 pb-6">
        {/* 로고와 프로필 */}
        <div className="flex justify-between items-center mb-[50px]">
          <div className="flex gap-[15px]">
            <Link href="/mypage">
              <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
            </Link>
            <Link href="/mypage">
              <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
            </Link>
          </div>
          <Link href="/mypage">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          </Link>
        </div>

        {/* 위치 */}
        <div className="flex items-center gap-2 mb-15">
          <img src="/location logo.svg" alt="위치" width="31" height="31" className="text-red-500" />
          <h1 className="text-2xl font-semibold text-black">
            충청북도 충주시 대소원면
          </h1>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-[15px] mb-[13px] pl-[23px]">
          {[1, 2, 3, 4].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className={`w-[61px] h-6 rounded-[20px] text-sm font-normal flex items-center justify-center ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#d9d9d9] text-[#8b8484]'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* 분실물 찾기 섹션 */}
      <section className="mb-[56px]">
        <div className="flex justify-between items-center mb-[27px] px-6">
          <h2 className="text-lg font-normal text-black">분실물 찾기</h2>
          <button className="text-xs text-black/30">더보기</button>
        </div>
        
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
            {foundItems.map((item) => (
              <Link key={item.id} href={`/lost-item/${item.id}`} className="flex flex-col flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" style={{ width: '124px' }}>
                <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                  {/* 실제로는 데이터베이스에서 가져온 이미지를 표시 */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </div>
                <h3 className="text-[13px] font-normal text-black mb-[5px] line-clamp-1" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  {item.title}
                </h3>
                <div className="flex justify-between items-center text-[8px] text-[#9e9e9e]" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  <span className="line-clamp-1 max-w-[70px]">{item.lost_location}</span>
                  <span className="flex-shrink-0">{getTimeAgo(item.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 분실물 수배 섹션 */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-[27px] px-6">
          <h2 className="text-lg font-normal text-black">분실물 수배</h2>
          <button className="text-xs text-black/30">더보기</button>
        </div>
        
        {/* 가로 스크롤 컨테이너 */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
            {wantedItems.map((item) => (
              <Link key={item.id} href={`/lost-item/${item.id}`} className="flex flex-col flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" style={{ width: '124px' }}>
                <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </div>
                <h3 className="text-[13px] font-normal text-black mb-[5px] line-clamp-1" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  {item.title}
                </h3>
                <div className="flex justify-between items-center text-[8px] text-[#9e9e9e]" style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}>
                  <span className="line-clamp-1 max-w-[70px]">{item.lost_location}</span>
                  <span className="flex-shrink-0">{getTimeAgo(item.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

        {/* 등록하기 버튼 */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleRegister}
            className="bg-gray-300 hover:bg-gray-400 transition-colors duration-200 px-6 py-3 rounded-xl shadow-lg"
          >
            <span className="text-white text-sm font-normal">+ 등록하기</span>
          </button>
        </div>
      </div>
    </main>
  );
}