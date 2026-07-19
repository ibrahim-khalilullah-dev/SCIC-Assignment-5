import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { getUserSession } from "@/lib/core/session";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const db = await getDb();
    const space = await db
      .collection("spaces")
      .findOne({ _id: new ObjectId(id) });

    if (!space) {
      return NextResponse.json(
        { error: "Spatial portfolio not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(space);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const body = await request.json();

    const updateFields: Record<string, any> = {
      title: body.title,
      category: body.category,
      shortDescription: body.shortDescription,
      description: body.description,
      price: parseFloat(body.price),
      coverImage: body.coverImage,
      dimensions: body.dimensions,
      location: body.location,
    };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key],
    );

    await db
      .collection("spaces")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const user = await getUserSession();
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin verification required" },
        { status: 403 },
      );
    }

    const db = await getDb();
    await db.collection("spaces").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
