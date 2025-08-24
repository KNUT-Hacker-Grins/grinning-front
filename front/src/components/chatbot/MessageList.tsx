import React from "react";
import { Message } from "@/types/chatbot";
import ChoiceButtons from "./ChoiceButtons";

type MessageListProps = {
  messages: Message[];
  scrollRef: React.Ref<HTMLDivElement>;
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
      {messages.map((msg, index) => (
        <div
          key={index}
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
            {msg.content}
          </div>
        </div>
      ))}
      <ChoiceButtons
        choices={choices}
        loading={loading}
        onChoiceClick={onChoiceClick}
      />
      {errorMsg && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {errorMsg}
        </div>
      )}
    </div>
  );
}