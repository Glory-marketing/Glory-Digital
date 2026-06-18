"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { createService, updateService, deleteService } from "@/server-actions/services-actions";
import { useTranslations } from "next-intl";
import { AiImageAnalyzer } from "@/components/admin/ai-image-analyzer";
import type { AnalysisResult } from "@/components/admin/ai-image-analyzer";

function ImageUpload({ urlName, filePreview }: { urlName: string; filePreview?: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const displayUrl = preview || filePreview;

  return (
    <div className="space-y-2">
      <input name="image_file" type="file" accept="image/*" onChange={handleFileChange}
        className="file:mr-3 file:rounded-lg file:border-0 file:bg-[#BF953F]/10 file:px-3 file:py-1.5 file:text-xs file:text-[#FCF6BA] text-xs text-gray-400" />
      <input name={urlName} type="hidden" />
      {displayUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black/30">
          <img src={displayUrl} alt="" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}

interface ServiceItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  price: string;
  image_url: string;
  sort_order: number;
  visible: boolean;
}

export function ServicesManager({ services: initial }: { services: ServiceItem[] }) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const [services, setServices] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleAiResult = (result: AnalysisResult) => {
    const set = (name: string, value: string) => {
      const el = document.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el) el.value = value;
    };
    set("name_en", result.title_en);
    set("name_ar", result.title_ar);
    set("description_en", result.description_en);
    set("description_ar", result.description_ar);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createService(fd);
      toast(t("service_created"), "success");
      setShowForm(false);
    } catch { toast(tc("error"), "error"); }
  };

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateService(id, fd);
      toast(t("service_updated"), "success");
      setEditingId(null);
    } catch { toast(tc("error"), "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("delete_confirm"))) return;
    try {
      await deleteService(id);
      setServices(s => s.filter(x => x.id !== id));
      toast(t("service_deleted"), "info");
    } catch { toast(tc("error"), "error"); }
  };

  const aiEnhance = async (field: string, value: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Enhance this ${field} for a marketing company website (make it professional, compelling, concise, return ONLY the enhanced text, no explanation): "${value}"` }),
      });
      const data = await res.json();
      if (data.content) {
        return data.content;
      }
    } catch {}
    return value;
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? t("cancel") : t("add_service")}
      </Button>

      {showForm && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("new_service")}</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <AiImageAnalyzer onResult={handleAiResult} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="name_en" placeholder={t("service_name_en")} required />
              <Input name="name_ar" placeholder={t("service_name_ar")} required />
              <Input name="icon" placeholder={t("icon")} />
              <Input name="price" placeholder={t("price")} />
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
              <div>
                <textarea name="description_en" placeholder={t("service_desc_en")} rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                <Button type="button" size="sm" variant="ghost" className="text-xs mt-1"
                  onClick={async (e) => {
                    const ta = (e.target as HTMLElement).closest('div')?.previousElementSibling as HTMLTextAreaElement;
                    if (ta) ta.value = await aiEnhance("service description", ta.value || "professional marketing service");
                  }}>
                  ✨ {t("ai_enhance")}
                </Button>
              </div>
              <div>
                <textarea name="description_ar" placeholder={t("service_desc_ar")} rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                <Button type="button" size="sm" variant="ghost" className="text-xs mt-1"
                  onClick={async (e) => {
                    const container = (e.target as HTMLElement).closest('div');
                    const arTa = container?.querySelector('textarea') as HTMLTextAreaElement;
                    const enDiv = document.querySelector('textarea[name="description_en"]') as HTMLTextAreaElement;
                    if (arTa && arTa.value && enDiv) {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(s => (
          <Card key={s.id}>
            {editingId === s.id ? (
              <form onSubmit={(e) => handleUpdate(s.id, e)} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input name="name_en" defaultValue={s.name_en} required />
                  <Input name="name_ar" defaultValue={s.name_ar} required />
                  <Input name="icon" defaultValue={s.icon} />
                  <Input name="price" defaultValue={s.price} />
                  <div className="space-y-1">
                    <label className="block text-xs text-gray-500">{t("upload_image")}</label>
                    <ImageUpload urlName="image_url" filePreview={s.image_url} />
                  </div>
                  <Input name="sort_order" type="number" defaultValue={String(s.sort_order)} />
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" name="visible" defaultChecked={s.visible} /> {t("visible")}
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea name="description_en" defaultValue={s.description_en} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                  <div>
                    <textarea name="description_ar" defaultValue={s.description_ar} rows={2}
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
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 flex items-center justify-center text-[#FCF6BA] text-lg">
                    {s.icon === "print" ? "🖨" : s.icon === "description" ? "📄" : s.icon === "devices" ? "📱" : s.icon === "palette" ? "🎨" : s.icon === "share" ? "📤" : s.icon === "trending_up" ? "📈" : "✦"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{s.name_en}</h3>
                    <p className="text-xs text-gray-500">Sort: {s.sort_order}{s.price ? ` — ${s.price}` : ""}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{s.description_en}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(s.id)}>{tc("edit")}</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>{tc("delete")}</Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
