"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { updateProfile } from "@/lib/actions/users";
import { Card, Button } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Edit,
  ShieldCheck,
  X,
} from "lucide-react";

export default function ProfilePage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    } else if (session) {
      setName(session.user.name || "");
      setImage(session.user.image || "");
    }
  }, [session, isPending, router]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

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
        throw new Error("Failed to upload profile image.");
      }

      const result = await res.json();
      if (result.success && result.data?.url) {
        setImage(result.data.url);
      }
    } catch (err) {
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const result = await updateProfile({ name, image });
      if (result && result.success) {
        setNotification({
          type: "success",
          message: "Profile updated successfully.",
        });
        setEditOpen(false);
      } else {
        setNotification({
          type: "error",
          message: result?.error || "Failed to update profile parameters.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to process query.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] w-full text-neutral-100 pb-16">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780] block animate-pulse">
            Profile Custody
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest text-white leading-tight">
            Studio Credentials
          </h1>
          <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto leading-relaxed">
            Manage your personal verification coordinates and public avatar
            images.
          </p>
        </div>

        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              notification.type === "success"
                ? "bg-[#dfb780]/5 border-[#dfb780]/20 text-[#dfb780]"
                : "bg-red-500/5 border-red-500/20 text-red-400"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                {notification.type === "success"
                  ? "Registry Updated"
                  : "Update Blocked"}
              </span>
              <p className="text-xs font-light mt-1">{notification.message}</p>
            </div>
          </motion.div>
        )}

        <Card className="bg-gradient-to-b from-[#0a0a0d] to-[#040404] border border-white/[0.02] p-8 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#dfb780]/5 via-transparent to-transparent pointer-events-none" />

          <div className="w-20 h-20 rounded-full border border-[#dfb780]/30 bg-neutral-900 flex items-center justify-center text-[#dfb780] font-serif italic text-2xl overflow-hidden shrink-0 relative group">
            {session.user.image ? (
              <img
                src={session.user.image}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <span>
                {session.user.name ? session.user.name[0].toUpperCase() : "U"}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {session.user.name}
            </h3>
            <span className="text-[9px] text-[#dfb780] uppercase tracking-widest block font-medium">
              {session.user.role || "Standard Member"}
            </span>
          </div>

          <div className="w-full border-t border-white/[0.03] pt-6 grid grid-cols-2 gap-4 text-left text-[10px] uppercase tracking-widest text-neutral-400">
            <div className="space-y-1">
              <span className="text-neutral-500 block">Email Address</span>
              <span className="text-white font-medium block truncate">
                {session.user.email}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-neutral-500 block">Account Status</span>
              <span className="text-[#dfb780] font-medium block flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
          </div>

          <div className="pt-4 w-full">
            <Button
              onClick={() => setEditOpen(true)}
              className="w-full h-11 bg-white/[0.02] border border-white/5 hover:bg-[#dfb780]/10 hover:border-[#dfb780]/40 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4 text-[#dfb780]" /> Edit Studio Profile
            </Button>
          </div>
        </Card>

        <AnimatePresence>
          {editOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md bg-[#0a0a0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative z-10"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/[0.03]">
                  <h3 className="text-white text-base uppercase tracking-widest font-light">
                    Edit Studio Profile
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="text-neutral-500 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-6">
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

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                          }
                          className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                        Avatar Image URL
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-600">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <input
                          type="url"
                          value={image}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setImage(e.target.value)
                          }
                          className="w-full h-11 pl-10 pr-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-white/[0.03] flex justify-end gap-3">
                    <Button
                      onClick={() => setEditOpen(false)}
                      className="h-10 px-5 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isPending={loading}
                      className="h-10 px-6 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-md cursor-pointer"
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
