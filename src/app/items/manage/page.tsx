"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { deleteSpace } from "@/lib/actions/spaces";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Loader2, AlertTriangle, Eye, Trash2 } from "lucide-react";

interface Space {
  _id: string;
  title: string;
  category: string;
  coverImage?: string;
  price: number;
}

export default function ManageItemsPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState<boolean>(true);
  const [warning, setWarning] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchSpaces = async (): Promise<void> => {
      try {
        const res = await fetch("/api/spaces");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSpaces(data);
        }
      } catch (err) {
        setSpaces([]);
      } finally {
        setLoadingSpaces(false);
      }
    };

    if (session) {
      fetchSpaces();
    }
  }, [session]);

  const handleDelete = async (id: string): Promise<void> => {
    if (session?.user?.role !== "admin") {
      setWarning("Admin authorization required to delete spatial records");
      return;
    }

    setDeletingId(id);
    setWarning(null);

    try {
      const result = await deleteSpace(id);
      if (result && result.error) {
        setWarning("Admin authorization required to delete spatial records");
      } else {
        setSpaces((prev) => prev.filter((space) => space._id !== id));
      }
    } catch (err: any) {
      setWarning("Admin authorization required to delete spatial records");
    } finally {
      setDeletingId(null);
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <Link
              href="/dashboard/user"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-500 hover:text-[#dfb780] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portal
            </Link>
            <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.15em]">
              Manage Spaces
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Review, inspect, or delete registered spatial portfolio records.
            </p>
          </div>

          <div>
            <Link href="/items/add">
              <Button className="h-10 px-6 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md">
                Register Space
              </Button>
            </Link>
          </div>
        </motion.div>

        <AnimatePresence>
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">
                  Access Denied
                </span>
                <p className="text-xs font-light mt-1">{warning}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="bg-[#0a0a0d] border border-white/[0.02] rounded-2xl overflow-hidden shadow-2xl">
          {loadingSpaces ? (
            <div className="divide-y divide-white/[0.02]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-6 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-white/[0.02] rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="w-48 h-3.5 bg-white/[0.02] rounded"></div>
                      <div className="w-24 h-2.5 bg-white/[0.01] rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-3 bg-white/[0.02] rounded"></div>
                    <div className="w-20 h-8 bg-white/[0.02] rounded-lg"></div>
                    <div className="w-20 h-8 bg-white/[0.02] rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : spaces.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <span className="text-neutral-600 text-xs uppercase tracking-widest block">
                No spatial records registered
              </span>
              <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
                No portfolios have been uploaded to the registry. Try
                registering a new space to begin.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Title</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02] text-xs font-light">
                    {spaces.map((space) => (
                      <tr
                        key={space._id}
                        className="hover:bg-white/[0.01] transition duration-200"
                      >
                        <td className="py-4 px-6">
                          <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-neutral-900 border border-white/5">
                            {space.coverImage ? (
                              <img
                                src={space.coverImage}
                                alt={space.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
                                Void
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-neutral-200">
                          {space.title}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/[0.02] text-neutral-400 border border-white/[0.02]">
                            {space.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#dfb780] font-medium tracking-wide">
                          {typeof space.price === "number"
                            ? space.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })
                            : `$${space.price}`}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/browse/${space._id}`}>
                              <Button
                                size="sm"
                                className="h-8 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(space._id)}
                              isPending={deletingId === space._id}
                              className="h-8 bg-red-950/20 border border-red-500/10 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="block md:hidden divide-y divide-white/[0.02]">
                {spaces.map((space) => (
                  <div key={space._id} className="p-4 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-16 relative rounded-lg overflow-hidden bg-neutral-900 border border-white/5 shrink-0">
                        {space.coverImage ? (
                          <img
                            src={space.coverImage}
                            alt={space.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
                            Void
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="text-neutral-200 font-medium block">
                          {space.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider bg-white/[0.02] text-neutral-400 border border-white/[0.02]">
                            {space.category}
                          </span>
                          <span className="text-[#dfb780] text-xs font-medium tracking-wide">
                            {typeof space.price === "number"
                              ? space.price.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })
                              : `$${space.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/browse/${space._id}`} className="w-full">
                        <Button
                          size="sm"
                          className="w-full h-9 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(space._id)}
                        isPending={deletingId === space._id}
                        className="w-full h-9 bg-red-950/20 border border-red-500/10 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
