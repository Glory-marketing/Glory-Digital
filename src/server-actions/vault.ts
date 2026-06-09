"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { encrypt, decrypt } from "@/lib/encryption";
import { apiCredentialSchema } from "@/lib/validators";

export async function storeCredential(
  name: string,
  value: string,
  provider: string
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then((r) => r.data)) as { role: string } | null;

  if (profile?.role !== "Super_Admin") throw new Error("Forbidden");

  apiCredentialSchema.parse({ name, value, provider });
  const encrypted = await encrypt(value);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("api_credentials") as any;
  const { error } = await db.upsert(
    { name, encrypted_value: encrypted, provider },
    { onConflict: "name" }
  );

  if (error) throw new Error("Failed to store credential");
  return { success: true };
}

export async function getDecryptedCredential(name: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then((r) => r.data)) as { role: string } | null;

  if (profile?.role !== "Super_Admin") throw new Error("Forbidden");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("api_credentials") as any;
  const { data, error } = await db
    .select("encrypted_value")
    .eq("name", name)
    .single();

  if (error || !data) throw new Error("Credential not found");
  return decrypt(data.encrypted_value);
}

export async function deleteCredential(name: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile = (await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
    .then((r) => r.data)) as { role: string } | null;

  if (profile?.role !== "Super_Admin") throw new Error("Forbidden");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("api_credentials") as any;
  const { error } = await db.delete().eq("name", name);

  if (error) throw new Error("Failed to delete credential");
  return { success: true };
}
