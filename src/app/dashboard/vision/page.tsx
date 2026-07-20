"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Camera,
} from "lucide-react";

export default function SpatialVisionPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  React.useEffect(() => {
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
    setError("");
    setAnalysisResult("");

    const formData = new FormData();
    formData.append("image", file);

    const apiKey =
      process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API ||
      "81e9a814e602ad8b0864a375b9d886e2";

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload space rendering snap.");
      }

      const result = await res.json();
      if (result.success && result.data?.url) {
        setCoverImageUrl(result.data.url);
      } else {
        throw new Error("Invalid storage registry payload.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse design rendering snapshot.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = (): void => {
    fileInputRef.current?.click();
  };

  const handleRunAnalysis = async (): Promise<void> => {
    if (!coverImageUrl) return;

    setAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/ai/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: coverImageUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to compile layout parsing parameters.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data.analysis || "No response received.");
    } catch (err: any) {
      setError(err.message || "An unexpected vision compiling error occurred.");
    } finally {
      setAnalyzing(false);
    }
  };

  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-[#dfb780] font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        return (
          <h4
            key={index}
            className="text-xs uppercase tracking-widest text-[#dfb780] font-bold mt-4 mb-2"
          >
            {trimmed.slice(4)}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="text-sm uppercase tracking-widest text-[#dfb780] font-bold mt-4 mb-2"
          >
            {trimmed.slice(3)}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2
            key={index}
            className="text-base uppercase tracking-widest text-[#dfb780] font-light mt-4 mb-2"
          >
            {trimmed.slice(2)}
          </h2>
        );
      }
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <li
            key={index}
            className="list-disc list-inside text-neutral-400 pl-2 mt-1 font-light text-xs leading-relaxed"
          >
            {parseInlineMarkdown(trimmed.slice(2))}
          </li>
        );
      }
      if (trimmed === "") {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="leading-relaxed mb-2 font-light text-xs">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-neutral-100 pb-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <Link
              href="/dashboard/user"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#dfb780] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
            </Link>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em] flex items-center gap-3">
              <Camera className="w-6 h-6 text-[#dfb780]" /> Spatial Vision AI
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Upload room blueprints or physical rendering snaps to classify
              style rules.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="md:col-span-2 space-y-4">
            <Card
              onClick={triggerFileSelect}
              className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl flex flex-col items-center justify-center text-center h-[280px] shadow-2xl relative overflow-hidden group cursor-pointer hover:border-[#dfb780]/40 transition duration-300"
            >
              {uploading ? (
                <div className="space-y-2">
                  <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin mx-auto" />
                  <span className="text-[10px] uppercase tracking-widest text-[#dfb780] block font-bold animate-pulse">
                    Parsing Image...
                  </span>
                </div>
              ) : coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Upload Preview"
                  className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="space-y-2">
                  <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto" />
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 block">
                    Upload Snapshot
                  </span>
                  <p className="text-[9px] text-neutral-600 uppercase tracking-widest max-w-[150px] mx-auto leading-relaxed">
                    Click here to upload room snapshot layout rendering snap
                  </p>
                </div>
              )}
            </Card>

            <Button
              isDisabled={!coverImageUrl || analyzing || uploading}
              onClick={handleRunAnalysis}
              className="w-full h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md shadow-[#dfb780]/5 disabled:opacity-50"
            >
              Analyze Room Metrics
            </Button>
          </div>

          <div className="md:col-span-3">
            {analyzing ? (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center min-h-[340px] text-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium animate-pulse">
                  Querying Multimodal Vision Pipeline...
                </span>
              </Card>
            ) : analysisResult ? (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-6 md:p-8 rounded-2xl shadow-2xl space-y-4">
                <div className="pb-4 border-b border-white/[0.02]">
                  <span className="text-[9px] uppercase tracking-widest text-[#dfb780] font-bold block">
                    Analysis Report
                  </span>
                  <h3 className="text-sm uppercase tracking-wider text-white mt-1">
                    Spatial Classification Overview
                  </h3>
                </div>
                <div className="text-neutral-400 font-light text-xs leading-relaxed space-y-2">
                  {renderMarkdown(analysisResult)}
                </div>
              </Card>
            ) : (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center min-h-[340px] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-neutral-300">
                    Awaiting Upload
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed font-light">
                    Upload an architectural blueprint to trigger aesthetic style
                    category evaluation.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
