"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/validators";

export async function getServices() {
  const supabase = await createServerSupabaseClient();
  const db = supabase.from("services") as any;
  const { data } = await db.select("*").order("sort_order", { ascending: true });
  return (data || []) as Array<{
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
  }>;
}

export async function createService(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const data = {
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    icon: formData.get("icon") as string,
    price: formData.get("price") as string,
    image_url: formData.get("image_url") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    visible: formData.get("visible") === "on",
  };

  serviceSchema.parse(data);

  const db = supabase.from("services") as any;
  const { error } = await db.insert(data);
  if (error) throw new Error("Failed to create service");
  revalidatePath("/[locale]/glory-admin/services");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const data = {
    name_en: formData.get("name_en") as string,
    name_ar: formData.get("name_ar") as string,
    description_en: formData.get("description_en") as string,
    description_ar: formData.get("description_ar") as string,
    icon: formData.get("icon") as string,
    price: formData.get("price") as string,
    image_url: formData.get("image_url") as string,
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    visible: formData.get("visible") === "on",
  };

  serviceSchema.parse(data);

  const db = supabase.from("services") as any;
  const { error } = await db.update(data).eq("id", id);
  if (error) throw new Error("Failed to update service");
  revalidatePath("/[locale]/glory-admin/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const db = supabase.from("services") as any;
  const { error } = await db.delete().eq("id", id);
  if (error) throw new Error("Failed to delete service");
  revalidatePath("/[locale]/glory-admin/services");
  return { success: true };
}
