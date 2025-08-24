'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FoundItemListResponse, FoundItem } from '@/types/foundItems';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';
import Pagination from '@/components/Pagination';

// 경찰청 API 아이템 타입
interface PoliceItem {
  atcId: string;
  fdSn: string; // 상세 페이지 링크에 필요
  fdPrdtNm: string;
  fdYmd: string;
  depPlace: string; 
  fdFilePathImg: string;
  prdtClNm: string;
  clrNm: string;
}

// 경찰청 API 아이템 타입
interface CombinedItem {
  type: 'found' | 'police';
  date: Date; // Normalized date for sorting
  originalItem: FoundItem | PoliceItem;
}

export default function FoundPage() {
  const categories = ['전체', '지갑/카드', '전자기기', '의류', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([]); // Combined data state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust as needed
  const [totalCombinedItems, setTotalCombinedItems] = useState(0);

  const totalPages = Math.ceil(totalCombinedItems / itemsPerPage);

  useEffect(() => {
    const fetchAllFoundItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const serviceParams = selectedCategory === '전체' ? {} : { category: selectedCategory };
        // Fetch all items for now, pagination will be client-side for combined list
        const policeParams = { page: 1, limit: 1000 }; // Fetch a large number to combine

        // Our service and Police API parallel calls
        const [serviceResponse, policeResponse] = await Promise.allSettled([
          api.foundItems.getAll(serviceParams),
          api.police.getFoundItems(policeParams)
        ]);

        let serviceItems: FoundItem[] = [];
        if (serviceResponse.status === 'fulfilled' && serviceResponse.value.status === 'success') {
          serviceItems = serviceResponse.value.data.items;
        } else {
          console.error('Failed to fetch service items:', serviceResponse.status === 'rejected' && serviceResponse.reason);
        }

        let policeItems: PoliceItem[] = [];
        if (policeResponse.status === 'fulfilled' && policeResponse.value.status === 'success') {
          policeItems = policeResponse.value.data.items;
        } else {
          console.error('Failed to fetch police items:', policeResponse.status === 'rejected' && policeResponse.reason);
        }

        // Combine and Normalize Dates
        const processedServiceItems: CombinedItem[] = serviceItems.map(item => ({
          type: 'found',
          date: new Date(item.found_at),
          originalItem: item
        }));

        const processedPoliceItems: CombinedItem[] = policeItems.map(item => ({
          type: 'police',
          date: new Date(item.fdYmd),
          originalItem: item
        }));

        const allCombinedItems = [...processedServiceItems, ...processedPoliceItems];

        // Sort by date in descending order
        allCombinedItems.sort((a, b) => b.date.getTime() - a.date.getTime());

        setTotalCombinedItems(allCombinedItems.length);

        // Apply client-side pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCombinedItems(allCombinedItems.slice(startIndex, endIndex));

      } catch (err) {
        console.error('Failed to fetch found items:', err);
        setError('습득물 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFoundItems();
  }, [selectedCategory, currentPage]); // Add currentPage to dependency array

  const statusColor = {
    available: 'bg-green-400',
    returned: 'bg-yellow-400',
  };

  return (
    <div className="w-full mx-auto bg-white min-h-screen" style={{ maxWidth: '390px' }}>
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} user={user} />
      <div className="px-4 py-6">
        {/* 카테고리 필터 */}
        <div className="flex gap-[15px] mb-[13px] pl-[23px] overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 h-6 rounded-[20px] text-xs font-normal flex items-center justify-center whitespace-nowrap ${
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

        {/* 통합 습득물 리스트 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">통합 습득물 정보</h2>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-10">목록을 불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : combinedItems.length > 0 ? (
            combinedItems.map((item) => (
              <Link
                href={item.type === 'found' ? `/found-item/${(item.originalItem as FoundItem).id}` : { pathname: '/police-item', query: {
                  atcId: (item.originalItem as PoliceItem).atcId,
                  fdSn: (item.originalItem as PoliceItem).fdSn,
                  fdPrdtNm: (item.originalItem as PoliceItem).fdPrdtNm,
                  fdYmd: (item.originalItem as PoliceItem).fdYmd,
                  depPlace: (item.originalItem as PoliceItem).depPlace,
                  fdFilePathImg: (item.originalItem as PoliceItem).fdFilePathImg,
                  prdtClNm: (item.originalItem as PoliceItem).prdtClNm,
                  clrNm: (item.originalItem as PoliceItem).clrNm,
                } }}
                key={item.type === 'found' ? (item.originalItem as FoundItem).id : (item.originalItem as PoliceItem).atcId}
                className="block"
              >
                <div className="flex items-start gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden relative">
                    <img
                      src={item.type === 'found' ? (item.originalItem as FoundItem).image_urls[0] || '/placeholder.svg' : (item.originalItem as PoliceItem).fdFilePathImg || '/placeholder.svg'}
                      alt={item.type === 'found' ? (item.originalItem as FoundItem).title : (item.originalItem as PoliceItem).fdPrdtNm}
                      className="object-cover w-full h-full"
                    />
                    {item.type === 'police' && (
                      <img
                        src="/112.svg"
                        alt="112 Police Logo"
                        className="absolute top-0 left-0 w-6 h-6" // Adjust size as needed
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.type === 'found' ? (item.originalItem as FoundItem).title : (item.originalItem as PoliceItem).fdPrdtNm}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'found' ? (item.originalItem as FoundItem).found_location : `보관장소: ${(item.originalItem as PoliceItem).depPlace}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'found' ? new Date((item.originalItem as FoundItem).found_at).toLocaleDateString() : `습득일: ${(item.originalItem as PoliceItem).fdYmd}`}
                    </p>
                  </div>
                  {item.type === 'found' && (
                    <div className={`w-3 h-3 rounded-full mt-1 ${statusColor[(item.originalItem as FoundItem).status]}`}></div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">등록된 습득물이 없습니다.</div>
          )}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>
    </div>
  );
}
