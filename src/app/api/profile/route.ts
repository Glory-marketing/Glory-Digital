import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const locale = (formData.get("locale") as string) || "en";

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(`/${locale}/client-portal/login`, request.url));
  }

  const updates: Record<string, string> = {};
  if (fullName) updates.full_name = fullName;
  if (phone) updates.phone = phone;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
  }

  return NextResponse.redirect(new URL(`/${locale}/client-portal`, request.url));
}
