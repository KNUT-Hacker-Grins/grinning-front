"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { FoundItem } from "@/types/foundItems";
import { LostItem } from "@/types/lostItems";
import BottomNav from "@/components/BottomNav";
import LanguageSelector from "@/components/LanguageSelector";

// 메인 카드 컴포넌트
const MainCard = ({ 
  title, 
  icon, 
  borderColor, 
  bgColor, 
  href, 
  onClick 
}: {
  title: string;
  icon: string;
  borderColor: string;
  bgColor: string;
  href?: string;
  onClick?: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const cardContent = (
    <div
      className={`
        relative w-full h-32 rounded-3xl border-2 ${borderColor} ${bgColor}
        flex items-center justify-between px-6
        transition-all duration-200 ease-out
        hover:scale-105 card-shadow hover:card-shadow-hover
        active:scale-95
        ${isPressed ? 'scale-95' : ''}cursor-pointer }`} 
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* 왼쪽 텍스트 */}
      <h3 className="text-xl font-bold text-gray-800">
        {title}
      </h3>
      
      {/* 오른쪽 아이콘 */}
      <div className="flex-shrink-0">
        <img
          src={icon}
          alt={title}
          className="object-contain w-16 h-16"
        />
      </div>
      
      {/* 호버 효과를 위한 오버레이 */}
      <div className="absolute inset-0 bg-white rounded-3xl opacity-0 transition-opacity duration-200 hover:opacity-5"></div>
    </div>
  );

  if (href) {
  return (
      <Link href={href} className="block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  // 로딩 상태 표시
  if (authLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-gray-50">
        <div
          className="flex justify-center items-center mx-auto w-full max-w-md"
          style={{ maxWidth: "390px" }}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-orange-500 animate-spin"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center min-h-screen bg-gray-50">
      <div className="relative mx-auto w-full max-w-md" style={{ maxWidth: "390px", minHeight: "100vh" }}>
        {/* 상단 헤더 */}
        <div className="relative px-6 pt-16 pb-8">
          {/* 프로필 아이콘 (우상단) */}
          <div className="absolute right-6 top-16">
            <Link href={isAuthenticated ? "/mypage" : "/login"}>
              <div className="flex overflow-hidden justify-center items-center w-10 h-10 bg-gray-300 rounded-full transition-colors hover:bg-gray-400">
                {!authLoading && (
                  isAuthenticated && user ? (
                    <img
                      src={user.profile_picture_url || "/default-profile.png"}
                      alt="프로필 사진"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-xs text-gray-600">
                      LOGIN
                    </span>
                  )
                )}
              </div>
            </Link>
          </div>

          {/* 중앙 로고 및 타이틀 */}
          <div className="flex flex-col items-center mb-12">
            {/* 찾아줘! 로고 */}
            <div className="flex gap-3 items-center mb-2">
              <img
                src="/logo.svg"
                alt="찾아줘 로고"
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold text-orange-500">찾아줘!</h1>
            </div>

            {/* 언어 선택기 */}
            <div className="mt-4">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* 메인 카드 섹션 */}
        <div className="flex-1 px-6 space-y-6">
          {/* 분실물 조회 카드 - 습득물 목록 페이지로 이동 */}
          <MainCard
            title="분실물 조회"
            icon="/lostitem.svg"
            borderColor="border-red-400"
            bgColor="bg-red-50"
            href="/found-item"
          />

          {/* 분실물 수배 카드 - 분실물 목록 페이지로 이동 */}
          <MainCard
            title="분실물 수배"
            icon="/wanted.svg"
            borderColor="border-blue-400"
            bgColor="bg-blue-50"
            href="/items/lost-item"
          />

          {/* 찾아줘 챗봇 카드 - 채팅 페이지로 이동 */}
          <MainCard
            title="찾아줘 챗봇"
            icon="/chatbot.svg"
            borderColor="border-orange-400"
            bgColor="bg-orange-50"
            href="/chat"
          />
        </div>


                {/* 하단 네비게이션을 위한 여백 */}
        <div className="pb-20">
          {/* 여백만 제공하고 BottomNav는 fixed로 표시됨 */}
          </div>
       <BottomNav />
      </div>
    </main>
  );
}
