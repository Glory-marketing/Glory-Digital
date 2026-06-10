import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const db = supabase.from("services") as any;
  const { data } = await db
    .select("id, name_en, name_ar, description_en, description_ar, icon, price, image_url")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  return NextResponse.json(data || []);
}
