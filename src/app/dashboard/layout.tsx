"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  PlusCircle,
  ShieldAlert,
  Layers,
  User,
  Sparkles,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role || "user";
  const userRole = session?.user?.userRole || "user";

  const getPortalHome = (): string => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "moderator") return "/dashboard/moderator";
    if (userRole === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  return (
    <div className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col md:flex-row pt-20">
      <aside className="w-full md:w-64 shrink-0 bg-[#07070a]/90 border-r border-white/[0.02] p-6 space-y-8 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-neutral-600 px-3 block mb-2">
              Portal Menus
            </span>

            <Link
              href={getPortalHome()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/dashboard/user" ||
                pathname === "/dashboard/writer" ||
                pathname === "/dashboard/admin" ||
                pathname === "/dashboard/moderator"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#dfb780]" />
              Portal Home
            </Link>

            <Link
              href="/dashboard/browse"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/dashboard/browse"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Compass className="w-4 h-4 text-neutral-500" />
              Explore Catalog
            </Link>

            <Link
              href="/dashboard/vision"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/dashboard/vision"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-neutral-500" />
              Spatial Vision AI
            </Link>

            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                pathname === "/dashboard/profile"
                  ? "bg-[#dfb780]/15 text-[#dfb780]"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <User className="w-4 h-4 text-neutral-500" />
              My Profile
            </Link>

            {(userRole === "writer" || role === "admin") && (
              <Link
                href="/dashboard/items/add"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                  pathname === "/dashboard/items/add"
                    ? "bg-[#dfb780]/15 text-[#dfb780]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-neutral-500" />
                Add Space
              </Link>
            )}

            {(userRole === "writer" || role === "admin") && (
              <Link
                href="/dashboard/items/manage"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                  pathname === "/dashboard/items/manage"
                    ? "bg-[#dfb780]/15 text-[#dfb780]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <Layers className="w-4 h-4 text-neutral-500" />
                Manage Spaces
              </Link>
            )}

            {(role === "admin" || role === "moderator") && (
              <Link
                href="/dashboard/moderator"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                  pathname === "/dashboard/moderator"
                    ? "bg-[#dfb780]/15 text-[#dfb780]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-neutral-500" />
                Moderator Panel
              </Link>
            )}

            {role === "admin" && (
              <Link
                href="/dashboard/admin"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium tracking-wider uppercase transition ${
                  pathname === "/dashboard/admin"
                    ? "bg-[#dfb780]/15 text-[#dfb780]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-neutral-500" />
                Admin Panel
              </Link>
            )}
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
