"use client";

import { motion } from "framer-motion";

const projects = [
  {
    title: "Luxury Brand Identity",
    category: "Design",
    image: "/placeholder.svg",
  },
  {
    title: "E-Commerce Platform",
    category: "Development",
    image: "/placeholder.svg",
  },
  {
    title: "Digital Marketing Campaign",
    category: "Marketing",
    image: "/placeholder.svg",
  },
];

export function Portfolio({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <section id="portfolio" className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-white">
            Our <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">Work</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#121212]"
            >
              <div className="aspect-video bg-gradient-to-br from-[#BF953F]/10 to-[#B38728]/10 flex items-center justify-center">
                <span className="text-4xl text-[#BF953F]/30">✦</span>
              </div>
              <div className="p-4">
                <span className="text-xs text-[#BF953F]">{project.category}</span>
                <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-[#FCF6BA] transition-colors">
                  {project.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
