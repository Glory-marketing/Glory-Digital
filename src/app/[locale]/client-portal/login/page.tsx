import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ClientPortalLogin({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; tab?: string; success?: string }>;
}) {
  const { locale } = await params;
  const { error: errorParam, tab, success } = await searchParams;
  const t = await getTranslations({ locale, namespace: "common" });
  const isSignup = tab === "signup";

  async function handleLogin(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const lang = formData.get("locale") as string;
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      redirect(`/${lang}/client-portal/login?error=${encodeURIComponent(error.message)}`);
    }
    redirect(`/${lang}/client-portal`);
  }

  async function handleSignup(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const lang = formData.get("locale") as string;
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role: "Client" } },
    });

    if (error) {
      redirect(`/${lang}/client-portal/login?tab=signup&error=${encodeURIComponent(error.message)}`);
    }
    redirect(`/${lang}/client-portal/login?success=true`);
  }

  async function handleGoogleSignIn() {
    "use server";
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/callback?next=/${locale}/client-portal`,
      },
    });
    if (data?.url) redirect(data.url);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="w-full max-w-md">
        <div className="mb-6 flex rounded-xl border border-white/5 bg-[#121212] p-1">
          <a
            href={`/${locale}/client-portal/login${isSignup ? "?tab=login" : ""}`}
            className={`flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-all ${
              !isSignup ? "bg-[#BF953F] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            {locale === "ar" ? "تسجيل الدخول" : "Login"}
          </a>
          <a
            href={`/${locale}/client-portal/login?tab=signup`}
            className={`flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-all ${
              isSignup ? "bg-[#BF953F] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            {locale === "ar" ? "إنشاء حساب" : "Sign Up"}
          </a>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#121212] p-8">
          <div className="mb-8 text-center">
            <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-2xl font-bold text-transparent">
              {locale === "ar" ? "بوابة العميل" : "Client Portal"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {isSignup
                ? (locale === "ar" ? "إنشاء حساب جديد" : "Create a new account")
                : (locale === "ar" ? "سجل الدخول إلى حسابك" : "Sign in to your account")}
            </p>
          </div>

          <form action={handleGoogleSignIn} className="mb-6">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {locale === "ar" ? "تسجيل الدخول عبر Google" : "Sign in with Google"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#121212] px-3 text-gray-500">
                {locale === "ar" ? "أو" : "or"}
              </span>
            </div>
          </div>

          {isSignup ? (
            <form action={handleSignup} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="name">
                  {locale === "ar" ? "الاسم" : "Full Name"}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                  placeholder={locale === "ar" ? "الاسم الكامل" : "Your full name"}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="email">
                  {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="password">
                  {locale === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                  placeholder="••••••••"
                />
              </div>
              {errorParam && <p className="text-sm text-red-400">{errorParam}</p>}
              {success === "true" && (
                <p className="text-sm text-green-400">
                  {locale === "ar"
                    ? "تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب."
                    : "Account created! Please check your email to confirm your account."}
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 font-medium text-black transition-all hover:brightness-110"
              >
                {locale === "ar" ? "إنشاء حساب" : "Create Account"}
              </button>
            </form>
          ) : (
            <form action={handleLogin} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="email">
                  {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="password">
                  {locale === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                  placeholder="••••••••"
                />
              </div>
              {errorParam && <p className="text-sm text-red-400">{errorParam}</p>}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 font-medium text-black transition-all hover:brightness-110"
              >
                {locale === "ar" ? "تسجيل الدخول" : "Login"}
              </button>
              <p className="text-center text-xs text-gray-500">
                <a href={`/${locale}`} className="text-[#BF953F] hover:underline">
                  {locale === "ar" ? "العودة للرئيسية" : "Back to home"}
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
