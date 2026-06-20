import { NextResponse } from "next/server";
import { testAIConfig } from "@/lib/ai-config";

export async function GET() {
  const result = await testAIConfig();
  return NextResponse.json(result);
}
