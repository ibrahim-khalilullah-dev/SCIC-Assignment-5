"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Send } from "lucide-react";
import { motion } from "motion/react";

export default function Newsletter(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-t from-[#dfb780]/5 via-[#040404] to-[#040404] border-t border-white/[0.02] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl mx-auto space-y-6"
      >
        <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780] mx-auto">
          <Send className="w-4 h-4" />
        </div>
        <h2 className="text-2xl font-light uppercase tracking-[0.18em] text-white">
          Join Aetheris Insights
        </h2>
        <p className="text-neutral-400 text-xs font-light max-w-md mx-auto leading-relaxed">
          Subscribe to receive curated design alerts showcasing minimalist
          architectures and design optimizations.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-[#dfb780]/5 border border-[#dfb780]/15 rounded-xl text-[#dfb780] text-xs font-semibold uppercase tracking-wider"
          >
            Successfully Added to Registry
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4"
          >
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="flex-1 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:border-[#dfb780] focus:shadow-lg focus:shadow-[#dfb780]/5 rounded-lg px-4 py-3 text-xs uppercase tracking-wider focus:outline-none text-white transition-all duration-300"
            />
            <Button
              type="submit"
              className="h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] hover:scale-[1.02] text-black text-xs font-bold uppercase tracking-wider px-6 rounded-lg transition duration-300 shadow-md shadow-[#dfb780]/5"
            >
              Subscribe
            </Button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
