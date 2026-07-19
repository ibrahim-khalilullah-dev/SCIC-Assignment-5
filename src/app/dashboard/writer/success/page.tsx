"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function WriterSuccessPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const verifyArchitect = async (): Promise<void> => {
      try {
        const res = await fetch("/api/checkout/session-capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(
            data.error || "Failed to confirm architect credentials.",
          );
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    verifyArchitect();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <Loader2 className="w-12 h-12 text-[#dfb780] animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
            Authorizing Architect Credentials...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">
              Verification Failed
            </span>
            <h1 className="text-3xl font-light uppercase tracking-widest text-white">
              Activation Incomplete
            </h1>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              {error}
            </p>
          </div>
          <div className="pt-4">
            <Link href="/dashboard/writer">
              <Button className="h-11 px-6 bg-white/[0.02] border border-white/5 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 transition duration-300">
                Return to Portal
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/20 flex items-center justify-center text-[#dfb780] mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
            Architect Status Activated
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest text-white">
            Verification Success
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Your elite publishing parameters have been synchronized with the
            Aetheris Vault.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/dashboard/user">
            <Button className="h-11 px-6 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-wider rounded-lg transition duration-300 shadow-lg shadow-[#dfb780]/5">
              Enter Portal
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
