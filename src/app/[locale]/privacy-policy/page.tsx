import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const isAr = locale === "ar";
  const date = "June 23, 2026";

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-32 pb-20" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Back */}
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FCF6BA] transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isAr ? "M19 12H5m7 7l-7-7 7-7" : "M5 12h14m-7-7l7 7-7 7"} />
          </svg>
          {t("back")}
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-4xl font-bold text-transparent">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {t("last_updated")}: {date}
          </p>
        </div>

        {/* Section */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <section key={num} className="mb-8 rounded-2xl border border-white/5 bg-[#121212] p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-white">{t(`s${num}_title`)}</h2>
            {(() => {
              const paragraphs = t.raw(`s${num}_body`);
              if (Array.isArray(paragraphs)) {
                return paragraphs.map((p: string, i: number) => (
                  <p key={i} className="mb-3 text-sm leading-relaxed text-gray-400 last:mb-0">{p}</p>
                ));
              }
              return <p className="text-sm leading-relaxed text-gray-400">{paragraphs}</p>;
            })()}
          </section>
        ))}
      </div>
    </div>
  );
}
