import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/core/session";
import { getDb } from "@/lib/db";
import { Layers, Sparkles, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

interface InquiredSpace {
  _id: string;
  title: string;
  architectName: string;
  category: string;
  price: number;
  coverImage: string;
}

export default async function UserDashboard(): Promise<React.JSX.Element> {
  const user = await requireRole("user");

  const db = await getDb();
  const transactions = await db
    .collection("transactions")
    .find({ buyerEmail: user.email, type: "purchase" })
    .toArray();

  const associatedSpaceIds = transactions
    .map((tx) => tx.associatedItemId)
    .filter(Boolean);

  const inquiredSpacesRaw = await db
    .collection("spaces")
    .find({ _id: { $in: associatedSpaceIds } })
    .toArray();

  const inquiredSpaces: InquiredSpace[] = inquiredSpacesRaw.map((space) => ({
    _id: space._id.toString(),
    title: space.title,
    architectName: space.architectName,
    category: space.category,
    price: space.price,
    coverImage: space.coverImage || "",
  }));

  return (
    <div className="space-y-12 bg-[#040404] min-h-screen text-neutral-100">
      <div className="border-b border-white/[0.02] pb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780]">
          Aesthetics Registry
        </span>
        <h1 className="text-3xl font-light uppercase tracking-widest mt-1">
          Welcome, {user?.name || "Client"}
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Monitor active structural inquiries, view layout analytics, and
          explore design inspirations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-[#0a0a0d] to-[#040404] border border-white/[0.02] hover:border-[#dfb780]/15 p-6 rounded-xl flex flex-row items-center gap-5 transition duration-300">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              Inquired Spaces
            </span>
            <span className="text-xl font-light text-white tracking-wider">
              {inquiredSpaces.length} Portfolios
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#0a0a0d] to-[#040404] border border-white/[0.02] hover:border-[#dfb780]/15 p-6 rounded-xl flex flex-row items-center gap-5 transition duration-300">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              License Portfolio
            </span>
            <span className="text-xl font-light text-white tracking-wider">
              {transactions.length} Active Licenses
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#0a0a0d] to-[#040404] border border-white/[0.02] hover:border-[#dfb780]/15 p-6 rounded-xl flex flex-row items-center gap-5 transition duration-300">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              Complexity Metric
            </span>
            <span className="text-xl font-light text-[#dfb780] tracking-wider">
              Optimal (94%)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.02]">
            <h2 className="text-sm uppercase tracking-widest text-white">
              Your Inquired Sanctuaries
            </h2>
            <Link
              href="/browse"
              className="text-[10px] uppercase tracking-widest text-[#dfb780] hover:underline"
            >
              Browse Spaces
            </Link>
          </div>

          {inquiredSpaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {inquiredSpaces.map((space) => (
                <div
                  key={space._id}
                  className="bg-[#0a0a0d] border border-white/[0.02] p-5 rounded-xl flex flex-row gap-5 items-center hover:border-[#dfb780]/10 transition duration-300"
                >
                  <div className="w-16 aspect-[3/4] rounded-lg overflow-hidden relative bg-neutral-900 shrink-0 flex items-center justify-center border border-white/[0.01]">
                    {space.coverImage ? (
                      <img
                        src={space.coverImage}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Blueprint"
                      />
                    ) : (
                      <span className="text-[10px] font-serif italic text-neutral-600 font-bold">
                        Æ
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-semibold text-white truncate">
                        {space.title}
                      </h3>
                      <p className="text-[10px] text-neutral-500 font-light mt-0.5">
                        {space.architectName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                        Licensed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#0a0a0d] border border-white/[0.02] rounded-xl">
              <p className="text-neutral-500 text-xs uppercase tracking-widest">
                No structural portfolios registered yet.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-white">
              Client Portfolio Profile
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-white/10 bg-neutral-900 flex items-center justify-center shrink-0">
                {user?.image ? (
                  <img
                    src={user.image}
                    className="w-full h-full object-cover rounded-full"
                    alt="Avatar"
                  />
                ) : (
                  <span className="text-xs font-serif italic text-[#dfb780]">
                    {user?.name ? user.name[0].toUpperCase() : "C"}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs uppercase tracking-widest font-semibold text-white block truncate">
                  {user?.name || "Premium Client"}
                </span>
                <span className="text-[10px] text-neutral-500 block truncate mt-0.5">
                  {user?.email || "client@aetheris.com"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xs uppercase tracking-widest text-white">
                Spatial Complexity Rating
              </h3>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest">
                Optimal structural values over time
              </p>
            </div>

            <div className="w-full h-32 pt-4 relative">
              <svg
                viewBox="0 0 100 30"
                className="w-full h-full overflow-visible"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="100"
                  y2="0"
                  stroke="white"
                  strokeWidth="0.05"
                  strokeDasharray="1 2"
                  opacity="0.1"
                />
                <line
                  x1="0"
                  y1="15"
                  x2="100"
                  y2="15"
                  stroke="white"
                  strokeWidth="0.05"
                  strokeDasharray="1 2"
                  opacity="0.1"
                />
                <line
                  x1="0"
                  y1="30"
                  x2="100"
                  y2="30"
                  stroke="white"
                  strokeWidth="0.05"
                  strokeDasharray="1 2"
                  opacity="0.1"
                />

                <path
                  d="M 0,25 Q 25,12 50,18 T 100,5"
                  fill="none"
                  stroke="#dfb780"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />

                <circle
                  cx="0"
                  cy="25"
                  r="1.2"
                  fill="#040404"
                  stroke="#dfb780"
                  strokeWidth="0.4"
                />
                <circle
                  cx="50"
                  cy="18"
                  r="1.2"
                  fill="#040404"
                  stroke="#dfb780"
                  strokeWidth="0.4"
                />
                <circle
                  cx="100"
                  cy="5"
                  r="1.2"
                  fill="#040404"
                  stroke="#dfb780"
                  strokeWidth="0.4"
                />
              </svg>
              <div className="flex justify-between text-[8px] text-neutral-600 uppercase tracking-widest pt-2 font-mono">
                <span>Phase I</span>
                <span>Phase II</span>
                <span>Phase III</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm uppercase tracking-widest text-white pb-3 border-b border-white/[0.02]">
          Design Transactions & Retainers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[10px] uppercase tracking-widest text-neutral-400">
            <thead>
              <tr className="border-b border-white/[0.02] text-neutral-500">
                <th className="py-4 px-2 font-semibold">Reference Key</th>
                <th className="py-4 px-2 font-semibold">Buyer Location</th>
                <th className="py-4 px-2 font-semibold">Filing Date</th>
                <th className="py-4 px-2 font-semibold text-right">
                  Retainer Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.01] bg-[#07070a]/10">
              {transactions.map((tx) => (
                <tr
                  key={tx._id.toString()}
                  className="hover:bg-white/[0.01] transition"
                >
                  <td className="py-4 px-2 font-mono text-neutral-600">
                    {tx.stripeSessionId.slice(-12).toUpperCase()}
                  </td>
                  <td className="py-4 px-2 text-white font-medium">
                    {tx.buyerEmail}
                  </td>
                  <td className="py-4 px-2 text-neutral-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-[#dfb780]">
                    ${tx.amountPaid.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
