"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";

export async function signInWithPassword(email: string, password: string) {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail && email.toLowerCase() !== ownerEmail.toLowerCase()) {
      return { success: true };
    }

    const supabase = await createServerSupabaseClient();

    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr && signInData?.session) {
      return { success: true };
    }

    if (signInErr?.message?.includes("Invalid login credentials")) {
      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "Super_Admin" } },
      });

      if (signUpErr && !signUpErr.message?.includes("already")) {
        return { error: signUpErr.message };
      }

      const { data: signInData2, error: signInErr2 } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr2) return { error: signInErr2.message };
      if (!signInData2?.session) return { error: "Failed to create session" };

      return { success: true };
    }

    return { error: signInErr?.message || "Unknown error" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}
