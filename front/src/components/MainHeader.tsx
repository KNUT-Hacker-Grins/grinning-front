'use client';

import Link from 'next/link';

interface MainHeaderProps {
  isAuthenticated: boolean;
  authLoading: boolean;
}

export default function MainHeader({ isAuthenticated, authLoading }: MainHeaderProps) {
  return (
    <div className="relative px-6 pt-16 pb-6">
      {/* 로고와 네비게이션 */}
      <div className="flex justify-between items-center mb-[50px]">
        {/* 왼쪽: 로고 + 찾아줘! + 번역 */}
        <div className="flex gap-3 items-center">
          {/* 로고 */}
          <img
            src="/logo.jpeg"
            alt="찾아줘 로고"
            width="40"
            height="40"
            className="rounded-lg"
          />

          {/* 찾아줘! 타이틀 */}
          <h1 className="text-xl font-bold text-gray-800">찾아줘!</h1>

          {/* 번역 기능 */}
          <div className="flex gap-1 items-center">
            <span className="text-lg">🇰🇷</span>
            <select
              className="text-sm text-gray-600 bg-transparent border-none cursor-pointer"
              onChange={(e) => {
                // 번역 기능 추후 구현
                console.log('언어 변경:', e.target.value);
              }}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>

        {/* 오른쪽: 프로필 */}
        <Link href={isAuthenticated ? "/mypage" : "/login"}>
          <div className="flex justify-center items-center w-10 h-10 bg-gray-300 rounded-full">
            {!authLoading && (
              <span className="text-xs text-gray-600">
                {isAuthenticated ? "MY" : "LOGIN"}
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}