"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  budget: string | null;
  brief: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, "warning" | "success" | "default" | "gold"> = {
  new: "warning",
  contacted: "gold",
  qualified: "success",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const t = useTranslations("admin");
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(leads);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase();
    setSearch(q);
    setFiltered(
      leads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
    );
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { updateLeadStatus } = await import("@/server-actions/leads");
    await updateLeadStatus(id, status);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder={t("search_leads")}
        value={search}
        onChange={handleSearch}
      />

      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("name")}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("email")}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("service")}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("budget")}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("status")}</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">{t("date")}</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                <td className="px-4 py-3 text-gray-400 capitalize">{lead.service}</td>
                <td className="px-4 py-3 text-gray-400">{lead.budget || "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusColors[lead.status] || "default"}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {formatDate(lead.created_at)}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="rounded border border-white/10 bg-black/50 px-2 py-1 text-xs text-white"
                  >
                    <option value="new">{t("new")}</option>
                    <option value="contacted">{t("contacted")}</option>
                    <option value="qualified">{t("qualified")}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
