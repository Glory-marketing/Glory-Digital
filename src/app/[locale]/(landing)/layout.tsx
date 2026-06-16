"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { GlobalChatbot } from "@/components/landing/global-chatbot";

const WHATSAPP_MARKETING = "20115191604";
const WHATSAPP_PRINTING = "201123328964";
const LOCATION_URL = "https://share.google/XYPHbFZfOtw4tCYfI";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-xl before:absolute before:left-0 before:right-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#BF953F] before:to-transparent before:pointer-events-none">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Glory"
              width={100}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href={`/${locale}`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("home")}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("services")}
            </Link>
            <Link
              href={`/${locale}/portfolio`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("portfolio")}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("contact")}
            </Link>
            <div className="flex gap-2 border-l border-white/10 pl-4">
              {routing.locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}${pathname.replace(`/${locale}`, "") || "/"}`}
                  className={`text-xs font-medium transition-colors ${
                    locale === l
                      ? "text-[#FCF6BA]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {l === "en" ? "EN" : "العربية"}
                </Link>
              ))}
            </div>
          </nav>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="text-white md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {mobileMenu && (
          <div className="border-t border-white/5 bg-[#0B0B0B] px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/services`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("services")}
              </Link>
              <Link
                href={`/${locale}/portfolio`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("portfolio")}
              </Link>
              <Link
                href={`/${locale}/about`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("about")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("contact")}
              </Link>
              <div className="flex gap-3 border-t border-white/5 pt-4">
                {routing.locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}${pathname.replace(`/${locale}`, "") || "/"}`}
                    onClick={() => setMobileMenu(false)}
                    className={`text-xs font-medium ${
                      locale === l ? "text-[#FCF6BA]" : "text-gray-500"
                    }`}
                  >
                    {l === "en" ? "English" : "العربية"}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <GlobalChatbot />

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 left-6 z-40 group">
        <a
          href={`https://wa.me/${WHATSAPP_MARKETING}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-green-500/40"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#121212] px-3 py-1.5 text-xs text-gray-300 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 border border-white/5">
          {t("wa_marketing")}
        </span>
      </div>

      <footer className="relative border-t border-white/5 bg-[#0B0B0B] py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <Image
                src="/logo.png"
                alt="Glory"
                width={120}
                height={38}
                className="mb-4 h-10 w-auto"
              />
              <p className="max-w-md text-sm leading-relaxed text-gray-500">
                {t("footer_desc")}
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {t("quick_links")}
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href={`/${locale}`} className="hover:text-[#FCF6BA] transition-colors">{t("home")}</Link></li>
                <li><Link href={`/${locale}/services`} className="hover:text-[#FCF6BA] transition-colors">{t("services")}</Link></li>
                <li><Link href={`/${locale}/portfolio`} className="hover:text-[#FCF6BA] transition-colors">{t("portfolio")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {t("contact_us")}
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href={`https://wa.me/${WHATSAPP_MARKETING}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t("wa_marketing")}
                  </a></li>
                <li><a href={`https://wa.me/${WHATSAPP_PRINTING}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    {t("wa_printing")}
                  </a></li>
                <li><a href={LOCATION_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {t("location")}
                  </a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/5 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Glory For Marketing. {t("all_rights")}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
