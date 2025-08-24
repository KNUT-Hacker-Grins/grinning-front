"use client";
import { useState, useEffect, useRef } from "react";
import { Message, HealthRes, ChatbotReply } from "@/types/chatbot";

export function useChatbot(isOpen: boolean) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [health, setHealth] = useState<HealthRes | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, choices]);

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

    setMessages([{ role: "bot", content: "안녕하세요! 무엇을 도와드릴까요?" }]);
    setChoices(["분실물 찾기", "분실물 신고", "기타 문의"]);
    setErrorMsg(null);
  }, [isOpen]);

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

      if (data.reply === "게시글을 작성하기 위해 이동합니다.") {
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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    await sendIntent(undefined, trimmed);
  };

  const handleChoiceClick = async (choice: string) => {
    if (loading) return;
    setMessages((prev) => [...prev, { role: "user", content: choice }]);
    await sendIntent(choice);
  };

  return {
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
  };
}
