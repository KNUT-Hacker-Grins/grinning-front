"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Card = {
  id: number;
  title: string;
  imageUrl: string;
  categoryLabel?: string;
};

export default function ChatGallery({
  note,
  cards,
}: {
  note?: string;
  cards: Card[];
}) {
  const router = useRouter();

  const handleClick = (postId: number) => {
    if (!postId) return;
    // 추천은 “습득물(Found)”일 확률이 높다면 found 기준으로:
    router.push(`/found-item/${postId}`);
    // 만약 분실물 상세로 가야 한다면 라우트만 바꾸세요: `/lost-item/${postId}`
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-[85%]">
        {note && <div className="text-sm text-gray-700 mb-2">{note}</div>}

        {/* ✅ 가로 스크롤, 스냅 */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => handleClick(c.id)}
              className="min-w-[140px] max-w-[140px] flex-shrink-0 snap-start text-left border rounded-lg overflow-hidden bg-white hover:shadow transition"
              title={c.title}
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={c.imageUrl || "/placeholder.png"}
                  alt={c.title || "항목"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-2">
                <div className="text-xs font-medium text-gray-800 line-clamp-2">
                  {c.title || "항목"}
                </div>
                {c.categoryLabel && (
                  <div className="mt-1 text-[10px] text-gray-500">
                    #{c.categoryLabel}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 선택: “더 보기” 버튼으로 카테고리 라벨 필터 이동 */}
        {/* 
        <div className="mt-2 text-right">
          <button
            className="text-xs text-indigo-600 hover:underline"
            onClick={() => {
              const labels = Array.from(
                new Set(cards.map(c => c.categoryLabel).filter(Boolean) as string[])
              );
              const qs = labels.length ? `?category=${encodeURIComponent(labels.join(","))}` : "";
              router.push(`/found-item${qs}`);
            }}
          >
            관련 목록 더 보기
          </button>
        </div>
        */}
      </div>
    </div>
  );
}