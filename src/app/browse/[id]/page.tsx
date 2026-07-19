import React from "react";
import Link from "next/link";
import { getSpaceById } from "@/lib/api/spaces";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Star,
  User,
  Calendar,
  Award,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getCritiques(category: string) {
  const norm = category?.toLowerCase() || "";
  if (norm.includes("brutalism")) {
    return [
      {
        quote: "A powerful display of raw concrete and structural honesty. The shadows cast by the skylights create a dramatic, ever-changing interior canvas.",
        author: "Julian Vane",
        source: "Architectural Review",
      },
      {
        quote: "Brutalism refined. The contrast between rough-cast concrete surfaces and warm walnut accents introduces a sophisticated tension.",
        author: "Elena Croft",
        source: "Frame Magazine",
      },
    ];
  } else if (norm.includes("minimalism") || norm.includes("japandi")) {
    return [
      {
        quote: "The integration of natural light and raw timber structures in this layout achieves a rare wabi-sabi balance. The transitions between public and private spaces are seamless.",
        author: "Aria Sterling",
        source: "Spatial Critic",
      },
      {
        quote: "A masterclass in restraint. The neutral plaster textures harmonize with the low-profile furniture, emphasizing negative space over ornamentation.",
        author: "Renato Rossi",
        source: "Domus Forum",
      },
    ];
  } else if (norm.includes("bauhaus")) {
    return [
      {
        quote: "A faithful homage to functional geometry. Every structural element serves a clear utility, wrapped in elegant, clean lines.",
        author: "Dieter Schmidt",
        source: "Bauhaus Archiv",
      },
      {
        quote: "The rationalist design language is executed with precision. Tubular steel and glass details reference classic modernist paradigms.",
        author: "Nadia K.",
        source: "Design Museum",
      },
    ];
  } else {
    return [
      {
        quote: "Exquisite warmth. The combination of local stone fireplaces and exposed pine trusses evokes a serene forest retreat.",
        author: "Björn Larsson",
        source: "Nordic Living",
      },
      {
        quote: "A celebration of local materials and cozy simplicity. The texture-rich textiles and hearth-centric layout feel authentic.",
        author: "Fiona Campbell",
        source: "Cabin Journal",
      },
    ];
  }
}

export default async function SpaceDetailsPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  let space = null;
  try {
    space = await getSpaceById(id);
  } catch (err) {
    space = null;
  }

  if (!space || space.error || !space.title) {
    return (
      <main className="min-h-screen bg-[#040404] text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
              Spatial Registry Error
            </span>
            <h1 className="text-3xl font-light uppercase tracking-widest text-white">
              Space Not Found
            </h1>
            <p className="text-xs text-neutral-500 font-light leading-relaxed">
              The spatial configuration you requested does not exist or has been removed from the archives.
            </p>
          </div>
          <div className="pt-4">
            <Link href="/browse">
              <span className="inline-flex items-center h-11 px-6 bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition duration-300 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Catalog
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const critiques = getCritiques(space.category);

  return (
    <main className="min-h-screen bg-[#040404] text-neutral-100 pb-20">
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          {space.coverImage ? (
            <img
              src={space.coverImage}
              alt={space.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#0a0a0d] flex items-center justify-center text-[#dfb780]/20 font-serif italic text-8xl">
              Æ
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040404] via-[#040404]/60 to-[#040404]/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#dfb780]/70 hover:text-[#dfb780] transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
            </Link>
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] bg-[#dfb780]/10 border border-[#dfb780]/20 text-[#dfb780] font-medium">
                {space.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-light uppercase tracking-widest text-white leading-tight">
                {space.title}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-neutral-400 text-xs font-light">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#dfb780]" />
                <span>{space.location || "Location N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-neutral-500" />
                <span>{space.dimensions || "Dimensions N/A"}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
              Licensing Plan Rate
            </span>
            <span className="text-3xl md:text-4xl font-extralight text-[#dfb780] tracking-wider">
              ${(space.price || 0).toFixed(2)}k
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Architectural Overview
            </h2>
            <div className="space-y-4 text-sm text-neutral-400 font-light leading-relaxed">
              {space.description ? (
                space.description
                  .split("\n")
                  .map((para: string, idx: number) => <p key={idx}>{para}</p>)
              ) : (
                <p>No description provided for this spatial portfolio.</p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780] flex items-center gap-2">
              <Award className="w-3.5 h-3.5" /> Technical Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl">
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#dfb780]" /> Architect
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {space.architectName || "Anonymous"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-[#dfb780]" /> Dimensions
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {space.dimensions || "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#dfb780]" /> Location
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {space.location || "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-[#dfb780]" /> Aesthetic Rating
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {space.rating?.toFixed(2) || "5.00"}
                </span>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 block flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#dfb780]" /> Registry Date
                </span>
                <span className="text-xs text-neutral-300 font-medium">
                  {space.createdAt
                    ? new Date(space.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Aesthetic Critiques
            </h2>
            <div className="space-y-4">
              {critiques.map((critique, idx) => (
                <div
                  key={idx}
                  className="bg-[#0a0a0d]/60 border border-white/[0.02] p-6 rounded-2xl space-y-3"
                >
                  <p className="text-xs text-neutral-400 italic leading-relaxed">
                    "{critique.quote}"
                  </p>
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-neutral-500">
                    <span className="font-semibold">{critique.author}</span>
                    <span>{critique.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-28 bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-2xl space-y-6 shadow-2xl">
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-[#dfb780] font-bold block">
                Spatial Licensing
              </span>
              <h3 className="text-lg uppercase tracking-wider text-white font-light">
                Acquire Spatial Plan
              </h3>
              <p className="text-xs text-neutral-500 font-light leading-relaxed">
                Gain immediate access to verified architectural drawings, dimension layouts, material boards, and 3D assets.
              </p>
            </div>

            <div className="space-y-3">
              <button className="w-full h-11 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-xs font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md shadow-[#dfb780]/5 cursor-pointer">
                Acquire Spatial Licensing Plan
              </button>
              <button className="w-full h-11 bg-white/[0.02] border border-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition duration-300 cursor-pointer">
                Inquire Blueprint Design
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.02] space-y-2 text-[10px] text-neutral-500 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb780]" />
                <span>Includes high-res CAD blueprints</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfb780]" />
                <span>Direct architect communication</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}