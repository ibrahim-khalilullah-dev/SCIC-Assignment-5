import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGO_DB_URI) {
  throw new Error(
    "Missing environment variable: MONGO_DB_URI inside .env.local",
  );
}

const uri = process.env.MONGO_DB_URI;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const connection = await clientPromise;
  return connection.db(process.env.AUTH_DB_NAME || "aetheris");
}
