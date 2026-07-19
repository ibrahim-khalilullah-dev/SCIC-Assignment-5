"use server";

import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export async function addBookmark(spaceId: string): Promise<any> {
  const result = await serverMutation("/api/bookmarks", { spaceId }, "POST");
  revalidatePath("/dashboard/user");
  return result;
}

export async function deleteBookmark(spaceId: string): Promise<any> {
  const result = await serverMutation(
    `/api/bookmarks/${spaceId}`,
    {},
    "DELETE",
  );
  revalidatePath("/dashboard/user");
  return result;
}
