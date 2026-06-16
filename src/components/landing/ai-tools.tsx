"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useTranslations, useLocale } from "next-intl";

interface AnalyzerResult {
  score: number;
  performance: string[];
  ux: string[];
  seo: string[];
  design: string[];
  summary: string;
}

export function AITools({ visible }: { visible: boolean }) {
  const tAna = useTranslations("analyzer");
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [showModal, setShowModal] = useState(false);

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
        alert(tAna("error") || "Analysis failed. Please try again.");
      }
      setAnalyzing(false);
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
                {tAna("title")}
              </h3>
              <p className="mb-6 text-sm text-gray-400">
                Get a free AI-powered analysis of your website&apos;s performance,
                UX, SEO, and design.
              </p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={tAna("placeholder")}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={analyzing}>
                  {analyzing ? tAna("analyzing") : tAna("submit")}
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
              <h3 className="text-xl font-bold text-white">{tAna("audit_report")}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{tAna("score")}:</span>
                <span className="text-2xl font-bold text-[#FCF6BA]">{result.score}/100</span>
              </div>
            </div>

            <p className="text-sm text-gray-300">{result.summary}</p>

            {[
              { label: tAna("performance"), items: result.performance },
              { label: tAna("ux"), items: result.ux },
              { label: tAna("seo"), items: result.seo },
              { label: tAna("design"), items: result.design },
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
              <Button onClick={() => setShowModal(false)}>{tAna("close")}</Button>
            </div>
          </div>
        )}
      </Modal>


    </>
  );
}
