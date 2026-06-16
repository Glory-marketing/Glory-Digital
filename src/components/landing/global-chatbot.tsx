"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function GlobalChatbot() {
  const t = useTranslations("chatbot");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.error || data.content || "..." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: t("sorry_unavailable") }]);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#BF953F]/30"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex h-[500px] flex-col">
          <div className="mb-4 border-b border-white/10 pb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{t("title")}</h3>
            <span className="text-xs text-[#BF953F]">✦ AI</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 px-1" style={{ direction: locale === "ar" ? "rtl" : "ltr" }}>
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-500 pt-8">
                {t("greeting")}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-[#BF953F] text-black"
                      : "bg-white/5 text-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              placeholder={t("placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
            />
            <Button onClick={handleSend}>{t("send")}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
