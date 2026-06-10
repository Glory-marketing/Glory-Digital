"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/server-actions/auth";
import { useUser } from "@/hooks/use-user";
import { useLocale, useTranslations } from "next-intl";

const navItems = [
  { href: "/glory-admin", label: "admin.dashboard", icon: "◆" },
  { href: "/glory-admin/portfolio", label: "admin.portfolio", icon: "▣" },
  { href: "/glory-admin/services", label: "admin.services", icon: "✦" },
  { href: "/glory-admin/page-builder", label: "admin.page_builder", icon: "◇" },
  { href: "/glory-admin/leads", label: "admin.leads", icon: "○" },
  { href: "/glory-admin/vault", label: "admin.vault", icon: "●" },
  { href: "/glory-admin/ai-manager", label: "admin.ai_manager", icon: "◎" },
  { href: "/glory-admin/analytics", label: "admin.analytics", icon: "◈" },
  { href: "/glory-admin/team", label: "admin.team", icon: "◉" },
];

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { profile } = useUser();
  const currentLocale = useLocale();
  const t = useTranslations("admin");
  const otherLocale = currentLocale === "ar" ? "en" : "ar";

  const handleLogout = async () => {
    await signOut();
    window.location.href = `/${locale}`;
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/5 bg-[#121212]">
      <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Glory"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
          <span className="text-xs text-gray-500">Admin</span>
        </div>
        <Link
          href={`/${otherLocale}${pathname.replace(`/${locale}`, "") || "/glory-admin"}`}
          className="rounded-md px-2 py-1 text-xs font-medium text-[#BF953F] hover:bg-[#BF953F]/10 transition-all"
        >
          {otherLocale === "ar" ? "AR" : "EN"}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === `/${locale}${item.href}`;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-[#BF953F]/10 text-[#FCF6BA] border-l-2 border-[#BF953F]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {t(item.label.replace("admin.", ""))}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-3 py-4">
        {profile && (
          <div className="mb-3 px-3 text-xs text-gray-500">
            {profile.full_name || "Admin"} — {profile.role}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-all hover:text-white hover:bg-white/5"
        >
          <span className="text-lg">✕</span>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
