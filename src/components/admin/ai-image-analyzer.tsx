"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface AnalysisResult {
  category: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  tags: string[];
  search_query: string;
}

export function AiImageAnalyzer({
  onResult,
}: {
  onResult: (result: AnalysisResult) => void;
}) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.error) {
        toast(data.error, "error");
      } else {
        onResult(data);
        toast("AI analysis complete!", "success");
      }
    } catch {
      toast("Analysis failed", "error");
    }
    setAnalyzing(false);
  };

  return (
    <div className="rounded-xl border border-white/5 bg-[#121212] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#BF953F] animate-pulse" />
        <span className="text-xs font-medium text-[#FCF6BA] tracking-widest uppercase">AI Image Analyzer</span>
      </div>
      <p className="text-xs text-gray-500">
        Upload a design image — AI will detect the category, suggest title/description in Egyptian Arabic, and search terms.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-gray-400 file:mr-2 file:rounded file:border-0 file:bg-[#BF953F]/20 file:px-2 file:py-1 file:text-xs file:text-[#FCF6BA]"
      />
      {preview && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/30">
          <img src={preview} alt="preview" className="h-full w-full object-contain" />
        </div>
      )}
      <Button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || analyzing}
        className="w-full text-xs"
      >
        {analyzing ? (
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 animate-spin rounded-full border border-black border-t-transparent" />
            Analyzing with AI...
          </span>
        ) : (
          "🔍 Analyze with AI"
        )}
      </Button>
    </div>
  );
}

export type { AnalysisResult };
