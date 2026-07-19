"use client";

import React from "react";
import { motion } from "motion/react";

interface Step {
  num: string;
  title: string;
  desc: string;
}

export default function Pipeline(): React.JSX.Element {
  const steps: Step[] = [
    {
      num: "01",
      title: "Identity Match",
      desc: "Configure customized account properties, backed by highly secure Better-Auth authentication structures.",
    },
    {
      num: "02",
      title: "Analyze Interior",
      desc: "Utilize our Spatial Vision AI engine to upload room drafts, parsing aesthetics parameters instantly.",
    },
    {
      num: "03",
      title: "Secure Booking",
      desc: "Confirm spatial design bookings or purchase licensing structures handled by mock Stripe endpoints safely.",
    },
    {
      num: "04",
      title: "Design Deployment",
      desc: "Directly sync blueprints to your physical space backed by continuous AI spatial optimization support.",
    },
  ];

  return (
    <section className="py-24 bg-[#07070a]/50 border-y border-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em] block font-mono">
            The Flow
          </span>
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[0.18em]">
            Architectural Pipeline
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2, ease: "easeOut" }}
              className="space-y-4 group"
            >
              <div className="text-4xl font-light text-[#dfb780]/10 font-serif italic group-hover:text-[#dfb780]/30 transition duration-300">
                {s.num}
              </div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                {s.title}
              </h4>
              <p className="text-[11px] text-neutral-400 font-light leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
