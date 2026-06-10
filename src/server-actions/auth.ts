"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function signInWithPassword(email: string, password: string) {
  try {
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail && email.toLowerCase() !== ownerEmail.toLowerCase()) {
      return { success: true };
    }

    const supabase = await createServerSupabaseClient();

    // Try signing in first (works if account already exists with correct password)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) return { success: true };

    // If sign-in failed, try creating account via Supabase sign-up
    if (signInErr.message?.includes("Invalid login credentials")) {
      const { error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: "Super_Admin" } },
      });

      if (signUpErr && !signUpErr.message?.includes("already")) {
        return { error: signUpErr.message };
      }

      // Try signing in again
      const { error: signInErr2 } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr2) return { error: signInErr2.message };

      return { success: true };
    }

    return { error: signInErr.message };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/en");
}
