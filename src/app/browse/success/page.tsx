import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { CheckCircle } from "lucide-react";

export default function SuccessPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/20 flex items-center justify-center text-[#dfb780] mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
            Transaction Authorized
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest text-white">
            Registry Complete
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Your spatial blueprints and access licensing structures have been successfully synchronized.
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