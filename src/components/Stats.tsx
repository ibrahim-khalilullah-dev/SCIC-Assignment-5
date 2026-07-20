"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Metric {
  value: string;
  label: string;
}

export default function Stats(): React.JSX.Element {
  const [metrics, setMetrics] = useState<Metric[]>([
    { value: "180+", label: "Curated Havens" },
    { value: "4.92", label: "Aesthetic Rating" },
    { value: "25k+", label: "Analyzed Spaces" },
    { value: "12", label: "Elite Agencies" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setMetrics([
            { value: data.curatedHavens, label: "Curated Havens" },
            { value: data.aestheticRating, label: "Aesthetic Rating" },
            { value: data.analyzedSpaces, label: "Analyzed Spaces" },
            { value: data.eliteAgencies, label: "Elite Agencies" },
          ]);
        }
      } catch (err) {
        // Keep default metric configurations on execution error
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="py-16 border-b border-white/[0.02] bg-[#07070a]/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            className="space-y-2 group"
          >
            <div className="text-2xl md:text-3xl font-light text-[#dfb780] bg-gradient-to-r from-[#f3d0a4] to-[#c2965d] bg-clip-text text-transparent tracking-wider group-hover:scale-105 transition duration-300">
              {m.value}
            </div>
            <div className="text-[9px] text-neutral-500 uppercase tracking-[0.25em] font-semibold">
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
