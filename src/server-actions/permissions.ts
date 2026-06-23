"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface Permission {
  id: string;
  key: string;
  label_en: string;
  label_ar: string;
  module: string;
}

export interface RolePermission {
  role: string;
  permission_key: string;
}

export async function getPermissions() {
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("permissions")
    .select("*")
    .order("module")
    .order("key") as unknown as { data: Permission[] | null };
  return data || [];
}

export async function getRolePermissions() {
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("role_permissions")
    .select("*") as unknown as { data: RolePermission[] | null };
  return data || [];
}

export async function setRolePermission(role: string, permissionKey: string, grant: boolean) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminClient = createAdminClient();
  const profDb = adminClient.from("profiles") as any;
  const { data: profile } = await profDb
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: { role: string } | null };

  if (!profile || profile.role !== "Super_Admin") {
    throw new Error("Only Super_Admin can manage permissions");
  }

  const rpDb = adminClient.from("role_permissions") as any;

  if (grant) {
    const { error } = await rpDb.insert({ role, permission_key: permissionKey });
    if (error && !error.message?.includes("duplicate")) throw new Error(error.message);
  } else {
    const { error } = await rpDb
      .delete()
      .eq("role", role)
      .eq("permission_key", permissionKey);
    if (error) throw new Error(error.message);
  }

  return { success: true };
}
