"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#dfb780]">
          Error 404
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
          Aesthetic Sanctuary Missing
        </h1>
        <p className="text-sm text-neutral-500 font-light">
          The structural coordinate or spatial portfolio you are searching for
          cannot be found in our current archives.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black font-bold px-6 rounded-lg uppercase text-[10px] tracking-widest">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
