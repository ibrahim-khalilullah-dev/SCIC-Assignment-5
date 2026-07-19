import { serverFetch, protectedFetch } from "../core/server";
import { SpaceSchema, TransactionSchema } from "../types/schema";

export async function getSpaces(
  queryString: string = "",
): Promise<SpaceSchema[]> {
  return serverFetch<SpaceSchema[]>(`/api/spaces?${queryString}`);
}

export async function getSpaceById(
  id: string,
): Promise<SpaceSchema & { error?: string }> {
  return serverFetch<SpaceSchema & { error?: string }>(`/api/spaces/${id}`);
}

export async function getArchitectSpaces(): Promise<SpaceSchema[]> {
  return protectedFetch<SpaceSchema[]>("/api/architect/my-spaces");
}

export async function getArchitectReservations(): Promise<TransactionSchema[]> {
  return protectedFetch<TransactionSchema[]>("/api/architect/reservations");
}

export async function getBookmarks(): Promise<SpaceSchema[]> {
  return protectedFetch<SpaceSchema[]>("/api/bookmarks");
}

export async function getUserReservations(): Promise<TransactionSchema[]> {
  return protectedFetch<TransactionSchema[]>("/api/user/reservations");
}
