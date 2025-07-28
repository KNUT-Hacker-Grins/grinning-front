'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ChatPreviewCard from '@/components/ChatPreviewCard';
import SettingHeader from '@/components/SettingHeader'; // 헤더 재사용
import RegisterHeader from '@/components/RegisterHeader';
import { api } from '@/lib/api'; // API 클라이언트

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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchChatRooms = async () => {
        try {
          const response = await api.chat.getRooms(); 
          setChatRooms(response.data);
        } catch (error) {
          console.error('채팅 목록을 불러오는 데 실패했습니다.', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchChatRooms();
    }
  }, [isAuthenticated]);

  if (isAuthLoading || !isAuthenticated) {
    return <div className="text-center pt-20">인증 상태를 확인하는 중...</div>;
  }

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