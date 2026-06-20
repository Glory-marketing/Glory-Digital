"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

interface ServiceItem {
  id: string;
  name_en: string;
  name_ar: string;
  icon: string;
  price: string;
  visible: boolean;
}

export function PricingForm() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    const res = await fetch("/api/services");
    if (res.ok) {
      const data = await res.json();
      setServices(data.map((s: any) => ({ ...s, visible: s.visible ?? true })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleSave = async (id: string) => {
    setSaving(id);
    try {
      const service = services.find(s => s.id === id);
      if (!service) return;
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: service.price, visible: service.visible }),
      });
      if (res.ok) {
        toast(t("price_saved"), "success");
      } else {
        toast(t("price_save_failed"), "error");
      }
    } catch {
      toast(t("price_save_failed"), "error");
    } finally {
      setSaving(null);
    }
  };

  const updateField = (id: string, field: "price" | "visible", value: string | boolean) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (loading) {
    return <p className="text-sm text-gray-500">{tc("loading")}</p>;
  }

  return (
    <div className="space-y-4">
      {services.map(service => (
        <Card key={service.id} className="flex items-center gap-4">
          <span className="text-2xl">{service.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{service.name_en}</p>
            <p className="text-xs text-gray-500 truncate">{service.name_ar}</p>
          </div>
          <div className="w-32">
            <input
              type="text"
              value={service.price}
              onChange={e => updateField(service.id, "price", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-gray-400">{t("visible")}</span>
            <input
              type="checkbox"
              checked={service.visible}
              onChange={e => updateField(service.id, "visible", e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-black/50 text-[#BF953F] focus:ring-[#BF953F]"
            />
          </label>
          <Button
            size="sm"
            onClick={() => handleSave(service.id)}
            disabled={saving === service.id}
          >
            {tc("save")}
          </Button>
        </Card>
      ))}
    </div>
  );
}
