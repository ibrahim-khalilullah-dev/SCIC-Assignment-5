import React from "react";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Pipeline from "@/components/Pipeline";
import Editorial from "@/components/Editorial";
import Inquiries from "@/components/Inquiries";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function LandingPage(): React.JSX.Element {
  return (
    <div className="bg-gradient-to-tr from-[#030303] via-[#09090d] to-[#020202] text-neutral-100 min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <Pipeline />
      <Editorial />
      <Inquiries />
      <Newsletter />
      <Footer />
    </div>
  );
}

