"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from "@/server-actions/portfolio";
import { useTranslations } from "next-intl";
import { AiImageAnalyzer } from "@/components/admin/ai-image-analyzer";
import type { AnalysisResult } from "@/components/admin/ai-image-analyzer";

interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  category: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  sort_order: number;
  visible: boolean;
}

function ImageUpload({ urlName, filePreview }: { urlName: string; filePreview?: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const displayUrl = preview || filePreview;

  return (
    <div className="space-y-2">
      <input
        name="image_file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file:mr-3 file:rounded-lg file:border-0 file:bg-[#BF953F]/10 file:px-3 file:py-1.5 file:text-xs file:text-[#FCF6BA] text-xs text-gray-400"
      />
      <input name={urlName} type="hidden" />
      {displayUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/30">
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}

export function PortfolioManager({ projects: initial }: { projects: Project[] }) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [projects, setProjects] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleAiResult = (result: AnalysisResult) => {
    const set = (name: string, value: string) => {
      const el = document.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = value;
    };
    set("title_en", result.title_en);
    set("title_ar", result.title_ar);
    set("category", result.category);
    set("description_en", result.description_en);
    set("description_ar", result.description_ar);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await createPortfolioProject(fd);
      toast(t("project_created"), "success");
      setShowForm(false);
      form.reset();
    } catch { toast(t("content_update_failed"), "error"); }
  };

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updatePortfolioProject(id, fd);
      toast(t("project_updated"), "success");
      setEditingId(null);
    } catch { toast(t("content_update_failed"), "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_confirm"))) return;
    try {
      await deletePortfolioProject(id);
      setProjects(p => p.filter(x => x.id !== id));
      toast(t("project_deleted"), "info");
    } catch { toast(t("content_update_failed"), "error"); }
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? t("cancel") : t("add_project")}
      </Button>

      {showForm && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("new_project")}</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <AiImageAnalyzer onResult={handleAiResult} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="title_en" placeholder={t("title_en")} required />
              <Input name="title_ar" placeholder={t("title_ar")} required />
              <Input name="category" placeholder={t("category")} required />
              <div className="space-y-1">
                <label className="block text-xs text-gray-500">{t("upload_image")}</label>
                <ImageUpload urlName="image_url" />
              </div>
              <Input name="sort_order" type="number" placeholder={t("sort_order")} defaultValue="0" />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" name="visible" defaultChecked /> {t("visible")}
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <textarea name="description_en" placeholder={t("description_en")} rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
              <div>
                <textarea name="description_ar" placeholder={t("description_ar")} rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                <Button type="button" size="sm" variant="ghost" className="text-xs mt-1"
                  onClick={async (e) => {
                    const container = (e.target as HTMLElement).closest('div');
                    const arTa = container?.querySelector('textarea') as HTMLTextAreaElement;
                    const enDiv = document.querySelector('textarea[name="description_en"]') as HTMLTextAreaElement;
                    if (arTa?.value && enDiv) {
                      const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: `Translate this Arabic text to professional English for a marketing company website. Return ONLY the English translation, no explanation: "${arTa.value}"` }),
                      });
                      const data = await res.json();
                      if (data.content) enDiv.value = data.content;
                    }
                  }}>
                  🔄 Translate to English
                </Button>
              </div>
            </div>
            <Button type="submit">{tc("create")}</Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map(p => (
          <Card key={p.id}>
            {editingId === p.id ? (
              <form onSubmit={(e) => handleUpdate(p.id, e)} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input name="title_en" defaultValue={p.title_en} required />
                  <Input name="title_ar" defaultValue={p.title_ar} required />
                  <Input name="category" defaultValue={p.category} required />
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500">{t("upload_image")}</label>
                    <ImageUpload urlName="image_url" filePreview={p.image_url} />
                  </div>
                  <Input name="sort_order" type="number" defaultValue={String(p.sort_order)} />
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" name="visible" defaultChecked={p.visible} /> {t("visible")}
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea name="description_en" defaultValue={p.description_en} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                  <div>
                    <textarea name="description_ar" defaultValue={p.description_ar} rows={2}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                    <Button type="button" size="sm" variant="ghost" className="text-xs mt-1"
                      onClick={async (e) => {
                        const ta = (e.target as HTMLElement).closest('div')?.querySelector('textarea') as HTMLTextAreaElement;
                        const enTa = (e.target as HTMLElement).closest('.grid')?.querySelector('textarea[name="description_en"]') as HTMLTextAreaElement;
                        if (ta?.value && enTa) {
                          const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: `Translate this Arabic text to professional English for a marketing company website. Return ONLY the English translation, no explanation: "${ta.value}"` }),
                          });
                          const data = await res.json();
                          if (data.content) enTa.value = data.content;
                        }
                      }}>
                      🔄 Translate to English
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">{tc("save")}</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>{t("cancel")}</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-2 aspect-video rounded-lg bg-gradient-to-br from-[#BF953F]/10 to-[#B38728]/10 flex items-center justify-center text-sm text-gray-500">
                  {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full rounded-lg object-cover" /> : t("no_image")}
                </div>
                <h3 className="font-semibold text-white">{p.title_en}</h3>
                <p className="text-xs text-gray-500">{p.category} — Sort: {p.sort_order}</p>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2">{p.description_en}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(p.id)}>{tc("edit")}</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>{tc("delete")}</Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
