"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { chatMessageSchema, urlSchema } from "@/lib/validators";
import { getDecryptedCredential } from "./vault";

export async function sendChatMessage(message: string) {
  chatMessageSchema.parse({ message });

  let openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    try {
      openaiKey = await getDecryptedCredential("OPENAI_API_KEY");
    } catch {
      return {
        role: "assistant" as const,
        content: "AI is not configured. Please contact the administrator.",
      };
    }
  }

  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docsDb = supabase.from("documents") as any;
  const { data: relevantDocs } = await docsDb.select("content").limit(3);

  const docs = (relevantDocs as { content: string }[] | null) || [];
  const context = docs.map((d: { content: string }) => d.content).join("\n") || "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are Glory AI, a marketing assistant for Glory For Marketing. 
            Be helpful, professional, and concise. Use the following context about our services:
            ${context || "We offer premium marketing, design, and development services."}
            
            If the user shows buying intent (mentions budget, timeline, or specific project needs),
            politely ask for their contact information to have a team member reach out.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
    return { role: "assistant" as const, content };
  } catch {
    return {
      role: "assistant" as const,
      content: "I'm having trouble connecting. Please try again later.",
    };
  }
}

export async function analyzeWebsite(url: string) {
  urlSchema.parse(url);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a website auditor. Analyze the following website URL and provide a 
              professional audit report covering: performance suggestions, UX improvements, SEO observations, 
              and design recommendations. Format as structured JSON with keys: 
              score (0-100), performance (array), ux (array), seo (array), design (array), summary (string).`,
          },
          { role: "user", content: `Analyze this website: ${url}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch {
    throw new Error("Failed to analyze website");
  }
}
