import { NextRequest, NextResponse } from "next/server";
import { sendChatMessage } from "@/server-actions/ai";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(getRateLimitKey(ip, "chat"), 20, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  try {
    const { message } = await request.json();
    const result = await sendChatMessage(message);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
