'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { api } from '@/lib/api';

interface ChatMessage {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  message_type: string;
}

interface ChatRoom {
  id: number;
  participants: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = parseInt(params.roomId as string);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [roomInfo, setRoomInfo] = useState<ChatRoom | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // 메시지 목록 하단으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const profile = await api.auth.getProfile();
        setCurrentUser(profile?.name || profile?.email || '나');
      } catch (error: any) {
        console.error('사용자 정보 가져오기 실패:', error);
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (error.message.includes('401') || error.message.includes('Failed to fetch')) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
        }
      }
    };

    fetchCurrentUser();
  }, [router]);

  // 메시지 목록 가져오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.chat.getMessages(roomId);
        
        if (response && response.data && response.data.messages) {
          // 메시지를 시간순으로 정렬 (오래된 것부터)
          const sortedMessages = response.data.messages.sort((a: ChatMessage, b: ChatMessage) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          setMessages(sortedMessages);
        }
      } catch (error: any) {
        console.error('메시지 가져오기 실패:', error);
        if (error.message.includes('403')) {
          setError('채팅방에 접근할 권한이 없습니다.');
        } else if (error.message.includes('401') || error.message.includes('Failed to fetch')) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
        } else {
          setError('메시지를 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId, router]);

  // 메시지가 업데이트될 때 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      
      const response = await api.chat.sendMessage(roomId, newMessage.trim());
      
      if (response && response.data) {
        // 새 메시지를 목록에 추가
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // 날짜 포맷팅
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    }
    
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  // 날짜가 바뀌었는지 확인
  const shouldShowDateSeparator = (currentMsg: ChatMessage, prevMsg: ChatMessage | null) => {
    if (!prevMsg) return true;
    
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    
    return currentDate !== prevDate;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => router.back()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-100"
        >
          <FaArrowLeft className="text-gray-600" size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">채팅</h1>
          <p className="text-sm text-gray-500">
            {roomInfo?.participants?.find(p => p.name !== currentUser)?.name || '상대방'}
          </p>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div 
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">아직 메시지가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const isMyMessage = message.sender === currentUser;
            const showDateSeparator = shouldShowDateSeparator(message, prevMessage);

            return (
              <div key={message.id}>
                {/* 날짜 구분선 */}
                {showDateSeparator && (
                  <div className="flex justify-center my-4">
                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}

                {/* 메시지 */}
                <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'order-2' : 'order-1'}`}>
                    {!isMyMessage && (
                      <p className="text-xs text-gray-500 mb-1 px-1">{message.sender}</p>
                    )}
                    <div 
                      className={`px-4 py-2 rounded-lg ${
                        isMyMessage 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 px-1 ${isMyMessage ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력창 */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={isSending}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className={`p-2 rounded-lg transition-colors ${
              newMessage.trim() && !isSending
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <FaPaperPlane size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 