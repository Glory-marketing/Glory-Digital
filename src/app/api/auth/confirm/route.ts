import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/en/client-portal";
  const redirect_to = searchParams.get("redirect_to") ?? next;

  if (!token_hash || !type) {
    return NextResponse.redirect(`${origin}/en/client-portal/login`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/en?error=config_error`);
  }

  const response = NextResponse.redirect(`${origin}${redirect_to}`);
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as "magiclink" | "signup" | "email" | "recovery",
  });

  if (error) {
    console.error("Auth confirm error:", error.message);
    return NextResponse.redirect(`${origin}/en/client-portal/login?error=${encodeURIComponent(error.message)}`);
  }

  return response;
}
