// /src/app/api/chatbot/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


const DJANGO_BASE_URL = "https://cheetahsmiling.duckdns.org";
const SESSION_COOKIE_KEY = "chatbot_session_id";

export async function POST(req: NextRequest) {
  try {
    const { intent, message } = await req.json();

    const jar = await cookies();
    let sessionId = jar.get(SESSION_COOKIE_KEY)?.value;

    let isNewSession = false;

    // 1) 세션 없으면 health로 발급
    if (!sessionId) {
      const healthRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!healthRes.ok) throw new Error(`Health HTTP ${healthRes.status}`);
      const healthJson = await healthRes.json();
      sessionId = healthJson.session_id || crypto.randomUUID();
      isNewSession = true;
    }

    // 2) Django에 프록시 (⚠️ 슬래시 삭제)
    const upRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, intent, message }),
    });

    if (!upRes.ok) {
      const text = await upRes.text().catch(() => "");
      throw new Error(`Upstream HTTP ${upRes.status}: ${text}`);
    }

    const data = await upRes.json();

    // 3) 그대로 반환, 세션 쿠키 새로 발급 시 쿠키 설정
    const resp = NextResponse.json(data);

    if (isNewSession) {
      resp.cookies.set(SESSION_COOKIE_KEY, sessionId!, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return resp;
  } catch (err: any) {
    console.error("message route error:", err?.message || err);
    console.log("[chatbot/message] DJANGO_BASE_URL =", process.env.DJANGO_BASE_URL)
    return NextResponse.json(
      {
        session_id: "dev",
        state: "idle",
        reply: `오류가 발생했어요. 잠시 후 다시 시도해 주세요.`,
        choices: ["분실물 찾기", "분실물 신고", "기타 문의"],
        recommendations: [],
        data: {},
      },
      { status: 200 } // 필요 시 500으로 바꾸고 디버깅 끝나면 200 복구
    );
  }
}