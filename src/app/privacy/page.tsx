import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, CreditCard } from "lucide-react";

export default function PrivacyPage(): React.JSX.Element {
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
            Aetheris Legal
          </span>
          <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-white leading-tight">
            Privacy & Custody Policy
          </h1>
          <p className="text-xs text-neutral-500 font-light max-w-xl leading-relaxed">
            Review Aetheris protocols regarding spatial asset security, cryptographic blueprint custody, and merchant processing standards.
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#dfb780]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                1. Blueprint Custody & IP Protection
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              All architectural blueprints, CAD schemas, and vector files registered in the Aetheris Vault are held under strict custody. We implement access-control policies limiting file access exclusively to verified license holders. Raw project files are encrypted at rest and served using time-limited, signed URLs to prevent unauthorized dissemination of intellectual property.
            </p>
          </div>

          <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#dfb780]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                2. Spatial & Cognitive Data Privacy
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              When you submit spatial coordinates or room dimensions to our AI Curator or Recommender, the data is processed transiently to generate design insights. We do not sell or monetize structural layout maps. Uploaded telemetry is isolated per user session and is never utilized to train public, multi-tenant generative models.
            </p>
          </div>

          <div className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#dfb780]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                3. Payment Compliance & Stripe Security
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Financial operations, licensing plan acquisitions, and Stripe subscription transactions are processed directly by Stripe’s secure merchant servers. Aetheris does not store, transmit, or cache sensitive cardholder numbers. Transactions comply with PCI-DSS guidelines, utilizing tokenized authentication to guarantee secure payment flows.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.02] flex justify-between items-center text-[10px] text-neutral-600 uppercase tracking-widest">
          <span>Effective July 2026</span>
          <span>Aetheris Compliance Registry</span>
        </div>
      </div>
    </main>
  );
}
