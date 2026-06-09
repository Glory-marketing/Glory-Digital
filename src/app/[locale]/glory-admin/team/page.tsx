import { TeamInvite } from "@/components/admin/team-invite";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TeamPage() {
  const supabase = await createServerSupabaseClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profDb = supabase.from("profiles") as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const invDb = supabase.from("invitations") as any;

  const { data: members } = await profDb
    .select("*")
    .order("created_at", { ascending: false });

  const { data: invitations } = await invDb
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <p className="text-sm text-gray-500">
          Manage team members and invitations
        </p>
      </div>

      <TeamInvite members={members || []} invitations={invitations || []} />
    </div>
  );
}
