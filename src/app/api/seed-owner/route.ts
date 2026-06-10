import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const email = process.env.OWNER_EMAIL;
    const password = "Ma@2468100";
    if (!email) return NextResponse.json({ error: "OWNER_EMAIL not set" }, { status: 500 });

    const adminClient = createAdminClient();

    const { data: existing } = await adminClient.auth.admin.listUsers();
    const alreadyExists = existing?.users?.some((u) => u.email === email);
    if (alreadyExists) {
      return NextResponse.json({ message: "Owner already exists" });
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "Failed to create user" }, { status: 500 });
    }

    const profileDb = adminClient.from("profiles") as any;
    await profileDb.insert({
      id: data.user.id,
      email,
      role: "Super_Admin",
      is_active: true,
    });

    return NextResponse.json({ message: "Owner created successfully", userId: data.user.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
