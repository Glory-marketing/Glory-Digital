"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const INDUSTRIES = ["Fashion", "Tech", "Food", "Health", "Real Estate", "Other"];

interface BrandKitResult {
  personality: string;
  audience: string;
  slogan: string;
  fonts: string;
}

function ShimmerLine() {
  return (
    <div className="h-4 w-full animate-pulse rounded bg-white/5">
      <div className="h-full w-2/3 rounded bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
    </div>
  );
}

export function BrandKitGenerator() {
  const t = useTranslations("common");
  const [brandName, setBrandName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#BF953F");
  const [secondaryColor, setSecondaryColor] = useState("#0B0B0B");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BrandKitResult | null>(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!brandName || !industry) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate a complete brand kit for ${brandName}. Primary: ${primaryColor}, Secondary: ${secondaryColor}. Industry: ${industry}. Include: brand personality (3 words), target audience, slogan, font recommendations. Format as JSON with keys: personality, audience, slogan, fonts`,
        }),
      });

      const data = await res.json();
      const raw = data.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: BrandKitResult = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      } else {
        setError(t("error"));
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
              Brand Kit Generator
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-xl">
          <div className="space-y-5 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="brandName">
                Brand Name
              </label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Nike"
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300" htmlFor="primaryColor">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                  <span className="text-xs text-gray-400">{primaryColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-300" htmlFor="secondaryColor">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded border border-white/10 bg-transparent"
                  />
                  <span className="text-xs text-gray-400">{secondaryColor}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300" htmlFor="industry">
                Industry
              </label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={loading || !brandName || !industry}
              onClick={handleGenerate}
            >
              {loading ? (t("loading")) : "Generate Brand Kit"}
            </Button>
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4 rounded-2xl border border-white/5 bg-[#121212]/80 p-8 backdrop-blur-xl"
            >
              <ShimmerLine />
              <ShimmerLine />
              <ShimmerLine />
              <div className="h-20 w-full animate-pulse rounded bg-white/5" />
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-2xl border border-[#BF953F]/20 bg-[#121212]/80 p-6 backdrop-blur-xl">
                <h3 className="mb-3 text-lg font-semibold text-[#FCF6BA]">
                  {brandName} — Brand Kit
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-white/5 bg-black/30 p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Personality
                    </span>
                    <p className="mt-1 text-white">{result.personality}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-black/30 p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Target Audience
                    </span>
                    <p className="mt-1 text-white">{result.audience}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-black/30 p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Slogan
                    </span>
                    <p className="mt-1 text-lg font-semibold text-[#FCF6BA]">{result.slogan}</p>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-black/30 p-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Font Recommendations
                    </span>
                    <p className="mt-1 text-white">{result.fonts}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
