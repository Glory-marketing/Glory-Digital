export interface AIModelConfig {
  endpoint: string;
  apiKey: string;
  models: {
    chat: string;
    vision: string;
    translate: string;
    enhance: string;
    analyze: string;
  };
}

const DEFAULT_CONFIG: AIModelConfig = {
  endpoint: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
  models: {
    chat: "llama-3.3-70b-versatile",
    vision: "llama-3.2-11b-vision-preview",
    translate: "llama-3.3-70b-versatile",
    enhance: "llama-3.3-70b-versatile",
    analyze: "llama-3.3-70b-versatile",
  },
};

let cachedConfig: AIModelConfig | null = null;

export function getAIConfig(): AIModelConfig {
  if (cachedConfig) return cachedConfig;
  cachedConfig = { ...DEFAULT_CONFIG };

  if (process.env.AI_ENDPOINT) cachedConfig.endpoint = process.env.AI_ENDPOINT;
  if (process.env.AI_API_KEY) cachedConfig.apiKey = process.env.AI_API_KEY;
  if (process.env.AI_CHAT_MODEL) cachedConfig.models.chat = process.env.AI_CHAT_MODEL;
  if (process.env.AI_VISION_MODEL) cachedConfig.models.vision = process.env.AI_VISION_MODEL;
  if (process.env.AI_TRANSLATE_MODEL) cachedConfig.models.translate = process.env.AI_TRANSLATE_MODEL;
  if (process.env.AI_ENHANCE_MODEL) cachedConfig.models.enhance = process.env.AI_ENHANCE_MODEL;
  if (process.env.AI_ANALYZE_MODEL) cachedConfig.models.analyze = process.env.AI_ANALYZE_MODEL;

  return cachedConfig;
}

export async function aiChat(
  messages: { role: string; content: string }[],
  opts?: { model?: string; json?: boolean }
): Promise<string> {
  const cfg = getAIConfig();
  const model = opts?.model || cfg.models.chat;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
  };
  if (opts?.json) body.response_format = { type: "json_object" };

  const res = await fetch(`${cfg.endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function aiVision(
  base64Image: string,
  prompt: string,
  opts?: { model?: string }
): Promise<string> {
  const cfg = getAIConfig();
  const model = opts?.model || cfg.models.vision;

  const res = await fetch(`${cfg.endpoint}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI Vision API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}
