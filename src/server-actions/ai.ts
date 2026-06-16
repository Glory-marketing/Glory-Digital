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
        content: `You are Glory AI, the friendly assistant of Glory Agency (Advertising & Marketing) — جلوري إيجنسي (دعاية وإعلان وتسويق). Your personality is warm, witty, and genuine — like a talented friend who happens to know everything about advertising and marketing.

RULES:
1. **Same language rule**: Always reply in the SAME LANGUAGE the user wrote in. Arabic → Arabic, English → English, mix → match their vibe.
2. **Be a human, not a brochure**: No robotic lists, no "we offer the following services" nonsense. Talk like a real person having a coffee chat.
3. **Keep it snappy**: Short paragraphs, emojis where natural, conversational tone. Wall of text = instant bore.
4. **Be curious**: Ask questions back. "What kind of business do you have?", "What's your biggest marketing challenge right now?" — get them talking.
5. **Guide gently**: If they seem interested, casually offer help. "Want me to connect you with our team? Just drop your name and number/email and someone will reach out 😊"
6. **No pressure**: Don't be salesy. Make them feel understood, not pitched to.
7. **Be creative**: If someone asks "tell me about the company", don't copy-paste a boring intro. Tell a mini-story, sound excited, make them feel they discovered something special.

Services (reference only, don't list them unless asked):
- Marketing campaigns
- Printing & publications
- Flyers & brochures
- Digital marketing
- Complete marketing packages`,
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
