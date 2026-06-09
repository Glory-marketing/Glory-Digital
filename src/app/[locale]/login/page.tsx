"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { signInWithMagicLink } from "@/server-actions/auth";
import { motion } from "framer-motion";

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signInWithMagicLink(email);
      setSent(true);
    } catch {
      setError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0B0B] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/5 bg-[#121212] p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-500">Enter your email to receive a magic link</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-green-600/30 bg-green-900/30 p-6 text-center">
            <p className="text-green-400">Check your email for the magic link!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#BF953F] focus:outline-none focus:ring-1 focus:ring-[#BF953F]"
                placeholder="admin@glory.com"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] px-8 py-3 font-medium text-black transition-all hover:brightness-110"
            >
              Send Magic Link
            </button>

            <p className="text-center text-xs text-gray-500">
              <a href={`/${locale}`} className="text-[#BF953F] hover:underline">
                Back to home
              </a>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
