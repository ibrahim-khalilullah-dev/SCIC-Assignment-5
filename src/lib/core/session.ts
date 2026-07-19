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
  allowedRole: "user" | "writer" | "admin" | "moderator",
): Promise<CustomUser> {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  const roleKey = user.role?.toLowerCase();
  const subRoleKey = user.userRole?.toLowerCase();

  if (roleKey === "admin") {
    return user;
  }

  if (allowedRole === "admin" && roleKey !== "admin") {
    redirect("/unauthorized");
  }

  if (allowedRole === "moderator" && roleKey !== "moderator") {
    redirect("/unauthorized");
  }

  if (allowedRole === "writer" && subRoleKey !== "writer") {
    redirect("/unauthorized");
  }

  if (
    allowedRole === "user" &&
    subRoleKey !== "user" &&
    subRoleKey !== "writer"
  ) {
    redirect("/unauthorized");
  }

  return user;
}
