"use client";

import { useSupabase } from "@/providers/supabase-provider";

export function useUser() {
  return useSupabase();
}
