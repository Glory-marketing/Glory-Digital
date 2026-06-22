import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/server-actions/email";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SUPABASE_WEBHOOK_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.type === "INSERT" && body.table === "profiles") {
      const record = body.record;
      if (record.role === "Client" && record.email) {
        const locale = (record.full_name?.match(/[\u0600-\u06FF]/) ? "ar" : "en") as "ar" | "en";
        await sendWelcomeEmail({
          name: record.full_name,
          email: record.email,
          locale,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
