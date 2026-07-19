"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { signUp } from "@/lib/auth-client";
import { Mail, Lock, User } from "lucide-react";

export default function SignUpPage(): React.JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<"user" | "writer">("user");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await signUp.email({
        email,
        password,
        name,
        userRole: role,
        callbackURL: "/dashboard/user",
      });

      if (authError) {
        setError(authError.message || "Registration parameter mismatch.");
      }
    } catch (err) {
      setError("An unexpected registration error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/30 via-[#040404] to-[#040404]">
      <Card className="w-full max-w-md bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-xl uppercase tracking-widest text-white font-light">
            Join Aetheris
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Establish your luxury spatial workspace profile.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-lg text-red-500 text-xs text-center uppercase tracking-wider font-semibold">
            {error}
          </div>
        )}

        <div className="bg-zinc-900/30 p-1 rounded-xl border border-white/5 flex gap-1">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "user"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Client Profile
          </button>
          <button
            type="button"
            onClick={() => setRole("writer")}
            className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "writer"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Architect Profile
          </button>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white placeholder-neutral-600 transition"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white placeholder-neutral-600 transition"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type="password"
              placeholder="Choose Password (Min 6 chars)"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white placeholder-neutral-600 transition"
              required
            />
          </div>

          <Button
            type="submit"
            isPending={loading}
            className="w-full h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition"
          >
            Create Profile Registry
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-500">
          Already verified?{" "}
          <Link href="/auth/signin" className="text-[#dfb780] hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
