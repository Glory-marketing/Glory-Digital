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

    if (isStatic) {
      return NextResponse.next();
    }

    if (isApi) {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex");
      return response;
    }

    if (isProtected) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.redirect(new URL("/en", request.url));
      }

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      });

      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        return NextResponse.redirect(new URL("/en", request.url));
      }

      return NextResponse.next();
    }

    return intlMiddleware(request);
  } catch {
    return intlMiddleware(request);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
