"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { FoundItem } from "@/types/foundItems"; // Import FoundItem
import { LostItem } from "@/types/lostItems"; // Import LostItem
import BottomNav from "@/components/BottomNav";
import Chatbot from "@/components/Chatbot";
import LanguageSelector from "@/components/LanguageSelector";


// 시간 차이 계산 함수
const getTimeAgo = (dateString?: string) => {
  if (!dateString) return "날짜 정보 없음";
  const createdAt = new Date(dateString);
  if (isNaN(createdAt.getTime())) return "유효하지 않은 날짜";

  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "방금 전";
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}일 전`;
};

// 카테고리 순환 애니메이션 컴포넌트
const AnimatedCategory = () => {
  const categories = ["전자기기", "지갑", "의류", "기타"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 2000); // 2초마다 변경

    return () => clearInterval(interval);
  }, [categories.length]);

  return (
    <span className="text-lg font-semibold text-blue-600 transition-all duration-500 ease-in-out">
      {categories[currentIndex]}
    </span>
  );
};

export default function Home() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth(); // user 추가
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]); // 습득물 배열
  const [wantedItems, setWantedItems] = useState<LostItem[]>([]); // 분실물 배열
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"found" | "wanted">("found");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  // Home 컴포넌트 마운트/업데이트 시 useAuth 상태 로깅
  useEffect(() => {
    console.log("Home component mounted/updated.");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("authLoading:", authLoading);
    console.log("User data from useAuth:", user); // user 데이터 로깅
  }, [isAuthenticated, authLoading, user]); // user를 의존성 배열에 추가

  // 분실물과 습득물 데이터 가져오기
  useEffect(() => {
    console.log("첫 페이지 진입: 데이터 로딩 시작"); // <-- 이 라인을 추가합니다.
    const fetchAllItems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 습득물과 분실물을 병렬로 가져오기
        const [foundItemsResponse, lostItemsResponse] =
          await Promise.allSettled([
            api.foundItems.getAll({}), // 모든 습득물들
            api.lostItems.getAll({}), // 모든 분실물들
          ]);

        // 습득물 데이터 처리
        if (
          foundItemsResponse.status === "fulfilled" &&
          foundItemsResponse.value?.data?.items
        ) {
          setFoundItems(foundItemsResponse.value.data.items);
        } else {
          setFoundItems([]);
        }

        // 분실물 데이터 처리
        if (
          lostItemsResponse.status === "fulfilled" &&
          lostItemsResponse.value?.data?.items
        ) {
          setWantedItems(lostItemsResponse.value.data.items);
        } else {
          setWantedItems([]);
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setError("데이터를 불러오는데 실패했습니다.");

        // 에러 발생 시 빈 배열로 설정
        setFoundItems([]);
        setWantedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  

  const handleRegister = () => {
    window.location.href = "/register";
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div
          className="flex justify-center items-center mx-auto w-full max-w-md"
          style={{ maxWidth: "390px" }}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
            <p className="text-gray-600">분실물 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div
          className="flex justify-center items-center mx-auto w-full max-w-md"
          style={{ maxWidth: "390px" }}
        >
          <div className="text-center">
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="mx-auto w-full max-w-md" style={{ maxWidth: "390px" }}>
        {/* 상단 헤더 */}
        <div className="relative px-6 pt-16 pb-6">
          {/* 로고와 네비게이션 */}
          <div className="flex justify-between items-center mb-[50px]">
            {/* 왼쪽: 로고 + 찾아줘! + 번역 */}
            <div className="flex gap-4 items-center">
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

              <LanguageSelector />

              
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

          {/* 메시지 (로그인 상태별) */}
          {!authLoading && !isAuthenticated && (
            <div className="text-center mb-[30px]">
              <div className="flex gap-1 justify-center items-center">
                <AnimatedCategory />
                <span className="text-lg text-gray-700">
                  를 찾기 위해서는 로그인해주세요
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 검색바 */}
        <div className="relative mb-[20px]">
          {/* 검색바 컨테이너 */}
          <div className="relative h-[54px] w-full max-w-[340px] mx-auto">
            {/* 배경과 테두리 */}
            <div className="absolute inset-0 bg-white border-2 border-solid border-black rounded-[27px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"></div>

            {/* 검색 아이콘 */}
            <div className="absolute left-3 top-[13px] w-[29px] h-[29px] overflow-hidden">
              <div className="absolute inset-[12.5%]">
                <img
                  src="/Search.svg"
                  alt="검색"
                  className="block w-full h-full"
                />
              </div>
            </div>

            {/* 입력 필드 */}
            <input
              type="text"
              placeholder="내 물건 찾기"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="absolute left-[55px] top-[15px] w-[200px] h-[24px] text-gray-800 text-base font-normal outline-none bg-transparent leading-none placeholder:text-[#8b8484] placeholder:leading-none"
              style={{ fontFamily: "Inter, Noto Sans KR, sans-serif" }}
            />

            {/* 카메라 아이콘 */}
            <div className="absolute right-3 top-[17px] w-5 h-5 overflow-hidden">
              <div className="absolute bottom-[12.5%] left-[4.167%] right-[4.167%] top-[12.5%]">
                <img
                  src="/Camera.svg"
                  alt="카메라"
                  className="block w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-[15px] mb-[13px] pl-[23px] overflow-x-auto">
          {["전자기기", "지갑", "의류", "기타"].map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? null : category
                )
              }
              className={`px-3 h-6 rounded-[20px] text-xs font-normal flex items-center justify-center whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-[#d9d9d9] text-[#8b8484]"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 분실물 찾기 섹션 */}
        <section className="mb-[56px]">
          <div className="flex justify-between items-center mb-[27px] px-6">
            <h2 className="text-lg font-normal text-black">분실물 찾기</h2>
            <Link href="/found-item" className="text-xs text-black/30">
              더보기
            </Link>
          </div>

          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div
              className="flex gap-[20px] px-6"
              style={{ width: "max-content" }}
            >
              {foundItems
                .filter(
                  (item) =>
                    (searchQuery === "" ||
                      item.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.found_location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                    (selectedCategory === null ||
                      item.category.some(
                        (cat) => cat.label === selectedCategory
                      ))
                )
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/found-item/${item.id}`}
                    className="flex flex-col flex-shrink-0 transition-opacity cursor-pointer hover:opacity-80"
                    style={{ width: "124px" }}
                  >
                    <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img
                          src={item.image_urls[0]}
                          alt={item.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/124/124";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                      )}
                    </div>
                    <h3
                      className="text-[13px] font-normal text-black mb-[5px] line-clamp-1"
                      style={{ fontFamily: "Inter, Noto Sans KR, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="flex justify-between items-center text-[8px] text-[#9e9e9e]"
                      style={{ fontFamily: "Inter, Noto Sans KR, sans-serif" }}
                    >
                      <span className="line-clamp-1 max-w-[70px]">
                        {item.found_location || "위치 없음"}
                      </span>
                      <span className="flex-shrink-0">
                        {getTimeAgo(item.found_at)}
                      </span>
                    </div>
                  </Link>
                ))}

              {foundItems.length === 0 && (
                <div className="flex items-center justify-center w-[124px] h-[124px] bg-gray-100 rounded-xl text-gray-500 text-sm">
                  등록된
                  <br />
                  습득물이
                  <br />
                  없습니다
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 분실물 수배 섹션 */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-[27px] px-6">
            <h2 className="text-lg font-normal text-black">분실물 수배</h2>
            <Link href="../items/lost-item" className="text-xs text-black/30">
              더보기
            </Link>
          </div>

          {/* 가로 스크롤 컨테이너 */}
          <div className="overflow-x-auto scrollbar-hide">
            <div
              className="flex gap-[20px] px-6"
              style={{ width: "max-content" }}
            >
              {wantedItems
                .filter(
                  (item) =>
                    (searchQuery === "" ||
                      item.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.lost_location
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) &&
                    (selectedCategory === null ||
                      item.category.some(
                        (cat) => cat.label === selectedCategory
                      ))
                )
                .map((item) => (
                  <Link
                    key={item.id}
                    href={`/lost-item/${item.id}`}
                    className="flex flex-col flex-shrink-0 transition-opacity cursor-pointer hover:opacity-80"
                    style={{ width: "124px" }}
                  >
                    <div className="w-[124px] h-[124px] bg-gray-300 rounded-xl mb-[7px] overflow-hidden">
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img
                          src={item.image_urls[0]}
                          alt={item.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/api/placeholder/124/124";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                      )}
                    </div>
                    <h3
                      className="text-[13px] font-normal text-black mb-[5px] line-clamp-1"
                      style={{ fontFamily: "Inter, Noto Sans KR, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="flex justify-between items-center text-[8px] text-[#9e9e9e]"
                      style={{ fontFamily: "Inter, Noto Sans KR, sans-serif" }}
                    >
                      <span className="line-clamp-1 max-w-[70px]">
                        {item.lost_location}
                      </span>
                      <span className="flex-shrink-0">
                        {getTimeAgo(item.lost_at || item.created_at)}
                      </span>
                    </div>
                  </Link>
                ))}

              {wantedItems.length === 0 && (
                <div className="flex items-center justify-center w-[124px] h-[124px] bg-gray-100 rounded-xl text-gray-500 text-sm">
                  등록된
                  <br />
                  분실물이
                  <br />
                  없습니다
                </div>
              )}
            </div>
          </div>
        </section>

        <Chatbot />

       <BottomNav />
      </div>
    </main>
  );
}
