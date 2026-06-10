"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

export function AIManagerForm() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!files?.length) return;
    setUploading(true);

    // In production: process files → embeddings → store in documents table
    await new Promise((r) => setTimeout(r, 1000));

    toast(t("content_updated"), "success");
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          {t("knowledge_base")}
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          {t("kb_desc")}
        </p>
        <div className="flex gap-3">
          <input
            type="file"
            accept=".md,.pdf,.txt"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="file:mr-4 file:rounded-lg file:border-0 file:bg-[#BF953F]/10 file:px-4 file:py-2 file:text-sm file:text-[#FCF6BA] text-sm text-gray-400"
          />
          <Button onClick={handleUpload} disabled={!files?.length || uploading}>
            {uploading ? t("processing") : t("upload")}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">
          {t("chatbot_config")}
        </h3>
        <div className="space-y-4">
          <Input
            label={t("bot_personality")}
            placeholder="Friendly, professional marketing assistant"
            defaultValue="Friendly, professional marketing assistant"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              {t("greeting_message")}
            </label>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              rows={3}
              defaultValue="Hello! I'm Glory AI. How can I help you elevate your brand today?"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">
              {t("qualifying_questions")}
            </label>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              rows={3}
              placeholder={t("questions_placeholder")}
            />
          </div>
          <Button>{t("save_config")}</Button>
        </div>
      </Card>
    </div>
  );
}
