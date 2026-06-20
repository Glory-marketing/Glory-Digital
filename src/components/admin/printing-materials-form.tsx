"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

interface PrintingMaterial {
  id: string;
  name_en: string;
  name_ar: string;
  size: string;
  material_type: string;
  price: string;
  service_id: string | null;
  services?: { name_en: string; name_ar: string };
}

interface ServiceOption {
  id: string;
  name_en: string;
}

const SIZES = ["A3", "A4", "A5", "Roll-up", "Banner", "Card"];
const MATERIAL_TYPES = ["Glossy", "Matte", "Vinyl", "Canvas", "Sticker"];

export function PrintingMaterialsForm() {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const { toast } = useToast();
  const [materials, setMaterials] = useState<PrintingMaterial[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [size, setSize] = useState(SIZES[0]);
  const [materialType, setMaterialType] = useState(MATERIAL_TYPES[0]);
  const [price, setPrice] = useState("");
  const [serviceId, setServiceId] = useState("");

  const fetchMaterials = useCallback(async () => {
    const res = await fetch("/api/printing-materials");
    if (res.ok) setMaterials(await res.json());
  }, []);

  const fetchServices = useCallback(async () => {
    const res = await fetch("/api/services");
    if (res.ok) setServices(await res.json());
  }, []);

  useEffect(() => { fetchMaterials(); fetchServices(); }, [fetchMaterials, fetchServices]);

  const resetForm = () => {
    setNameEn("");
    setNameAr("");
    setSize(SIZES[0]);
    setMaterialType(MATERIAL_TYPES[0]);
    setPrice("");
    setServiceId("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!nameEn || !price) return;
    const body = { name_en: nameEn, name_ar: nameAr, size, material_type: materialType, price, service_id: serviceId || null };
    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/printing-materials?id=${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/printing-materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        toast(editingId ? t("material_added") : t("material_added"), "success");
        resetForm();
        fetchMaterials();
      } else {
        toast(t("material_add_failed"), "error");
      }
    } catch {
      toast(t("material_add_failed"), "error");
    }
  };

  const handleEdit = (material: PrintingMaterial) => {
    setNameEn(material.name_en);
    setNameAr(material.name_ar);
    setSize(material.size);
    setMaterialType(material.material_type);
    setPrice(material.price);
    setServiceId(material.service_id || "");
    setEditingId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/printing-materials?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast(t("material_deleted"), "info");
      fetchMaterials();
    } else {
      toast(t("material_delete_failed"), "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? tc("cancel") : t("add_material")}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">
            {editingId ? t("edit_service") : t("add_material")}
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("material_name_en")}</label>
              <input
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("material_name_ar")}</label>
              <input
                value={nameAr}
                onChange={e => setNameAr(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("price")}</label>
              <input
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("size")}</label>
              <select
                value={size}
                onChange={e => setSize(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              >
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("material_type")}</label>
              <select
                value={materialType}
                onChange={e => setMaterialType(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              >
                {MATERIAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500">{t("service")}</label>
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
              >
                <option value="">--</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name_en}</option>)}
              </select>
            </div>
          </div>
          <Button className="mt-4" onClick={handleSubmit}>
            {editingId ? tc("save") : t("add_material")}
          </Button>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("printing_materials")}</h3>
        {materials.length === 0 ? (
          <p className="text-sm text-gray-500">{tc("no_results")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left text-gray-500">
                  <th className="pb-2 font-medium">{t("material_name_en")}</th>
                  <th className="pb-2 font-medium">{t("material_name_ar")}</th>
                  <th className="pb-2 font-medium">{t("size")}</th>
                  <th className="pb-2 font-medium">{t("material_type")}</th>
                  <th className="pb-2 font-medium">{t("price")}</th>
                  <th className="pb-2 font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id} className="border-b border-white/5">
                    <td className="py-3 text-white">{m.name_en}</td>
                    <td className="py-3 text-white">{m.name_ar}</td>
                    <td className="py-3 text-gray-400">{m.size}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#BF953F]/20 px-2.5 py-0.5 text-xs text-[#FCF6BA]">
                        {m.material_type}
                      </span>
                    </td>
                    <td className="py-3 text-[#FCF6BA]">{m.price}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(m)}>
                          {tc("edit")}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => handleDelete(m.id)}
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
