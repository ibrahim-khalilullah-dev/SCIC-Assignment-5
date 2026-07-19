import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export interface CustomUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string;
  userRole?: string;
  verifiedArchitect?: boolean;
}

export async function getUserSession(): Promise<CustomUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (session?.user as unknown as CustomUser) || null;
}

export async function getUserToken(): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.token || null;
}

export async function requireRole(
  allowedRole: "user" | "writer" | "admin",
): Promise<CustomUser> {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user.role !== allowedRole) {
    redirect("/unauthorized");
  }

  return user;
}
