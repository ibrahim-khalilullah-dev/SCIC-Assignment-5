"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function createEbook(data: Record<string, any>): Promise<any> {
  const result = await serverMutation("/api/ebooks", data, "POST");
  revalidatePath("/browse");
  revalidatePath("/dashboard/writer/ebooks");
  return result;
}

export async function updateEbook(
  id: string,
  data: Record<string, any>,
): Promise<any> {
  const result = await serverMutation(`/api/ebooks/${id}`, data, "PATCH");
  revalidatePath(`/browse/${id}`);
  revalidatePath("/dashboard/writer/ebooks");
  revalidatePath("/dashboard/admin/ebooks");
  return result;
}

export async function deleteEbook(id: string): Promise<any> {
  const result = await serverMutation(`/api/ebooks/${id}`, {}, "DELETE");
  revalidatePath("/browse");
  revalidatePath("/dashboard/writer/ebooks");
  revalidatePath("/dashboard/admin/ebooks");
  return result;
}
