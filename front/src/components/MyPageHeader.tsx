'use client';

import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function MyPageHeader() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 오류가 발생해도 로컬 토큰은 정리되므로 홈페이지로 이동
      router.push('/');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
      <h1 className="text-xl font-semibold text-gray-900">마이페이지</h1>
      <div className="flex items-center gap-3">
        {/* 테스트용 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          로그아웃
        </button>
        <Link href="/mysetting">
          <FaCog className="text-gray-500" size={20} />
        </Link>
      </div>
    </header>
  )
}
