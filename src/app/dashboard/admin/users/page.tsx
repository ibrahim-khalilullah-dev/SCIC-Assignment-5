"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, Button } from "@heroui/react";
import { Shield, Trash2, Ban, ShieldCheck, Loader2 } from "lucide-react";
import {
  banUser,
  unbanUser,
  updateUserRole,
  deleteUser,
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

export default function AdminUsersPage(): React.JSX.Element {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "admin")) {
      router.push("/unauthorized");
    }
  }, [session, isPending, router]);

  const fetchUsers = async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const handleRoleChange = async (
    userId: string,
    currentRole: string,
  ): Promise<void> => {
    setProcessingId(userId);
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
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
    } finally {
      setProcessingId(null);
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
    <div className="space-y-12 bg-[#040404] min-h-screen text-neutral-100">
      <div className="border-b border-white/[0.02] pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780]">
          Administrative Control Panel
        </span>
        <h1 className="text-3xl font-light uppercase tracking-widest mt-1 flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#dfb780]" /> Admin Workspace
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Monitor account roles, promote platform moderators, and execute global
          block parameters.
        </p>
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
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">License</th>
                  <th className="py-4 px-6 text-right">Account Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02] text-xs font-light">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-white/[0.01] transition duration-200"
                  >
                    <td className="py-4 px-6 font-medium text-neutral-200">
                      {u.name}
                    </td>
                    <td className="py-4 px-6 text-neutral-400">{u.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${
                          u.role === "admin"
                            ? "bg-[#dfb780]/20 text-[#dfb780]"
                            : "bg-white/[0.02] text-neutral-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] uppercase tracking-widest px-2 py-0.5 rounded border ${
                          u.verifiedArchitect
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                            : "bg-neutral-900 text-neutral-600 border-neutral-800"
                        }`}
                      >
                        {u.verifiedArchitect
                          ? "Verified Architect"
                          : "Standard"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRoleChange(u.id, u.role)}
                          isPending={processingId === u.id}
                          className="h-8 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Toggle Admin
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBanToggle(u.id, !!u.banned)}
                          isPending={processingId === u.id}
                          className={`h-8 border text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer ${
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
                          className="h-8 bg-red-950/20 border border-red-500/10 hover:bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
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
        </Card>
      )}
    </div>
  );
}
