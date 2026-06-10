"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { createService, updateService, deleteService } from "@/server-actions/services-actions";

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
  const [services, setServices] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await createService(fd);
      toast("Service created!", "success");
      setShowForm(false);
    } catch { toast("Failed to create", "error"); }
  };

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updateService(id, fd);
      toast("Service updated!", "success");
      setEditingId(null);
    } catch { toast("Failed to update", "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      setServices(s => s.filter(x => x.id !== id));
      toast("Service deleted", "info");
    } catch { toast("Failed to delete", "error"); }
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
        {showForm ? "Cancel" : "Add Service"}
      </Button>

      {showForm && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">New Service</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="name_en" placeholder="Name (English)" required />
              <Input name="name_ar" placeholder="Name (Arabic)" required />
              <Input name="icon" placeholder="Icon name (e.g. star, print)" />
              <Input name="price" placeholder="Price (optional)" />
              <Input name="image_url" placeholder="Image URL" />
              <Input name="sort_order" type="number" placeholder="Sort Order" defaultValue="0" />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" name="visible" defaultChecked /> Visible
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <textarea name="description_en" placeholder="Description (English)" rows={3}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                <Button type="button" size="sm" variant="ghost" className="text-xs mt-1"
                  onClick={async (e) => {
                    const ta = (e.target as HTMLElement).closest('div')?.previousElementSibling as HTMLTextAreaElement;
                    if (ta) ta.value = await aiEnhance("service description", ta.value || "professional marketing service");
                  }}>
                  ✨ AI Enhance
                </Button>
              </div>
              <textarea name="description_ar" placeholder="Description (Arabic)" rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
            </div>
            <Button type="submit">Create</Button>
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
                  <Input name="image_url" defaultValue={s.image_url} />
                  <Input name="sort_order" type="number" defaultValue={String(s.sort_order)} />
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" name="visible" defaultChecked={s.visible} /> Visible
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea name="description_en" defaultValue={s.description_en} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                  <textarea name="description_ar" defaultValue={s.description_ar} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
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
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(s.id)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
