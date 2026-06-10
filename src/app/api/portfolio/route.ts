import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const db = supabase.from("portfolio_projects") as any;
  const { data } = await db
    .select("id, title_en, title_ar, category, description_en, description_ar, image_url")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  return NextResponse.json(data || []);
}
