"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { portfolioProjectSchema } from "@/lib/validators";

export async function getPortfolioProjects() {
  const supabase = await createServerSupabaseClient();
  const db = supabase.from("portfolio_projects") as any;
  const { data } = await db.select("*").order("sort_order", { ascending: true });
  return (data || []) as Array<{
    id: string;
    title_en: string;
    title_ar: string;
    category: string;
    description_en: string;
    description_ar: string;
    image_url: string;
    sort_order: number;
    visible: boolean;
  }>;
}

export async function createPortfolioProject(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let imageUrl = formData.get("image_url") as string || "";
  const file = formData.get("image_file") as File;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `portfolio/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }
  }

  const data = {
    title_en: formData.get("title_en") as string,
    title_ar: formData.get("title_ar") as string,
    category: formData.get("category") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    image_url: imageUrl,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    visible: formData.get("visible") === "on",
  };

  portfolioProjectSchema.parse(data);

  const db = supabase.from("portfolio_projects") as any;
  const { error } = await db.insert(data);
  if (error) throw new Error("Failed to create project");
  revalidatePath("/[locale]/glory-admin/portfolio");
  return { success: true };
}

export async function updatePortfolioProject(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let imageUrl = formData.get("image_url") as string || "";
  const file = formData.get("image_file") as File;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `portfolio/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }
  }

  const data = {
    title_en: formData.get("title_en") as string,
    title_ar: formData.get("title_ar") as string,
    category: formData.get("category") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    image_url: imageUrl,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    visible: formData.get("visible") === "on",
  };

  portfolioProjectSchema.parse(data);

  const db = supabase.from("portfolio_projects") as any;
  const { error } = await db.update(data).eq("id", id);
  if (error) throw new Error("Failed to update project");
  revalidatePath("/[locale]/glory-admin/portfolio");
  return { success: true };
}

export async function deletePortfolioProject(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const db = supabase.from("portfolio_projects") as any;
  const { error } = await db.delete().eq("id", id);
  if (error) throw new Error("Failed to delete project");
  revalidatePath("/[locale]/glory-admin/portfolio");
  return { success: true };
}
