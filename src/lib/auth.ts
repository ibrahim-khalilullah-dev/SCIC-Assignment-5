import { betterAuth } from "better-auth";
import clientPromise from "./db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = await clientPromise;
const db = client.db(process.env.AUTH_DB_NAME || "aetheris");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      userRole: {
        type: "string",
        defaultValue: "user",
      },
      verifiedArchitect: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              role:
                user.userRole === "admin"
                  ? "admin"
                  : user.userRole === "moderator"
                    ? "moderator"
                    : "user",
            },
          };
        },
      },
    },
  },
  plugins: [admin()],
});
