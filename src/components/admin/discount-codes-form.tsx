"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
}

export function DiscountCodesForm() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [generating, setGenerating] = useState(false);
  const [newPercent, setNewPercent] = useState(15);
  const [newDesc, setNewDesc] = useState("");
  const [newMax, setNewMax] = useState(50);

  const fetchCodes = useCallback(async () => {
    const res = await fetch("/api/discount-codes");
    if (res.ok) setCodes(await res.json());
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return `GLORY-${code.match(/.{1,5}/g)?.join("-")}`;
  };

  const handleGenerate = async () => {
    if (!newPercent || newPercent < 1 || newPercent > 100) return;
    setGenerating(true);
    try {
      const code = generateCode();
      const res = await fetch("/api/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, discount_percent: newPercent, description: newDesc, max_uses: newMax }),
      });
      if (res.ok) {
        toast(t("code_generated"), "success");
        setNewDesc("");
        fetchCodes();
      } else {
        const err = await res.json();
        toast(err.error || t("code_generate_failed"), "error");
      }
    } catch {
      toast(t("code_generate_failed"), "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    const res = await fetch(`/api/discount-codes?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: active }),
    });
    if (res.ok) fetchCodes();
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/discount-codes?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast(t("code_deleted"), "info");
      fetchCodes();
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("generate_discount_code")}</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("discount_percent")}</label>
            <input
              type="number"
              min={1}
              max={100}
              value={newPercent}
              onChange={e => setNewPercent(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs text-gray-500">{t("description")}</label>
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder={t("code_desc_placeholder")}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t("max_uses")}</label>
            <input
              type="number"
              min={1}
              value={newMax}
              onChange={e => setNewMax(Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
            />
          </div>
        </div>
        <Button className="mt-4" onClick={handleGenerate} disabled={generating}>
          {generating ? t("generating") : t("generate_code")}
        </Button>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("existing_codes")}</h3>
        {codes.length === 0 ? (
          <p className="text-sm text-gray-500">{t("no_codes_yet")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-gray-500">
                  <th className="pb-2 font-medium">{t("code")}</th>
                  <th className="pb-2 font-medium">{t("discount")}</th>
                  <th className="pb-2 font-medium">{t("uses")}</th>
                  <th className="pb-2 font-medium">{t("status")}</th>
                  <th className="pb-2 font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {codes.map(c => (
                  <tr key={c.id} className="border-b border-white/5">
                    <td className="py-3 font-mono text-[#FCF6BA]">{c.code}</td>
                    <td className="py-3 text-white">{c.discount_percent}%</td>
                    <td className="py-3 text-gray-400">{c.used_count}/{c.max_uses}</td>
                    <td className="py-3">
                      <Badge variant={c.is_active ? "gold" : "default"}>
                        {c.is_active ? t("active") : t("inactive")}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggle(c.id, !c.is_active)}
                        >
                          {c.is_active ? t("deactivate") : t("activate")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => handleDelete(c.id)}
                        >
                          {t("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
