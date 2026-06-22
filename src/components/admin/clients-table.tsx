"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function ClientsTable({
  clients,
  locale,
}: {
  clients: Client[];
  locale: string;
}) {
  const isRtl = locale === "ar";

  return (
    <Card>
      <div className="space-y-2">
        {clients.length === 0 ? (
          <div className="rounded-lg border border-white/5 p-12 text-center">
            <p className="text-gray-500">
              {isRtl ? "لا يوجد عملاء مسجلين بعد" : "No registered clients yet"}
            </p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3 transition-all hover:border-[#BF953F]/30"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {client.full_name || client.email}
                </p>
                <p className="text-xs text-gray-500 truncate">{client.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  variant={
                    client.role === "Super_Admin"
                      ? "gold"
                      : client.role === "Admin"
                        ? "default"
                        : "default"
                  }
                >
                  {client.role === "Super_Admin"
                    ? isRtl ? "مشرف عام" : "Super Admin"
                    : client.role === "Admin"
                      ? isRtl ? "مشرف" : "Admin"
                      : isRtl ? "محرر" : "Editor"}
                </Badge>
                {!client.is_active && (
                  <Badge variant="danger">
                    {isRtl ? "غير نشط" : "Inactive"}
                  </Badge>
                )}
                <span className="text-xs text-gray-600">
                  {new Date(client.created_at).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
