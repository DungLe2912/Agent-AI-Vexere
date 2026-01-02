import { MongoClient } from "mongodb";
import { DatabaseAdapter } from "./base.js";

export class MongoDBAdapter extends DatabaseAdapter {
  constructor(conn) {
    super();
    this.connectionString = conn;
    this.client = null;
    this.db = null;
  }

  async connect() {
    this.client = new MongoClient(this.connectionString);
    await this.client.connect();

    // Extract database name from connection string
    const url = new URL(this.connectionString);
    const dbName = url.pathname.slice(1) || "test";
    this.db = this.client.db(dbName);
  }

  async query(query) {
    // MongoDB uses different query syntax
    // This is a simplified implementation
    // For production, you'd need to convert SQL to MongoDB queries
    throw new Error("MongoDB adapter requires NoSQL query format, not SQL");
  }

  async executeMongoQuery(collection, operation, query = {}) {
    const col = this.db.collection(collection);
    const result = await col[operation](query).toArray();
    return { rows: result };
  }

  async close() {
    if (this.client) {
      await this.client.close();
    }
  }
}
