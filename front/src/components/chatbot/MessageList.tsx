import { RefObject } from "react";
import { Message } from "@/types/chatbot";

type MessageListProps = {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement>;
  errorMsg: string | null;
};

export default function MessageList({ messages, scrollRef, errorMsg }: MessageListProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 rounded-xl text-sm max-w-[75%] ${
              msg.role === "user"
                ? "bg-indigo-100 text-gray-800"
                : "bg-gray-100 text-gray-800"
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
