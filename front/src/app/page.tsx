'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { FoundItem } from '@/types/foundItems'; // Import FoundItem
import { LostItem } from '@/types/lostItems';   // Import LostItem

// 타입 정의
interface PopularCategory {
  category: string;
  search_count: number;
  sample_item: {
    id: number;
    title: string;
    image_url: string;
    found_location: string;
  } | null;
}

// 상수 정의
const CATEGORIES = ['전자기기', '지갑', '의류', '기타'] as const;
type CategoryType = typeof CATEGORIES[number];




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

// 카테고리 순환 애니메이션 컴포넌트
const AnimatedCategory = () => {
  const categories = ['전자기기', '지갑', '의류', '기타'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <span className="text-lg font-semibold text-blue-600 transition-all duration-500 ease-in-out">
      {categories[currentIndex]}
    </span>
  );
};

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth(); // user 추가
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]); // 습득물 배열
  const [wantedItems, setWantedItems] = useState<LostItem[]>([]); // 분실물 배열
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'found' | 'wanted'>('found');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentLanguage, setCurrentLanguage] = useState('ko');
  const [isTranslating, setIsTranslating] = useState(false);

  // 인기 카테고리 상태
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [popularCategoriesError, setPopularCategoriesError] = useState(false);
  const [isLoadingPopularCategories, setIsLoadingPopularCategories] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Home 컴포넌트 마운트/업데이트 시 useAuth 상태 로깅
  useEffect(() => {
    console.log('Home component mounted/updated.');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('authLoading:', authLoading);
    console.log('User data from useAuth:', user); // user 데이터 로깅
  }, [isAuthenticated, authLoading, user]); // user를 의존성 배열에 추가
  
  // 분실물과 습득물 데이터 가져오기
  useEffect(() => {
    console.log('첫 페이지 진입: 데이터 로딩 시작'); // <-- 이 라인을 추가합니다.
    const fetchAllItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 습득물과 분실물을 병렬로 가져오기
        const [foundItemsResponse, lostItemsResponse] = await Promise.allSettled([
          api.foundItems.getAll({}), // 모든 습득물들
          api.lostItems.getAll({})    // 모든 분실물들
        ]);

        // 습득물 데이터 처리
        if (foundItemsResponse.status === 'fulfilled' && 
            foundItemsResponse.value?.data?.items) {
          setFoundItems(foundItemsResponse.value.data.items);
        } else {
          setFoundItems([]);
        }

        // 분실물 데이터 처리
        if (lostItemsResponse.status === 'fulfilled' && 
            lostItemsResponse.value?.data?.items) {
          setWantedItems(lostItemsResponse.value.data.items);
        } else {
          setWantedItems([]);
        }

      } catch (error) {
        console.error('데이터 가져오기 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
        
        // 에러 발생 시 빈 배열로 설정
        setFoundItems([]);
        setWantedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  // 콜백 함수들 정의
  const handleCategoryCardClick = useCallback(() => {
    if (!popularCategoriesError && popularCategories.length > 0) {
      const currentCategory = popularCategories[currentCategoryIndex];
      if (currentCategory.sample_item?.id) {
        // Link 컴포넌트가 처리
        return;
      } else {
        setSelectedCategory(currentCategory.category);
        setSearchQuery('');
      }
    }
  }, [popularCategoriesError, popularCategories, currentCategoryIndex, setSelectedCategory, setSearchQuery]);

  const handleCategoryCardKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCategoryCardClick();
    }
  }, [handleCategoryCardClick]);

  const handleRetryPopularCategories = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchPopularCategories();
  }, []);

  // 인기 카테고리 데이터 가져오기 함수
  const fetchPopularCategories = useCallback(async () => {
    try {
      setIsLoadingPopularCategories(true);
      setPopularCategoriesError(false);
      const response = await api.stats.getPopularCategories();
      if (response?.data?.length > 0) {
        setPopularCategories(response.data);
      } else {
        setPopularCategoriesError(true);
      }
    } catch (error) {
      console.error('인기 카테고리 조회 실패:', error);
      setPopularCategoriesError(true);
      setPopularCategories([]);
    } finally {
      setIsLoadingPopularCategories(false);
    }
  }, []);

  // 인기 카테고리 데이터 가져오기
  useEffect(() => {
    fetchPopularCategories();
  }, []); // foundItems 의존성 제거

  // 번역 함수
  const translateItems = async (targetLang: string) => {
    if (targetLang === 'ko' || isTranslating) return;
    
    setIsTranslating(true);
    try {
      // 습득물 번역
      const translatedFoundItems = await Promise.all(
        foundItems.map(async (item) => {
          try {
            const titleResponse = await api.translate.text(item.title, 'ko', targetLang);
            const descResponse = await api.translate.text(item.description, 'ko', targetLang);
            const locationResponse = await api.translate.text(item.found_location, 'ko', targetLang);
            
            return {
              ...item,
              title: titleResponse.translated || item.title,
              description: descResponse.translated || item.description,
              found_location: locationResponse.translated || item.found_location,
            };
          } catch (error) {
            console.error('습득물 번역 오류:', error);
            return item;
          }
        })
      );

      // 분실물 번역
      const translatedWantedItems = await Promise.all(
        wantedItems.map(async (item) => {
          try {
            const titleResponse = await api.translate.text(item.title, 'ko', targetLang);
            const descResponse = await api.translate.text(item.description, 'ko', targetLang);
            const locationResponse = await api.translate.text(item.lost_location, 'ko', targetLang);
            
            return {
              ...item,
              title: titleResponse.translated || item.title,
              description: descResponse.translated || item.description,
              lost_location: locationResponse.translated || item.lost_location,
            };
          } catch (error) {
            console.error('분실물 번역 오류:', error);
            return item;
          }
        })
      );

      setFoundItems(translatedFoundItems);
      setWantedItems(translatedWantedItems);
    } catch (error) {
      console.error('번역 중 오류:', error);
      alert('번역 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsTranslating(false);
    }
  };

  // 언어 변경 핸들러
  const handleLanguageChange = async (newLang: string) => {
    if (newLang === currentLanguage) return;
    
    setCurrentLanguage(newLang);
    
    if (newLang === 'ko') {
      // 한국어로 돌아갈 때는 데이터 새로고침
      const fetchAllItems = async () => {
        try {
          setIsLoading(true);
          const [foundItemsResponse, lostItemsResponse] = await Promise.allSettled([
            api.foundItems.getAll({}),
            api.lostItems.getAll({})
          ]);

          if (foundItemsResponse.status === 'fulfilled' && 
              foundItemsResponse.value?.data?.items) {
            setFoundItems(foundItemsResponse.value.data.items);
          }

          if (lostItemsResponse.status === 'fulfilled' && 
              lostItemsResponse.value?.data?.items) {
            setWantedItems(lostItemsResponse.value.data.items);
          }
        } catch (error) {
          console.error('데이터 새로고침 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      await fetchAllItems();
    } else {
      // 다른 언어로 번역
      await translateItems(newLang);
    }
  };

  // 메모화된 필터링 로직
  const filteredFoundItems = useMemo(() => {
    return foundItems.filter(item => 
      (searchQuery === '' || 
       item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.found_location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null || item.category.some(cat => cat.label === selectedCategory))
    );
  }, [foundItems, searchQuery, selectedCategory]);

  const filteredWantedItems = useMemo(() => {
    return wantedItems.filter(item => 
      (searchQuery === '' || 
       item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       item.lost_location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null || item.category.some(cat => cat.label === selectedCategory))
    );
  }, [wantedItems, searchQuery, selectedCategory]);

  // 메모화된 현재 인기 카테고리
  const currentPopularCategory = useMemo(() => {
    return popularCategories[currentCategoryIndex] || null;
  }, [popularCategories, currentCategoryIndex]);

  // 콜백 함수들
  const handleCategorySelect = useCallback((category: CategoryType | null) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  }, [selectedCategory]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleRegister = useCallback(() => {
    window.location.href = '/register';
  }, []);

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
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
            <p className="mb-4 text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
      <div className="mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
        {/* 상단 헤더 */}
        <div className="relative px-6 pt-16 pb-6">
          {/* 로고와 네비게이션 */}
          <div className="flex justify-between items-center mb-[50px]">
            {/* 왼쪽: 로고 + 찾아줘! + 번역 */}
            <div className="flex gap-3 items-center">
              {/* 로고 */}
              <img src="/logo.jpeg" alt="찾아줘 로고" width="40" height="40" className="rounded-lg" />
              
              {/* 찾아줘! 타이틀 */}
              <h1 className="text-xl font-bold text-gray-800">찾아줘!</h1>
              
              {/* 번역 기능 */}
              <div className="flex gap-1 items-center">
                <span className="text-lg">
                  {currentLanguage === 'ko' && '🇰🇷'}
                  {currentLanguage === 'en' && '🇺🇸'}
                  {currentLanguage === 'ja' && '🇯🇵'}
                  {currentLanguage === 'zh' && '🇨🇳'}
                </span>
                <select 
                  value={currentLanguage}
                  className="text-sm text-gray-600 bg-transparent border-none cursor-pointer"
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  disabled={isTranslating}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
                {isTranslating && (
                  <div className="w-3 h-3 border border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
                )}
              </div>
            </div>
            
            {/* 오른쪽: 프로필 */}
            <Link href={isAuthenticated ? "/mypage" : "/login"}>
              <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full">
                {!authLoading && (
                  <span className="text-xs text-gray-600">
                    {isAuthenticated ? "MY" : "LOGIN"}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* 메시지 (로그인 상태별) */}
          {!authLoading && !isAuthenticated && (
            <div className="text-center mb-[30px]">
              <div className="flex gap-1 justify-center items-center">
                <AnimatedCategory />
                <span className="text-lg text-gray-700">를 찾기 위해서는 로그인해주세요</span>
              </div>
            </div>
          )}
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
                <img src="/Search.svg" alt="검색" className="block w-full h-full" />
              </div>
            </div>
            
            {/* 입력 필드 */}
            <input
              type="text"
              placeholder="내 물건 찾기"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="absolute left-[55px] top-[15px] w-[200px] h-[24px] text-gray-800 text-base font-normal outline-none bg-transparent leading-none placeholder:text-[#8b8484] placeholder:leading-none"
              style={{ fontFamily: 'Inter, Noto Sans KR, sans-serif' }}
              aria-label="분실물 검색"
            />
            
            {/* 카메라 아이콘 */}
            <div className="absolute right-3 top-[17px] w-5 h-5 overflow-hidden">
              <div className="absolute bottom-[12.5%] left-[4.167%] right-[4.167%] top-[12.5%]">
                <img src="/Camera.svg" alt="카메라" className="block w-full h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 오늘 가장 많이 검색된 카테고리 섹션 */}
        <div className="flex justify-center mb-[20px]">
          {isLoadingPopularCategories ? (
            <div className="relative w-[340px] h-[120px] rounded-[15px] overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : popularCategoriesError ? (
            <div className="relative w-[340px] h-[120px] rounded-[15px] overflow-hidden bg-gray-200 flex flex-col items-center justify-center">
              <p className="text-gray-600 mb-2">카테고리 정보를 불러올 수 없습니다</p>
              <button 
                onClick={handleRetryPopularCategories}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                aria-label="인기 카테고리 다시 불러오기"
              >
                다시 시도
              </button>
            </div>
          ) : !popularCategoriesError && popularCategories.length > 0 && currentPopularCategory?.sample_item?.id ? (
            <Link href={`/found-item/${currentPopularCategory.sample_item.id}`}>
              <div 
                className="relative w-[340px] h-[120px] rounded-[15px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                role="button"
                tabIndex={0}
                aria-label={`${currentPopularCategory.category} 카테고리의 ${currentPopularCategory.sample_item.title} 상세보기`}
                onKeyDown={handleCategoryCardKeyDown}
              >
                {/* 배경 이미지 또는 fallback */}
                {currentPopularCategory?.sample_item?.image_url ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${currentPopularCategory.sample_item.image_url})`
                    }}
                  />
                ) : (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #6b7280, #4b5563)'
                    }}
                  />
                )}
                
                {/* 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* 텍스트 컨텐츠 */}
                <div className="relative w-full h-full p-4 text-white flex flex-col justify-between">
                  <div>
                    <div className="text-sm font-medium mb-1 drop-shadow-lg">오늘 가장 많이 검색된 카테고리</div>
                    <div className="text-xl font-bold drop-shadow-lg">
                      {currentPopularCategory?.category || 'N/A'}
                    </div>
                  </div>
                  <div className="text-xs opacity-90 drop-shadow-lg">
                    검색횟수: {`${currentPopularCategory?.search_count || 0}회`}
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div 
              className="relative w-[340px] h-[120px] rounded-[15px] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              role="button"
              tabIndex={0}
              aria-label={`${currentPopularCategory?.category || 'N/A'} 카테고리 필터 적용`}
              onClick={handleCategoryCardClick}
              onKeyDown={handleCategoryCardKeyDown}
            >
              {/* 배경 이미지 또는 fallback */}
              {!popularCategoriesError && popularCategories.length > 0 && popularCategories[currentCategoryIndex]?.sample_item?.image_url ? (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${popularCategories[currentCategoryIndex].sample_item.image_url})`
                  }}
                />
              ) : (
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)'
                  }}
                />
              )}
              
              {/* 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* 텍스트 컨텐츠 */}
              <div className="relative w-full h-full p-4 text-white flex flex-col justify-between">
                <div>
                  <div className="text-sm font-medium mb-1 drop-shadow-lg">오늘 가장 많이 검색된 카테고리</div>
                  <div className="text-xl font-bold drop-shadow-lg">
                    {popularCategoriesError || popularCategories.length === 0 
                      ? 'N/A' 
                      : popularCategories[currentCategoryIndex]?.category || 'N/A'}
                  </div>
                </div>
                <div className="text-xs opacity-90 drop-shadow-lg">
                  검색횟수: {popularCategoriesError || popularCategories.length === 0 
                    ? 'N/A' 
                    : `${popularCategories[currentCategoryIndex]?.search_count || 0}회`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-[15px] mb-[13px] pl-[23px] overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-3 h-6 rounded-[20px] text-xs font-normal flex items-center justify-center whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-[#d9d9d9] text-[#8b8484]'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
              aria-label={`${category} 카테고리 ${selectedCategory === category ? '선택됨' : '선택'}`}
              aria-pressed={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 분실물 찾기 섹션 */}
        <section className="mb-[56px]">
          <div className="flex justify-between items-center mb-[27px] px-6">
            <h2 className="text-lg font-normal text-black">분실물 찾기</h2>
            <Link href="/found-item" className="text-xs text-black/30">더보기</Link> 
          </div>
          
          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
              {filteredFoundItems.map((item) => (
                <Link key={item.id} href={`/found-item/${item.id}`} className="flex flex-col flex-shrink-0 transition-opacity cursor-pointer hover:opacity-80" style={{ width: '124px' }}>
                  <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                    {item.image_urls && item.image_urls.length > 0 ? (
                      <img 
                        src={item.image_urls[0]} 
                        alt={item.title}
                        className="object-cover w-full h-full"
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
                    <span className="line-clamp-1 max-w-[70px]">{item.found_location}</span>
                    <span className="flex-shrink-0">{item.created_at ? getTimeAgo(item.created_at) : '최근'}</span>
                  </div>
                </Link>
              ))}
              
              {filteredFoundItems.length === 0 && (
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
            <Link href="../items/lost-item" className="text-xs text-black/30">더보기</Link> 
          </div>
          
          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-[20px] px-6" style={{ width: 'max-content' }}>
              {filteredWantedItems.map((item) => (
                <Link key={item.id} href={`/lost-item/${item.id}`} className="flex flex-col flex-shrink-0 transition-opacity cursor-pointer hover:opacity-80" style={{ width: '124px' }}>
                  <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                    {item.image_urls && item.image_urls.length > 0 ? (
                      <img 
                        src={item.image_urls[0]} 
                        alt={item.title}
                        className="object-cover w-full h-full"
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
              
              {filteredWantedItems.length === 0 && (
                <div className="flex items-center justify-center w-[124px] h-[124px] bg-gray-100 rounded-xl text-gray-500 text-sm">
                  등록된<br />분실물이<br />없습니다
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className="fixed bottom-0 left-1/2 py-2 w-full max-w-md bg-white border-t border-gray-200 transform -translate-x-1/2">
          <div className="flex justify-around items-center">
            <Link href="/" className="flex flex-col items-center px-4 py-2">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span className="mt-1 text-xs text-indigo-600">홈</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center px-4 py-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="mt-1 text-xs text-gray-400">검색</span>
            </Link>
            <Link href="/register" className="flex flex-col items-center px-4 py-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="mt-1 text-xs text-gray-400">등록</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center px-4 py-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="mt-1 text-xs text-gray-400">채팅</span>
            </Link>
            <Link href={isAuthenticated ? "/mypage" : "/login"} className="flex flex-col items-center px-4 py-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="mt-1 text-xs text-gray-400">{isAuthenticated ? "마이" : "로그인"}</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}