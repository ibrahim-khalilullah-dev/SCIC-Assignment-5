import { serverFetch, protectedFetch } from "../core/server";

export async function getSpaces(queryString: string = ""): Promise<any> {
  return serverFetch(`/api/spaces?${queryString}`);
}

export async function getSpaceById(id: string): Promise<any> {
  return serverFetch(`/api/spaces/${id}`);
}

export async function getArchitectSpaces(): Promise<any> {
  return protectedFetch("/api/architect/my-spaces");
}

export async function getArchitectReservations(): Promise<any> {
  return protectedFetch("/api/architect/reservations");
}

export async function getBookmarks(): Promise<any> {
  return protectedFetch("/api/bookmarks");
}

export async function getUserReservations(): Promise<any> {
  return protectedFetch("/api/user/reservations");
}
