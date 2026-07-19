import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function authHeader(): Promise<HeadersInit> {
  const token = await getUserToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

export async function serverFetch<T = any>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });
  return handleStatusCode<T>(res);
}

export async function protectedFetch<T = any>(path: string): Promise<T> {
  const headers = await authHeader();
  const res = await fetch(`${baseUrl}${path}`, {
    headers,
    cache: "no-store",
  });
  return handleStatusCode<T>(res);
}

export async function serverMutation<T = any>(
  path: string,
  data: any,
  method: string = "POST",
): Promise<T> {
  const authHeaders = await authHeader();
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    } as HeadersInit,
    body: JSON.stringify(data),
  });
  return handleStatusCode<T>(res);
}

function handleStatusCode<T = any>(res: Response): Promise<T> {
  if (res.status === 401) {
    redirect("/unauthorized");
  } else if (res.status === 403) {
    redirect("/unauthorized");
  }
  return res.json() as Promise<T>;
}
