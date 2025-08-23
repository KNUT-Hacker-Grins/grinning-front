'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { LostItem } from '@/types/lostItems';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';

// PoliceLostItem 타입 정의 (백엔드 모델 기반)
interface PoliceLostItem {
  atcId: string;
  lstPrdtNm: string;
  lstYmd: string;
  lstPlace: string;
  lstFilePathImg: string;
  prdtClNm: string;
  clrNm: string;
  lstSn: string;
}

// 통합 아이템 타입 정의
interface CombinedItem {
  type: 'lost' | 'police';
  date: Date;
  originalItem: LostItem | PoliceLostItem;
}

export default function LostPage() {
  const categories = ['전체', '휴대폰', '지갑', '가방', '의류', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalCombinedItems, setTotalCombinedItems] = useState(0);

  useEffect(() => {
    const fetchAllLostItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const serviceParams = selectedCategory === '전체' ? {} : { category: selectedCategory };
        const policeParams = { page: currentPage, limit: itemsPerPage };

        const [serviceResponse, policeResponse] = await Promise.allSettled([
          api.lostItems.getAll(serviceParams),
          api.police.getLostItems(policeParams)
        ]);

        let serviceItems: LostItem[] = [];
        let serviceTotal = 0;
        if (serviceResponse.status === 'fulfilled' && serviceResponse.value.status === 'success') {
          serviceItems = serviceResponse.value.data.items;
          serviceTotal = serviceResponse.value.data.total; // Get total from service API
        }

        let policeItems: PoliceLostItem[] = [];
        let policeTotal = 0;
        if (policeResponse.status === 'fulfilled' && policeResponse.value.status === 'success') {
          policeItems = policeResponse.value.data.items;
          policeTotal = policeResponse.value.data.total; // Get total from police API
        }

        const processedServiceItems: CombinedItem[] = serviceItems.map(item => ({
          type: 'lost',
          date: new Date(item.lost_at),
          originalItem: item
        }));

        const processedPoliceItems: CombinedItem[] = policeItems.map(item => ({
          type: 'police',
          date: new Date(item.lstYmd),
          originalItem: item
        }));

        const allCombinedItems = [...processedServiceItems, ...processedPoliceItems];
        allCombinedItems.sort((a, b) => b.date.getTime() - a.date.getTime());

        setTotalCombinedItems(serviceTotal + policeTotal); // Sum of totals from both APIs

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCombinedItems(allCombinedItems.slice(startIndex, endIndex));

      } catch (err) {
        console.error('Failed to fetch lost items:', err);
        setError('분실물 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllLostItems();
  }, [selectedCategory, currentPage]);

  const statusColor = {
    searching: 'bg-green-400',
    found: 'bg-yellow-400',
    cancelled: 'bg-red-400',
  };

  return (
    <div className="w-full mx-auto bg-white min-h-screen" style={{ maxWidth: '390px' }}>
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />
      <div className="px-4 py-6">
        <div className="flex gap-[15px] mb-[13px] pl-[23px] overflow-x-auto">
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

        <h2 className="text-lg font-semibold text-gray-800 mb-3">통합 분실물 정보</h2>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-10">목록을 불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : combinedItems.length > 0 ? (
            combinedItems.map((item, index) => (
              <Link
                href={item.type === 'lost' ? `/lost-item/${(item.originalItem as LostItem).id}` : {
                  pathname: '/police-lost-item',
                  query: { ...(item.originalItem as PoliceLostItem) }
                }}
                key={`${item.type}-${item.type === 'lost' ? (item.originalItem as LostItem).id : (item.originalItem as PoliceLostItem).atcId}`}
                className="block"
              >
                <div className="flex items-start gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden relative">
                    <img
                      src={item.type === 'lost' ? (item.originalItem as LostItem).image_urls[0] || '/placeholder.svg' : (item.originalItem as PoliceLostItem).lstFilePathImg || '/placeholder.svg'}
                      alt={item.type === 'lost' ? (item.originalItem as LostItem).title : (item.originalItem as PoliceLostItem).lstPrdtNm}
                      className="object-cover w-full h-full"
                    />
                    {item.type === 'police' && (
                      <img
                        src="/112.svg"
                        alt="112 Police Logo"
                        className="absolute top-0 left-0 w-6 h-6"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.type === 'lost' ? (item.originalItem as LostItem).title : (item.originalItem as PoliceLostItem).lstPrdtNm}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'lost' ? (item.originalItem as LostItem).lost_location : `분실장소: ${(item.originalItem as PoliceLostItem).lstPlace}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'lost' ? new Date((item.originalItem as LostItem).lost_at).toLocaleDateString() : `분실일: ${(item.originalItem as PoliceLostItem).lstYmd}`}
                    </p>
                  </div>
                  {item.type === 'lost' && (
                    <div className={`w-3 h-3 rounded-full mt-1 ${statusColor[(item.originalItem as LostItem).status]}`}></div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">등록된 분실물이 없습니다.</div>
          )}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            이전
          </button>
          <span className="px-4 py-2 text-gray-700">
            {currentPage} / {Math.ceil(totalCombinedItems / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= totalCombinedItems}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            다음
          </button>
        </div>

      </div>
    </div>
  );
}
