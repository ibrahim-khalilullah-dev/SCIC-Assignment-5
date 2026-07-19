"use client";

import React from "react";
import { motion } from "motion/react";

export default function Loading(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#040404] flex flex-col items-center justify-center p-6">
      <div className="space-y-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border border-[#dfb780]/20 flex items-center justify-center text-[#dfb780] font-serif italic text-lg shadow-lg shadow-[#dfb780]/5 mx-auto"
        >
          Æ
        </motion.div>
        <div className="space-y-2">
          <p className="text-[9px] text-[#dfb780] tracking-[0.25em] font-sans uppercase">
            Aetheris Studio
          </p>
          <p className="text-[8px] text-neutral-600 tracking-[0.15em] font-mono uppercase">
            COMPILING SPATIAL LAYOUTS...
          </p>
        </div>
      </div>
    </div>
  );
}
