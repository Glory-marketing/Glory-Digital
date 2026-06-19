"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  image_url: string;
  category: string;
}

interface Props {
  projects: Project[];
  locale: string;
}

function getVisibleCount(): number {
  if (typeof window === "undefined") return 5;
  if (window.innerWidth < 640) return 3;
  if (window.innerWidth < 1024) return 5;
  return 7;
}

export function PortfolioGallery3D({ projects, locale }: Props) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    setVisibleCount(getVisibleCount());
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const startAutoRotate = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % projects.length);
    }, 4000);
  }, [projects.length]);

  const stopAutoRotate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!hovered && projects.length > 1) {
      startAutoRotate();
    } else {
      stopAutoRotate();
    }
    return stopAutoRotate;
  }, [hovered, projects.length, startAutoRotate, stopAutoRotate]);

  const goNext = () => setActive((prev) => (prev + 1) % projects.length);
  const goPrev = () => setActive((prev) => (prev - 1 + projects.length) % projects.length);

  const angleStep = 360 / visibleCount;
  const radius = 280;

  const getTitle = (p: Project) => (locale === "ar" ? p.title_ar || p.title_en : p.title_en);

  return (
    <div
      className="relative mx-auto flex h-[520px] w-full max-w-5xl items-center justify-center overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: -(active * angleStep) }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          {projects.map((project, i) => {
            const angle = i * angleStep;
            const isFront = i === active;
            return (
              <motion.div
                key={project.id}
                className="absolute cursor-pointer"
                style={{
                  width: isFront ? 220 : 180,
                  height: isFront ? 300 : 250,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  width: isFront ? 220 : 180,
                  height: isFront ? 300 : 250,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <div
                  className={`flex h-full w-full flex-col overflow-hidden rounded-xl border ${
                    isFront
                      ? "border-[#BF953F] shadow-[0_0_30px_rgba(191,149,63,0.4)]"
                      : "border-white/10"
                  } bg-gradient-to-b from-[#1a1a1a] to-[#121212] transition-all duration-300`}
                >
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={getTitle(project)}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] uppercase tracking-wider text-[#BF953F]">
                      {project.category}
                    </span>
                    <h3
                      className={`mt-1 font-semibold text-white leading-tight ${
                        isFront ? "text-sm" : "text-xs"
                      }`}
                    >
                      {getTitle(project)}
                    </h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:border-[#BF953F]/50 hover:text-[#BF953F] sm:left-4"
        aria-label="Previous"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white backdrop-blur-sm transition-all hover:border-[#BF953F]/50 hover:text-[#BF953F] sm:right-4"
        aria-label="Next"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 flex gap-2">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-6 bg-[#BF953F]" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
