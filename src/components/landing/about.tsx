"use client";

import { motion } from "framer-motion";

interface AboutProps {
  content: string;
  visible: boolean;
}

export function About({ content, visible }: AboutProps) {
  if (!visible) return null;

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white">
            About <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Glory</span>
          </h2>
          <div className="prose prose-invert mx-auto">
            <p className="text-lg leading-relaxed text-gray-300">{content}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
