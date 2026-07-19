import { ObjectId } from "mongodb";

export interface UserSchema {
  _id: ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: "user" | "writer" | "admin" | "moderator";
  userRole: "user" | "writer";
  verifiedArchitect: boolean;
  banned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpaceSchema {
  _id: ObjectId;
  title: string;
  category:
    | "Japandi Minimalism"
    | "Modernist Brutalism"
    | "Classical Bauhaus"
    | "Nordic Rustic";
  shortDescription: string;
  description: string;
  price: number;
  rating: number;
  coverImage: string;
  architectName: string;
  architectEmail: string;
  dimensions: string;
  location: string;
  createdAt: Date;
}

export interface TransactionSchema {
  _id: ObjectId;
  stripeSessionId: string;
  type: "purchase" | "publishing fee";
  buyerEmail: string;
  associatedItemId?: ObjectId;
  amountPaid: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}
