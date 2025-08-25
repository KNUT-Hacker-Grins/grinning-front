"use client";
import { useState, useEffect, useRef } from "react";
import { Message, HealthRes, ChatbotReply } from "@/types/chatbot";
import { useRouter } from "next/navigation";

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
  // message 또는 choice가 바뀔 때마다 스크롤을 맨 아래로 이동
  // 새 메시지가 생기면 항상 최신 대화가 보이도록 함

  useEffect(() => {
    // 컴포넌트(혹은 훅)가 렌더링된 뒤 부수효과를 실행하는 React 훅 시작
    if (!isOpen) return;
    // 모달이 닫혀 있으면 아래 로직을 실행하지 않음
    // useEffect는 컴포넌트가 렌더링될 때마다 실행 -> 불필요한 api 요청이 있을 수 있음
    (async () => {
      try {
        const res = await fetch("/api/chatbot/health", { method: "GET" });
        // 엔드포인트로 헬스 체크 요청 전송
        const json: HealthRes = await res.json();
        // JSON으로 파싱해서 HealthRes 타입으로 받음
        setHealth(json);
        // 파싱된 헬스 정보를 저장 헤더의 on/off 배지 값
      } catch {
        setHealth({ ok: false, time: new Date().toISOString() });
      } // 예외 상황 시 오프라인으로 간주
    })();

    setMessages([{ role: "bot", content: "안녕하세요! 무엇을 도와드릴까요?" }]);
    // 봇의 인사 메시지
    setChoices(["분실물 찾기", "분실물 신고", "기타 문의"]);
    // 초기 선택지 버튼
    setErrorMsg(null);
    // 이전에 남아있을 수 있는 에러 메시지 초기화
  }, [isOpen]); // 닫았다가 다시 열면 인사 선택지가 재설정됨

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

      return data; // ✅ 호출부에서 응답 활용
    } catch (err) {
      setErrorMsg("서버 통신 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "오류가 발생했어요. 잠시 후 다시 시도해 주세요." },
      ]);
      return null; // ✅ 실패 시 null
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    // 문자열 앞 뒤 공백 모두 제거
    if (!trimmed || loading) return;
    // 공백이거나 로딩 주이면 무시
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    // 메시지를 화면에 먼저 추가
    setInput("");
    // 입력창 비움
    lastDescRef.current = trimmed;
    await sendIntent(undefined, trimmed);
    // 서버에 전달
  };

  const handleChoiceClick = async (choice: string) => {
    if (loading) return;

    // UI에 사용자 선택 추가
    setMessages((prev) => [...prev, { role: "user", content: choice }]);

    if (choice === "🔍 검색하기") {
      const payload = (lastDescRef.current || "").trim();

      // 1) 서버에 요청
      const result = payload
        ? await sendIntent(undefined, payload)   // 마지막 설명을 message로 전송
        : await sendIntent(choice);              // 설명이 없으면 intent로 전송(서버가 안내)

      // 2) 응답에서 카테고리 ID들 추출 (두 형태 모두 지원)
      let ids: number[] = [];

      // (A) data.category_ids 또는 data.data.category_ids
      const fromData = (result as any)?.data?.category_ids ?? (result as any)?.category_ids;
      if (Array.isArray(fromData)) {
        ids = fromData
          .map((v: any) => Number(v))
          .filter((n: number) => Number.isFinite(n));
      }

      // (B) recommendations 배열에 category_id가 들어있는 경우
      if ((!ids || ids.length === 0) && Array.isArray((result as any)?.recommendations)) {
        ids = ((result as any)?.recommendations || [])
          .map((r: any) => Number(r?.category_id))
          .filter((n: number) => Number.isFinite(n));
      }

      // 3) 라우팅: 카테고리 ID가 있으면 쿼리로 전달
      if (ids && ids.length > 0) {
        const qs = `?cats=${encodeURIComponent(ids.join(","))}`;
        router.push(`/found-item${qs}`);
      } else {
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
