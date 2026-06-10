import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const locales = ["en", "ar"];
const defaultLocale = "en";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

const protectedPaths = ["/glory-admin"];

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some((p) => pathname.includes(p));
    const isApi = pathname.startsWith("/api");
    const isStatic = pathname.includes("/_next") || pathname.includes("/favicon");
    const isLoginPage = pathname.includes("/login");

    if (isStatic) return NextResponse.next();

    if (isApi) {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex");
      return response;
    }

    // Detect current locale from pathname
    const localeMatch = pathname.match(/^\/(en|ar)/);
    const currentLocale = localeMatch?.[1] || "en";

    // Always run intlMiddleware first so next-intl sets locale headers/cookies
    const intlResponse = intlMiddleware(request);
    if (intlResponse.status !== 200) return intlResponse; // redirect if needed

    if (isProtected) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              intlResponse.cookies.set(name, value, options);
            });
          },
        },
      });

      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url));
      }

      return intlResponse;
    }

    return intlResponse;
  } catch {
    return NextResponse.redirect(new URL("/en/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
