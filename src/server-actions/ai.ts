"use server";

import { chatMessageSchema, urlSchema } from "@/lib/validators";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "qwen/qwen3-32b"];

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

async function chatWithAI(messages: { role: string; content: string }[], preferredModel?: string) {
  const modelsToTry = preferredModel ? [preferredModel, ...GROQ_MODELS] : GROQ_MODELS;

  if (GROQ_API_KEY) {
    for (const model of modelsToTry) {
      const res = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
      if (res.ok) return res.json();
      const errText = await res.text();
      if (!errText.includes("decommissioned") && !errText.includes("not found")) {
        let msg = errText;
        try { const j = JSON.parse(errText); msg = j.error?.message || errText; } catch { /* ignore */ }
        throw new Error(`Groq API error (${res.status}): ${msg.substring(0, 200)}`);
      }
    }
    throw new Error("No available Groq models. Check API key or try again later.");
  }

  if (OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      let msg = err;
      try { const j = JSON.parse(err); msg = j.error?.message || j.error?.code || err; } catch { /* ignore */ }
      throw new Error(`OpenAI API error (${res.status}): ${msg.substring(0, 200)}`);
    }
    return res.json();
  }

  throw new Error("No AI provider configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
}

export async function sendChatMessage(message: string) {
  chatMessageSchema.parse({ message });

  try {
    const data = await chatWithAI([
      {
        role: "system",
        content: `You are Glory AI, the official AI assistant for Glory For Marketing (جلوري للتسويق).
IMPORTANT: Always respond in the SAME LANGUAGE as the user's message. If they write in Arabic, respond in Arabic. If they write in English, respond in English.

We offer these services:
- Marketing campaigns (حملات تسويقية)
- Printing materials (مطبوعات)
- Flyers & brochures (بروشورات وفلائر)
- Digital marketing (تسويق إلكتروني)
- Complete marketing packages (حزم تسويقية متكاملة)

Be professional, warm, and helpful. If the user seems interested in our services, ask for their contact info so our team can follow up.`,
      },
      { role: "user", content: message },
    ]);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return {
        role: "assistant" as const,
        content: message.match(/[\u0600-\u06FF]/)
          ? "عذراً، لم أتمكن من معالجة طلبك. حاول مرة أخرى."
          : "I'm sorry, I couldn't process that. Please try again.",
      };
    }
    return { role: "assistant" as const, content };
  } catch (err) {
    console.error("Chat error:", err);
    return {
      role: "assistant" as const,
      content: message.match(/[\u0600-\u06FF]/)
        ? `عذراً، واجهت مشكلة: ${err instanceof Error ? err.message.substring(0, 100) : "حاول مرة أخرى لاحقاً."}`
        : `Sorry: ${err instanceof Error ? err.message.substring(0, 100) : "Please try again later."}`,
    };
  }
}

export async function analyzeWebsite(url: string) {
  urlSchema.parse(url);

  const data = await chatWithAI(
    [
      {
        role: "system",
        content: `You are a website auditor. Analyze the following website URL and provide a 
          professional audit report covering: performance suggestions, UX improvements, SEO observations, 
          and design recommendations. Format as structured JSON with keys: 
          score (0-100), performance (array), ux (array), seo (array), design (array), summary (string).`,
      },
      { role: "user", content: `Analyze this website: ${url}` },
    ],
    "llama-3.3-70b-versatile"
  );

  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content from AI");
  return JSON.parse(content);
}
