import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 });
    }

    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert advertising & marketing analyst for Glory Agency (وكالة جلوري). Analyze this image and respond in STRICT JSON format with NO markdown, NO code fences, just raw JSON:

{
  "category": "one of: marketing, printing, flyers, digital, full",
  "title_en": "professional english title for this design/project",
  "title_ar": "title in Egyptian Arabic (مصري)",
  "description_en": "detailed english description (1-2 sentences)",
  "description_ar": "detailed description in Egyptian Arabic (مصري)، كأنك بتشرح لعميل",
  "tags": ["relevant", "tags", "in", "english"],
  "search_query": "google search terms to find similar designs"
}

Rules:
- Category must be one of: marketing, printing, flyers, digital, full
- If it looks like a print design (cards, banners, rollups) → printing or flyers
- If it looks like a digital/social media design → marketing or digital
- If it's a brand identity/logo/ux → digital
- If it's a complete campaign → full
- Titles and descriptions MUST be in Egyptian Arabic dialect (عامية مصرية) for the _ar fields
- Be descriptive but concise`,
              },
              {
                type: "image_url",
                image_url: { url: dataUrl },
              },
            ],
          },
        ],
        max_tokens: 600,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Groq vision error: ${err.substring(0, 200)}` }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No analysis from AI" }, { status: 502 });
    }

    let parsed;
    try {
      const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "AI response was not valid JSON", raw: content }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to analyze image" },
      { status: 500 }
    );
  }
}
