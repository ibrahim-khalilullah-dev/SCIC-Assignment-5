import React from "react";
import Link from "next/link";
import { getDb } from "@/lib/db";
import { Star, ArrowRight } from "lucide-react";

interface ShowcaseSpace {
  _id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  coverImage: string;
  architectName: string;
}

export default async function Showcase(): Promise<React.JSX.Element> {
  let spaces: ShowcaseSpace[] = [];

  try {
    const db = await getDb();
    const rawSpaces = await db
      .collection("spaces")
      .find({ status: "Approved" })
      .sort({ rating: -1 })
      .limit(3)
      .toArray();

    if (rawSpaces.length > 0) {
      spaces = rawSpaces.map((s) => ({
        _id: s._id.toString(),
        title: s.title,
        category: s.category,
        price: s.price,
        rating: s.rating,
        coverImage: s.coverImage || "",
        architectName: s.architectName,
      }));
    } else {
      const allRawSpaces = await db
        .collection("spaces")
        .find()
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray();

      if (allRawSpaces.length > 0) {
        spaces = allRawSpaces.map((s) => ({
          _id: s._id.toString(),
          title: s.title,
          category: s.category,
          price: s.price,
          rating: s.rating,
          coverImage: s.coverImage || "",
          architectName: s.architectName,
        }));
      }
    }
  } catch (err) {
    spaces = [];
  }

  if (spaces.length === 0) {
    spaces = [
      {
        _id: "demo1",
        title: "The Japandi Atrium",
        category: "Japandi Minimalism",
        price: 24.5,
        rating: 4.95,
        coverImage:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop",
        architectName: "Kengo Shira",
      },
      {
        _id: "demo2",
        title: "The Concrete Monolith",
        category: "Modernist Brutalism",
        price: 32.0,
        rating: 4.88,
        coverImage:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
        architectName: "Elena Croft",
      },
      {
        _id: "demo3",
        title: "The Dessau Pavilion",
        category: "Classical Bauhaus",
        price: 19.8,
        rating: 4.92,
        coverImage:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
        architectName: "Dieter Schmidt",
      },
    ];
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 bg-[#040404]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em] block">
            The Showcase
          </span>
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-widest text-white leading-tight">
            Featured Curations
          </h2>
          <p className="text-xs text-neutral-500 font-light max-w-md leading-relaxed">
            A dynamic showcase of our highest-rated luxury architectural layouts
            registered inside the Aetheris Vault.
          </p>
        </div>
        <Link href="/dashboard/browse">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#dfb780] hover:underline cursor-pointer">
            Enter Complete Catalog <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div
            key={space._id}
            className="bg-[#0a0a0d] border border-white/[0.02] p-5 rounded-xl flex flex-col h-full hover:border-[#dfb780]/20 transition-all duration-300 group"
          >
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden relative bg-neutral-900 shrink-0 border border-white/[0.01]">
              {space.coverImage ? (
                <img
                  src={space.coverImage}
                  alt={space.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#dfb780]/20 font-serif italic text-4xl">
                  Æ
                </div>
              )}
              <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded text-[#dfb780] font-bold border border-white/5">
                {space.category.split(" ")[0]}
              </span>
            </div>

            <div className="pt-4 flex flex-col flex-1 space-y-3 justify-between">
              <div className="space-y-1 min-w-0">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-white truncate group-hover:text-[#dfb780] transition">
                  {space.title}
                </h3>
                <p className="text-[10px] text-neutral-500 font-light">
                  By {space.architectName}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.02]">
                <div className="flex items-center gap-1 text-[10px] text-[#dfb780] font-bold">
                  <Star className="w-3 h-3 fill-current" />{" "}
                  {space.rating?.toFixed(2) || "5.00"}
                </div>
                <span className="text-xs font-black text-white">
                  ${space.price?.toFixed(2)}k
                </span>
              </div>

              <Link href={`/dashboard/browse`} className="block">
                <span className="w-full h-9 bg-white/[0.01] border border-white/5 text-neutral-400 hover:bg-gradient-to-r hover:from-[#dfb780] hover:to-[#c2965d] hover:text-black font-bold rounded-lg text-[9px] uppercase tracking-widest transition duration-300 flex items-center justify-center cursor-pointer">
                  Inquire Details
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
