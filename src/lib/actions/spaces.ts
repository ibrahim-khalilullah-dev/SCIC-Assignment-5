"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import { ObjectId } from "mongodb";

export async function createSpace(data: Record<string, any>): Promise<any> {
  const user = await getUserSession();
  if (
    !user ||
    (user.role !== "writer" &&
      user.role !== "admin" &&
      user.userRole !== "writer")
  ) {
    return { error: "Architect or Admin privilege required." };
  }

  try {
    const db = await getDb();
    const newSpace = {
      title: data.title,
      category: data.category,
      shortDescription: data.shortDescription,
      description: data.description,
      price: parseFloat(data.price) || 0,
      rating: 5.0,
      coverImage: data.coverImage || "",
      architectName: user.name,
      architectEmail: user.email,
      dimensions: data.dimensions || "N/A",
      location: data.location || "N/A",
      createdAt: new Date(),
    };

    const result = await db.collection("spaces").insertOne(newSpace);

    revalidatePath("/dashboard/browse");
    revalidatePath("/dashboard/items/manage");
    return { success: true, spaceId: result.insertedId.toString() };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateSpace(
  id: string,
  data: Record<string, any>,
): Promise<any> {
  const user = await getUserSession();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const existingSpace = await db
      .collection("spaces")
      .findOne({ _id: new ObjectId(id) });

    if (!existingSpace) {
      return { error: "Target spatial blueprint record not found." };
    }

    const isOwner = existingSpace.architectEmail === user.email;
    const isSteward = user.role === "admin" || user.role === "moderator";

    if (!isOwner && !isSteward) {
      return { error: "Access denied: Content ownership limits enforced." };
    }

    const updateFields: Record<string, any> = {
      title: data.title,
      category: data.category,
      shortDescription: data.shortDescription,
      description: data.description,
      price: data.price !== undefined ? parseFloat(data.price) : undefined,
      coverImage: data.coverImage,
      dimensions: data.dimensions,
      location: data.location,
    };

    Object.keys(updateFields).forEach(
      (key) => updateFields[key] === undefined && delete updateFields[key],
    );

    await db
      .collection("spaces")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    revalidatePath(`/dashboard/browse`);
    revalidatePath("/dashboard/items/manage");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteSpace(id: string): Promise<any> {
  const user = await getUserSession();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const existingSpace = await db
      .collection("spaces")
      .findOne({ _id: new ObjectId(id) });

    if (!existingSpace) {
      return { error: "Target spatial blueprint record not found." };
    }

    const isOwner = existingSpace.architectEmail === user.email;
    const isSteward = user.role === "admin" || user.role === "moderator";

    if (!isOwner && !isSteward) {
      return { error: "Access denied: Content ownership limits enforced." };
    }

    await db.collection("spaces").deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/dashboard/browse");
    revalidatePath("/dashboard/items/manage");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
