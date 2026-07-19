"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function createSpace(data: Record<string, any>): Promise<any> {
  const result = await serverMutation("/api/spaces", data, "POST");
  revalidatePath("/browse");
  revalidatePath("/dashboard/user");
  return result;
}

export async function updateSpace(
  id: string,
  data: Record<string, any>,
): Promise<any> {
  const result = await serverMutation(`/api/spaces/${id}`, data, "PATCH");
  revalidatePath(`/browse/${id}`);
  revalidatePath("/browse");
  return result;
}

export async function deleteSpace(id: string): Promise<any> {
  const result = await serverMutation(`/api/spaces/${id}`, {}, "DELETE");
  revalidatePath("/browse");
  return result;
}
