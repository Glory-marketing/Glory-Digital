"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { leadSchema } from "@/lib/validators";
import { headers } from "next/headers";

export async function submitLead(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const headersList = await headers();

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    service: formData.get("service") as string,
    budget: formData.get("budget") as string,
    brief: formData.get("brief") as string,
  };

  const validated = leadSchema.parse(rawData);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("leads") as any;
  const { error } = await db.insert({
    name: validated.name,
    email: validated.email,
    phone: validated.phone || null,
    service: validated.service,
    budget: validated.budget || null,
    brief: validated.brief || null,
    locale: headersList.get("accept-language")?.startsWith("ar") ? "ar" : "en",
    utm_source: (formData.get("utm_source") as string) || null,
    utm_medium: (formData.get("utm_medium") as string) || null,
    utm_campaign: (formData.get("utm_campaign") as string) || null,
    status: "new",
  });

  if (error) throw new Error("Failed to submit lead");

  revalidatePath("/[locale]/glory-admin/leads");
  return { success: true };
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("leads") as any;
  const { error } = await db.update({ status }).eq("id", id);

  if (error) throw new Error("Failed to update lead status");
  revalidatePath("/[locale]/glory-admin/leads");
}
