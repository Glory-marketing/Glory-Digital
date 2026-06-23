import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/en/glory-admin";
  const redirectTo = searchParams.get("redirect_to") ?? next;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/en?error=config_error`);
  }

  // Token hash verification (email confirmation, magic link, etc.)
  if (token_hash && type) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    });

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as "magiclink" | "signup" | "email" | "recovery",
    });

    if (!error) {
      const response = NextResponse.redirect(`${origin}${redirectTo}`);
      const supabase2 = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options);
            }
          },
        },
      });
      const { error: verifyErr } = await supabase2.auth.verifyOtp({
        token_hash,
        type: type as "magiclink" | "signup" | "email" | "recovery",
      });
      if (!verifyErr) return response;
    }

    return NextResponse.redirect(`${origin}/en?error=verification_failed`);
  }

  // OAuth code exchange (Google, etc.)
  if (code) {
    const response = NextResponse.redirect(`${origin}${redirectTo}`);
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;

    // OAuth failed — redirect with error message
    const msg = error.message || "oauth_failed";
    return NextResponse.redirect(`${origin}/en/client-portal/login?error=${encodeURIComponent(msg)}`);
  }

  return NextResponse.redirect(`${origin}/en`);
}
