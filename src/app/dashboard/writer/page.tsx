import React from "react";
import Link from "next/link";
import { requireRole } from "@/lib/core/session";
import { getDb } from "@/lib/db";
import { Layers, PlusCircle, Activity, Landmark } from "lucide-react";

export const dynamic = "force-dynamic";

interface ManagedSpace {
  _id: string;
  title: string;
  category: string;
  price: number;
  location: string;
}

export default async function WriterDashboard(): Promise<React.JSX.Element> {
  const user = await requireRole("writer");

  const db = await getDb();
  const rawSpaces = await db
    .collection("spaces")
    .find({ architectEmail: user.email })
    .toArray();

  const spaces: ManagedSpace[] = rawSpaces.map((s) => ({
    _id: s._id.toString(),
    title: s.title,
    category: s.category,
    price: s.price,
    location: s.location || "N/A",
  }));

  const spaceIds = rawSpaces.map((s) => s._id);
  const clientPurchases = await db
    .collection("transactions")
    .find({ associatedItemId: { $in: spaceIds }, type: "purchase" })
    .toArray();

  const totalEarnings = clientPurchases.reduce(
    (acc, tx) => acc + (tx.amountPaid || 0),
    0,
  );

  return (
    <div className="space-y-12 bg-[#040404] min-h-screen text-neutral-100">
      <div className="border-b border-white/[0.02] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#dfb780]">
            Architect Control Console
          </span>
          <h1 className="text-3xl font-light uppercase tracking-widest mt-1">
            Studio Registry: {user?.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-2 font-light">
            Monitor spatial layout metrics, track acquisition payments, and
            distribute curated designs.
          </p>
        </div>

        {!user.verifiedArchitect && (
          <div className="p-4 bg-[#dfb780]/5 border border-[#dfb780]/20 rounded-xl max-w-sm shrink-0">
            <span className="text-[9px] uppercase tracking-widest text-[#dfb780] font-bold block mb-1">
              Account Unverified
            </span>
            <p className="text-[10px] text-neutral-400 font-light leading-relaxed mb-3">
              Unlock spatial blueprint listings by purchasing the Aetheris
              Architect License.
            </p>
            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="checkout_type" value="verification" />
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-[#dfb780] to-[#c2965d] hover:from-[#e7c79c] hover:to-[#dfb780] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg transition"
              >
                Pay Registration Fee ($20)
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl flex flex-row items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              Registered Blueprints
            </span>
            <span className="text-xl font-light text-white tracking-wider">
              {spaces.length} Templates
            </span>
          </div>
        </div>

        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl flex flex-row items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              Total Licensing Income
            </span>
            <span className="text-xl font-light text-[#dfb780] tracking-wider">
              ${totalEarnings.toLocaleString()} USD
            </span>
          </div>
        </div>

        <div className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl flex flex-row items-center gap-5">
          <div className="w-10 h-10 rounded-full bg-[#dfb780]/5 border border-[#dfb780]/15 flex items-center justify-center text-[#dfb780]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest block">
              Active Acquisitions
            </span>
            <span className="text-xl font-light text-white tracking-wider">
              {clientPurchases.length} Transactions
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.02]">
          <h2 className="text-sm uppercase tracking-widest text-white">
            Your Studio Collections
          </h2>
          <Link href="/items/add">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#dfb780] hover:underline cursor-pointer">
              <PlusCircle className="w-4 h-4" /> Add Space
            </span>
          </Link>
        </div>

        {spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaces.map((space) => (
              <div
                key={space._id}
                className="bg-[#0a0a0d] border border-white/[0.02] p-6 rounded-xl space-y-4 hover:border-[#dfb780]/15 transition duration-300"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-white font-medium">
                      {space.title}
                    </h3>
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 mt-1 block">
                      {space.category} • {space.location}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-[#dfb780]">
                    ${space.price}k
                  </span>
                </div>
                <div className="pt-2 border-t border-white/[0.02] flex justify-between items-center text-[10px] uppercase tracking-widest">
                  <Link href={`/browse/${space._id}`}>
                    <span className="text-neutral-400 hover:text-white transition">
                      View Catalog
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#0a0a0d] border border-white/[0.02] rounded-xl">
            <p className="text-neutral-500 text-xs uppercase tracking-widest">
              You haven't listed any architectural spaces yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
