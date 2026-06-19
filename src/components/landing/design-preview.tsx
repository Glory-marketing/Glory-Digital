"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

type MockupType = "tshirt" | "billboard" | "bizcard" | "phone";

interface DesignPreviewProps {
  imageUrl: string;
  mockupType?: MockupType;
}

const labels: Record<string, { en: string; ar: string }> = {
  tshirt: { en: "T-Shirt", ar: "تي شيرت" },
  billboard: { en: "Billboard", ar: "لوحة إعلانية" },
  bizcard: { en: "Business Card", ar: "بطاقة عمل" },
  phone: { en: "Phone", ar: "جوال" },
};

export function DesignPreview({ imageUrl, mockupType = "tshirt" }: DesignPreviewProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [active, setActive] = useState<MockupType>(mockupType);

  const types: MockupType[] = ["tshirt", "billboard", "bizcard", "phone"];

  return (
    <div className="rounded-xl border border-white/5 bg-[#121212] p-4 md:p-6" dir={isRtl ? "rtl" : "ltr"}>
      <div className={`mb-4 flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              active === t
                ? "bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black"
                : "border border-white/10 text-gray-400 hover:border-[#BF953F]/30 hover:text-white"
            }`}
          >
            {isRtl ? labels[t].ar : labels[t].en}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center">
        {active === "tshirt" && (
          <div className="relative h-72 w-56">
            <div className="absolute inset-0 rounded-[3rem] border-2 border-white/10 bg-zinc-900" />
            <div className="absolute inset-x-4 top-12 bottom-16 rounded-xl border-2 border-dashed border-white/5 bg-zinc-800/50 flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover opacity-90"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 h-6 w-16 -translate-x-1/2 rounded-full border border-white/5" />
            <div className="absolute left-1/2 top-2 h-8 w-2 -translate-x-1/2 rounded-full border border-white/5" />
          </div>
        )}

        {active === "billboard" && (
          <div className="relative w-full max-w-lg">
            <div className="relative overflow-hidden rounded-lg border-2 border-white/10 bg-zinc-900 shadow-2xl">
              <img
                src={imageUrl}
                alt=""
                className="h-48 w-full object-cover md:h-64"
              />
            </div>
            <div className="mx-auto mt-2 h-1 w-3/4 rounded bg-zinc-800" />
            <div className="mx-auto h-16 w-2 rounded-b-full bg-zinc-800" />
          </div>
        )}

        {active === "bizcard" && (
          <div className="relative h-44 w-72">
            <div className="absolute inset-0 rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
              <div className="absolute left-0 top-0 h-full w-[35%] rounded-l-xl bg-zinc-800 p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={imageUrl}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
              </div>
              <div className="absolute right-0 top-0 h-full w-[65%] rounded-r-xl overflow-hidden">
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        )}

        {active === "phone" && (
          <div className="relative h-[28rem] w-52">
            <div className="absolute inset-0 rounded-[2.5rem] border-[3px] border-zinc-700 bg-zinc-900 shadow-2xl">
              <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-800" />
              <div className="absolute inset-x-2 top-8 bottom-8 overflow-hidden rounded-2xl border border-white/5">
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute bottom-3 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-800" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
