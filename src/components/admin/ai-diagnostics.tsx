"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function AIDiagnostics() {
  const t = useTranslations("admin");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/check-ai");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-white">{t("ai_diagnostics")}</h3>
      <p className="mb-4 text-sm text-gray-500">{t("ai_diagnostics_desc")}</p>

      <button
        onClick={handleTest}
        disabled={loading}
        className="rounded-lg bg-gradient-to-r from-[#BF953F] to-[#B38728] px-5 py-2 text-sm font-semibold text-black transition-all hover:brightness-110 disabled:opacity-50"
      >
        {loading ? t("testing") : t("test_ai")}
      </button>

      {result && (
        <div className="mt-4 rounded-lg border border-white/5 bg-black/30 p-4 font-mono text-xs text-gray-300">
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Card>
  );
}
