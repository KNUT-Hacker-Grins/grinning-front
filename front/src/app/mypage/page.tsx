'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyPageHeader from '@/components/MyPageHeader';
import ProfileCard from '@/components/ProfileCard';
import SectionTitle from '@/components/SectionTitle';
import RegisteredItemCard from '@/components/RegisteredItemCard';
import ChatPreviewCard from '@/components/ChatPreviewCard';
import { useAuth } from '@/hooks/useAuth';
import { api, tokenManager } from '@/lib/api';
import { LostItem } from '@/types/lostItems';
import MainHeader from '@/components/MainHeader';

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

  // // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  // useEffect(() => {
  //   if (!authLoading && !isAuthenticated) {
  //     router.push('/login');
  //   }
  // }, [authLoading, isAuthenticated, router]);

  // 사용자 데이터 로드
  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated || !user) return;

      console.log('My Page - user.profile_picture_url:', user?.profile_picture_url); // Added console.log

      try {
        setIsDataLoading(true);
        setError(null);

        // 내 분실물 목록 가져오기
        try {
          const lostItemsResponse = await api.lostItems.getMy({ limit: 10 });
          if (lostItemsResponse.status === 'success') {
            setMyLostItems(lostItemsResponse.data.items || []);
          }
        } catch (lostItemsError) {
          console.error('분실물 목록 로드 실패:', lostItemsError);
        }

        // 채팅방 목록 가져오기
        try {
          const chatRoomsResponse = await api.chat.getRooms();
          if (chatRoomsResponse.status === 'success') {
            setChatRooms(chatRoomsResponse.data || []);
          }
        } catch (chatError) {
          console.error('채팅방 목록 로드 실패:', chatError);
          // 채팅방 로드 실패는 전체 에러로 처리하지 않음
        }

      } catch (error) {
        console.error('사용자 데이터 로드 실패:', error);
        console.error('현재 토큰:', tokenManager.getAccessToken());
        console.error('API 응답:', error);
        setError(`데이터를 불러오는데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user]);

  // 로딩 상태
  if (authLoading || isDataLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
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
      <main className="flex justify-center min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="flex justify-center items-center h-screen">
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
        </div>
      </main>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전까지의 임시 상태)
  if (!isAuthenticated || !user) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
          <div className="flex justify-center items-center h-screen">
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
  const getStatusText = (status: string): '진행 중' | '회수 완료' => {
    switch (status) {
      case 'searching': return '진행 중';
      case 'found': return '회수 완료';
      case 'cancelled': return '진행 중'; // 취소된 항목도 진행 중으로 표시
      default: return '진행 중';
    }
  };

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md" style={{maxWidth: '390px'}}>
        <div className="p-4 pt-0 space-y-4">
          <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} user={user} />


          <ProfileCard 
            name={user.name || user.nickname || '사용자'} 
            email={user.email}
            profileImage={user.profile_picture_url} // Changed to profile_picture_url
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
              <div className="py-8 text-center text-gray-500">
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
              <div className="py-8 text-center text-gray-500">
                참여한 채팅이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
