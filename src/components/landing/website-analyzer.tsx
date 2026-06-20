"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

interface AnalysisResult {
  score: number;
  performance: string[];
  ux: string[];
  seo: string[];
  design: string[];
  competitors: string[];
  social: string[];
  summary: string;
}

export function WebsiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const locale = useLocale();

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80 ? "text-green-400" : s >= 50 ? "text-yellow-400" : "text-red-400";

  const renderList = (items: string[], title: string, icon: string) => (
    <div className="rounded-xl border border-white/5 bg-[#121212] p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-lg">{icon}</span> {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-400">
            <span className="mt-0.5 shrink-0 text-[#BF953F]">◆</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  const isRtl = locale === "ar";

  return (
    <section className="py-24" dir={isRtl ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
              {isRtl ? "تحليل المواقع" : "Website Analysis"}
            </span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {isRtl
              ? "حلل أي موقع منافس أو موقعك واحصل على تقرير محترف"
              : "Analyze any website and get a professional audit report"}
          </p>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder={isRtl ? "https://example.com" : "https://example.com"}
              onKeyDown={e => e.key === "Enter" && handleAnalyze()}
              className="flex-1 rounded-xl border border-white/10 bg-[#121212] px-5 py-3 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !url.trim()}
              className="rounded-xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-6 py-3 text-sm font-semibold text-black transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading
                ? isRtl ? "جارٍ التحليل..." : "Analyzing..."
                : isRtl ? "حلل" : "Analyze"}
            </button>
          </div>

          {loading && (
            <div className="mt-8 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Score */}
              <div className="flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#BF953F]/30">
                  <div className={`text-3xl font-bold ${scoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#BF953F] text-xs font-bold text-black">
                      {result.score >= 80 ? "A" : result.score >= 60 ? "B" : "C"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm leading-relaxed text-gray-300">{result.summary}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {renderList(result.performance, isRtl ? "الأداء" : "Performance", "⚡")}
                {renderList(result.ux, isRtl ? "تجربة المستخدم" : "UX", "🎯")}
                {renderList(result.seo, "SEO", "🔍")}
                {renderList(result.design, isRtl ? "التصميم" : "Design", "🎨")}
                {renderList(result.competitors, isRtl ? "المنافسون" : "Competitors", "🏆")}
                {renderList(result.social, isRtl ? "السوشيال ميديا" : "Social Media", "📱")}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
