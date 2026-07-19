"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Compass, HelpCircle } from "lucide-react";

interface RecommendedSpace {
  _id: string;
  title: string;
  category: string;
  price: number;
  coverImage?: string;
}

interface RecommendationResult {
  recommendedSpaceId: string;
  reasoning: string;
  suitabilityScore: number;
}

export default function AiRecommendPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [preferences, setPreferences] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [recommendation, setRecommendation] =
    useState<RecommendationResult | null>(null);
  const [recommendedSpace, setRecommendedSpace] =
    useState<RecommendedSpace | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendation(null);
    setRecommendedSpace(null);

    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences,
          budget: parseFloat(budget) || 0,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process spatial recommendation.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setRecommendation(data);

      if (data.recommendedSpaceId) {
        const spaceRes = await fetch(`/api/spaces/${data.recommendedSpaceId}`);
        if (spaceRes.ok) {
          const spaceData = await spaceRes.json();
          setRecommendedSpace(spaceData);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected recommendation error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium">
            Verifying Credentials...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040404] text-neutral-100 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
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
              <Compass className="w-6 h-6 text-[#dfb780]" /> Smart Recommender
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Enter your aesthetic preferences and budget limit to discover
              matching layouts.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <Card className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Design Preferences
                  </label>
                  <textarea
                    value={preferences}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setPreferences(e.target.value)
                    }
                    rows={4}
                    className="w-full p-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light resize-none min-h-[100px]"
                    placeholder="e.g. A Japandi living room with warm lighting, concrete finishes, and wood accents."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 block font-medium">
                    Max Budget ($k)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBudget(e.target.value)
                    }
                    className="w-full h-11 px-4 bg-zinc-900/30 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white transition placeholder-neutral-600 font-light"
                    placeholder="e.g. 30"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/15 rounded-lg text-red-500 text-[10px] uppercase tracking-wider font-semibold text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  isPending={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md shadow-[#dfb780]/5"
                >
                  Generate Match
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            {loading ? (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-medium animate-pulse">
                  Analyzing Spatial Datasets...
                </span>
              </Card>
            ) : recommendation ? (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-6 md:p-8 rounded-2xl shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.02]">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-[#dfb780] font-bold block">
                      Top Match Result
                    </span>
                    <h3 className="text-xl font-light uppercase tracking-wider text-white">
                      {recommendedSpace?.title || "Recommended Space"}
                    </h3>
                    {recommendedSpace?.category && (
                      <span className="inline-block px-2 py-0.5 rounded text-[8px] uppercase tracking-wider bg-white/[0.02] text-neutral-400 border border-white/[0.02] mt-1">
                        {recommendedSpace.category}
                      </span>
                    )}
                  </div>

                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#dfb780"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={175.9}
                        strokeDashoffset={
                          175.9 -
                          (175.9 * (recommendation.suitabilityScore || 90)) /
                            100
                        }
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-semibold text-white">
                      {recommendation.suitabilityScore || 90}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block">
                    Cognitive Architectural Reasoning
                  </span>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {recommendation.reasoning}
                  </p>
                </div>

                {recommendedSpace && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-white/[0.01] border border-white/[0.02] rounded-xl">
                    <div className="flex items-center gap-4 w-full">
                      {recommendedSpace.coverImage && (
                        <div className="w-16 h-12 relative rounded-lg overflow-hidden shrink-0 border border-white/5 bg-neutral-900">
                          <img
                            src={recommendedSpace.coverImage}
                            alt={recommendedSpace.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-0.5">
                        <span className="text-xs font-medium text-neutral-200 block">
                          {recommendedSpace.title}
                        </span>
                        <span className="text-[10px] text-[#dfb780] font-medium block">
                          {(recommendedSpace.price || 0).toFixed(2)}k
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/browse/${recommendedSpace._id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto h-9 px-5 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition">
                        View Space
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="bg-[#0a0a0d] border border-white/[0.02] p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
                  <HelpCircle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-neutral-300">
                    Awaiting Input
                  </h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed font-light">
                    Fill out the preferences panel to query the cognitive
                    spatial matching model.
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
