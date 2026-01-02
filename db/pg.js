import { Client as PgClient } from "pg";
import { DatabaseAdapter } from "./base.js";

export class PostgresAdapter extends DatabaseAdapter {
  constructor(conn) {
    super();
    this.client = new PgClient({ connectionString: conn });
  }

  async connect() {
    await this.client.connect();
  }

  async query(sql) {
    return this.client.query(sql);
  }

  async close() {
    await this.client.end();
  }
}
