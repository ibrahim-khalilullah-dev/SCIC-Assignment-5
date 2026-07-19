"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, Button } from "@heroui/react";
import { Shield, Eye, CheckCircle2, AlertOctagon, Loader2 } from "lucide-react";

interface Space {
  _id: string;
  title: string;
  category: string;
  price: number;
  location: string;
  architectName: string;
  status?: string;
}

export default function ModeratorPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (
      !isPending &&
      (!session ||
        (session.user.role !== "admin" && session.user.role !== "moderator"))
    ) {
      router.push("/unauthorized");
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
        setLoading(false);
      }
    };
    if (session) {
      fetchSpaces();
    }
  }, [session]);

  const updateStatus = async (
    id: string,
    status: "Approved" | "Flagged",
  ): Promise<void> => {
    setActionId(id);
    try {
      const res = await fetch(`/api/spaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSpaces((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status } : s)),
        );
      }
    } catch (err) {
    } finally {
      setActionId(null);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-[#040404] flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 bg-[#040404] min-h-screen text-neutral-100">
      <div className="border-b border-white/[0.02] pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780]">
          Steward Workspace
        </span>
        <h1 className="text-3xl font-light uppercase tracking-widest mt-1 flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#dfb780]" /> Moderator Panel
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Inspect and moderate spatial portfolio blueprints submitted by
          architects.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
        </div>
      ) : spaces.length === 0 ? (
        <Card className="bg-[#0a0a0d] border border-white/[0.02] p-8 text-center text-xs text-neutral-500 uppercase tracking-widest rounded-2xl">
          No registered spatial blueprints found
        </Card>
      ) : (
        <Card className="bg-[#0a0a0d] border border-white/[0.02] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                  <th className="py-4 px-6">Space</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Architect</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-xs font-light">
                {spaces.map((space) => (
                  <tr
                    key={space._id}
                    className="hover:bg-white/[0.01] transition duration-200"
                  >
                    <td className="py-4 px-6 font-medium text-neutral-200">
                      {space.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-white/[0.02] text-neutral-400 border border-white/[0.02]">
                        {space.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {space.architectName}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                          space.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                            : space.status === "Flagged"
                              ? "bg-red-500/10 text-red-400 border-red-500/10"
                              : "bg-[#dfb780]/15 text-[#dfb780] border-[#dfb780]/10"
                        }`}
                      >
                        {space.status || "Pending Inspect"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateStatus(space._id, "Approved")}
                          isPending={actionId === space._id}
                          className="h-8 bg-emerald-950/20 border border-emerald-500/10 hover:bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(space._id, "Flagged")}
                          isPending={actionId === space._id}
                          className="h-8 bg-red-950/20 border border-red-500/10 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> Flag
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
