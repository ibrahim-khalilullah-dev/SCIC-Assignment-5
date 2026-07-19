"use client";

import React from "react";
import { motion } from "motion/react";
import { Compass, Sparkles, Layers } from "lucide-react";

export default function Editorial(): React.JSX.Element {
  const values = [
    {
      icon: <Layers className="w-6 h-6 text-[#dfb780]" />,
      title: "I. Form",
      description:
        "Form is the silent language of structural gravity. We curate geometry that honors pure volume and minimalist restraint. From the raw block contours of Modernist Brutalism to the delicate proportions of Japandi structures, every line is calculated to convey architectural honesty.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#dfb780]" />,
      title: "II. Light",
      description:
        "Light is the dynamic canvas of interior perception. We design openings, skylights, and reflection surfaces that treat natural light as a precious raw material. Our AI-driven models evaluate diurnal shading vectors to ensure spaces breathe and evolve from sunrise to dusk.",
    },
    {
      icon: <Compass className="w-6 h-6 text-[#dfb780]" />,
      title: "III. Materiality",
      description:
        "Materiality represents the tactile core of physical spaces. We prioritize raw, honest textures: rough-cast concrete, hand-planed timbers, and brush-finished metals. By selecting materials that age gracefully, we build spaces that gather character and warmth over time.",
    },
  ];

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 border-t border-b border-white/[0.02] bg-[#040404]">
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
        <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
          Design Philosophy
        </span>
        <h2 className="text-3xl font-light uppercase tracking-widest text-white">
          Aesthetic Pillars
        </h2>
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          The curated values that govern every blueprint, layout recommendation, and spatial vector registered in the Aetheris Vault.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((val, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
            className="bg-[#0a0a0d] border border-white/[0.02] hover:border-[#dfb780]/15 p-8 rounded-2xl space-y-6 transition duration-300 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center">
              {val.icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {val.title}
              </h3>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {val.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
