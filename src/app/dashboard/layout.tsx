"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, PlusCircle } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col md:flex-row pt-20">
      <aside className="w-full md:w-64 shrink-0 bg-[#07070a]/90 border-r border-white/[0.02] p-6 space-y-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-600 px-3 block mb-2">
              Portal Menus
            </span>

            <Link
              href="/dashboard/user"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/dashboard/user"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#dfb780]" />
              Portal Home
            </Link>

            <Link
              href="/browse"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/browse"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Compass className="w-4 h-4 text-neutral-500" />
              Explore Catalog
            </Link>

            <Link
              href="/items/add"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/items/add"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-neutral-500" />
              Add Space
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.03]">
          <Link
            href="/"
            className="text-[9px] uppercase tracking-widest text-neutral-500 hover:text-[#dfb780] transition px-3 block"
          >
            ← Exit Workspace
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">{children}</main>
    </div>
  );
}
