"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Permission {
  id: string;
  key: string;
  label_en: string;
  label_ar: string;
  module: string;
}

interface PermissionsManagerProps {
  permissions: Permission[];
  rolePermissions: { role: string; permission_key: string }[];
  locale: string;
}

const ROLES = ["Super_Admin", "Admin", "Editor", "Client"];

const roleColors: Record<string, string> = {
  Super_Admin: "text-red-400 border-red-500/30 bg-red-500/10",
  Admin: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  Editor: "text-blue-400 border-blue-500/30 bg-blue-500/10",
  Client: "text-green-400 border-green-500/30 bg-green-500/10",
};

export function PermissionsManager({ permissions, rolePermissions, locale }: PermissionsManagerProps) {
  const [localRp, setLocalRp] = useState(rolePermissions);
  const [saving, setSaving] = useState<string | null>(null);

  const hasPermission = useCallback(
    (role: string, key: string) => localRp.some((rp) => rp.role === role && rp.permission_key === key),
    [localRp]
  );

  const modules = [...new Set(permissions.map((p) => p.module))];

  const toggle = async (role: string, key: string) => {
    const grant = !hasPermission(role, key);
    setSaving(`${role}:${key}`);

    try {
      const res = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, permissionKey: key, grant }),
      });
      if (!res.ok) throw new Error("Failed");

      if (grant) {
        setLocalRp((prev) => [...prev, { role, permission_key: key }]);
      } else {
        setLocalRp((prev) => prev.filter((rp) => !(rp.role === role && rp.permission_key === key)));
      }
    } catch {
      // revert
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module tabs */}
      {modules.map((module) => (
        <div key={module} className="rounded-2xl border border-white/5 bg-[#121212] overflow-hidden">
          <div className="border-b border-white/5 px-5 py-3">
            <h3 className="font-semibold text-white text-sm">
              {module === "Users" ? (locale === "ar" ? "المستخدمين" : "Users") :
               module === "Projects" ? (locale === "ar" ? "المشاريع" : "Projects") :
               module === "Content" ? (locale === "ar" ? "المحتوى" : "Content") :
               module === "Leads" ? (locale === "ar" ? "العملاء المحتملين" : "Leads") :
               module === "Analytics" ? (locale === "ar" ? "التحليلات" : "Analytics") :
               module === "Vault" ? (locale === "ar" ? "الخزنة" : "Vault") :
               module === "Settings" ? (locale === "ar" ? "الإعدادات" : "Settings") :
               module === "Discounts" ? (locale === "ar" ? "الخصومات" : "Discounts") :
               module === "Printing" ? (locale === "ar" ? "الطباعة" : "Printing") :
               module}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500">{locale === "ar" ? "الصلاحية" : "Permission"}</th>
                  {ROLES.map((role) => (
                    <th key={role} className="px-4 py-3 text-center text-xs font-medium">
                      <span className={`rounded-full border px-2 py-0.5 ${roleColors[role] || ""}`}>
                        {role === "Super_Admin" ? "S-Admin" : role}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions
                  .filter((p) => p.module === module)
                  .map((perm, i) => (
                    <motion.tr
                      key={perm.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3">
                        <p className="font-medium text-white text-xs">
                          {locale === "ar" ? perm.label_ar : perm.label_en}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5 font-mono">{perm.key}</p>
                      </td>
                      {ROLES.map((role) => {
                        const enabled = hasPermission(role, perm.key);
                        const isLoading = saving === `${role}:${perm.key}`;
                        const canEdit = role !== "Super_Admin" || true; // Super_Admin always has all
                        const isSuperAdminLocked = role === "Super_Admin";

                        return (
                          <td key={role} className="px-4 py-3 text-center">
                            {isSuperAdminLocked ? (
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#BF953F]/20 text-xs text-[#BF953F]">✓</span>
                            ) : (
                              <button
                                onClick={() => toggle(role, perm.key)}
                                disabled={isLoading || !canEdit}
                                className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                                  enabled
                                    ? "border-green-500/40 bg-green-500/20 text-green-400"
                                    : "border-white/10 bg-white/5 text-gray-500 hover:border-white/20"
                                } disabled:opacity-50`}
                              >
                                {isLoading ? (
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#BF953F] border-t-transparent" />
                                ) : enabled ? (
                                  "✓"
                                ) : (
                                  "−"
                                )}
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
