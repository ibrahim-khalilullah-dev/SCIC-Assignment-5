"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import { ObjectId } from "mongodb";

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<any> {
  const user = await getUserSession();
  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { role } });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function banUser(userId: string): Promise<any> {
  const user = await getUserSession();
  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { banned: true } });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function unbanUser(userId: string): Promise<any> {
  const user = await getUserSession();
  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { banned: false } });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteUser(userId: string): Promise<any> {
  const user = await getUserSession();
  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function updateProfile(data: Record<string, any>): Promise<any> {
  const user = await getUserSession();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const updateFields: Record<string, any> = {
      name: data.name,
      image: data.image,
    };

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(user.id) }, { $set: updateFields });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
