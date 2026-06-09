"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { acceptInvitation } from "@/server-actions/invitations";
import { useToast } from "@/components/ui/toast";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }
    if (password.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }

    setSubmitting(true);
    try {
      await acceptInvitation(token, password);
      setSuccess(true);
      toast("Account created! You can now log in.", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to accept invitation",
        "error"
      );
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-[#BF953F]/20 to-[#FCF6BA]/20 flex items-center justify-center">
            <span className="text-3xl text-[#FCF6BA]">✦</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Welcome to Glory!</h1>
          <p className="mb-6 text-gray-400">
            Your account has been created. You can now log in.
          </p>
          <a href="/en/glory-admin">
            <Button>Go to Dashboard</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Accept Invitation</h1>
          <p className="mt-2 text-gray-400">Set your password to get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/5 bg-[#121212] p-8"
        >
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            required
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating account..." : "Accept & Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
