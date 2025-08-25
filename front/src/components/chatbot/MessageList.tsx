import { useRouter } from "next/navigation";
import React from "react";
import { Message } from "@/types/chatbot";
import ChoiceButtons from "./ChoiceButtons";
import ChatGallery from "./ChatGallery"; 

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
  
  const router = useRouter();

  return (
    <div ref={scrollRef as any} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => {
        // ✅ 갤러리 메시지 분기
        if ((msg as any).kind === "gallery") {
          const g = msg as any;
          const cards = Array.isArray(g.cards) ? g.cards : [];
          if (cards.length === 0) return null;
          return (
            <div key={`gallery-${index}`} className="flex flex-col items-start w-full">
              {g.note && (
                <div className="mb-2 text-sm text-gray-700">{g.note}</div>
              )}
              <div className="flex flex-row space-x-4 overflow-x-auto pb-2">
                {cards.map((c: any) => (
                  <div
                    key={c.id}
                    className="min-w-[180px] max-w-[180px] bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow flex-shrink-0"
                    onClick={() => router.push(`/found-item/${c.id}`)}
                  >
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt={c.title || "Found item"}
                        className="w-full h-28 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="p-2">
                      <div className="font-semibold text-gray-800 truncate">{c.title}</div>
                      {c.categoryLabel && (
                        <div className="text-xs text-gray-500 mt-1">{c.categoryLabel}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 기본 텍스트 메시지
        return (
          <div
            key={`text-${index}`}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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

      <ChoiceButtons choices={choices} loading={loading} onChoiceClick={onChoiceClick} />

      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {errorMsg}
        </div>
      )}
    </div>
  );
}