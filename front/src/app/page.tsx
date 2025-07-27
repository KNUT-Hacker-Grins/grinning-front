'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface LostItem {
  id: number;
  title: string;
  lost_location: string;
  created_at: string;
  image_urls: string[];
  owner?: {
    nickname: string;
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
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [foundItems, setFoundItems] = useState<LostItem[]>([]);
  const [wantedItems, setWantedItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'found' | 'wanted'>('found');
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
        
        if (response && response.data && Array.isArray(response.data.items)) {
          // 찾은 물건 (found 상태)과 찾는 물건 (searching 상태)으로 분리
          const allItems = response.data.items;
          const foundItemsList = allItems.filter((item: LostItem) => item.status === 'found');
          const searchingItemsList = allItems.filter((item: LostItem) => item.status === 'searching');
          
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

  const handleRegister = () => {
    window.location.href = '/register';
  };

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
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
        {/* 상단 헤더 */}
        <div className="relative px-6 pt-16 pb-6">
          {/* 로고와 프로필 */}
          <div className="flex justify-between items-center mb-[50px]">
            <div className="flex gap-[15px]">
              <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
              <div className="w-[61px] h-10 bg-gray-300 rounded-[20px]"></div>
            </div>
            <Link href={isAuthenticated ? "/mypage" : "/login"}>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {!authLoading && (
                  <span className="text-xs text-gray-600">
                    {isAuthenticated ? "MY" : "LOGIN"}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* 위치 */}
          <div className="flex items-center gap-2 mb-[50px]">
            <img src="/location logo.svg" alt="위치" width="31" height="31" className="text-red-500" />
            <h1 className="text-2xl font-semibold text-black">
              충청북도 충주시 대소원면
            </h1>
          </div>
        </div>

        {/* 검색바 */}
        <div className="relative mb-[20px]">
          {/* 검색바 컨테이너 */}
          <div className="relative h-[54px] w-full max-w-[340px] mx-auto">
            {/* 배경과 테두리 */}
            <div className="absolute inset-0 bg-white border-2 border-solid border-black rounded-[27px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>
            
            {/* 검색 아이콘 */}
            <div className="absolute left-3 top-[13px] w-[29px] h-[29px] overflow-hidden">
              <div className="absolute inset-[12.5%]">
                <img src="/Search.svg" alt="검색" className="w-full h-full block" />
              </div>
            </div>
            
            {/* 입력 필드 */}
            <input
              type="text"
              placeholder="내 물건 찾기"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="absolute left-[55px] top-[15px] w-[200px] h-[24px] text-[#8b8484] text-base font-normal outline-none bg-transparent leading-none placeholder:text-[#8b8484] placeholder:leading-none"
              style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}
            />
            
            {/* 카메라 아이콘 */}
            <div className="absolute right-3 top-[17px] w-5 h-5 overflow-hidden">
              <div className="absolute bottom-[12.5%] left-[4.167%] right-[4.167%] top-[12.5%]">
                <img src="/Camera.svg" alt="카메라" className="w-full h-full block" />
              </div>
            </div>
          </div>
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

        {/* 분실물 찾기 섹션 */}
        <section className="mb-[56px]">
          <div className="flex justify-between items-center mb-[27px] px-6">
            <h2 className="text-lg font-normal text-black">분실물 찾기</h2>
            <button className="text-xs text-black/30">더보기</button>
          </div>
          
          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
              {foundItems
                .filter(item => 
                  searchQuery === '' || 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.lost_location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                <Link key={item.id} href={`/lost-item/${item.id}`} className="flex flex-col flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" style={{ width: '124px' }}>
                  <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
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
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                    )}
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
              
              {foundItems.length === 0 && (
                <div className="flex items-center justify-center w-[124px] h-[124px] bg-gray-100 rounded-xl text-gray-500 text-sm">
                  등록된<br />분실물이<br />없습니다
                </div>
              )}
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
              {wantedItems
                .filter(item => 
                  searchQuery === '' || 
                  item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.lost_location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                <Link key={item.id} href={`/lost-item/${item.id}`} className="flex flex-col flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" style={{ width: '124px' }}>
                  <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
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
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                    )}
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
              
              {wantedItems.length === 0 && (
                <div className="flex items-center justify-center w-[124px] h-[124px] bg-gray-100 rounded-xl text-gray-500 text-sm">
                  등록된<br />분실물이<br />없습니다
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 등록하기 버튼 */}
        <div className="fixed bottom-6 right-6 z-10">
          <button
            onClick={handleRegister}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 px-6 py-3 rounded-xl shadow-lg"
          >
            <span className="text-white text-sm font-medium">+ 등록하기</span>
          </button>
        </div>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 py-2">
          <div className="flex justify-around items-center">
            <Link href="/" className="flex flex-col items-center py-2 px-4">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="text-xs text-indigo-600 mt-1">홈</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center py-2 px-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">검색</span>
            </Link>
            <Link href="/register" className="flex flex-col items-center py-2 px-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">등록</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center py-2 px-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">채팅</span>
            </Link>
            <Link href={isAuthenticated ? "/mypage" : "/login"} className="flex flex-col items-center py-2 px-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">{isAuthenticated ? "마이" : "로그인"}</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}