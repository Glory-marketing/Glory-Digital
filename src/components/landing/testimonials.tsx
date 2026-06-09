"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Al-Rashid",
    role: "CEO, LuxCorp",
    content: "Glory transformed our digital presence completely. The results exceeded our expectations.",
  },
  {
    name: "Ahmed Hassan",
    role: "Founder, TechVentures",
    content: "Working with Glory was a game-changer. Their attention to detail is unmatched.",
  },
  {
    name: "Layla Mohammed",
    role: "Marketing Director, Prestige Brands",
    content: "The team at Glory delivered a masterpiece. Our engagement rates have never been higher.",
  },
];

export function Testimonials({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white">
            What <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Clients</span> Say
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-xl border border-white/5 bg-[#121212] p-6"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className="text-[#BF953F]">★</span>
                ))}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                &ldquo;{item.content}&rdquo;
              </p>
              <div>
                <p className="font-medium text-white">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
