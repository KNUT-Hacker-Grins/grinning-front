'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ChatHeader from '@/components/ChatHeader';
import MessageInput from '@/components/MessageInput';
import ChatMessage from '@/components/ChatMessage';
import { api } from '@/lib/api'; // API 클라이언트
import { useAuth } from '@/hooks/useAuth';

import { ChatMessage as ChatMessageType, ChatMessageSender } from '@/types/chat'; // Import types

// Use the imported type
interface Message extends ChatMessageType {}



export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [participantName, setParticipantName] = useState('상대방'); // 참여자 이름 상태
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId) return;

    console.log('🔁 메시지 불러오기 시도 중:', roomId); // 로그 추가

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const numericRoomId = Number(roomId); // roomId를 숫자로 변환
        if (isNaN(numericRoomId)) {
          console.error('유효하지 않은 채팅방 ID입니다:', roomId);
          setIsLoading(false);
          return;
        }
        const response = await api.chat.getMessages(numericRoomId, 1, 50);
        console.log('✅ 메시지 응답:', response);
        setMessages(response.data.messages.reverse());
      } catch (error) {
        console.error('❌ 메시지 요청 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);


  // 참여자 이름 불러오기
  useEffect(() => {
    if (!roomId) return;

    const fetchParticipantName = async () => {
      try {
        const numericRoomId = Number(roomId);
        if (isNaN(numericRoomId)) {
          console.error('유효하지 않은 채팅방 ID입니다:', roomId);
          return;
        }
        const response = await api.chat.getRooms();
        const room = response.data.find((r: any) => Number(r.id) === numericRoomId);
        if (room) {
          setParticipantName(room.participant.name);
        }
      } catch (error) {
        console.error('참여자 이름을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchParticipantName();
  }, [roomId]);

  // 스크롤 아래로 자동 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (inputValue.trim() && roomId) {
      try {
        const numericRoomId = Number(roomId);
        if (isNaN(numericRoomId)) {
          console.error('유효하지 않은 채팅방 ID입니다:', roomId);
          alert('메시지 전송에 실패했습니다: 유효하지 않은 채팅방 ID');
          return;
        }
        const response = await api.chat.sendMessage(numericRoomId, inputValue);
        setMessages((prevMessages) => [...prevMessages, response.data]);
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
      <ChatHeader name={participantName} />
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 my-2">{dateString}</div>
        {isLoading ? (
          <div className="text-center">대화 내역을 불러오는 중...</div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              text={msg.content}
              isMine={msg.sender.id === user?.id}
              senderProfilePictureUrl={msg.sender.profile_picture_url} // Pass profile picture URL
              senderName={msg.sender.name} // Pass sender name
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
