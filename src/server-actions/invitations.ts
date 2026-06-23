"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { invitationSchema } from "@/lib/validators";
import { generateToken } from "@/lib/utils";

const INVITATION_EXPIRY_HOURS = 24;

export async function sendInvitation(email: string, role: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminClient = createAdminClient();

  const profDb = adminClient.from("profiles") as any;
  const { data: profile } = await profDb
    .select("role")
    .eq("id", user.id)
    .single() as unknown as { data: { role: string } | null };

  if (!profile || (profile.role !== "Super_Admin" && profile.role !== "Admin")) {
    throw new Error("Forbidden");
  }

  invitationSchema.parse({ email, role });

  const token = generateToken();
  const expiresAt = new Date(
    Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000
  ).toISOString();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glory.dpdns.org";
  const inviteLink = `${appUrl}/en/accept-invite?token=${token}`;

  const invDb = adminClient.from("invitations") as any;
  const { error } = await invDb.insert({
    email,
    role: role as "Super_Admin" | "Admin" | "Editor",
    invited_by: user.id,
    token,
    expires_at: expiresAt,
  });

  if (error) throw new Error(error.message || "Failed to create invitation");

  // Try sending email, but don't block if it fails
  try {
    const { Resend } = await import("resend");
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Glory Agency <info@glory.dpdns.org>",
        to: email,
        subject: "You're invited to join Glory Agency / دعوة للانضمام إلى Glory Agency",
        html: `<div style="background:#0B0B0B;padding:40px;font-family:sans-serif;text-align:center">
          <h1 style="color:#FCF6BA;font-size:24px;margin-bottom:16px">🚀 You're Invited!</h1>
          <p style="color:#ccc;font-size:14px;line-height:1.8">Click below to accept your invitation as <strong style="color:#BF953F">${role}</strong></p>
          <a href="${inviteLink}" style="display:inline-block;background:linear-gradient(135deg,#BF953F,#FCF6BA,#B38728);color:#0B0B0B;text-decoration:none;padding:12px 32px;border-radius:12px;font-weight:600;margin:24px 0">Accept Invitation →</a>
          <p style="color:#666;font-size:12px">Link expires in 24 hours</p>
        </div>`,
      });
    }
  } catch {
    // Email sending is best-effort
  }

  revalidatePath("/[locale]/glory-admin/team");
  return { success: true, token, inviteLink };
}

export async function acceptInvitation(token: string, password: string) {
  const adminClient = createAdminClient();

  const invDb = adminClient.from("invitations") as any;
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

  // Ensure profile exists with correct role (upsert in case trigger failed)
  await (adminClient.from("profiles") as any)
    .upsert({
      id: authData.user.id,
      email: invitation.email,
      role: invitation.role,
      is_active: true,
    })
    .eq("id", authData.user.id);

  await invDb
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  return { success: true };
}

export async function revokeInvitation(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const adminClient = createAdminClient();
  const { error } = await (adminClient.from("invitations") as any)
    .delete()
    .eq("id", id);

  if (error) throw new Error("Failed to revoke invitation");

  revalidatePath("/[locale]/glory-admin/team");
  return { success: true };
}
