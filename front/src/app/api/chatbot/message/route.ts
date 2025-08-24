import { NextResponse } from "next/server";

// POST /api/chatbot/message
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const intent = body.intent as string | undefined;
  const message = body.message as string | undefined;

  // intent 예시
  if (intent === "분실물 찾기") {
    return NextResponse.json({
      session_id: "dev",
      state: "awaiting_description",
      reply: "어떤 분실물을 찾고 계신가요? 자세히 알려주세요.",
      choices: [],
      recommendations: [],
      data: {},
    });
  }

  // 일반 메시지 예시
  if (message) {
    return NextResponse.json({
      session_id: "dev",
      state: "other",
      reply: `메시지 확인: ${message}`,
      choices: ["분실물 찾기", "분실물 신고", "기타 문의"],
      recommendations: [],
      data: {},
    });
  }

  // 기본 응답
  return NextResponse.json({
    session_id: "dev",
    state: "idle",
    reply: "무엇을 도와드릴까요?",
    choices: ["분실물 찾기", "분실물 신고", "기타 문의"],
    recommendations: [],
    data: {},
  });
}