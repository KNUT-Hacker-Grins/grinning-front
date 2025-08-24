import React from "react";
import { Message } from "@/types/chatbot";

type MessageListProps = {
  messages: Message[];  // 대화 메시지 배열 (user, bot 구분 포함)
  scrollRef: React.Ref<HTMLDivElement>; // 자동 스크롤을 위해 부모에서 전달할 ref
  errorMsg: string | null; // 에러가 있으면 표시할 메시지, 없으면 null
};

export default function MessageList({ messages, scrollRef, errorMsg }: MessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          // user이면 오른쪽 정렬
          // bot이면 왼쪽 정렬
        > 
          <div
            className={`p-3 rounded-xl text-sm max-w-[75%] ${
              msg.role === "user"
                ? "bg-indigo-100 text-gray-800"
                : "bg-gray-100 text-gray-800"
                // 유저면 파란색 톤 배경, 봇이면 회색 톤 배경
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
