import { NextRequest, NextResponse } from "next/server";
import { analyzeWebsite } from "@/server-actions/ai";
import { rateLimit, getRateLimitKey } from "@/lib/rate-limit";

const analysisCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const { allowed } = rateLimit(getRateLimitKey(ip, "analyze"), 5, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  try {
    const { url } = await request.json();

    const cached = analysisCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const result = await analyzeWebsite(url);
    analysisCache.set(url, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}
