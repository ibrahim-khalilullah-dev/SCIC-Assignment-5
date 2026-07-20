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
    const existingSpace = await db
      .collection("spaces")
      .findOne({ _id: new ObjectId(id) });

    if (!existingSpace) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const isOwner = existingSpace.architectEmail === user.email;
    const isSteward = user.role === "admin" || user.role === "moderator";

    if (!isOwner && !isSteward) {
      return NextResponse.json(
        { error: "Forbidden: Ownership verified" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const updateFields: Record<string, any> = {
      title: body.title,
      category: body.category,
      shortDescription: body.shortDescription,
      description: body.description,
      price: body.price !== undefined ? parseFloat(body.price) : undefined,
      coverImage: body.coverImage,
      dimensions: body.dimensions,
      location: body.location,
      status: body.status, // Allow moderator reviews status modification
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const existingSpace = await db
      .collection("spaces")
      .findOne({ _id: new ObjectId(id) });

    if (!existingSpace) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const isOwner = existingSpace.architectEmail === user.email;
    const isSteward = user.role === "admin" || user.role === "moderator";

    if (!isOwner && !isSteward) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("spaces").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
