'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (provider: 'kakao' | 'google') => {
    // 로그인 상태를 localStorage에 저장
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginProvider', provider);
    
    // 메인 페이지로 이동
    router.push('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white w-[390px] h-[844px] relative">
        {/* 메인 컨텐츠 */}
        <div className="absolute left-6 top-56 w-[342px] h-[396px]">
          {/* 로고 및 타이틀 섹션 */}
          <div className="w-[342px] h-[184px] relative">
            {/* 앱 로고 */}
            <div className="absolute left-[123px] top-0 w-24 h-24 bg-[#4a90a4] rounded-lg flex items-center justify-center">      
            </div>
            
            {/* 메인 타이틀 */}
            <h1 className="absolute left-1/2 transform -translate-x-1/2 top-[111px] text-[30px] font-bold text-gray-900 text-center leading-[36px] tracking-[-1.25px]">
              찾아줘!
            </h1>
            
            {/* 서브 타이틀 */}
            <p className="absolute left-1/2 transform -translate-x-1/2 top-[164px] text-[14px] text-gray-600 text-center leading-[20px]">
              분실물을 찾는 가장 빠른 방법
            </p>
          </div>

          {/* 로그인 버튼 섹션 */}
          <div className="absolute top-[216px] w-[342px] h-[108px]">
            {/* 카카오 로그인 버튼 */}
            <button 
              className="w-[342px] h-[46px] bg-[#fee500] rounded-md flex items-center justify-center relative hover:bg-[#fdd835] transition-colors"
              onClick={() => handleLogin('kakao')}
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
                카카오로 로그인하기
              </span>
            </button>

            {/* 구글 로그인 버튼 */}
            <button 
              className="w-[342px] h-[46px] bg-white border border-gray-300 rounded-md flex items-center justify-center relative mt-4 hover:bg-gray-50 transition-colors"
              onClick={() => handleLogin('google')}
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
                구글로 로그인하기
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