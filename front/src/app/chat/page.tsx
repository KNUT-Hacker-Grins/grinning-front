'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaComments, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

export default function ChatListPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // 로딩 상태
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전까지의 임시 상태)
  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600">로그인이 필요합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()}
          className="mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-100"
        >
          <FaArrowLeft className="text-gray-600" size={18} />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">채팅</h1>
      </div>

      {/* 채팅방 목록 - API 개발 필요 안내 */}
      <div className="flex-1">
        <div className="text-center py-12">
          <FaExclamationTriangle className="mx-auto text-amber-400 mb-4" size={48} />
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            채팅 목록 기능 준비 중
          </h2>
          <p className="text-gray-500 mb-2">
            채팅방 목록을 불러오는 기능이 아직 개발 중입니다.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            백엔드에 <code className="bg-gray-200 px-2 py-1 rounded text-xs">GET /api/chat/rooms/my</code> API가 필요합니다.
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/"
              className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              홈으로 돌아가기
            </Link>
            <div>
              <p className="text-xs text-gray-400">
                분실물 상세 페이지에서 채팅을 시작할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 