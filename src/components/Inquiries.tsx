"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  q: string;
  a: string;
}

export default function Inquiries(): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const questions: Question[] = [
    {
      q: "How does Spatial Vision AI classify designs?",
      a: "Our integration feeds uploaded spatial blueprints or interior snaps to a multi-modal agent. It extracts structural tags, matches layout constraints against catalog parameters, and evaluates lighting balance automatically.",
    },
    {
      q: "Can physical interior designers register?",
      a: "Yes, Aetheris supports dual interfaces. Licensed architects can register profiles and publish customized design files, securing bookings directly through Stripe verification.",
    },
  ];

  const toggleInquiry = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 max-w-4xl mx-auto px-6">
      <div className="text-center space-y-4 mb-20">
        <HelpCircle className="w-7 h-7 text-[#dfb780] mx-auto animate-pulse" />
        <h2 className="text-2xl font-light uppercase tracking-widest text-white">
          System Inquiries
        </h2>
      </div>

      <div className="space-y-4">
        {questions.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`p-6 bg-gradient-to-r from-[#0a0a0d] to-[#040404] border rounded-xl transition-all duration-300 cursor-pointer ${
                isOpen
                  ? "border-[#dfb780]/30 shadow-lg shadow-[#dfb780]/2"
                  : "border-white/[0.02] hover:border-[#dfb780]/10"
              }`}
              onClick={() => toggleInquiry(i)}
            >
              <div className="flex items-center justify-between select-none">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-white">
                  {item.q}
                </h4>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-[#dfb780]"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-[11px] text-neutral-400 font-light pt-4 leading-relaxed border-t border-white/[0.02] mt-4">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
