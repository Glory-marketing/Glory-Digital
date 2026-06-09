"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { storeCredential, deleteCredential } from "@/server-actions/vault";
import { useToast } from "@/components/ui/toast";

export function VaultForm() {
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
      toast("Credential stored securely!", "success");
      form.reset();
    } catch {
      toast("Failed to store credential", "error");
    }
  };

  const handleDelete = async (name: string) => {
    try {
      await deleteCredential(name);
      toast("Credential deleted", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">Add Credential</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input name="name" label="Name" placeholder="OPENAI_API_KEY" required />
            <Input name="provider" label="Provider" placeholder="OpenAI" required />
            <Input
              name="value"
              label="Value"
              type="password"
              placeholder="sk-..."
              required
            />
          </div>
          <Button type="submit">Store Encrypted</Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-white">Existing Credentials</h3>
        <p className="text-sm text-gray-500">Credentials are masked by default. Only Super Admins can view.</p>
      </Card>
    </div>
  );
}
