"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { signIn } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

export default function SignInPage(): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn.email({
        email: email.toLowerCase(),
        password,
        fetchOptions: {
          onSuccess: (ctx) => {
            const u = ctx.data?.user;
            if (u?.role === "admin") {
              router.push("/dashboard/admin");
            } else if (u?.role === "moderator") {
              router.push("/dashboard/moderator");
            } else if (u?.userRole === "writer") {
              router.push("/dashboard/writer");
            } else {
              router.push("/dashboard/user");
            }
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Credential verification failed.");
            setLoading(false);
          },
        },
      });
    } catch (err) {
      setError("An unexpected authentication error occurred.");
      setLoading(false);
    }
  };

  const handleOneClickLogin = async (
    role: "admin" | "moderator" | "architect" | "client",
  ): Promise<void> => {
    setLoading(true);
    setError("");
    const targetEmail = `${role}@aetheris.com`;
    const targetPassword = "PASSWORD123";

    try {
      await signIn.email({
        email: targetEmail,
        password: targetPassword,
        fetchOptions: {
          onSuccess: (ctx) => {
            const u = ctx.data?.user;
            if (u?.role === "admin") {
              router.push("/dashboard/admin");
            } else if (u?.role === "moderator") {
              router.push("/dashboard/moderator");
            } else if (u?.userRole === "writer") {
              router.push("/dashboard/writer");
            } else {
              router.push("/dashboard/user");
            }
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Credential verification failed.");
            setLoading(false);
          },
        },
      });
    } catch (err) {
      setError("An unexpected verification error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/30 via-[#040404] to-[#040404]">
      <Card className="w-full max-w-md bg-[#0a0a0d] border border-white/20 p-8 rounded-2xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-9 h-9 rounded-full border border-[#dfb780]/30 flex items-center justify-center text-[#dfb780] font-serif italic mx-auto">
            Æ
          </div>
          <h1 className="text-lg uppercase tracking-[0.18em] text-white font-light">
            Portal Authentication
          </h1>
          <p className="text-[9px] text-neutral-500 uppercase tracking-widest">
            Enter credentials below to access portfolios
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-lg text-red-500 text-[10px] text-center uppercase tracking-wider font-semibold">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[9px] uppercase tracking-widest font-semibold text-neutral-600 block text-center">
            One-Click Portals
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={() => handleOneClickLogin("admin")}
              className="bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 text-red-400 text-[9px] font-bold uppercase tracking-wider rounded-lg h-10 transition duration-300"
            >
              Admin Portal
            </Button>
            <Button
              size="sm"
              onClick={() => handleOneClickLogin("moderator")}
              className="bg-[#dfb780]/15 border border-[#dfb780]/20 hover:bg-[#dfb780]/30 text-[#dfb780] text-[9px] font-bold uppercase tracking-wider rounded-lg h-10 transition duration-300"
            >
              Moderator
            </Button>
            <Button
              size="sm"
              onClick={() => handleOneClickLogin("architect")}
              className="bg-[#dfb780]/10 border border-[#dfb780]/10 hover:bg-[#dfb780]/20 text-[#dfb780] text-[9px] font-bold uppercase tracking-wider rounded-lg h-10 transition duration-300"
            >
              Architect
            </Button>
            <Button
              size="sm"
              onClick={() => handleOneClickLogin("client")}
              className="bg-white/[0.02] border border-white/10 hover:bg-white/[0.06] text-neutral-300 text-[9px] font-bold uppercase tracking-wider rounded-lg h-10 transition duration-300"
            >
              Client Portal
            </Button>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.02 }}
            className="relative border border-white/20 hover:border-white/40 focus-within:border-[#dfb780] rounded-lg transition duration-300"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 outline-none rounded-lg text-xs tracking-wider text-white placeholder-neutral-500 font-medium transition"
              required
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.02 }}
            className="relative border border-white/20 hover:border-white/40 focus-within:border-[#dfb780] rounded-lg transition duration-300"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full h-11 pl-10 pr-12 bg-zinc-900/30 outline-none rounded-lg text-xs tracking-wider text-white placeholder-neutral-500 font-medium transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white transition"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </motion.div>

          <Button
            type="submit"
            isPending={loading}
            className="w-full h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition shadow-md shadow-[#dfb780]/5"
          >
            Authenticate Credentials
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-500">
          Create design profile?{" "}
          <Link href="/auth/signup" className="text-[#dfb780] hover:underline">
            Register Here
          </Link>
        </p>
      </Card>
    </div>
  );
}
