import React from "react";
import Link from "next/link";

export default function Footer(): React.JSX.Element {
  return (
    <footer className="bg-[#040404] border-t border-white/[0.02] pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border border-neutral-800 flex items-center justify-center text-neutral-400 text-xs">
              Æ
            </div>
            <span className="font-light tracking-[0.15em] text-neutral-300 text-sm">
              Aetheris
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light uppercase tracking-wider leading-relaxed">
            Curating luxury physical spaces matched natively with cognitive
            vision layers.
          </p>
        </div>

        <div>
          <h5 className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mb-4">
            Portfolios
          </h5>
          <ul className="space-y-2 text-[10px] text-neutral-400 uppercase tracking-widest">
            <li>
              <Link href="/browse" className="hover:text-[#dfb780] transition">
                Brutalist
              </Link>
            </li>
            <li>
              <Link href="/browse" className="hover:text-[#dfb780] transition">
                Minimalist
              </Link>
            </li>
            <li>
              <Link href="/browse" className="hover:text-[#dfb780] transition">
                Japandi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mb-4">
            Inquiries
          </h5>
          <ul className="space-y-2 text-[10px] text-neutral-400 uppercase tracking-widest">
            <li>
              <Link href="/contact" className="hover:text-[#dfb780] transition">
                Architect Registry
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#dfb780] transition">
                Client Retainers
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] text-white font-bold uppercase tracking-[0.2em] mb-4">
            Legal
          </h5>
          <ul className="space-y-2 text-[10px] text-neutral-400 uppercase tracking-widest">
            <li>
              <Link href="/privacy" className="hover:text-[#dfb780] transition">
                Privacy Terms
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#dfb780] transition">
                Service Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] text-neutral-600 uppercase tracking-widest border-t border-white/[0.02] pt-8">
        <p>© {new Date().getFullYear()} Aetheris Studio. Editorial Standard.</p>
        <div className="flex gap-6">
          <span className="hover:text-white transition cursor-pointer">
            Instagram
          </span>
          <span className="hover:text-white transition cursor-pointer">
            LinkedIn
          </span>
        </div>
      </div>
    </footer>
  );
}
