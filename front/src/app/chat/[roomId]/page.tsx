'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ChatHeader from '@/components/ChatHeader';
import MessageInput from '@/components/MessageInput';
import ChatMessage from '@/components/ChatMessage';
import { api } from '@/lib/api'; // API 클라이언트

// API 응답에 맞춘 메시지 타입 정의
interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    name: string;
  };
  timestamp: string;
}

// 임시로 내 유저 ID를 설정합니다. (실제로는 로그인 정보에서 가져와야 함)
const MY_USER_ID = 1;

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 채팅 내역 불러오기
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await api.chat.getMessages(parseInt(roomId, 10), 1, 50);
        setMessages(response.data.messages.reverse()); // 최신 메시지가 아래로 가도록 배열을 뒤집습니다.
      } catch (error) {
        console.error('채팅 내역을 불러오는 데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  // 스크롤을 맨 아래로 이동시키는 함수
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (inputValue.trim() && roomId) {
      try {
        const response = await api.chat.sendMessage(parseInt(roomId, 10), inputValue);
        // 성공 시, 화면에 새 메시지 즉시 추가
        setMessages(prevMessages => [...prevMessages, response.data]);
        setInputValue('');
      } catch (error) {
        console.error('메시지 전송에 실패했습니다.', error);
        alert('메시지 전송에 실패했습니다.');
      }
    }
  };

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="w-full mx-auto bg-white flex flex-col h-screen border-x" style={{ maxWidth: '390px' }}>
      {/* TODO: 채팅방 상대방 이름 동적으로 가져오기 */}
      <ChatHeader name="상대방" />
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 my-2">
          {dateString}
        </div>
        {isLoading ? (
          <div className="text-center">대화 내역을 불러오는 중...</div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              text={msg.content}
              isMine={msg.sender.id === MY_USER_ID}
            />
          ))
        )}
      </div>
      <MessageInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
      />
    </div>
  );
}
