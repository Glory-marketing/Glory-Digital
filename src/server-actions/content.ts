"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateContentTranslation(
  section: string,
  key: string,
  locale: string,
  value: string
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("content_translations") as any;
  const { error } = await db.upsert(
    { section, key, locale, value, updated_by: user.id },
    { onConflict: "section,key,locale" }
  );

  if (error) throw new Error("Failed to update content");
  revalidatePath("/[locale]/glory-admin/page-builder");
}

export async function toggleSectionVisibility(
  section: string,
  locale: string,
  isVisible: boolean
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("page_content") as any;
  const { error } = await db
    .update({ is_visible: isVisible, updated_by: user.id })
    .eq("section", section)
    .eq("locale", locale);

  if (error) throw new Error("Failed to toggle visibility");
  revalidatePath("/[locale]/glory-admin/page-builder");
}

export async function updateSiteSetting(key: string, value: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("site_settings") as any;
  const { error } = await db.upsert(
    { key, value, updated_by: user.id },
    { onConflict: "key" }
  );

  if (error) throw new Error("Failed to update setting");
  revalidatePath("/[locale]/glory-admin/page-builder");
}

export async function revalidateAll() {
  const adminClient = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = adminClient.from("site_settings") as any;
  const { error } = await db.upsert({
    key: "_last_revalidate",
    value: new Date().toISOString(),
  });

  if (error) throw new Error("Revalidation failed");
  revalidatePath("/", "layout");
}
