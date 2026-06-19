"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";

interface CompareImage {
  url: string;
  title: string;
}

interface CompareModalProps {
  images: CompareImage[];
  onClose: () => void;
}

export function CompareModal({ images, onClose }: CompareModalProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [handleEscape]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#121212] p-4 shadow-2xl md:p-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <button
            onClick={onClose}
            className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#121212] text-white transition-colors hover:text-[#FCF6BA] border border-white/10"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className={`flex flex-col gap-4 md:flex-row ${isRtl ? "md:flex-row-reverse" : ""}`}>
            {images.slice(0, 2).map((img, i) => (
              <div
                key={i}
                className="group relative flex-1 overflow-hidden rounded-xl border border-white/5 transition-all duration-300 hover:border-[#BF953F]/50 hover:shadow-lg hover:shadow-[#BF953F]/10"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-sm font-medium text-white">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
