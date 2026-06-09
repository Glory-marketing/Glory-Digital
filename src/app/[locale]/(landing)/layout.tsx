"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const locales = [
  { code: "en", label: "EN" },
  { code: "ar", label: "العربية" },
];

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);

  const currentLocale = pathname.split("/")[1];

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPath;
  };

  return (
    <>
      {/* Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/${currentLocale}`} className="flex items-center">
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
              href={`/${currentLocale}#services`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Services
            </Link>
            <Link
              href={`/${currentLocale}#portfolio`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Portfolio
            </Link>
            <Link
              href={`/${currentLocale}#contact`}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              Contact
            </Link>
            <div className="flex gap-2 border-l border-white/10 pl-4">
              {locales.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`text-xs transition-colors ${
                    currentLocale === l.code
                      ? "text-[#FCF6BA]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <Link
              href={`/${currentLocale}/glory-admin`}
              className="rounded-lg border border-[#BF953F]/30 px-4 py-1.5 text-xs text-[#FCF6BA] transition-all hover:bg-[#BF953F]/10"
            >
              Admin
            </Link>
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
                href={`/${currentLocale}#services`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400"
              >
                Services
              </Link>
              <Link
                href={`/${currentLocale}#portfolio`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400"
              >
                Portfolio
              </Link>
              <Link
                href={`/${currentLocale}#contact`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-400"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0B0B0B] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo.png"
              alt="Glory"
              width={100}
              height={32}
              className="h-8 w-auto opacity-80"
            />
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Glory For Marketing. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
