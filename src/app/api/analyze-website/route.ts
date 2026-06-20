import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai-config";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const content = await aiChat(
      [
        {
          role: "system",
          content: `You are a professional website auditor. Analyze the given website URL and provide a comprehensive audit report.

Return ONLY valid JSON with these exact keys:
- score (number 0-100)
- performance (array of strings - performance suggestions)
- ux (array of strings - UX improvements)
- seo (array of strings - SEO observations)
- design (array of strings - design recommendations)
- competitors (array of strings - competitor insights)
- social (array of strings - social media presence evaluation)
- summary (string - overall assessment in 1-2 sentences)

Be specific, actionable, and professional. If you cannot actually visit the URL, provide analysis based on common best practices and what can be inferred from the URL structure.`,
        },
        { role: "user", content: `Analyze this website: ${url}` },
      ],
      { json: true, model: "llama-3.3-70b-versatile" }
    );

    if (!content) {
      return NextResponse.json({ error: "No analysis from AI" }, { status: 502 });
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
