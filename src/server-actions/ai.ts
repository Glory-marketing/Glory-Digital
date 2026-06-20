"use server";

import { chatMessageSchema, urlSchema } from "@/lib/validators";
import { aiChat } from "@/lib/ai-config";

export async function sendChatMessage(message: string) {
  chatMessageSchema.parse({ message });

  try {
    const content = await aiChat([
      {
        role: "system",
        content: `You are Glory AI, the friendly assistant of Glory Agency (Advertising & Marketing) — وكالة جلوري (دعاية وإعلان وتسويق). Your personality is warm, witty, and genuine — like a talented friend who happens to know everything about advertising and marketing.

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

  const content = await aiChat(
    [
      {
        role: "system",
        content: `You are a professional website auditor. Analyze the following website URL and provide a comprehensive audit report. Include:
- Overall score (0-100)
- Performance suggestions
- UX improvements
- SEO observations
- Design recommendations
- Competitor insights
- Social media presence evaluation

Return ONLY valid JSON with these exact keys:
score (number), performance (string[]), ux (string[]), seo (string[]), design (string[]), competitors (string[]), social (string[]), summary (string).`,
      },
      { role: "user", content: `Analyze this website thoroughly: ${url}` },
    ],
    { json: true }
  );

  if (!content) throw new Error("No content from AI");
  return JSON.parse(content);
}
