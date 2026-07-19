"use client";

import React, { useEffect } from "react";
import { Button } from "@heroui/react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): React.JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="text-xs font-semibold uppercase tracking-widest text-red-500">
          System Interruption
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Something Went Wrong
        </h1>
        <p className="text-sm text-zinc-500">
          An error occurred while compiling this page. Please try reloading or
          returning to the dashboard.
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Button
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 rounded-xl"
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-6 rounded-xl"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </main>
  );
}
