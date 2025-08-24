import { NextResponse } from "next/server";

// GET /api/chatbot/health
export async function GET() {
  return NextResponse.json({
    ok: true,
    time: new Date().toISOString(),
  });
}