'use client';

import Link from "next/link";
import LanguageSelector from "./LanguageSelector";

interface MainHeaderProps {
  isAuthenticated: boolean;
  authLoading: boolean;
}

export default function MainHeader({
  isAuthenticated,
  authLoading,
}: MainHeaderProps) {
  return (
    <header className="w-full bg-white border-b sticky top-0 z-10">
      <div className="max-w-screen-md mx-auto flex items-center justify-between px-4 py-10">
        {/* 왼쪽: 로고 + 텍스트 + 언어 선택 */}
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1">
            <img
              src="/logo.jpeg"
              alt="찾아줘 로고"
              width="40"
              height="40"
              className="rounded-lg cursor-pointer"
            />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">찾아줘!</h1>
        </div>

        {/* 오른쪽: 프로필 버튼 */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
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
    </header>
  );
}
