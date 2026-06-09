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
  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some((p) => pathname.includes(p));
  const isApi = pathname.startsWith("/api");
  const isStatic = pathname.includes("/_next") || pathname.includes("/favicon");

  if (isStatic) {
    return NextResponse.next();
  }

  if (isApi) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    if (origin && referer) {
      try {
        const originUrl = new URL(origin);
        const refererUrl = new URL(referer);
        if (originUrl.hostname !== refererUrl.hostname && process.env.NODE_ENV !== "development") {
          return new NextResponse("CSRF validation failed", { status: 403 });
        }
      } catch {
        return new NextResponse("Invalid headers", { status: 400 });
      }
    }
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex");
    return response;
  }

  if (isProtected) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      const url = new URL("/en", request.url);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (!profile || !["Super_Admin", "Admin", "Editor"].includes(profile.role)) {
      const url = new URL("/en", request.url);
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
