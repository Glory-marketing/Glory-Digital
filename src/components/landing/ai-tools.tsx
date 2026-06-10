"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface AnalyzerResult {
  score: number;
  performance: string[];
  ux: string[];
  seo: string[];
  design: string[];
  summary: string;
}

export function AITools({ visible }: { visible: boolean }) {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");

  if (!visible) return null;

  const handleAnalyze = async () => {
    if (!url) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data && typeof data.score === "number") {
        setResult(data);
        setShowModal(true);
      }
    } catch {
      // handle error
    }
    setAnalyzing(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.error || data.content || "..." }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: chatInput.match(/[\u0600-\u06FF]/) ? "عذراً، غير متاح حالياً." : "Sorry, I'm unavailable right now." },
      ]);
    }
  };

  return (
    <>
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold text-white">
              AI <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Tools</span>
            </h2>
          </motion.div>

          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-white/5 bg-[#121212] p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Free Website Audit
              </h3>
              <p className="mb-6 text-sm text-gray-400">
                Get a free AI-powered analysis of your website&apos;s performance,
                UX, SEO, and design.
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Enter your website URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal open={showModal} onClose={() => setShowModal(false)} className="max-w-2xl">
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Audit Report</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Score:</span>
                <span className="text-2xl font-bold text-[#FCF6BA]">{result.score}/100</span>
              </div>
            </div>

            <p className="text-sm text-gray-300">{result.summary}</p>

            {[
              { label: "Performance", items: result.performance },
              { label: "UX", items: result.ux },
              { label: "SEO", items: result.seo },
              { label: "Design", items: result.design },
            ].map((section) => (
              <div key={section.label}>
                <h4 className="mb-2 font-medium text-[#BF953F]">{section.label}</h4>
                <ul className="space-y-1">
                  {section.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#BF953F]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex justify-end">
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Chatbot FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/20 transition-all hover:scale-105"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <Modal open={chatOpen} onClose={() => setChatOpen(false)}>
        <div className="flex h-[500px] flex-col">
          <div className="mb-4 border-b border-white/10 pb-4">
            <h3 className="text-lg font-semibold text-white">Glory AI Assistant</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 px-1">
            {chatMessages.length === 0 && (
              <div className="text-center text-sm text-gray-500 pt-8">
                Hello! I'm Glory AI. How can I help you today?
              </div>
            )}
            {chatMessages.map((msg, i) => (
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
              placeholder="Ask me anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChat()}
            />
            <Button onClick={handleChat}>Send</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
