"use client";

import { useEffect, useState } from "react";
import ChatHeader from "./chatbot/ChatHeader";
import MessageList from "./chatbot/MessageList";
import ChoiceButtons from "./chatbot/ChoiceButtons";
import MessageInput from "./chatbot/MessageInput";
import { useChatbot } from "@/hooks/useChatbot";

type ChatbotProps = { autoOpen?: boolean; onRequestClose?: () => void };

export default function Chatbot({ autoOpen = false, onRequestClose }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelEnter, setPanelEnter] = useState(false);

  const {
    input,
    setInput,
    messages,
    choices,
    health,
    loading,
    errorMsg,
    scrollRef,
    handleSend,
    handleChoiceClick,
  } = useChatbot(isOpen);

  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setPanelEnter(true), 10);
  };

  const closeModal = () => {
    setPanelEnter(false);
    setTimeout(() => setIsOpen(false), 300);
    onRequestClose?.();
  };

  useEffect(() => {
    if (autoOpen && !isOpen) openModal();
  }, [autoOpen, isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/40"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={[
              "w-[300px] bg-white rounded-2xl shadow-xl",
              "flex flex-col",
              "h-[600px]",
              "pb-4",
              "mb-[80px]",
              "transform transition-transform duration-300 ease-out",
              panelEnter ? "translate-y-0" : "translate-y-full",
            ].join(" ")}
          >
            <ChatHeader health={health} onClose={closeModal} />
            <MessageList messages={messages} scrollRef={scrollRef} errorMsg={errorMsg} />
            <div className="p-4">
              <ChoiceButtons choices={choices} loading={loading} onChoiceClick={handleChoiceClick} />
            </div>
            <MessageInput input={input} setInput={setInput} onSend={handleSend} loading={loading} />
          </div>
        </div>
      )}
    </>
  );
}