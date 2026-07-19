"use client";

import React from "react";
import { Maximize2, Sparkles, Layers } from "lucide-react";
import { motion } from "motion/react";

interface Feature {
  icon: React.JSX.Element;
  title: string;
  desc: string;
}

export default function Features(): React.JSX.Element {
  const list: Feature[] = [
    {
      icon: <Maximize2 className="w-4 h-4" />,
      title: "Spatial Vision AI",
      desc: "Upload physical interior layouts. Our vision pipeline categorizes aesthetics, defines functional color palettes, and tags structural properties.",
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: "Architectural Advisor",
      desc: "Engage with context-aware spatial agents capable of summarizing structural options, matching budgets, and resolving layout bottlenecks.",
    },
    {
      icon: <Layers className="w-4 h-4" />,
      title: "Verified Portfolios",
      desc: "High-end design properties checked for architectural safety limits. Fully functional checkout reservations managed via secure billing structures.",
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center space-y-4 mb-20">
        <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em] block">
          Platform Frameworks
        </span>
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.18em] text-white">
          Cognitive Design Features
        </h2>
        <p className="text-neutral-500 text-xs max-w-md mx-auto font-light leading-relaxed">
          Where physical properties merge with structural AI capabilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {list.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            className="p-8 bg-gradient-to-b from-[#0a0a0d] to-[#040404] border border-white/[0.02] hover:border-[#dfb780]/20 rounded-xl space-y-6 transition duration-300 group"
          >
            <div className="w-9 h-9 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780] group-hover:bg-[#dfb780]/10 transition">
              {item.icon}
            </div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-white group-hover:text-[#dfb780] transition">
              {item.title}
            </h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-light">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
