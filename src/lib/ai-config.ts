interface ProviderConfig {
  endpoint: string;
  apiKey: string;
  models: {
    chat: string[];
    vision: string[];
    translate: string[];
    enhance: string[];
    analyze: string[];
  };
}

function getProviders(): ProviderConfig[] {
  const providers: ProviderConfig[] = [];

  // AI_API_KEY (unified — e.g. DOUGH.ID, OpenRouter, or custom proxy)
  const unifiedKey = process.env.AI_API_KEY || "";
  if (unifiedKey) {
    const endpoint = process.env.AI_ENDPOINT || "https://api.openai.com/v1";
    providers.push({
      endpoint,
      apiKey: unifiedKey,
      models: {
        chat: [
          process.env.AI_CHAT_MODEL || "groq/llama-3.3-70b-versatile",
          "groq/qwen/qwen3-32b",
        ],
        vision: [
          process.env.AI_VISION_MODEL || "mimo/mimo-v2-omni",
        ],
        translate: [
          process.env.AI_TRANSLATE_MODEL || "groq/llama-3.3-70b-versatile",
          "groq/qwen/qwen3-32b",
        ],
        enhance: [
          process.env.AI_ENHANCE_MODEL || "groq/llama-3.3-70b-versatile",
          "groq/qwen/qwen3-32b",
        ],
        analyze: [
          process.env.AI_ANALYZE_MODEL || "groq/llama-3.3-70b-versatile",
          "groq/qwen/qwen3-32b",
        ],
      },
    });
  }

  // Groq (primary)
  const groqKey = process.env.GROQ_API_KEY || "";
  if (groqKey) {
    providers.push({
      endpoint: "https://api.groq.com/openai/v1",
      apiKey: groqKey,
      models: {
        chat: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
        vision: ["llama-3.2-11b-vision-preview"],
        translate: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
        enhance: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
        analyze: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
      },
    });
  }

  // OpenAI (fallback)
  const openaiKey = process.env.OPENAI_API_KEY || "";
  if (openaiKey) {
    providers.push({
      endpoint: "https://api.openai.com/v1",
      apiKey: openaiKey,
      models: {
        chat: ["gpt-4o-mini", "gpt-4o"],
        vision: ["gpt-4o-mini", "gpt-4o"],
        translate: ["gpt-4o-mini", "gpt-4o"],
        enhance: ["gpt-4o-mini", "gpt-4o"],
        analyze: ["gpt-4o-mini", "gpt-4o"],
      },
    });
  }

  return providers;
}

function getModelFor(providers: ProviderConfig[], task: keyof ProviderConfig["models"]): string | null {
  for (const p of providers) {
    if (p.models[task]?.[0]) return p.models[task][0];
  }
  return null;
}

function getProviderFor(providers: ProviderConfig[], task: keyof ProviderConfig["models"]): ProviderConfig | null {
  for (const p of providers) {
    if (p.models[task]?.[0]) return p;
  }
  return null;
}

export async function aiChat(
  messages: { role: string; content: string }[],
  opts?: { model?: string; json?: boolean }
): Promise<string> {
  const providers = getProviders();
  if (providers.length === 0) {
    throw new Error("No AI provider configured. Set GROQ_API_KEY or OPENAI_API_KEY in environment variables.");
  }

  const task = "chat";
  const preferredModel = opts?.model;
  const errors: string[] = [];

  for (const provider of providers) {
    const models = preferredModel ? [preferredModel, ...provider.models[task]] : provider.models[task];

    for (const model of models) {
      const body: Record<string, unknown> = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096,
      };
      if (opts?.json) body.response_format = { type: "json_object" };

      try {
        const res = await fetch(`${provider.endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        }

        const errText = await res.text();
        const skipErrors = ["decommissioned", "not found", "model_not_found", "invalid_model"];
        const shouldSkip = skipErrors.some(s => errText.toLowerCase().includes(s));
        if (!shouldSkip) {
          errors.push(`${provider.endpoint} (${model}): ${res.status} ${errText.substring(0, 150)}`);
          // If it's an auth error (401), skip this provider entirely
          if (res.status === 401) break;
        }
      } catch (fetchErr) {
        errors.push(`${provider.endpoint} (${model}): ${fetchErr instanceof Error ? fetchErr.message : "fetch failed"}`);
      }
    }
  }

  throw new Error(
    `All AI providers failed:\n${errors.join("\n")}\n\nMake sure your API keys are valid. If using Groq, your key should start with "gsk_".`
  );
}

export async function aiVision(
  base64Image: string,
  prompt: string,
  opts?: { model?: string }
): Promise<string> {
  const providers = getProviders();
  if (providers.length === 0) {
    throw new Error("No AI provider configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
  }

  const preferredModel = opts?.model;
  const errors: string[] = [];

  for (const provider of providers) {
    const models = preferredModel ? [preferredModel, ...provider.models.vision] : provider.models.vision;

    for (const model of models) {
      try {
        const res = await fetch(`${provider.endpoint}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
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

        if (res.ok) {
          const data = await res.json();
          return data.choices?.[0]?.message?.content || "";
        }

        const errText = await res.text();
        const skipErrors = ["decommissioned", "not found", "model_not_found"];
        if (!skipErrors.some(s => errText.toLowerCase().includes(s))) {
          errors.push(`${provider.endpoint} (${model}): ${res.status} ${errText.substring(0, 150)}`);
          if (res.status === 401) break;
        }
      } catch (fetchErr) {
        errors.push(`${provider.endpoint} (${model}): ${fetchErr instanceof Error ? fetchErr.message : "fetch failed"}`);
      }
    }
  }

  throw new Error(`All AI vision providers failed:\n${errors.join("\n")}`);
}

export async function testAIConfig(): Promise<{
  ok: boolean;
  providers: number;
  groqKey: boolean;
  openaiKey: boolean;
  message: string;
}> {
  const providers = getProviders();
  const groqKey = !!(process.env.GROQ_API_KEY || process.env.AI_API_KEY);
  const openaiKey = !!process.env.OPENAI_API_KEY;

  if (providers.length === 0) {
    return {
      ok: false,
      providers: 0,
      groqKey,
      openaiKey,
      message: "No AI provider keys found. Set GROQ_API_KEY or OPENAI_API_KEY in Vercel environment variables.",
    };
  }

  try {
    await aiChat([{ role: "user", content: "Say OK" }]);
    return {
      ok: true,
      providers: providers.length,
      groqKey,
      openaiKey,
      message: "AI is working. Providers configured: " + providers.length,
    };
  } catch (err) {
    return {
      ok: false,
      providers: providers.length,
      groqKey,
      openaiKey,
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
