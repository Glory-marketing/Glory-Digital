"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/server-actions/auth";
import { useUser } from "@/hooks/use-user";

const navItems = [
  { href: "/glory-admin", label: "admin.dashboard", icon: "◆" },
  { href: "/glory-admin/page-builder", label: "admin.page_builder", icon: "◇" },
  { href: "/glory-admin/leads", label: "admin.leads", icon: "○" },
  { href: "/glory-admin/vault", label: "admin.vault", icon: "●" },
  { href: "/glory-admin/ai-manager", label: "admin.ai_manager", icon: "◎" },
  { href: "/glory-admin/analytics", label: "admin.analytics", icon: "◈" },
  { href: "/glory-admin/team", label: "admin.team", icon: "◉" },
];

const messages: Record<string, string> = {
  "admin.dashboard": "Dashboard",
  "admin.page_builder": "Page Builder",
  "admin.leads": "Leads",
  "admin.vault": "API Vault",
  "admin.ai_manager": "AI Manager",
  "admin.analytics": "Analytics",
  "admin.team": "Team",
  "admin.logout": "Logout",
};

export function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { profile } = useUser();

  const handleLogout = async () => {
    await signOut();
    window.location.href = `/${locale}`;
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/5 bg-[#121212]">
      <div className="flex items-center gap-3 border-b border-white/5 px-6 py-5">
        <Image
          src="/logo.png"
          alt="Glory"
          width={80}
          height={24}
          className="h-6 w-auto"
        />
        <span className="text-xs text-gray-500">Admin</span>
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
              {messages[item.label]}
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
          {messages["admin.logout"]}
        </button>
      </div>
    </aside>
  );
}
