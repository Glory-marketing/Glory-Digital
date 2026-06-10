"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from "@/server-actions/portfolio";

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

export function PortfolioManager({ projects: initial }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await createPortfolioProject(fd);
      toast("Project created!", "success");
      setShowForm(false);
      form.reset();
    } catch { toast("Failed to create", "error"); }
  };

  const handleUpdate = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await updatePortfolioProject(id, fd);
      toast("Project updated!", "success");
      setEditingId(null);
    } catch { toast("Failed to update", "error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deletePortfolioProject(id);
      setProjects(p => p.filter(x => x.id !== id));
      toast("Project deleted", "info");
    } catch { toast("Failed to delete", "error"); }
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Project"}
      </Button>

      {showForm && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">New Project</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input name="title_en" placeholder="Title (English)" required />
              <Input name="title_ar" placeholder="Title (Arabic)" required />
              <Input name="category" placeholder="Category" required />
              <Input name="image_url" placeholder="Image URL" />
              <Input name="sort_order" type="number" placeholder="Sort Order" defaultValue="0" />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" name="visible" defaultChecked /> Visible
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <textarea name="description_en" placeholder="Description (English)" rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
              <textarea name="description_ar" placeholder="Description (Arabic)" rows={3}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
            </div>
            <Button type="submit">Create</Button>
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
                  <Input name="image_url" defaultValue={p.image_url} />
                  <Input name="sort_order" type="number" defaultValue={String(p.sort_order)} />
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" name="visible" defaultChecked={p.visible} /> Visible
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <textarea name="description_en" defaultValue={p.description_en} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                  <textarea name="description_ar" defaultValue={p.description_ar} rows={2}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                <div className="mb-2 aspect-video rounded-lg bg-gradient-to-br from-[#BF953F]/10 to-[#B38728]/10 flex items-center justify-center text-sm text-gray-500">
                  {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full rounded-lg object-cover" /> : "No image"}
                </div>
                <h3 className="font-semibold text-white">{p.title_en}</h3>
                <p className="text-xs text-gray-500">{p.category} — Sort: {p.sort_order}</p>
                <p className="mt-1 text-xs text-gray-400 line-clamp-2">{p.description_en}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(p.id)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
