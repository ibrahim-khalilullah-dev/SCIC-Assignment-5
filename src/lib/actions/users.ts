"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<any> {
  const result = await serverMutation(
    `/api/admin/users/${userId}/role`,
    { role },
    "PATCH",
  );
  revalidatePath("/dashboard/admin/users");
  return result;
}

export async function banUser(userId: string): Promise<any> {
  const result = await serverMutation(
    `/api/admin/users/${userId}/ban`,
    {},
    "PATCH",
  );
  revalidatePath("/dashboard/admin/users");
  return result;
}

export async function unbanUser(userId: string): Promise<any> {
  const result = await serverMutation(
    `/api/admin/users/${userId}/unban`,
    {},
    "PATCH",
  );
  revalidatePath("/dashboard/admin/users");
  return result;
}

export async function deleteUser(userId: string): Promise<any> {
  const result = await serverMutation(
    `/api/admin/users/${userId}`,
    {},
    "DELETE",
  );
  revalidatePath("/dashboard/admin/users");
  return result;
}

export async function updateProfile(data: Record<string, any>): Promise<any> {
  const result = await serverMutation("/api/users/profile", data, "PATCH");
  revalidatePath("/dashboard/user/profile");
  revalidatePath("/dashboard/writer/profile");
  revalidatePath("/dashboard/admin/profile");
  return result;
}
