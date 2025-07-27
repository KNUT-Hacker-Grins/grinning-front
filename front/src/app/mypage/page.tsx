'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyPageHeader from '@/components/MyPageHeader';
import ProfileCard from '@/components/ProfileCard';
import SectionTitle from '@/components/SectionTitle';
import RegisteredItemCard from '@/components/RegisteredItemCard';
import ChatPreviewCard from '@/components/ChatPreviewCard';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface LostItem {
  id: number;
  title: string;
  lost_location: string;
  created_at: string;
  status: 'searching' | 'found' | 'cancelled';
  image_urls?: string[];
}

interface ChatRoom {
  id: number;
  last_message?: {
    id: number;
    content: string;
    timestamp: string;
    sender: string;
    message_type: string;
  };
  participants: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  other_participant?: {
    id: number;
    name: string;
    email: string;
  };
  post_type: 'found' | 'lost';
  post_id: number;
  post_info?: {
    title: string;
    type: string;
  };
  created_at: string;
  last_activity: string;
}

export default function MyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [myLostItems, setMyLostItems] = useState<LostItem[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setIsDataLoading(true);
        setError(null);

        // 내 분실물 목록 가져오기
        const lostItemsResponse = await api.user.getMyLostItems({ limit: 10 });
        if (lostItemsResponse.status === 'success') {
          setMyLostItems(lostItemsResponse.data.items || []);
        }

        // 채팅방 목록은 현재 API가 없어서 빈 상태로 처리
        setChatRooms([]);

      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsDataLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user]);

  // 로딩 상태
  if (authLoading || isDataLoading) {
    return (
      <main className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">데이터를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <main className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
          <div className="flex items-center justify-center h-screen">
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
        </div>
      </main>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전까지의 임시 상태)
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-white flex justify-center">
        <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-600">로그인이 필요합니다...</p>
          </div>
        </div>
      </main>
    );
  }

  // 시간 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '').replace(/\s/g, '.');
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case 'searching': return '진행 중';
      case 'found': return '회수 완료';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-white flex justify-center">
      <div className="w-full max-w-md mx-auto" style={{maxWidth: '390px'}}>
        <div className="p-4 pt-0 space-y-4">
          <MyPageHeader />

          <ProfileCard 
            name={user.name || user.nickname || '사용자'} 
            email={user.email} 
          />

          <div className="space-y-2">
            <SectionTitle title="내가 등록한 분실물" />
            {myLostItems.length > 0 ? (
              myLostItems.map((item) => (
                <RegisteredItemCard
                  key={item.id}
                  id={item.id.toString()}
                  title={item.title}
                  location={item.lost_location}
                  date={formatDate(item.created_at)}
                  status={getStatusText(item.status)}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                등록한 분실물이 없습니다.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <SectionTitle title="참여한 채팅" />
            {chatRooms.length > 0 ? (
              chatRooms.slice(0, 3).map((room) => {
                // 상대방 참여자 찾기
                const otherParticipant = room.other_participant || 
                  room.participants.find(p => p.id !== user.id);
                
                return (
                  <ChatPreviewCard
                    key={room.id}
                    name={otherParticipant?.name || '알 수 없음'}
                    message={room.last_message?.content || '채팅을 시작해보세요!'}
                    time={room.last_message?.timestamp ? 
                      new Date(room.last_message.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      }) : ''}
                  />
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                참여한 채팅이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
