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

  if (token_hash && type) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          // cookies are set via the response below
        },
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
      await supabase2.auth.verifyOtp({
        token_hash,
        type: type as "magiclink" | "signup" | "email" | "recovery",
      });
      return response;
    }

    return NextResponse.redirect(`${origin}/en`);
  }

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
    if (!error) {
      return response;
    }

    return NextResponse.redirect(`${origin}/en`);
  }

  return NextResponse.redirect(`${origin}/en`);
}
