import { Sidebar } from "@/components/admin/sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="flex min-h-screen bg-[#0B0B0B]">
      <Sidebar locale={locale} />
      <main className="ml-64 flex-1 overflow-auto">
        <div className="animate-in fade-in slide-in-from-bottom-2 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
