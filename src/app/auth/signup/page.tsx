"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { signUp } from "@/lib/auth-client";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";

export default function SignUpPage(): React.JSX.Element {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<"user" | "writer" | "moderator" | "admin">(
    "user",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        "https://api.imgbb.com/1/upload?key=81e9a814e602ad8b0864a375b9d886e2",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to upload avatar image.");
      }

      const result = await res.json();
      if (result.success && result.data?.url) {
        setImage(result.data.url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image file.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleSignUp = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await signUp.email({
        email: email.toLowerCase(),
        password,
        name,
        image,
        userRole: role,
        fetchOptions: {
          onSuccess: () => {
            if (role === "admin") {
              router.push("/dashboard/admin");
            } else if (role === "moderator") {
              router.push("/dashboard/moderator");
            } else if (role === "writer") {
              router.push("/dashboard/writer");
            } else {
              router.push("/dashboard/user");
            }
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Registration failed.");
            setLoading(false);
          },
        },
      });

      if (authError) {
        setError(authError.message || "Registration parameter mismatch.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected registration error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040404] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-900/30 via-[#040404] to-[#040404]">
      <Card className="w-full max-w-md bg-[#0a0a0d] border border-white/10 p-8 rounded-2xl space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-xl uppercase tracking-widest text-white font-light">
            Join Aetheris
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
            Establish your luxury spatial workspace profile
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-lg text-red-500 text-xs text-center uppercase tracking-wider font-semibold">
            {error}
          </div>
        )}

        <div className="bg-zinc-900/30 p-1 rounded-xl border border-white/10 grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "user"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole("writer")}
            className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "writer"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Architect
          </button>
          <button
            type="button"
            onClick={() => setRole("moderator")}
            className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "moderator"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Moderator
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg transition ${
              role === "admin"
                ? "bg-gradient-to-r from-[#dfb780] to-[#c2965d] text-black"
                : "text-neutral-500 hover:text-white"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center gap-2">
            <div
              onClick={triggerFileSelect}
              className="w-16 h-16 rounded-full border border-white/10 hover:border-[#dfb780]/40 bg-neutral-900 flex items-center justify-center text-[#dfb780] text-xl font-serif italic cursor-pointer overflow-hidden transition relative"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-[#dfb780] animate-spin" />
              ) : image ? (
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  alt="Profile"
                />
              ) : (
                <ImageIcon className="w-5 h-5 text-neutral-500" />
              )}
            </div>
            <span className="text-[8px] uppercase tracking-widest text-neutral-500">
              Click avatar to upload image
            </span>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            whileFocus={{ scale: 1.02 }}
            className="relative border border-white/20 hover:border-white/40 focus-within:border-[#dfb780] rounded-lg transition duration-300"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
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
              placeholder="Choose Password"
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
