// /src/app/api/chatbot/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || "https://cheetahsmiling.duckdns.org";
const SESSION_COOKIE_KEY = "chat_session_id";

export async function POST(req: NextRequest) {
  try {
    const { intent, message } = await req.json();

    const jar = await cookies();
    let sessionId = jar.get(SESSION_COOKIE_KEY)?.value;

    let isNewSession = false;

    // 1) 세션 없으면 health로 발급
    if (!sessionId) {
      console.log('No session found, creating new session...');
      const healthRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!healthRes.ok) throw new Error(`Health HTTP ${healthRes.status}`);
      const healthJson = await healthRes.json();
      sessionId = healthJson.session_id || crypto.randomUUID();
      isNewSession = true;
      console.log('New session created:', sessionId);
    }

    // 디버깅을 위한 로그 추가
    console.log('Session ID:', sessionId);
    console.log('Sending data to Django:', { session_id: sessionId, intent, message });

    // 2) Django에 프록시
    const upRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, intent, message }),
    });

    console.log('Django response status:', upRes.status);

    if (!upRes.ok) {
      const text = await upRes.text().catch(() => "");
      console.error('Django error response:', text);
      throw new Error(`Upstream HTTP ${upRes.status}: ${text}`);
    }

    const data = await upRes.json();
    console.log('Django response data:', data);

    // 3) 그대로 반환, 세션 쿠키 새로 발급 시 쿠키 설정
    const resp = NextResponse.json(data);

    if (isNewSession) {
      console.log('Setting new session cookie:', sessionId);
      resp.cookies.set(SESSION_COOKIE_KEY, sessionId!, {
        httpOnly: false,    // Django와 일치하도록 수정
        sameSite: "lax",   
        secure: false,     
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return resp;
  } catch (err: any) {
    console.error("message route error:", err?.message || err);
    console.error("Full error:", err);
    console.log("[chatbot/message] DJANGO_BASE_URL =", DJANGO_BASE_URL);
    
    // 에러 발생 시에도 유효한 세션 ID 반환
    const jar = await cookies();
    const currentSessionId = jar.get(SESSION_COOKIE_KEY)?.value || "dev";
    
    return NextResponse.json(
      {
        session_id: currentSessionId,
        state: "idle",
        reply: `오류가 발생했어요. 잠시 후 다시 시도해 주세요.`,
        choices: ["분실물 찾기", "분실물 신고", "기타 문의"],
        recommendations: [],
        data: {},
      },
      { status: 200 }
    );
  }
}