'use client';

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaEllipsisV,
  FaMapMarkerAlt,
  FaComments,
  FaCheck,
  FaFlag,
} from "react-icons/fa";
import BottomNav from "@/components/BottomNav";
import ReportModal from "@/components/ReportModal";
import { api } from "@/lib/api";
import MainHeader from '@/components/MainHeader';
import { useAuth } from '@/hooks/useAuth';
import { LostItem } from '@/types/lostItems';

// 시간 차이 계산 함수
const getTimeAgo = (dateString?: string) => {
  if (!dateString) return '날짜 정보 없음';
  const createdAt = new Date(dateString);
  if (isNaN(createdAt.getTime())) return '유효하지 않은 날짜';

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

// 날짜 포맷 함수
const formatDate = (dateString?: string) => {
  if (!dateString) return '날짜 정보 없음';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


export default function LostItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [item, setItem] = useState<LostItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // 신고 하기
  const handleReport = () => {
    setIsReportOpen(true);
  };

  const handleCloseReport = () => {
    setIsReportOpen(false);
  };

  const handleSubmitReport = async (reason: string, details: string) => {
  try {
    if (!item) return;

    const response = await api.reports.submit(item.id, {
      post_type: "lost",
      reason,
      description: details,
    });

    if (response?.status === "success") {
      alert("신고가 접수되었습니다.");
    } else {
      alert("신고에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (err) {
    console.error("신고 실패:", err);
    alert("신고 중 오류가 발생했습니다.");
  } finally {
    setIsReportOpen(false);
  }
};

  // 분실물 상세 정보 가져오기
  useEffect(() => {
    const fetchLostItem = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.lostItems.getById(parseInt(itemId));

        if (response && response.data) {
          setItem(response.data);
        } else {
          setError("분실물을 찾을 수 없습니다.");
        }
      } catch (error: any) {
        console.error("분실물 정보 가져오기 실패:", error);
        setError("분실물 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (itemId) {
      fetchLostItem();
    }
  }, [itemId]);

  // 로딩 상태
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

  // 에러 상태 또는 아이템이 없는 경우
  if (error || !item) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div
          className="flex justify-center items-center mx-auto w-full max-w-md"
          style={{ maxWidth: "390px" }}
        >
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {error || "분실물을 찾을 수 없습니다"}
            </h2>
            <button
              onClick={() => router.back()}
              className="text-indigo-600 hover:text-indigo-800"
            >
              뒤로 가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleChat = async () => {
    try {
      setIsStartingChat(true);

      const response = await api.chat.startChat(item.id, "lost");

      if (response && response.data && response.data.room_id) {
        router.push(`/chat/${response.data.room_id}`);
      } else {
        alert("채팅방 생성에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("채팅 시작 실패:", error);

      if (error.message.includes("403")) {
        alert("자신의 글에는 채팅을 시작할 수 없습니다.");
      } else if (error.message.includes("401")) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        alert("채팅 시작에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleFound = async () => {
    try {
      await api.lostItems.updateStatus(item.id, "found");
      alert("분실물을 찾았다고 표시되었습니다!");

      setItem((prev) => (prev ? { ...prev, status: "found" } : null));
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div
        className="flex flex-col mx-auto w-full max-w-md"
        style={{ maxWidth: "390px" }}
      >
      <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} user={user} />
      
        <div className="relative w-full h-80 bg-gray-200">
          {item.image_urls && item.image_urls.length > 0 ? (
            <img
              src={item.image_urls[0]}
              alt={item.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/400/300";
              }}
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === "found"
                  ? "bg-green-100 text-green-800"
                  : item.status === "searching"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.status === "found"
                ? "찾음"
                : item.status === "searching"
                ? "찾는 중"
                : "취소됨"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-4">
          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              {item.title}
            </h2>
            <div className="flex items-center mb-1 text-sm text-gray-600">
              <span>
                {item.category && item.category.length > 0
                  ? item.category[0].label
                  : "기타"}{" "}
                · 개인용품
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>
                {getTimeAgo(item.lost_at || item.created_at)} · {formatDate(item.lost_at || item.created_at)}{" "}
                등록
              </span>
            </div>
            {item.reward > 0 && (
              <div className="mt-2">
                <span className="inline-block px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                  현상금 {item.reward.toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <FaMapMarkerAlt
                className="flex-shrink-0 mt-1 mr-2 text-red-500"
                size={16}
              />
              <div>
                <h3 className="mb-1 font-medium text-gray-900">분실 위치</h3>
                <p className="text-sm text-gray-600">{item.lost_location}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-medium text-gray-900">상세 설명</h3>
            <p className="leading-relaxed text-gray-700">{item.description}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="mb-2 font-medium text-gray-900">등록자</h3>
            <div className="flex items-center">
              <div className="flex overflow-hidden justify-center items-center w-10 h-10 font-medium bg-gray-300 rounded-full">
                <img
                  src={item.user?.profile_picture_url || "/default-profile.png"}
                  alt="프로필 사진"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">
                  {item.user?.name || "익명"}
                </p>
                <p className="text-sm text-gray-500">등록자</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleChat}
              disabled={isStartingChat}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${
                isStartingChat
                  ? "text-white bg-gray-400 cursor-not-allowed"
                  : "text-white bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isStartingChat ? (
                <>
                  <div className="mr-2 w-4 h-4 rounded-full border-b-2 border-white animate-spin"></div>
                  채팅 시작 중...
                </>
              ) : (
                <>
                  <FaComments className="mr-2" size={16} />
                  채팅하기
                </>
              )}
            </button>

            {item.status === "searching" && (
              <button
                onClick={handleFound}
                className="flex flex-1 justify-center items-center px-4 py-3 text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
              >
                <FaCheck className="mr-2" size={16} />
                찾았어요
              </button>
            )}

            <button
              onClick={handleReport}
              className="flex justify-center items-center px-4 py-3 text-gray-700 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300"
            >
              <FaFlag size={16} />
              신고하기
            </button>
          </div>
        </div>
        <ReportModal
          isOpen={isReportOpen}
          onClose={() => handleCloseReport()}
          onSubmit={(reason, details) => handleSubmitReport(reason, details)}
        />

        <BottomNav />
      </div>
    </main>
  );
}
