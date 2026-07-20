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
  const [email, setEmail] = useState<string>("client@aetheris.com");
  const [password, setPassword] = useState<string>("password123");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("client");
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

  const handleGoogleSignIn = async (): Promise<void> => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard/user",
    });
  };

  const handleSelectDemo = (
    role: "admin" | "moderator" | "architect" | "client",
  ): void => {
    setSelectedRole(role);
    setEmail(`${role}@aetheris.com`);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-6 pt-32 pb-16 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/30 via-[#040404] to-[#040404]">
      <Card className="w-full max-w-md bg-[#0a0a0d] border border-white/10 p-8 rounded-2xl space-y-6 shadow-2xl">
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
          <div className="bg-zinc-900/30 p-1 rounded-xl border border-white/10 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => handleSelectDemo("client")}
              className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
                selectedRole === "client"
                  ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo("architect")}
              className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
                selectedRole === "architect"
                  ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              Architect
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo("moderator")}
              className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
                selectedRole === "moderator"
                  ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              Moderator
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo("admin")}
              className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
                selectedRole === "admin"
                  ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.01 }}
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
            whileFocus={{ scale: 1.01 }}
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

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-white/[0.03]"></div>
          <span className="flex-shrink mx-4 text-[9px] text-neutral-600 uppercase tracking-widest font-bold">
            or
          </span>
          <div className="flex-grow border-t border-white/[0.03]"></div>
        </div>

        <Button
          onClick={handleGoogleSignIn}
          className="w-full h-11 bg-white/[0.02] border border-white/10 hover:bg-white/[0.06] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5 text-neutral-300" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google Authentication
        </Button>

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
