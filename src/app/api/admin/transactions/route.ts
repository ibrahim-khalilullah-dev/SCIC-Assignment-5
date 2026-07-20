import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const db = await getDb();
    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json(transactions || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
