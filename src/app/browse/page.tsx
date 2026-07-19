"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { Search, Star, Layers, ChevronDown } from "lucide-react";

interface Space {
  _id: string;
  title: string;
  category: string;
  shortDescription?: string;
  description?: string;
  price: number;
  rating: number;
  coverImage?: string;
  architectName: string;
  architectEmail?: string;
  dimensions?: string;
  location?: string;
  createdAt?: string | Date;
}

const STYLES: string[] = [
  "All",
  "Japandi Minimalism",
  "Modernist Brutalism",
  "Classical Bauhaus",
  "Nordic Rustic",
];

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function CustomDropdown({
  value,
  onChange,
  options,
}: DropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="relative min-w-[180px] w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900/40 border border-white/5 hover:border-[#dfb780]/30 rounded-lg h-11 px-4 text-[10px] uppercase tracking-widest text-neutral-400 flex items-center justify-between transition cursor-pointer focus:outline-none"
      >
        <span>{selectedOption.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-600" />
      </button>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-12 left-0 w-full bg-[#0a0a0d] border border-[#dfb780]/20 rounded-lg shadow-xl py-1.5 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-[9px] uppercase tracking-widest transition-colors ${
                  opt.value === value
                    ? "bg-[#dfb780]/10 text-[#dfb780] font-semibold"
                    : "text-neutral-400 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function BrowsePage(): React.JSX.Element {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [maxInquiry, setMaxInquiry] = useState<number>(35);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpaces = async (): Promise<void> => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          "https://fable-backend.vercel.app";
        const res = await fetch(`${baseUrl}/api/spaces`);
        if (res.ok) {
          const data = await res.json();
          setSpaces(data || []);
        }
      } catch (err) {
        console.warn(
          "Express backend disconnected. Rendering safe Empty State.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, []);

  const filteredSpaces = spaces
    .filter((space) => {
      const matchesSearch =
        space.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        space.architectName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle =
        selectedStyle === "All" || space.category === selectedStyle;
      const matchesPrice = space.price <= maxInquiry;
      return matchesSearch && matchesStyle && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return b.rating - a.rating;
    });

  const styleOptions = STYLES.map((style) => ({ value: style, label: style }));

  const sortOptions = [
    { value: "rating", label: "Rating Priority" },
    { value: "price-low", label: "Rate: Low to High" },
    { value: "price-high", label: "Rate: High to Low" },
  ];

  return (
    <div className="bg-[#040404] text-neutral-100 min-h-screen px-6 pb-12 pt-28 md:px-12 md:pb-12 md:pt-32">
      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <span className="text-[10px] font-bold text-[#dfb780] uppercase tracking-[0.25em]">
            Aetheris Vault
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest mt-1">
            Curated Spaces
          </h1>
          <p className="text-xs text-neutral-500 mt-2 font-light">
            Explore blueprints, execute spatial vision queries, and engage
            agents.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search Curated Portfolios..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="w-full h-11 pl-11 pr-4 bg-zinc-900/40 border border-white/5 hover:border-white/10 focus:outline-none focus:border-[#dfb780] rounded-lg text-xs uppercase tracking-wider text-white placeholder-neutral-600 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center w-full lg:w-auto">
            <CustomDropdown
              value={selectedStyle}
              onChange={setSelectedStyle}
              options={styleOptions}
            />

            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />

            <div className="flex items-center gap-3 bg-zinc-900/40 border border-white/5 rounded-lg h-11 px-4 min-w-[200px] w-full sm:w-auto">
              <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold shrink-0">
                Limit: ${maxInquiry}k
              </span>
              <input
                type="range"
                min="10"
                max="35"
                value={maxInquiry}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setMaxInquiry(Number(e.target.value))
                }
                className="w-full accent-[#dfb780] h-1 rounded-lg cursor-pointer bg-neutral-800"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-[#0a0a0d] border border-white/[0.02] p-4 rounded-xl space-y-4 animate-pulse"
              >
                <div className="w-full aspect-[3/4] bg-zinc-900/40 rounded-lg"></div>
                <div className="h-3 bg-zinc-900/40 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-900/40 rounded w-1/2"></div>
                <div className="h-8 bg-zinc-900/40 rounded w-full pt-4"></div>
              </div>
            ))}
          </div>
        ) : filteredSpaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSpaces.map((space) => (
              <Card
                key={space._id}
                className="bg-[#0a0a0d] border border-white/[0.02] p-4 rounded-xl flex flex-col h-full hover:border-[#dfb780]/20 transition-all duration-300 group"
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden relative bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 shrink-0 flex items-center justify-center border border-white/[0.01]">
                  {space.coverImage ? (
                    <img
                      src={space.coverImage}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      alt={space.title}
                    />
                  ) : (
                    <div className="text-center space-y-2 p-4">
                      <div className="w-8 h-8 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780] text-[10px] font-bold mx-auto">
                        Æ
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-500 block truncate max-w-[130px] font-sans">
                        {space.title}
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 right-2 text-[8px] uppercase tracking-wider bg-neutral-950/80 backdrop-blur-md px-2 py-1 rounded text-[#dfb780] font-bold border border-white/5">
                    {space.category.split(" ")[0]}
                  </span>
                </div>

                <div className="pt-4 flex flex-col flex-1 space-y-3 justify-between">
                  <div className="space-y-1 min-w-0">
                    <h3
                      className="text-xs uppercase tracking-widest font-semibold text-white truncate group-hover:text-[#dfb780] transition"
                      title={space.title}
                    >
                      {space.title}
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-light">
                      {space.architectName}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-white/[0.02]">
                    <div className="flex items-center gap-1 text-[10px] text-[#dfb780] font-bold">
                      <Star className="w-3 h-3 fill-current" />{" "}
                      {space.rating?.toFixed(2)}
                    </div>
                    <span className="text-xs font-black text-white">
                      ${space.price?.toFixed(2)}k
                    </span>
                  </div>

                  <Link href={`/browse/${space._id}`} className="block">
                    <Button className="w-full h-8 bg-white/[0.02] border border-white/5 text-neutral-300 hover:bg-white/[0.06] group-hover:bg-gradient-to-r group-hover:from-[#dfb780] group-hover:to-[#c2965d] group-hover:text-black font-bold rounded-lg text-[9px] uppercase tracking-widest transition duration-300 h-9">
                      Inquire Details
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#0a0a0d] border border-white/[0.02] rounded-2xl flex flex-col items-center justify-center p-6 space-y-6">
            <div className="w-12 h-12 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-sm">
              <h3 className="text-sm uppercase tracking-[0.2em] font-semibold text-white">
                Archival Registry Empty
              </h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed font-light">
                There are no physical properties registered inside our database
                directories yet.
              </p>
            </div>
            <Link href="/items/add">
              <Button className="h-9 px-5 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[9px] font-bold uppercase tracking-widest rounded-lg transition duration-300 shadow-md">
                Register First Space
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
