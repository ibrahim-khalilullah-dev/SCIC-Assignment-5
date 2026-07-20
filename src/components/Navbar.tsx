"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signOut } from "@/lib/auth-client";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar(): React.JSX.Element {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleSignOut = async (): Promise<void> => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const getDashboardLink = (): string => {
    if (!session) return "/";
    const role = session.user.role;
    const userRole = session.user.userRole;
    if (role === "admin") return "/dashboard/admin";
    if (role === "moderator") return "/dashboard/moderator";
    if (userRole === "writer") return "/dashboard/writer";
    return "/dashboard/user";
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-[#040404]/60 backdrop-blur-xl border-b border-b-white/[0.03] px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-8 h-8 rounded-full border border-[#dfb780]/30 group-hover:border-[#dfb780]/60 flex items-center justify-center text-[#dfb780] font-serif italic font-semibold text-sm transition duration-300"
          >
            Æ
          </motion.div>
          <span className="font-light tracking-[0.25em] text-xs uppercase text-neutral-300 group-hover:text-white transition">
            Aetheris
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[9px] uppercase tracking-[0.2em] font-medium text-neutral-400">
          {["Catalog", "About"].map((link) => (
            <Link
              key={link}
              href={link === "Catalog" ? "/browse" : `/${link.toLowerCase()}`}
              className="relative py-1 hover:text-[#dfb780] transition duration-300 group"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#dfb780] to-[#c2965d] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {session ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-8 h-8 rounded-full border border-[#dfb780]/30 bg-neutral-900 flex items-center justify-center text-[#dfb780] font-serif italic overflow-hidden transition hover:border-[#dfb780]/60 focus:outline-none cursor-pointer"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>
                    {session.user.name
                      ? session.user.name[0].toUpperCase()
                      : "U"}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-48 bg-[#0a0a0d] border border-white/10 rounded-xl shadow-2xl py-3 px-4 z-50 space-y-3 text-left animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-semibold text-white block truncate uppercase tracking-wider">
                          {session.user.name}
                        </span>
                        <span className="text-[8px] text-neutral-500 block truncate">
                          {session.user.email}
                        </span>
                      </div>
                      <div className="border-t border-white/[0.03]" />
                      <div className="space-y-1">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white transition py-1"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-[#dfb780]" />
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleSignOut();
                          }}
                          className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white transition w-full text-left py-1 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button className="h-8 px-3 bg-transparent text-neutral-400 text-[9px] font-semibold rounded-lg hover:text-white uppercase tracking-wider cursor-pointer">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="h-8 px-5 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[9px] font-bold rounded-lg uppercase tracking-widest transition duration-300 shadow-md shadow-[#dfb780]/5 cursor-pointer">
                  Join
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
