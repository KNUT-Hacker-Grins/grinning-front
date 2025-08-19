"use client";

import { useEffect, useState } from "react";

type Message = {
  role: "user" | "bot";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelEnter, setPanelEnter] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // 챗봇 열기
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setPanelEnter(true), 10);
  };

  // 챗봇 닫기
  const closeModal = () => {
    setPanelEnter(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  // 챗봇 열렸을 때 처음 봇 인사 메시지 출력
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: "bot",
          content: "안녕하세요! 무엇을 도와드릴까요?",
        },
      ]);
    }
  }, [isOpen]);

  // 메시지 전송
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: "user", content: trimmed };

    // Gemini 연동 대신 임시 응답
    const botMessage: Message = {
      role: "bot",
      content: "감사합니다! 입력하신 내용을 확인했습니다.",
    };

    // 한 번에 메시지 배열 추가
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <>
      {/* 챗봇 열기 버튼 */}
      <section className="fixed bottom-[96px] left-[calc(50%+125px)] z-50">
        <button
          onClick={openModal}
          className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        >
          💬
        </button>
      </section>

      {/* 챗봇 모달 */}
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
            {/* 헤더 */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">찾아줘 챗봇</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="챗봇 닫기"
              >
                ✖
              </button>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-xl text-sm max-w-[70%] ${
                      msg.role === "user"
                        ? "bg-indigo-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            {/* 입력창 */}
            <div className="flex items-center border-t px-3 pt-3">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg"
              >
                전송
              </button>
            </div>

            {/* 카테고리 선택 영역 */}
            <div className="px-4 pt-3">
              <p className="text-center text-sm text-gray-700 mb-2">
                찾고 있는 물건 종류를 선택해주세요
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "전자기기", color: "blue", src: "Frame (1).svg" },
                  { label: "가방", color: "blue", src: "Frame (4).svg" },
                  { label: "지갑", color: "purple", src: "Frame (2).svg" },
                  { label: "액세서리", color: "purple", src: "Frame (5).svg" },
                  { label: "의류", color: "pink", src: "Frame (3).svg" },
                  { label: "기타", color: "pink", src: "Frame (6).svg" },
                ].map(({ label, color, src }) => (
                  <button
                    key={label}
                    className={`flex items-center gap-2 bg-${color}-100 text-${color}-500 rounded-xl px-3 py-2`}
                  >
                    <img src={src} alt={label} className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
