import React from "react";
import { Message } from "@/types/chatbot";
import ChoiceButtons from "./ChoiceButtons";

type MessageListProps = {
  messages: Message[];
  scrollRef: React.RefObject<HTMLDivElement | null> | React.MutableRefObject<HTMLDivElement | null>;
  errorMsg: string | null;
  choices: string[];
  loading: boolean;
  onChoiceClick: (choice: string) => void;
};


export default function MessageList({
  messages,
  scrollRef,
  errorMsg,
  choices,
  loading,
  onChoiceClick,
}: MessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => {
        // 갤러리형 메시지
        if ((msg as any).kind === "gallery") {
          const g = msg as any; // 타입 확장 전 임시 캐스팅
          const cards = Array.isArray(g.cards) ? g.cards : [];

          if (cards.length === 0) return null;

          return (
            <div key={`gallery-${index}`} className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-w-[85%]">
                {g.note && (
                  <div className="text-sm text-gray-700 mb-2">{g.note}</div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {cards.map((c: any) => (
                    <div
                      key={c.id ?? `${index}-${c.title}`}
                      className="border rounded-lg overflow-hidden bg-white"
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
                        {typeof c.categoryId !== "undefined" && (
                          <div className="mt-1 text-[10px] text-gray-500">
                            카테고리 #{c.categoryId}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        // 기본 텍스트 메시지
        return (
          <div
            key={`text-${index}`}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-xl text-sm max-w-[75%] ${
                msg.role === "user"
                  ? "bg-indigo-100 text-gray-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {"content" in msg ? msg.content : ""}
            </div>
          </div>
        );
      })}

      {/* 선택지 버튼(봇 말풍선 바로 아래에 붙도록 리스트 내부에 둠) */}
      <ChoiceButtons
        choices={choices}
        loading={loading}
        onChoiceClick={onChoiceClick}
      />

      {/* 에러 메시지 */}
      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {errorMsg}
        </div>
      )}
    </div>
  );
}