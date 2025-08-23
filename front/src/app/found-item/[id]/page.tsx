'use client';

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaArrowLeft,
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
import { FoundItemDetail } from '@/types/foundItems';
import SingleItemMap from '@/components/SingleItemMap';

// 시간 차이 계산 함수
const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const createdAt = new Date(dateString);
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function FoundItemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [item, setItem] = useState<FoundItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

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
        post_type: "found",
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

  useEffect(() => {
    const fetchFoundItem = async () => {
      if (!itemId) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.foundItems.getById(parseInt(itemId));
        if (response && response.data) {
          setItem(response.data);
        } else {
          setError("습득물을 찾을 수 없습니다.");
        }
      } catch (error: any) {
        console.error("습득물 정보 가져오기 실패:", error);
        setError("습득물 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoundItem();
  }, [itemId]);

  if (isLoading) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{ maxWidth: "390px" }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">습득물 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="flex justify-center min-h-screen bg-white">
        <div className="flex justify-center items-center mx-auto w-full max-w-md" style={{ maxWidth: "390px" }}>
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">{error || "습득물을 찾을 수 없습니다"}</h2>
            <button onClick={() => router.back()} className="text-indigo-600 hover:text-indigo-800">뒤로 가기</button>
          </div>
        </div>
      </main>
    );
  }

  const handleChat = async () => {
    try {
      setIsStartingChat(true);
      const response = await api.chat.startChat(item.id, "found");
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

  const handleReturned = async () => {
    try {
      await api.foundItems.updateStatus(item.id, "returned");
      alert("주인에게 돌려주었다고 표시했습니다.");
      setItem((prev) => (prev ? { ...prev, status: "returned" } : null));
    } catch (error) {
      console.error("상태 업데이트 실패:", error);
      alert("상태 업데이트에 실패했습니다.");
    }
  };

  return (
    <main className="flex justify-center min-h-screen bg-white">
      <div className="flex flex-col mx-auto w-full max-w-md" style={{ maxWidth: "390px" }}>
        <MainHeader isAuthenticated={isAuthenticated} authLoading={authLoading} />
        <div className="relative w-full h-80 bg-gray-200">
          {item.image_urls && item.image_urls.length > 0 ? (
            <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/api/placeholder/400/300"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === "returned" ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"}`}>
              {item.status === "returned" ? "주인 찾음" : "보관 중"}
            </span>
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <span>{item.category && item.category.length > 0 ? item.category[0].label : "기타"}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{getTimeAgo(item.found_at || new Date().toISOString())} · {formatDate(item.found_at || new Date().toISOString())} 등록</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} />
              <div>
                <h3 className="font-medium text-gray-900 mb-1">습득 위치</h3>
                <p className="text-sm text-gray-600">{item.found_location}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">상세 설명</h3>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">등록자</h3>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center font-medium bg-gray-300"> {/* Added overflow-hidden and bg-gray-300 for placeholder */}
                {item.user.profile_picture_url ? (
                  <img
                    src={item.user.profile_picture_url}
                    alt="프로필 사진"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-600">
                    {item.user.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{item.user.name || "익명"}</p>
                <p className="text-sm text-gray-500">등록자</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex space-x-3">
            <button onClick={handleChat} disabled={isStartingChat} className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center transition-colors ${isStartingChat ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}>
              {isStartingChat ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>채팅 시작 중...</>) : (<><FaComments className="mr-2" size={16} />채팅하기</>)}
            </button>
            {item.status === "available" && (
              <button onClick={handleReturned} className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                <FaCheck className="mr-2" size={16} />
                주인에게 돌려줌
              </button>
            )}
            <button onClick={handleReport} className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
              <FaFlag size={16} />
              신고하기
            </button>
          </div>
        </div>
        <ReportModal isOpen={isReportOpen} onClose={handleCloseReport} onSubmit={handleSubmitReport} />
        <BottomNav />
      </div>
    </main>
  );
}
