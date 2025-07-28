'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { MyLostItemsResponse, LostItem } from '@/types/lostItems';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';


export default function LostPage() {
  const categories = ['전체', '휴대폰', '지갑', '가방', '의류', '기타'];
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchLostItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = selectedCategory === '전체' ? {} : { category: selectedCategory };
        const response: MyLostItemsResponse = await api.lostItems.getAll(params);
        if (response.status === 'success') {
          setLostItems(response.data.items);
        } else {
          setError(response.message || '분실물 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        console.error('Failed to fetch lost items:', err);
        setError('분실물 목록을 불러오는데 실패했습니다. 서버 연결을 확인해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLostItems();
  }, [selectedCategory]);

  const statusColor = {
    searching: 'bg-green-400',
    found: 'bg-yellow-400',
    cancelled: 'bg-red-400',
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

        {/* 리스트 */}
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="text-center py-10">분실물 목록을 불러오는 중...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : lostItems.length > 0 ? (
            lostItems.map((item) => (
              <Link href={`/lost-item/${item.id}`} key={item.id} className="block">
                <div
                  className="flex items-start gap-4 p-3 rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* 이미지 */}
                  <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                    <img
                      src={item.image_urls[0] || '/placeholder.png'} // Use first image or placeholder
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* 텍스트 */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      {item.lost_location}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <span className="mr-1"></span>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : '날짜 미상'}
                    </p>
                  </div>

                  {/* 상태 점 */}
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${statusColor[item.status]}`}
                  ></div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">등록된 분실물이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}