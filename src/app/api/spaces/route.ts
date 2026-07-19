import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query: Record<string, any> = {};
    if (category && category !== "All") {
      query.category = category;
    }

    const spaces = await db.collection("spaces").find(query).toArray();
    return NextResponse.json(spaces || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getUserSession();
    if (!user || (user.role !== "writer" && user.role !== "admin")) {
      return NextResponse.json(
        { error: "Architect or Admin privilege required." },
        { status: 403 },
      );
    }

    const db = await getDb();
    const body = await request.json();

    const newSpace = {
      title: body.title,
      category: body.category,
      shortDescription: body.shortDescription,
      description: body.description,
      price: parseFloat(body.price) || 0,
      rating: 5.0,
      coverImage: body.coverImage || "",
      architectName: user.name,
      architectEmail: user.email,
      dimensions: body.dimensions || "N/A",
      location: body.location || "N/A",
      createdAt: new Date(),
    };

    const result = await db.collection("spaces").insertOne(newSpace);
    return NextResponse.json({ success: true, spaceId: result.insertedId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
