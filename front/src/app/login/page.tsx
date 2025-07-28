'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api, tokenManager } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인된 사용자는 홈페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSocialLogin = (provider: 'kakao' | 'google') => {
    setIsLoading(true);
    
    try {
      if (provider === 'kakao') {
        const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
        
        if (!kakaoClientId || !redirectUri) {
          throw new Error('카카오 OAuth 설정이 없습니다.');
        }
        
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=kakao`;
        window.location.href = kakaoAuthUrl;
        
      } else if (provider === 'google') {
        const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        
        if (!googleClientId || !redirectUri) {
          throw new Error('구글 OAuth 설정이 없습니다.');
        }

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20email%20profile&state=google&access_type=offline`;
        window.location.href = googleAuthUrl;
      }
    } catch (error) {
      console.error('소셜 로그인 오류:', error);
      alert(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  // OAuth는 콜백 페이지에서 처리됨

  // 인증 체크 중이거나 이미 로그인된 경우 로딩 표시
  if (authLoading || isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
          <p className="text-gray-600">
            {isAuthenticated ? '홈페이지로 이동 중...' : '로그인 상태 확인 중...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white w-[390px] h-[844px] relative">
        {/* 메인 컨텐츠 */}
        <div className="absolute left-6 top-56 w-[342px] h-[396px]">
          {/* 로고 및 타이틀 섹션 */}
          <div className="w-[342px] h-[184px] relative">
            {/* 앱 로고 */}
            <div className="absolute left-[90px] top-0 w-30 h-24 rounded-lg flex items-center justify-center">
                <Image 
                  src="/logo.jpeg" 
                  alt="로고" 
                  width={150} 
                  height={150}
                  className="mr-2"
                />      
            </div>
            {/* 서브 타이틀 */}
            <p className="absolute left-1/2 transform -translate-x-1/2 top-[145px] text-[17px] text-gray-600 text-center leading-[20px]">
              분실물을 찾는 가장 빠른 방법
            </p>
          </div>

          {/* 로그인 버튼 섹션 */}
          <div className="absolute top-[216px] w-[342px] h-[108px]">
            {/* 카카오 로그인 버튼 */}
            <button 
              className={`w-[342px] h-[46px] bg-[#fee500] rounded-md flex items-center justify-center relative hover:bg-[#fdd835] transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => handleSocialLogin('kakao')}
              disabled={isLoading}
            >
              <div className="absolute left-[95px] flex items-center">
                <Image 
                  src="/kakao.svg" 
                  alt="카카오" 
                  width={14} 
                  height={14}
                  className="mr-2"
                />
              </div>
              <span className="text-[14px] font-medium text-gray-800">
                {isLoading ? '로그인 중...' : '카카오로 로그인하기'}
              </span>
            </button>

            {/* 구글 로그인 버튼 */}
            <button 
              className={`w-[342px] h-[46px] bg-white border border-gray-300 rounded-md flex items-center justify-center relative mt-4 hover:bg-gray-50 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <div className="absolute left-[103px] flex items-center">
                <Image 
                  src="/google.svg" 
                  alt="구글" 
                  width={13} 
                  height={14}
                  className="mr-2"
                />
              </div>
              <span className="text-[14px] font-medium text-gray-700">
                {isLoading ? '로그인 중...' : '구글로 로그인하기'}
              </span>
            </button>
          </div>

          {/* 이용약관 동의 텍스트 */}
          <div className="absolute top-[356px] w-[342px] h-10">
            <p className="text-[14px] text-center leading-[20px] px-4">
              <span className="text-gray-500">로그인함으로써 </span>
              <span className="font-medium text-indigo-600">서비스 이용약관</span>
              <span className="text-gray-500"> 과 </span>
              <span className="font-medium text-indigo-600">개인정보 처리방침</span>
              <span className="text-gray-500"> 에 동의합니다.</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 