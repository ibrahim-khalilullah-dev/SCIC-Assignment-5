import { serverFetch, protectedFetch } from "../core/server";

export async function getEbooks(queryString: string = ""): Promise<any> {
  return serverFetch(`/api/ebooks?${queryString}`);
}

export async function getEbookById(id: string): Promise<any> {
  return serverFetch(`/api/ebooks/${id}`);
}

export async function getWriterEbooks(): Promise<any> {
  return protectedFetch("/api/writer/my-ebooks");
}

export async function getWriterSales(): Promise<any> {
  return protectedFetch("/api/writer/sales");
}

export async function getAdminUsers(): Promise<any> {
  return protectedFetch("/api/admin/users");
}

export async function getAdminTransactions(): Promise<any> {
  return protectedFetch("/api/admin/transactions");
}

export async function getAdminAnalytics(): Promise<any> {
  return protectedFetch("/api/admin/analytics");
}

export async function getBookmarks(): Promise<any> {
  return protectedFetch("/api/bookmarks");
}

export async function getUserPurchasedEbooks(): Promise<any> {
  return protectedFetch("/api/user/purchased-ebooks");
}

export async function getUserPurchases(): Promise<any> {
  return protectedFetch("/api/user/purchases");
}

export async function getAdminEbooks(): Promise<any> {
  return protectedFetch("/api/admin/ebooks");
}

export async function getTopWriters(): Promise<any> {
  return serverFetch("/api/top-writers");
}
