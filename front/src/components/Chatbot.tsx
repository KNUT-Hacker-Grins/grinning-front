"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatbotProps = { autoOpen?: boolean; onRequestClose?: () => void };

type Role = "user" | "bot";

type Message = {
  role: Role;
  content: string;
};

type HealthRes = {
  ok: boolean;
  time: string;
  state?: string;
  session_id?: string;
  created?: boolean;
};

type ChatbotReply = {
  session_id: string;
  state: "idle" | "awaiting_description" | "move_to_article" | "other" | string;
  reply: string;
  choices: string[];
  recommendations: unknown[];
  data: Record<string, unknown>;
};

export default function Chatbot({ autoOpen = false, onRequestClose }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelEnter, setPanelEnter] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [health, setHealth] = useState<HealthRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, choices]);

  // 챗봇 열기
  const openModal = () => {
    setIsOpen(true);
    setTimeout(() => setPanelEnter(true), 10);
  };

  // 챗봇 닫기
  const closeModal = () => {
    setPanelEnter(false);
    setTimeout(() => setIsOpen(false), 300);
    onRequestClose?.();
  };

  // 열릴 때 헬스체크 & 초기 인사
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      try {
        const res = await fetch("/api/chatbot/health", { method: "GET" });
        const json: HealthRes = await res.json();
        setHealth(json);
      } catch {
        setHealth({ ok: false, time: new Date().toISOString() });
      }
    })();

    // 초기 메시지는 API가 내려주지만, 버튼 선택 전 UX를 위해 프리메시지 표시
    setMessages([{ role: "bot", content: "안녕하세요! 무엇을 도와드릴까요?" }]);
    setChoices(["분실물 찾기", "분실물 신고", "기타 문의"]);
    setErrorMsg(null);
  }, [isOpen]);

  // 외부에서 자동 오픈
  useEffect(() => {
    if (autoOpen && !isOpen) openModal();
  }, [autoOpen, isOpen]);

  // intent/message 전송 공용 함수
  const sendIntent = async (intent?: string, message?: string) => {
    setLoading(true);
    setErrorMsg(null);

    const body: any = {};
    if (intent) body.intent = intent;
    if (message) body.message = message;

    try {
      const res = await fetch("/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: ChatbotReply = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
      setChoices(Array.isArray(data.choices) ? data.choices : []);

      // 게시글 작성 이동 신호에 대응
      if (data.reply === "게시글을 작성하기 위해 이동합니다.") {
        // TODO: 게시글 작성 화면으로 이동하거나, data를 폼 프리필에 사용
        // 예) router.push('/articles/new?prefill=' + encodeURIComponent(JSON.stringify(data.data)));
        console.log("게시글 작성 이동 데이터:", data.data);
      }
    } catch (err) {
      setErrorMsg("서버 통신 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "오류가 발생했어요. 잠시 후 다시 시도해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 입력창 전송 → AWAITING_DESCRIPTION/OTHER 등에서 message 전송
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    await sendIntent(undefined, trimmed);
  };

  // 선택지 클릭 → IDLE에서 intent 전송
  const handleChoiceClick = async (choice: string) => {
    if (loading) return;
    setMessages((prev) => [...prev, { role: "user", content: choice }]);
    await sendIntent(choice);
  };

  const healthBadge = useMemo(() => {
    if (!health) return null;
    return (
      <span
        className={`ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
          health.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
        title={health.time}
      >
        ● {health.ok ? "online" : "offline"}
      </span>
    );
  }, [health]);

  return (
    <>
      {/* (선택) 내부 열기 버튼 — 외부에서 autoOpen이면 필요 없음
      <section className="fixed bottom-[96px] left-[calc(50%+125px)] z-50">
        <button
          onClick={openModal}
          className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Open chatbot"
        >
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
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">찾아줘 챗봇</h2>
                {healthBadge}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="챗봇 닫기"
              >
                ✖
              </button>
            </div>

            {/* 메시지 영역 */}
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

              {/* 서버에서 내려준 choices */}
              {choices.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {choices.map((c) => (
                    <button
                      key={c}
                      disabled={loading}
                      onClick={() => handleChoiceClick(c)}
                      className="px-3 py-1.5 rounded-full text-sm border border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {/* 에러 메시지 */}
              {errorMsg && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {errorMsg}
                </div>
              )}
            </div>

            {/* 입력창 */}
            <div className="flex items-center border-t px-3 pt-3">
              <input
                type="text"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="ml-2 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full disabled:opacity-60"
              >
                {loading ? "..." : "전송"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}