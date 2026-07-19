"use server";

import { serverMutation } from "../core/server";

export async function createTransaction(
  subInfo: Record<string, any>,
): Promise<any> {
  const result = await serverMutation("/api/transactions", subInfo, "POST");
  return result;
}
