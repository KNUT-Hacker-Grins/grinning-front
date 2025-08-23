'use client';

import { useRouter } from 'next/navigation';
import RegisterHeader from '@/components/RegisterHeader';
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';
import BottomNav from '@/components/BottomNav';


export default function RegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout, updateProfile } = useAuth();

  const handleLostItemRegister = () => {
    router.push('/register/lost');
  };


  const handleFoundItemRegister = () => {
    router.push('/register/found');
  };

  return (
    <div className="flex flex-col mx-auto w-full max-w-sm min-h-screen bg-white">
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />

      <main className="flex-grow px-4 py-6">
        <div className="space-y-4">
          <h2 className="mb-8 text-lg font-semibold text-center text-gray-900">
            어떤 종류의 신고를 하시겠습니까?
          </h2>

          {/* 분실물 신고 카드 */}
          <div 
            onClick={handleLostItemRegister}
            className="p-6 bg-white rounded-lg border-2 border-red-200 transition-all cursor-pointer hover:border-red-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="flex justify-center items-center w-12 h-12 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">분실물 신고</h3>
                <p className="mt-1 text-sm text-gray-600">
                  물건을 잃어버렸어요
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  • 분실 시간과 위치를 등록하세요<br/>
                  • 현상금을 설정할 수 있어요<br/>
                  • 많은 사람들이 찾아드릴게요
                </p>
              </div>
              <div className="text-red-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 습득물 신고 카드 */}
          <div 
            onClick={handleFoundItemRegister}
            className="p-6 bg-white rounded-lg border-2 border-blue-200 transition-all cursor-pointer hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center space-x-4">
              <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">습득물 신고</h3>
                <p className="mt-1 text-sm text-gray-600">
                  물건을 찾았어요
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  • 습득 시간과 위치를 등록하세요<br/>
                  • 주인을 찾아드릴게요<br/>
                  • 따뜻한 마음에 감사해요
                </p>
              </div>
              <div className="text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>


          {/* 안내 메시지 */}
          <div className="p-4 mt-8 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 text-green-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-green-800">신고 전 확인사항</h4>
                <p className="mt-1 text-xs text-green-700">
                  • 정확한 정보를 입력해주세요<br/>
                  • 사진을 등록하면 찾을 확률이 높아져요<br/>
                  • 개인정보는 보호됩니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      
    </div>
  );
}