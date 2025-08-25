"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

// 인기 카테고리 타입 정의
interface PopularCategory {
  category: string;
  search_count: number;
  sample_item: {
    id: number;
    title: string;
    image_url: string;
    found_location: string;
  };
}
import BottomNav from "@/components/BottomNav";
import LanguageSelector from "@/components/LanguageSelector";
import Chatbot from "@/components/Chatbot";

// 메인 카드 컴포넌트
const MainCard = ({
  title,
  subtitle,
  titleColor,
  icon,
  borderColor,
  bgColor,
  href,
  onClick,
}: {
  title: string;
  subtitle: string;
  titleColor: string;
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
        ${isPressed ? "scale-95" : ""}cursor-pointer }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
    >
      {/* 왼쪽 텍스트 */}
      <div className="flex flex-col justify-center h-full">
        {title.includes(' ') ? (
          title.split(' ').map((word, index) => (
            <h3 key={index} className={`text-2xl font-bold leading-tight ${titleColor}`}>
              {word}
            </h3>
          ))
        ) : (
          <h3 className={`text-2xl font-bold ${titleColor}`}>{title}</h3>
        )}
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* 오른쪽 아이콘 */}
      <div className="flex-shrink-0">
        <img src={icon} alt={title} className="object-contain w-16 h-16" />
      </div>

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

// 인기 카테고리 카드 컴포넌트
const PopularCategoryCard = ({ popularCategories }: { popularCategories: PopularCategory[] }) => {
  const [isPressed, setIsPressed] = useState(false);
  const topCategory = popularCategories[0];

  const handleClick = () => {
    const category = topCategory?.category || "지갑";
    window.location.href = `/found-item?category=${encodeURIComponent(category)}`;
  };
  
  if (!topCategory) {
    return (
      <div
        className={`
          relative w-full h-48 rounded-3xl border-2 border-black bg-white
          flex items-center justify-between px-6
          transition-all duration-200 ease-out
          hover:scale-105 card-shadow hover:card-shadow-hover
          active:scale-95
          ${isPressed ? "scale-95" : ""}cursor-pointer }`}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={handleClick}
      >
        {/* 왼쪽 텍스트 */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold leading-tight text-black">가장 많이</h3>
          <h3 className="text-xl font-bold leading-tight text-black">검색된</h3>
          <h3 className="text-xl font-bold leading-tight text-black">카테고리</h3>
        </div>

        {/* 오른쪽 화살표 */}
        <div className="flex-shrink-0">
          <img src="/arrow.svg" alt="화살표" className="w-8 h-8" />
        </div>

      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full h-48 rounded-3xl border-2 border-black bg-white
        flex items-center justify-between px-6
        transition-all duration-200 ease-out
        hover:scale-105 card-shadow hover:card-shadow-hover
        active:scale-95
        ${isPressed ? "scale-95" : ""}cursor-pointer }`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      style={{
        backgroundImage: topCategory.sample_item?.image_url ? `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${topCategory.sample_item.image_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 왼쪽 텍스트 */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold leading-tight text-black">가장 많이</h3>
        <h3 className="text-xl font-bold leading-tight text-black">검색된</h3>
        <h3 className="text-xl font-bold leading-tight text-black">카테고리</h3>
      </div>

      {/* 오른쪽 화살표 */}
      <div className="flex-shrink-0">
        <img src="/arrow.svg" alt="화살표" className="w-8 h-8" />
      </div>

    </div>
  );
};

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);
  const [popularCategories, setPopularCategories] = useState<PopularCategory[]>([]);

  // 인기 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        const response = await api.stats.getPopularCategories();
        setPopularCategories(response.data || []);
      } catch (error) {
        console.error('인기 카테고리 로딩 실패:', error);
        // 에러 시 빈 배열로 설정
        setPopularCategories([]);
      }
    };

    fetchPopularCategories();
  }, []);
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
      <div
        className="relative mx-auto w-full max-w-md"
        style={{ maxWidth: "390px", minHeight: "100vh" }}
      >
        {/* 상단 헤더 */}
        <div className="flex justify-between items-center px-6 pt-16 pb-8">
          {/* 왼쪽 찾아줘 로고 */}
          <div>
            <img src="/logo.svg" alt="찾아줘 로고" className="w-16 h-16" />
          </div>
          
          {/* 오른쪽 아이콘들 */}
          <div className="flex gap-0 items-center">
            {/* 언어 설정 아이콘 */}
            <div className="flex justify-center items-center w-30 h-30">
              <LanguageSelector />
            </div>
            
            {/* 프로필 아이콘 */}
            <Link href={isAuthenticated ? "/mypage" : "/login"}>
              <div className="flex overflow-hidden justify-center items-center w-10 h-10 bg-gray-300 rounded-full transition-colors hover:bg-gray-400">
                {!authLoading &&
                  (isAuthenticated && user ? (
                    <img
                      src={user.profile_picture_url || "/default-profile.png"}
                      alt="프로필 사진"
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <img
                      src="/cheetah.jpeg"
                      alt="기본 프로필"
                      className="block object-cover object-center w-full h-full rounded-full"
                    />
                  ))}
              </div>
            </Link>
          </div>
        </div>

        {/* 메인 카드 섹션 */}
        <div className="flex-1 px-6 space-y-4">
          {/* 가장 많이 검색된 카테고리 카드 */}
          <PopularCategoryCard popularCategories={popularCategories} />
          {/* 분실물 조회 카드 - 습득물 목록 페이지로 이동 */}
          <MainCard
            title="분실물 조회"
            subtitle="잃어버린 물건 찾기"
            titleColor="text-red-500"
            icon="/lostitem.svg"
            borderColor="border-red-400"
            bgColor="bg-red-50"
            href="/found-item"
          />

          {/* 분실물 수배 카드 - 분실물 목록 페이지로 이동 */}
          <MainCard
            title="분실물 수배"
            subtitle="잃어버린 물건 수배하기"
            titleColor="text-blue-500"
            icon="/wanted.svg"
            borderColor="border-blue-400"
            bgColor="bg-blue-50"
            href="/items/lost-item"
          />

          {/* 찾아줘 챗봇 카드 - 채팅 페이지로 이동 */}
          <MainCard
            title="찾아줘 챗봇"
            subtitle="잃어버린 물건 물어보기"
            titleColor="text-orange-500"
            icon="/chatbot.svg"
            borderColor="border-orange-400"
            bgColor="bg-orange-50"
            onClick={() => setShowChatbot(true)}
          />
        </div>

        {/* 하단 네비게이션을 위한 여백 */}
        <div className="pb-20">
          {/* 여백만 제공하고 BottomNav는 fixed로 표시됨 */}
          {showChatbot && (
            <Chatbot autoOpen onRequestClose={() => setShowChatbot(false)} />
          )}{" "}
        </div>
        <BottomNav />
      </div>
    </main>
  );
}
