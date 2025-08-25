"use client";
import { useState, useEffect, useRef } from "react";
import { Message, HealthRes, ChatbotReply } from "@/types/chatbot";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function useChatbot(isOpen: boolean) {
  const router = useRouter();
  const [input, setInput] = useState(""); // 입력창 텍스트
  const [messages, setMessages] = useState<Message[]>([]); // 대화 기록
  const [choices, setChoices] = useState<string[]>([]); // 서버에서 내려준 선택지 버튼들
  const [health, setHealth] = useState<HealthRes | null>(null); // 서버 헬스체크 상태
  const [loading, setLoading] = useState(false); // 서버 요청 중 여부
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // 에러 메시지
  const lastDescRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null); // 스크롤 div 참조

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

      // 게시글 작성 이동 신호
      if (data.reply === "게시글을 작성하기 위해 이동합니다.") {
        console.log("게시글 작성 이동 데이터:", data.data);
        router.push("/register/found");
      }

      return data; // 호출부에서 응답 활용
    } catch (err) {
      setErrorMsg("서버 통신 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "오류가 발생했어요. 잠시 후 다시 시도해 주세요." },
      ]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // UI에 사용자 입력 먼저 추가
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    // 입력창 비움 + 마지막 설명 저장
    setInput("");
    lastDescRef.current = trimmed;

    // 1) 서버에 message로 전달하여 응답 받기
    const result = await sendIntent(undefined, trimmed);

    if (!result) return;

    // 1) 추천 배열 가져오기
    const recs = Array.isArray((result as any)?.recommendations)
      ? (result as any).recommendations
      : [];

    // 2) 추천이 있으면 바로 갤러리 메시지로 붙이기
    if (recs.length > 0) {
      setMessages((prev: any[]) => [
        ...prev,
        {
          role: "bot",
          kind: "gallery",
          note: "이 항목들이 비슷해 보여요 🙂",
          cards: recs.map((r: any) => ({
            id: r.id,
            title: r.title ?? r.description ?? "항목",
            imageUrl:
              Array.isArray(r.image_urls) && r.image_urls.length > 0
                ? r.image_urls[0]
                : "/placeholder.png",
            categoryId: undefined, // 지금 백엔드는 category_id를 주지 않음
            categoryLabel:
              Array.isArray(r.category) && r.category[0]?.label
                ? r.category[0].label
                : undefined,
          })),
        },
      ]);
      // 필요하면 여기서 끝. (원한다면 추가로 카테고리별 전체목록도 불러올 수 있음)
    }
  };

  const handleChoiceClick = async (choice: string) => {
    if (loading) return;

    setMessages((prev) => [...prev, { role: "user", content: choice }]);

    if (choice === "🔍 검색하기") {
      const payload = (lastDescRef.current || "").trim();

      if (payload) {
        const result = await sendIntent(undefined, payload);
        // 필요시 result.data 사용
        // 검색 결과 페이지로 이동(쿼리 붙여도 됨)
        router.push("/found-item");
      } else {
        const result = await sendIntent(choice);
        router.push("/found-item");
      }
    } else {
      await sendIntent(choice);
    }
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