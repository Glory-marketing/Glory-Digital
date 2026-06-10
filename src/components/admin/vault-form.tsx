"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { storeCredential, deleteCredential } from "@/server-actions/vault";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

export function VaultForm() {
  const t = useTranslations("admin");
  const { toast } = useToast();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await storeCredential(
        formData.get("name") as string,
        formData.get("value") as string,
        formData.get("provider") as string
      );
      toast(t("credential_stored"), "success");
      form.reset();
    } catch {
      toast(t("credential_store_failed"), "error");
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteCredential(name);
      toast(t("credential_deleted"), "info");
    } catch {
      toast(t("credential_delete_failed"), "error");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("add_credential")}</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input name="name" label={t("credential_name")} placeholder="OPENAI_API_KEY" required />
            <Input name="provider" label={t("credential_provider")} placeholder="OpenAI" required />
            <Input
              name="value"
              label={t("credential_value")}
              type="password"
              placeholder="sk-..."
              required
            />
          </div>
          <Button type="submit">{t("store_encrypted")}</Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">{t("existing_credentials")}</h3>
        <p className="text-sm text-gray-500">{t("credentials_masked")}</p>
      </Card>
    </div>
  );
}
