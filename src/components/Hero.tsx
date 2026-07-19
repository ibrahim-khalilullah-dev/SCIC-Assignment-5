"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const BANNER_IMAGES: string[] = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg",
];

export default function Hero(): React.JSX.Element {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative h-[75vh] pt-28 flex items-center justify-center overflow-hidden px-6 border-b border-white/[0.02]">
      <div className="absolute inset-0 z-0 bg-[#040404]">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={BANNER_IMAGES[index]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
            alt="Luxury Spatial Blueprint"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-b from-[#040404]/50 via-[#040404]/85 to-[#040404]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#dfb780]/5 blur-[140px] rounded-full pointer-events-none"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-[#dfb780]/5 border border-[#dfb780]/15 rounded-full text-[9px] text-[#dfb780] uppercase tracking-[0.2em] font-semibold"
        >
          <Sparkles className="w-3 h-3" /> Cognitive Spatial Design
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-light uppercase tracking-[0.18em] leading-tight text-white font-sans max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="block"
          >
            Aesthetics
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-[#f3d0a4] via-[#dfb780] to-[#a37943] text-transparent bg-clip-text italic font-serif normal-case tracking-normal block mt-2"
          >
            Redefined
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-neutral-400 text-[10px] tracking-widest leading-relaxed max-w-2xl mx-auto font-light uppercase"
        >
          An elite showcase of structural design augmented with advanced
          multi-modal agents.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/browse" className="w-full sm:w-auto">
            <Button className="h-11 px-6 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition duration-300 w-full sm:w-auto shadow-lg shadow-[#dfb780]/5">
              Explore Spaces <ArrowRight className="w-3.5 h-3.5 ml-2 inline" />
            </Button>
          </Link>
          <Link href="/auth/signup" className="w-full sm:w-auto">
            <Button className="h-11 px-6 bg-white/[0.01] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition w-full">
              Architect Register
            </Button>
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
