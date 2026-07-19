"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function Unauthorized(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#dfb780]">
          Access Restricted
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
          Privileges Required
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          You do not have the required role privileges (e.g., Architect or
          Admin) to view this workspace.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black font-bold px-6 rounded-lg uppercase text-[10px] tracking-widest">
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
