"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const WHATSAPP_NUMBER = "201123328964";

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
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-xl">
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
              href={`/${locale}#services`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("services")}
            </Link>
            <Link
              href={`/${locale}#portfolio`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {t("portfolio")}
            </Link>
            <Link
              href={`/${locale}#contact`}
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
                href={`/${locale}#services`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("services")}
              </Link>
              <Link
                href={`/${locale}#portfolio`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("portfolio")}
              </Link>
              <Link
                href={`/${locale}#contact`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t("contact")}
              </Link>
              <div className="flex gap-3 border-t border-white/5 pt-4">
                {routing.locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}`}
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

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:shadow-xl hover:shadow-green-500/40"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

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
                {locale === "ar"
                  ? "جلوري للتسويق - شريكك المتكامل في الدعاية والإعلان، المطبوعات، اليفط، والتسويق الإلكتروني. نصنع المجد لعلامتك التجارية."
                  : "Glory For Marketing - Your complete partner in advertising, printing materials, flyers, and digital marketing. We build glory for your brand."}
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {locale === "ar" ? "روابط سريعة" : "Quick Links"}
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href={`/${locale}#services`} className="hover:text-[#FCF6BA] transition-colors">{t("services")}</Link></li>
                <li><Link href={`/${locale}#portfolio`} className="hover:text-[#FCF6BA] transition-colors">{t("portfolio")}</Link></li>
                <li><Link href={`/${locale}#contact`} className="hover:text-[#FCF6BA] transition-colors">{t("contact")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {locale === "ar" ? "تواصل معنا" : "Contact"}
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="https://facebook.com/glorymarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/glorymarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/company/glorymarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#FCF6BA] transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-white/5 pt-8 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Glory For Marketing. 
              {locale === "ar" ? " جميع الحقوق محفوظة." : " All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
