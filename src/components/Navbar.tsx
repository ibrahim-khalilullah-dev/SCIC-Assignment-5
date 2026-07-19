"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "motion/react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar(): React.JSX.Element {
  const { data: session } = useSession();

  const handleSignOut = async (): Promise<void> => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
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
            <>
              <Link
                href={
                  session.user.userRole === "writer"
                    ? "/dashboard/writer"
                    : "/dashboard/user"
                }
                className="hover:text-[#dfb780] transition"
              >
                Portal
              </Link>
              <Button
                onClick={handleSignOut}
                className="h-8 px-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-white text-[9px] font-bold rounded-lg uppercase tracking-wider"
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button className="h-8 px-3 bg-transparent text-neutral-400 text-[9px] font-semibold rounded-lg hover:text-white uppercase tracking-wider">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="h-8 px-5 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[9px] font-bold rounded-lg uppercase tracking-widest transition duration-300 shadow-md shadow-[#dfb780]/5">
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
