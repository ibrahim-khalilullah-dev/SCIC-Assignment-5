import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SpaceDetailsPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
            Spatial Registry ID: {id}
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest text-white">
            Workspace Detail
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Aesthetic configuration and spatial vectors for this workspace are currently offline. Check back shortly.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/browse">
            <Button className="h-11 px-6 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition duration-300">
              <ArrowLeft className="w-3.5 h-3.5 mr-2 inline" /> Return to Catalog
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}