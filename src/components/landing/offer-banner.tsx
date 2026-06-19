"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

function getRemaining(end: number): { h: number; m: number; s: number } {
  const diff = Math.max(0, end - Date.now());
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export function OfferBanner() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [end] = useState(() => Date.now() + 86400000);
  const [remaining, setRemaining] = useState(() => getRemaining(end));
  const expired = remaining.h + remaining.m + remaining.s === 0;

  useEffect(() => {
    const id = setInterval(() => {
      const r = getRemaining(end);
      setRemaining(r);
    }, 1000);
    return () => clearInterval(id);
  }, [end]);

  const digit = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
      <div className="container mx-auto flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-semibold text-black md:gap-6 md:text-sm">
        <span className="rounded bg-black/10 px-2 py-0.5 tracking-wider">
          {isRtl ? "عرض خاص" : "OFFER"}
        </span>

        {expired ? (
          <span>{isRtl ? "انتهى العرض" : "Offer expired"}</span>
        ) : (
          <div className="flex items-center gap-2" dir="ltr">
            <span className="tabular-nums">{digit(remaining.h)}</span>
            <span className="opacity-50">:</span>
            <span className="tabular-nums">{digit(remaining.m)}</span>
            <span className="opacity-50">:</span>
            <span className="tabular-nums">{digit(remaining.s)}</span>
          </div>
        )}

        <Link
          href={`/${locale}/quote`}
          className="rounded bg-black px-3 py-1 text-white transition-opacity hover:opacity-80"
        >
          {isRtl ? "اطلب عرض سعر" : "Get Quote"}
        </Link>
      </div>
    </motion.div>
  );
}
