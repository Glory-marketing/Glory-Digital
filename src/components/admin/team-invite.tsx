"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sendInvitation, revokeInvitation } from "@/server-actions/invitations";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/hooks/use-user";

interface Invitation {
  id: string;
  email: string;
  role: string;
  accepted_at: string | null;
  expires_at: string;
}

interface Member {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
}

export function TeamInvite({
  members,
  invitations,
}: {
  members: Member[];
  invitations: Invitation[];
}) {
  const { toast } = useToast();
  const { profile } = useUser();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [sending, setSending] = useState(false);

  const canInvite =
    profile?.role === "Super_Admin" || profile?.role === "Admin";

  const handleInvite = async () => {
    if (!email) return;
    setSending(true);
    try {
      await sendInvitation(email, role);
      toast("Invitation sent!", "success");
      setEmail("");
    } catch {
      toast("Failed to send invitation", "error");
    }
    setSending(false);
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitation(id);
      toast("Invitation revoked", "info");
    } catch {
      toast("Failed to revoke", "error");
    }
  };

  return (
    <div className="space-y-8">
      {canInvite && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Invite Team Member</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
            >
              <option value="Editor">Editor</option>
              <option value="Admin">Admin</option>
              {profile?.role === "Super_Admin" && (
                <option value="Super_Admin">Super Admin</option>
              )}
            </select>
            <Button onClick={handleInvite} disabled={sending}>
              {sending ? "Sending..." : "Invite"}
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">Team Members</h3>
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {member.full_name || member.email}
                </p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.role === "Super_Admin" ? "gold" : "default"}>
                  {member.role}
                </Badge>
                {!member.is_active && (
                  <Badge variant="danger">Inactive</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">Pending Invitations</h3>
          <div className="space-y-2">
            {invitations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">{inv.email}</p>
                  <p className="text-xs text-gray-500">Role: {inv.role}</p>
                </div>
                <div className="flex items-center gap-2">
                  {inv.accepted_at ? (
                    <Badge variant="success">Accepted</Badge>
                  ) : (
                    <>
                      <Badge variant="warning">Pending</Badge>
                      {canInvite && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevoke(inv.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
