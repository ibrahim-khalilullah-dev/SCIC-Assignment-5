import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getUserSession } from "@/lib/core/session";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const db = await getDb();

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { banned: false } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
