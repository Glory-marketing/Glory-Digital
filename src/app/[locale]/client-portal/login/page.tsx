import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ClientPortalLogin({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { locale } = await params;
  const { error: errorParam } = await searchParams;
  const t = await getTranslations({ locale, namespace: "common" });

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-[#121212] p-8">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-2xl font-bold text-transparent">
            {locale === "ar" ? "بوابة العميل" : "Client Portal"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {locale === "ar" ? "سجل الدخول إلى حسابك" : "Sign in to your account"}
          </p>
        </div>

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
      </div>
    </div>
  );
}
