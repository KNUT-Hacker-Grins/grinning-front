'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { FoundItemListResponse, FoundItem } from '@/types/foundItems';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';

// 경찰청 API 아이템 타입
interface PoliceItem {
  atcId: string;
  fdSn: string; // 상세 페이지 링크에 필요
  fdPrdtNm: string;
  fdYmd: string;
  depPlace: string;
  fdFilePathImg: string;
}

export default function FoundPage() {
  const categories = ['전체', '지갑/카드', '전자기기', '의류', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [policeItems, setPoliceItems] = useState<PoliceItem[]>([]); // 경찰청 데이터 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchAllFoundItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = selectedCategory === '전체' ? {} : { category: selectedCategory };
        
        // 우리 서비스와 경찰청 API 병렬 호출
        const [serviceResponse, policeResponse] = await Promise.allSettled([
          api.foundItems.getAll(params),
          api.police.getFoundItems({ page: 1, limit: 10 })
        ]);

        if (serviceResponse.status === 'fulfilled' && serviceResponse.value.status === 'success') {
          setFoundItems(serviceResponse.value.data.items);
        } else {
          console.error('Failed to fetch service items:', serviceResponse.status === 'rejected' && serviceResponse.reason);
        }

        if (policeResponse.status === 'fulfilled' && policeResponse.value.status === 'success') {
          setPoliceItems(policeResponse.value.data.items);
        } else {
          console.error('Failed to fetch police items:', policeResponse.status === 'rejected' && policeResponse.reason);
        }

      } catch (err) {
        console.error('Failed to fetch found items:', err);
        setError('습득물 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFoundItems();
  }, [selectedCategory]);

  const statusColor = {
    available: 'bg-green-400',
    returned: 'bg-yellow-400',
  };

  return (
    <div className="w-full mx-auto bg-white min-h-screen" style={{ maxWidth: '390px' }}>
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />
      <div className="px-4 py-6">
        {/* 카테고리 필터 */}
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

        {/* 우리 서비스 리스트 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">찾아줘! 습득물</h2>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-10">목록을 불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : foundItems.length > 0 ? (
            foundItems.map((item) => (
              <Link href={`/found-item/${item.id}`} key={item.id} className="block">
                <div className="flex items-start gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                    <img src={item.image_urls[0] || '/placeholder.png'} alt={item.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.found_location}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.created_at ? new Date(item.created_at).toLocaleDateString() : '날짜 미상'}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full mt-1 ${statusColor[item.status]}`}></div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">등록된 습득물이 없습니다.</div>
          )}
        </div>

        {/* 경찰청 API 리스트 */}
        <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-3">경찰청 유실물 정보</h2>
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-10">경찰청 목록을 불러오는 중...</div>
          ) : policeItems.length > 0 ? (
            policeItems.map((item) => (
              <Link
                key={item.atcId}
                href={{ pathname: '/police-item', query: item }}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                    <img src={item.fdFilePathImg || '/placeholder.png'} alt={item.fdPrdtNm} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800">{item.fdPrdtNm}</h3>
                    <p className="text-xs text-gray-500 mt-1">보관장소: {item.depPlace}</p>
                    <p className="text-xs text-gray-500 mt-1">습득일: {item.fdYmd}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">경찰청에 등록된 습득물이 없습니다.</div>
          )}
        </div>

      </div>
    </div>
  );
}