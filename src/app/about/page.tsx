import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles, Building, Code2 } from "lucide-react";

export default function AboutPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#040404] text-neutral-100 pt-28 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#dfb780]/70 hover:text-[#dfb780] transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em] block">
            Aetheris Studio
          </span>
          <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-white leading-tight">
            Curating Spatial Legacies
          </h1>
          <p className="text-xs text-neutral-500 font-light max-w-xl leading-relaxed">
            Aetheris bridges physical structural mastery with cognitive design execution, bringing elite spatial templates to the digital vanguard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center">
              <Building className="w-5 h-5 text-[#dfb780]" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Heritage & Origin
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Founded at the intersection of Copenhagen's functional simplicity and Kyoto's wabi-sabi aesthetics, Aetheris has spent a decade designing physical spaces that honor quiet luxury. We believe architecture is not merely shelter, but a spatial dialogue between volume, material integrity, and natural light.
            </p>
          </div>

          <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#dfb780]" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Physical Collaborations
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              We collaborate with premier physical design houses in Tokyo, Berlin, and Stockholm. Through these partnerships, we digitize high-end spatial blueprints, cataloging curated layouts of Brutalist monoliths and Japandi minimalist homes to preserve and share physical legacy templates.
            </p>
          </div>
        </div>

        <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center shrink-0">
              <Code2 className="w-5 h-5 text-[#dfb780]" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-[#dfb780] font-bold block">
                The Digital Frontier
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Cognitive Spatial Pipelines
              </h2>
            </div>
          </div>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            By integrating generative AI with traditional architectural constraints, Aetheris introduces cognitive pipelines. Our platform analyzes spatial coordinates, evaluates diurnal lighting cycles, and generates layout modifications that satisfy structural demands. The result is a hybrid ecosystem where architects register their portfolios, users customize blueprints via natural language, and licensing is handled seamlessly on the blockchain of physical ideas.
          </p>
        </div>

        <div className="pt-8 border-t border-white/[0.02] flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest">
          <span>Established 2026</span>
          <span>Tokyo • Copenhagen • Berlin</span>
        </div>
      </div>
    </main>
  );
}
