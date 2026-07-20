"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getUserSession } from "@/lib/core/session";
import { ObjectId } from "mongodb";

export async function updateUserRole(
  userId: string,
  targetDesignation: "user" | "writer" | "moderator" | "admin",
): Promise<any> {
  const user = await getUserSession();
  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();

    let updateFields: Record<string, any> = {};
    if (targetDesignation === "admin") {
      updateFields = {
        role: "admin",
        userRole: "admin",
        verifiedArchitect: true,
      };
    } else if (targetDesignation === "moderator") {
      updateFields = {
        role: "moderator",
        userRole: "moderator",
        verifiedArchitect: false,
      };
    } else if (targetDesignation === "writer") {
      updateFields = {
        role: "user",
        userRole: "writer",
        verifiedArchitect: true,
      };
    } else {
      updateFields = {
        role: "user",
        userRole: "user",
        verifiedArchitect: false,
      };
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: updateFields });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function banUser(userId: string): Promise<any> {
  const user = await getUserSession();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const target = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!target) {
      return { error: "Target profile not found" };
    }

    // Security Gate: Moderators cannot ban administrator or moderator level roles
    if (
      user.role === "moderator" &&
      (target.role === "admin" || target.role === "moderator")
    ) {
      return {
        error: "Moderators are not authorized to block stewardship roles.",
      };
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { banned: true } });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function unbanUser(userId: string): Promise<any> {
  const user = await getUserSession();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const target = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!target) {
      return { error: "Target profile not found" };
    }

    if (
      user.role === "moderator" &&
      (target.role === "admin" || target.role === "moderator")
    ) {
      return {
        error: "Moderators are not authorized to block stewardship roles.",
      };
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { banned: false } });

    revalidatePath("/dashboard/admin");
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
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function issueWarning(
  userId: string,
  message: string,
): Promise<any> {
  const user = await getUserSession();
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    const newWarning = {
      userId,
      message,
      issuedBy: user.email,
      createdAt: new Date(),
    };

    await db.collection("warnings").insertOne(newWarning);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function dismissWarning(warningId: string): Promise<any> {
  const user = await getUserSession();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    const db = await getDb();
    await db.collection("warnings").deleteOne({
      _id: new ObjectId(warningId),
      userId: user.id,
    });
    revalidatePath("/dashboard/user");
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
