'use client';

import { useState } from 'react';
import ChatHeader from '@/components/ChatHeader';
import MessageInput from '@/components/MessageInput';
import ChatMessage from '@/components/ChatMessage';

// 임시 메시지 데이터 타입
interface Message {
  id: number;
  text: string;
  isMine: boolean; // true: 내 메시지, false: 상대방 메시지
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '안녕하세요! 분실물 보고 연락드렸습니다.', isMine: false },
    { id: 2, text: '네, 안녕하세요! 어떤 물건인지 여쭤봐도 될까요?', isMine: true },
    { id: 3, text: '홍대입구역에서 습득한 검은색 지갑입니다.', isMine: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), text: inputValue, isMine: true },
      ]);
      setInputValue('');
    }
  };

  const today = new Date();
  const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="w-full mx-auto bg-white flex flex-col h-screen border-x" style={{ maxWidth: '390px' }}>
      <ChatHeader name="이준호" />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-sm text-gray-500 my-2">
          {dateString}
        </div>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} text={msg.text} isMine={msg.isMine} />
        ))}
      </div>
      <MessageInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onSend={handleSendMessage}
      />
    </div>
  );
}
