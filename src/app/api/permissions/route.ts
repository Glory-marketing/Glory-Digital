import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { role, permissionKey, grant } = await request.json();

    if (!role || !permissionKey) {
      return NextResponse.json({ error: "Missing role or permissionKey" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const rpDb = adminClient.from("role_permissions") as any;

    if (grant) {
      const { error } = await rpDb.insert({ role, permission_key: permissionKey });
      if (error && !error.message?.includes("duplicate")) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await rpDb
        .delete()
        .eq("role", role)
        .eq("permission_key", permissionKey);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 }
    );
  }
}
