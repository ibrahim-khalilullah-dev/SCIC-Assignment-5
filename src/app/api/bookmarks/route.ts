import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const bookmarks = await db
      .collection("bookmarks")
      .find({ userId: user.id })
      .toArray();

    const spaceIds = bookmarks.map((b) => b.spaceId).filter(Boolean);
    const spaces = await db
      .collection("spaces")
      .find({ _id: { $in: spaceIds } })
      .toArray();

    return NextResponse.json(spaces || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { spaceId } = await request.json();
    if (!spaceId) {
      return NextResponse.json({ error: "Space ID required" }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("bookmarks").findOne({
      userId: user.id,
      spaceId: new ObjectId(spaceId),
    });

    if (existing) {
      return NextResponse.json({ success: true });
    }

    await db.collection("bookmarks").insertOne({
      userId: user.id,
      spaceId: new ObjectId(spaceId),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
