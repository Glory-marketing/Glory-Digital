"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sendInvitation, revokeInvitation } from "@/server-actions/invitations";
import { useToast } from "@/components/ui/toast";
import { useUser } from "@/hooks/use-user";
import { useTranslations } from "next-intl";

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
  userRole,
}: {
  members: Member[];
  invitations: Invitation[];
  userRole?: string | null;
}) {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const { profile } = useUser();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");
  const [sending, setSending] = useState(false);
  const [inviteLink, setInviteLink] = useState("");

  const effectiveRole = profile?.role || userRole;
  const canInvite =
    effectiveRole === "Super_Admin" || effectiveRole === "Admin";

  const handleInvite = async () => {
    if (!email) return;
    setSending(true);
    try {
      const result = await sendInvitation(email, role);
      if (result?.inviteLink) {
        await navigator.clipboard.writeText(result.inviteLink);
        setInviteLink(result.inviteLink);
        toast(t("invite_copied"), "success");
      } else {
        toast(t("invite_created"), "success");
      }
      setEmail("");
    } catch {
      toast(t("invite_failed"), "error");
    }
    setSending(false);
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitation(id);
      toast(t("invite_revoked"), "info");
    } catch {
      toast(t("invite_revoke_failed"), "error");
    }
  };

  return (
    <div className="space-y-8">
      {canInvite && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("invite_team")}</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder={t("invite_email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white"
            >
              <option value="Editor">{t("editor")}</option>
              <option value="Admin">{t("admin_role")}</option>
              {profile?.role === "Super_Admin" && (
                <option value="Super_Admin">{t("super_admin")}</option>
              )}
            </select>
            <Button onClick={handleInvite} disabled={sending}>
              {sending ? t("sending") : t("invite")}
            </Button>
          </div>
          {inviteLink && (
            <div className="mt-3 rounded-lg border border-[#BF953F]/30 bg-[#BF953F]/5 px-3 py-2">
              <p className="text-xs text-gray-400 mb-1">{t("invite_link")}</p>
              <p className="text-sm text-[#FCF6BA] break-all">{inviteLink}</p>
            </div>
          )}
        </Card>
      )}

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("team_members")}</h3>
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
                  <Badge variant="danger">{t("inactive")}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {invitations.length > 0 && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("pending_invitations")}</h3>
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
                    <Badge variant="success">{t("accepted")}</Badge>
                  ) : (
                    <>
                      <Badge variant="warning">{t("pending")}</Badge>
                      {canInvite && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevoke(inv.id)}
                        >
                          {t("revoke")}
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
