import { MongoClient, Db } from "mongodb";

const url = process.env.MONGODB_URI || "";
const dbName = process.env.DB_NAME || "tekChat-App";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const options = {
  connectTimeoutMS: 60000,
  maxPoolSize: 150,
};

async function connect(): Promise<Db> {
  if (cachedDb) return cachedDb;
  if (!url) throw new Error("MONGODB_URI is not set");

  // Create new client if none cached
  if (!cachedClient) {
    cachedClient = new MongoClient(url, options as any);
  }

  // Ensure the client is connected
  if (!cachedClient.topology || !cachedClient.topology.isConnected()) {
    await cachedClient.connect();
  }

  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

async function disconnect(force = false) {
  // Only close in forced scenarios to allow connection reuse across requests
  if (force && cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

export { connect, disconnect };