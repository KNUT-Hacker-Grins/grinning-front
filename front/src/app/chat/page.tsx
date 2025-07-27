'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatPreviewCard from '@/components/ChatPreviewCard';
import SettingHeader from '@/components/SettingHeader'; // 헤더 재사용
import RegisterHeader from '@/components/RegisterHeader';
// import { api } from '@/lib/api'; // API 클라이언트

// API 응답에 맞춘 채팅방 목록 타입 (가정)
interface ChatRoom {
  id: string; // 채팅방 ID (UUID)
  participant: {
    name: string;
    // imageUrl: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

export default function ChatListPage() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 백엔드에서 실제 채팅방 목록을 가져오는 API를 호출해야 합니다.
    // const fetchChatRooms = async () => {
    //   try {
    //     const response = await api.chat.getRooms(); // 예시: api.chat.getRooms() 같은 함수 필요
    //     setChatRooms(response.data);
    //   } catch (error) {
    //     console.error('채팅 목록을 불러오는 데 실패했습니다.', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchChatRooms();

    // --- 임시 데이터 사용 ---
    const mockData: ChatRoom[] = [
      {
        id: '1',
        participant: { name: '이준호' },
        lastMessage: { content: '안녕하세요, 지갑 찾으셨나요?', timestamp: '오후 2:30' },
        unreadCount: 1,
      },
      {
        id: '2',
        participant: { name: '박서준' },
        lastMessage: { content: '파우치 사진 좀 더 보내주실 수 있나요?', timestamp: '오전 11:15' },
        unreadCount: 0,
      },
    ];
    setChatRooms(mockData);
    setIsLoading(false);
    // --- 임시 데이터 끝 ---
  }, []);

  return (
    <div className="w-full mx-auto bg-white flex flex-col min-h-screen border-x" style={{ maxWidth: '390px' }}>
      <RegisterHeader title="채팅" />
      <div className="flex-1 p-4 space-y-2">
        {isLoading ? (
          <div className="text-center">채팅 목록을 불러오는 중...</div>
        ) : chatRooms.length > 0 ? (
          chatRooms.map((room) => (
            <Link href={`/chat/${room.id}`} key={room.id}>
              <ChatPreviewCard
                name={room.participant.name}
                message={room.lastMessage.content}
                time={room.lastMessage.timestamp}
                // unreadCount={room.unreadCount} // ChatPreviewCard에 unreadCount prop 추가 필요
              />
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-500 pt-16">참여 중인 채팅이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
