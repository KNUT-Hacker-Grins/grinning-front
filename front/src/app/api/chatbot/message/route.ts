// /src/app/api/chatbot/message/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || "https://cheetahsmiling.duckdns.org";
const SESSION_COOKIE_KEY = "chat_session_id";

export async function POST(req: NextRequest) {
  console.log('=== API Route 시작 ===');
  
  try {
    const requestBody = await req.json();
    console.log('1. 받은 요청:', requestBody);
    
    const { intent, message } = requestBody;

    const jar = await cookies();
    let sessionId = jar.get(SESSION_COOKIE_KEY)?.value;
    console.log('2. 현재 세션 ID:', sessionId);

    let isNewSession = false;

    // 1) 세션 없으면 health로 발급
    if (!sessionId) {
      console.log('세션이 없어서 새로 생성 중...');
      const healthRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      console.log('Health 요청 상태:', healthRes.status);
      
      if (!healthRes.ok) {
        const healthError = await healthRes.text().catch(() => "");
        console.log('Health 요청 실패:', healthError);
        throw new Error(`Health HTTP ${healthRes.status}: ${healthError}`);
      }
      
      const healthJson = await healthRes.json();
      console.log('Health 응답:', healthJson);
      
      sessionId = healthJson.session_id || crypto.randomUUID();
      isNewSession = true;
      console.log('새 세션 생성됨:', sessionId);
    }

    // 2) Django에 프록시
    console.log('3. Django 요청 전송:', {
      url: `${DJANGO_BASE_URL}/api/chatbot/message`,
      body: { session_id: sessionId, intent, message }
    });

    const upRes = await fetch(`${DJANGO_BASE_URL}/api/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, intent, message }),
    });

    console.log('4. Django 응답 상태:', upRes.status);
    console.log('5. Django 응답 헤더:', Object.fromEntries(upRes.headers.entries()));

    if (!upRes.ok) {
      const errorText = await upRes.text().catch(() => "");
      console.log('6. Django 에러 응답 원본:', errorText);
      throw new Error(`Django HTTP ${upRes.status}: ${errorText}`);
    }

    const data = await upRes.json();
    console.log('7. Django 성공 응답:', data);

    // 3) 그대로 반환, 세션 쿠키 새로 발급 시 쿠키 설정
    const resp = NextResponse.json(data);

    if (isNewSession) {
      console.log('새 세션 쿠키 설정:', sessionId);
      resp.cookies.set(SESSION_COOKIE_KEY, sessionId!, {
        httpOnly: false,    
        sameSite: "lax",   
        secure: false,     
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    console.log('=== API Route 성공 완료 ===');
    return resp;

  } catch (err: any) {
    console.log('=== API Route 에러 ===');
    console.log('에러 타입:', typeof err);
    console.log('에러 메시지:', err.message);
    console.log('에러 스택:', err.stack);
    console.log('[chatbot/message] DJANGO_BASE_URL =', DJANGO_BASE_URL);
    
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