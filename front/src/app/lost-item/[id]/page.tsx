'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEllipsisV, FaMapMarkerAlt, FaComments, FaCheck, FaFlag } from 'react-icons/fa';
import BottomNav from '@/components/BottomNav';
import { api } from '@/lib/api';

interface LostItem {
  id: number;
  title: string;
  description: string;
  lost_at: string;
  lost_location: string;
  image_urls: string[];
  category: any;
  reward: number;
  status: 'searching' | 'found' | 'cancelled';
  created_at: string;
  updated_at: string;
  owner: {
    nickname: string;
  };
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

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function LostItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  
  const [item, setItem] = useState<LostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);

  // 분실물 상세 정보 가져오기
  useEffect(() => {
    const fetchLostItem = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.lostItems.getById(parseInt(itemId));
        
        if (response) {
          setItem(response);
        } else {
          setError('분실물을 찾을 수 없습니다.');
        }
      } catch (error: any) {
        console.error('분실물 정보 가져오기 실패:', error);
        setError('분실물 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchLostItem();
    }
  }, [itemId]);

  // 로딩 상태
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

  // 에러 상태 또는 아이템이 없는 경우
  if (error || !item) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {error || '분실물을 찾을 수 없습니다'}
            </h2>
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

  const handleChat = async () => {
    try {
      setIsStartingChat(true);
      
      // 채팅방 시작 요청
      const response = await api.chat.startChat(item.id, 'lost');
      
      if (response && response.data && response.data.room_id) {
        // 채팅 페이지로 이동
        router.push(`/chat/${response.data.room_id}`);
      } else {
        alert('채팅방 생성에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('채팅 시작 실패:', error);
      
      if (error.message.includes('403')) {
        alert('자신의 글에는 채팅을 시작할 수 없습니다.');
      } else if (error.message.includes('401')) {
        alert('로그인이 필요합니다.');
        router.push('/login');
      } else {
        alert('채팅 시작에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleFound = async () => {
    try {
      await api.lostItems.updateStatus(item.id, 'found');
      alert('분실물을 찾았다고 표시되었습니다!');
      
      // 상태 업데이트
      setItem(prev => prev ? { ...prev, status: 'found' } : null);
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const handleReport = () => {
    console.log('신고하기');
    // TODO 신고 기능 
  };

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="flex flex-col mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button 
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">분실물 상세</h1>
          <button className="p-2 text-gray-600 hover:text-gray-800">
            <FaEllipsisV size={16} />
          </button>
        </div>

        {/* 메인 이미지 */}
        <div className="relative w-full h-80 bg-gray-200">
          {item.image_urls && item.image_urls.length > 0 ? (
            <img
              src={item.image_urls[0]}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/api/placeholder/400/300';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* 상태 배지 */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              item.status === 'found' 
                ? 'bg-green-100 text-green-800' 
                : item.status === 'searching'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {item.status === 'found' ? '찾음' : item.status === 'searching' ? '찾는 중' : '취소됨'}
            </span>
          </div>
        </div>

        {/* 분실물 정보 */}
        <div className="flex-1 p-4 space-y-4">
          {/* 제목과 기본 정보 */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <span>{item.category?.name || '기타'} · 개인용품</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{getTimeAgo(item.created_at)} · {formatDate(item.created_at)} 등록</span>
            </div>
            {item.reward > 0 && (
              <div className="mt-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  현상금 {item.reward.toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          {/* 분실 위치 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">분실 위치</h3>
                <p className="text-sm text-gray-600">{item.lost_location}</p>
              </div>
            </div>
          </div>

          {/* 상세 설명 */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">상세 설명</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* 등록자 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">등록자</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-medium">
                {item.owner?.nickname?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{item.owner?.nickname || '익명'}</p>
                <p className="text-sm text-gray-500">등록자</p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleChat}
              disabled={isStartingChat}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                isStartingChat
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isStartingChat ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  채팅 시작 중...
                </>
              ) : (
                <>
                  <FaComments className="mr-2" size={16} />
                  채팅하기
                </>
              )}
            </button>
            
            {item.status === 'searching' && (
              <button
                onClick={handleFound}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <FaCheck className="mr-2" size={16} />
                찾았어요
              </button>
            )}
            
            <button
              onClick={handleReport}
              className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
            >
              <FaFlag size={16} />
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </main>
  );
} 