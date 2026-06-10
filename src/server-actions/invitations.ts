"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { invitationSchema } from "@/lib/validators";
import { generateToken } from "@/lib/utils";

const INVITATION_EXPIRY_HOURS = 24;

export async function sendInvitation(email: string, role: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileDb = supabase.from("profiles") as any;
  const profile = (await profileDb
    .select("role")
    .eq("id", user.id)
    .single()
    .then((r: any) => r.data)) as { role: string } | null;

  if (!profile || (profile.role !== "Super_Admin" && profile.role !== "Admin")) {
    throw new Error("Forbidden");
  }

  invitationSchema.parse({ email, role });

  const token = generateToken();
  const expiresAt = new Date(
    Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000
  ).toISOString();

  // Get the app URL for the invite link
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glory-digital.vercel.app";
  const inviteLink = `${appUrl}/en/accept-invite?token=${token}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invDb = supabase.from("invitations") as any;
  const { error } = await invDb.insert({
    email,
    role: role as "Super_Admin" | "Admin" | "Editor",
    invited_by: user.id,
    token,
    expires_at: expiresAt,
  });

  if (error) throw new Error("Failed to create invitation");

  revalidatePath("/[locale]/glory-admin/team");
  return { success: true, token, inviteLink };
}

export async function acceptInvitation(token: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const adminClient = createAdminClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invDb = supabase.from("invitations") as any;
  const { data: invitation, error: fetchError } = await invDb
    .select("*")
    .eq("token", token)
    .single();

  if (fetchError || !invitation) throw new Error("Invalid invitation token");
  if (invitation.accepted_at) throw new Error("Invitation already accepted");
  if (new Date(invitation.expires_at) < new Date())
    throw new Error("Invitation expired");

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true,
    });

  if (authError || !authData.user) throw new Error("Failed to create user");

  // Update profile role (trigger creates it as 'Editor')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (adminClient.from("profiles") as any)
    .update({ role: invitation.role, is_active: true })
    .eq("id", authData.user.id);

  await invDb
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  return { success: true };
}

export async function revokeInvitation(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase.from("invitations") as any;
  const { error } = await db.delete().eq("id", id);
  if (error) throw new Error("Failed to revoke invitation");

  revalidatePath("/[locale]/glory-admin/team");
  return { success: true };
}
