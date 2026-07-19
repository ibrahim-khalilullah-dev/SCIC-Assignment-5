import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const db = await getDb();
    const rawUsers = await db.collection("users").find().toArray();

    const users = rawUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      userRole: u.userRole || "user",
      verifiedArchitect: !!u.verifiedArchitect,
      banned: !!u.banned,
    }));

    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
