"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { createSpace } from "@/lib/actions/spaces";
import { motion } from "motion/react";
import {
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export default function AddItemPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("Japandi Minimalism");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [fullDescription, setFullDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);

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
        throw new Error("Failed to upload image asset.");
      }

      const result = await res.json();
      if (result.success && result.data?.url) {
        setCoverImageUrl(result.data.url);
      } else {
        throw new Error("Invalid response payload from storage api.");
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to upload image file.",
      });
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
      const spaceData = {
        title,
        category,
        shortDescription,
        description: fullDescription,
        price: parseFloat(price) || 0,
        dimensions,
        location,
        coverImage: coverImageUrl,
      };

      const result = await createSpace(spaceData);

      if (result && result.success) {
        setNotification({
          type: "success",
          message: "Spatial portfolio successfully added to the registry.",
        });
        setTitle("");
        setCategory("Japandi Minimalism");
        setShortDescription("");
        setFullDescription("");
        setPrice("");
        setDimensions("");
        setLocation("");
        setCoverImageUrl("");
      } else {
        setNotification({
          type: "error",
          message:
            result?.error ||
            "An unexpected error occurred while saving the space.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to submit request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBackLink = (): string => {
    if (!session) return "/";
    return session.user.userRole === "writer"
      ? "/dashboard/writer"
      : "/dashboard/user";
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
      <div className="w-full max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <Link
              href={getBackLink()}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#dfb780] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
            </Link>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em]">
              Register New Space
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Expand the portfolio by adding a new architectural workspace.
            </p>
          </div>
        </motion.div>

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
                  ? "Registry Success"
                  : "Registry Failed"}
              </span>
              <p className="text-xs font-light mt-1">{notification.message}</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <Card
            onClick={triggerFileSelect}
            className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-[280px] shadow-2xl relative overflow-hidden group cursor-pointer hover:border-[#dfb780]/40 transition duration-300"
          >
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin mx-auto" />
                <span className="text-[10px] uppercase tracking-widest text-[#dfb780] block font-bold animate-pulse">
                  Uploading Image...
                </span>
              </div>
            ) : coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt="Upload Preview"
                className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="space-y-2">
                <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 block">
                  Blueprint Image Box
                </span>
                <p className="text-[9px] text-neutral-600 uppercase tracking-widest max-w-[150px] mx-auto leading-relaxed">
                  Click here to upload high-res rendering CAD file from device
                </p>
              </div>
            )}
          </Card>

          <Card className="bg-[#0a0a0d] border border-white/[0.02] p-6 md:p-8 rounded-2xl md:col-span-2 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTitle(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="e.g. The Obsidian Atrium"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setCategory(e.target.value)
                      }
                      className="w-full h-11 px-4 pr-10 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition appearance-none cursor-pointer font-light"
                      required
                    >
                      <option
                        className="bg-[#0a0a0d] text-neutral-300"
                        value="Japandi Minimalism"
                      >
                        Japandi Minimalism
                      </option>
                      <option
                        className="bg-[#0a0a0d] text-neutral-300"
                        value="Modernist Brutalism"
                      >
                        Modernist Brutalism
                      </option>
                      <option
                        className="bg-[#0a0a0d] text-neutral-300"
                        value="Classical Bauhaus"
                      >
                        Classical Bauhaus
                      </option>
                      <option
                        className="bg-[#0a0a0d] text-neutral-300"
                        value="Nordic Rustic"
                      >
                        Nordic Rustic
                      </option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Short Description
                  </label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShortDescription(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="Short architectural hook or visual highlight"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPrice(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="e.g. 24.50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDimensions(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="e.g. 120m² or 45' x 30'"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLocation(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="e.g. Kyoto, Japan or Oslo, Norway"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Cover Image URL (Auto-populated on device selection above)
                  </label>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCoverImageUrl(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Full Description
                  </label>
                  <textarea
                    value={fullDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFullDescription(e.target.value)
                    }
                    rows={5}
                    className="w-full p-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light resize-y min-h-[120px]"
                    placeholder="Detailed composition notes, structural elements, materials used, etc."
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  isPending={loading}
                  className="w-full md:w-auto h-11 px-8 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md shadow-[#dfb780]/5 cursor-pointer"
                >
                  Register Portfolio Space
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
