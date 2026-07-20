"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, Button } from "@heroui/react";
import { Shield, Trash2, Ban, ShieldCheck, Loader2, Send } from "lucide-react";
import {
  banUser,
  unbanUser,
  updateUserRole,
  deleteUser,
  issueWarning,
} from "@/lib/actions/users";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  userRole: string;
  verifiedArchitect: boolean;
  banned?: boolean;
}

interface Transaction {
  _id: string;
  amountPaid: number;
  createdAt: string | Date;
}

interface MetricSummary {
  totalSpaces: number;
  totalUsers: number;
  totalRevenue: number;
}

export default function AdminPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<MetricSummary>({
    totalSpaces: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [warningInputs, setWarningInputs] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      router.push("/unauthorized");
    }
  }, [session, isPending, router]);

  const fetchData = async (): Promise<void> => {
    try {
      const usersRes = await fetch("/api/admin/users");
      const usersData = await usersRes.json();
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      }

      const spacesRes = await fetch("/api/spaces");
      const spacesData = await spacesRes.json();

      const txsRes = await fetch("/api/admin/transactions");
      const txsData = await txsRes.json();
      if (Array.isArray(txsData)) {
        setTransactions(txsData);
      }

      const totalRevenue = Array.isArray(txsData)
        ? txsData.reduce((sum, tx) => sum + (tx.amountPaid || 0), 0)
        : usersData.filter((u: User) => u.verifiedArchitect).length * 20;

      setMetrics({
        totalSpaces: Array.isArray(spacesData) ? spacesData.length : 0,
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalRevenue,
      });
    } catch (err) {
      // Gracefully capture database query disruptions
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleRoleSelection = async (
    userId: string,
    targetDesignation: "user" | "writer" | "moderator" | "admin",
  ): Promise<void> => {
    setProcessingId(userId);
    try {
      const result = await updateUserRole(userId, targetDesignation);
      if (result && result.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  role:
                    targetDesignation === "writer" ? "user" : targetDesignation,
                  userRole:
                    targetDesignation === "writer"
                      ? "writer"
                      : targetDesignation,
                  verifiedArchitect:
                    targetDesignation === "writer" ||
                    targetDesignation === "admin",
                }
              : u,
          ),
        );
      }
    } catch (err) {
      // Retain state integrity on failure
    } finally {
      setProcessingId(null);
    }
  };

  const handleBanToggle = async (
    userId: string,
    isBanned: boolean,
  ): Promise<void> => {
    setProcessingId(userId);
    try {
      if (isBanned) {
        await unbanUser(userId);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, banned: false } : u)),
        );
      } else {
        await banUser(userId);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, banned: true } : u)),
        );
      }
    } catch (err) {
      // Secure state fallback on error
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (userId: string): Promise<void> => {
    setProcessingId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      // Abort gracefully
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendWarning = async (userId: string): Promise<void> => {
    const message = warningInputs[userId];
    if (!message || !message.trim()) return;

    setProcessingId(userId);
    try {
      const res = await issueWarning(userId, message);
      if (res && res.success) {
        setWarningInputs((prev) => ({ ...prev, [userId]: "" }));
      }
    } catch (err) {
      // Handle gracefully
    } finally {
      setProcessingId(null);
    }
  };

  const getTransactionWaveformPath = (): string => {
    if (transactions.length === 0) {
      return "M 0,22 Q 20,8 40,24 T 80,10 T 100,2";
    }

    const sorted = [...transactions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const maxVal = Math.max(...sorted.map((t) => t.amountPaid || 20), 20);
    const points = sorted.map((t, idx) => {
      const x = sorted.length > 1 ? (idx / (sorted.length - 1)) * 100 : 50;
      const ratio = (t.amountPaid || 0) / maxVal;
      const y = 30 - ratio * 24 - 3;
      return { x, y };
    });

    if (points.length === 1) {
      return `M 0,${points[0].y} H 100`;
    }

    return points.reduce((path, p, idx) => {
      if (idx === 0) return `M ${p.x},${p.y}`;
      const prev = points[idx - 1];
      const cpX = (prev.x + p.x) / 2;
      const cpY = (prev.y + p.y) / 2;
      return `${path} Q ${prev.x},${prev.y} ${cpX},${cpY}`;
    }, "");
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
          Steward Administrative Console
        </span>
        <h1 className="text-3xl font-light uppercase tracking-widest mt-1 flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#dfb780]" /> Admin Workspace
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Monitor transactions, adjust user designations with explicit
          privileges, and execute system warnings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
            Managed Spaces
          </span>
          <span className="text-2xl font-light text-white mt-1 block">
            {metrics.totalSpaces} Listings
          </span>
        </div>
        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
            Registered Profiles
          </span>
          <span className="text-2xl font-light text-white mt-1 block">
            {metrics.totalUsers} Members
          </span>
        </div>
        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl">
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
            Platform Fees Accumulated
          </span>
          <span className="text-2xl font-light text-[#dfb780] mt-1 block">
            ${metrics.totalRevenue.toLocaleString()} USD
          </span>
        </div>
      </div>

      <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs uppercase tracking-widest text-white">
            Steward Transaction Waveform
          </h3>
          <p className="text-[8px] text-neutral-500 uppercase tracking-widest font-mono">
            Real-time dynamic platform payments overview
          </p>
        </div>
        <div className="w-full h-32 pt-4">
          <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="0"
              stroke="white"
              strokeWidth="0.05"
              strokeDasharray="1 2"
              opacity="0.1"
            />
            <line
              x1="0"
              y1="15"
              x2="100"
              y2="15"
              stroke="white"
              strokeWidth="0.05"
              strokeDasharray="1 2"
              opacity="0.1"
            />
            <line
              x1="0"
              y1="30"
              x2="100"
              y2="30"
              stroke="white"
              strokeWidth="0.05"
              strokeDasharray="1 2"
              opacity="0.1"
            />
            <path
              d={getTransactionWaveformPath()}
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="goldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#f3d0a4" />
                <stop offset="50%" stopColor="#dfb780" />
                <stop offset="100%" stopColor="#c2965d" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-8 h-8 text-[#dfb780] animate-spin" />
        </div>
      ) : (
        <Card className="bg-[#0a0a0d] border border-white/[0.02] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.03] bg-white/[0.01] text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Designation</th>
                  <th className="py-4 px-6">Direct Warning Utility</th>
                  <th className="py-4 px-6 text-right">Steward Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-xs font-light">
                {users.map((u) => {
                  const displayRole =
                    u.role === "user" && u.userRole === "writer"
                      ? "writer"
                      : u.role;
                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-white/[0.01] transition duration-200"
                    >
                      <td className="py-4 px-6 font-medium text-neutral-200">
                        {u.name}
                      </td>
                      <td className="py-4 px-6 text-neutral-400">{u.email}</td>
                      <td className="py-4 px-6">
                        <select
                          value={displayRole}
                          onChange={(e) =>
                            handleRoleSelection(
                              u.id,
                              e.target.value as
                                | "user"
                                | "writer"
                                | "moderator"
                                | "admin",
                            )
                          }
                          disabled={processingId === u.id}
                          className="bg-neutral-900 border border-white/10 hover:border-[#dfb780]/30 rounded-lg h-8 px-3 text-[10px] uppercase tracking-widest text-neutral-300 focus:outline-none transition cursor-pointer"
                        >
                          <option value="user">Client</option>
                          <option value="writer">Architect</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2 items-center max-w-xs">
                          <input
                            type="text"
                            placeholder="Issue dynamic notice..."
                            value={warningInputs[u.id] || ""}
                            onChange={(e) =>
                              setWarningInputs((prev) => ({
                                ...prev,
                                [u.id]: e.target.value,
                              }))
                            }
                            className="flex-1 bg-neutral-950 border border-white/5 hover:border-white/10 rounded-lg h-8 px-3 text-[10px] text-white focus:outline-none placeholder-neutral-600 transition"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSendWarning(u.id)}
                            isPending={processingId === u.id}
                            className="h-8 w-8 min-w-0 bg-[#dfb780]/10 border border-[#dfb780]/20 text-[#dfb780] hover:bg-[#dfb780]/20 rounded-lg flex items-center justify-center p-0 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleBanToggle(u.id, !!u.banned)}
                            isPending={processingId === u.id}
                            className={`h-8 border text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                              u.banned
                                ? "bg-emerald-950/20 border-emerald-500/10 text-emerald-400"
                                : "bg-red-950/20 border-red-500/10 text-red-400"
                            }`}
                          >
                            <Ban className="w-3.5 h-3.5" />{" "}
                            {u.banned ? "Unban" : "Ban"}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDelete(u.id)}
                            isPending={processingId === u.id}
                            className="h-8 bg-red-950/20 border border-red-500/10 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
