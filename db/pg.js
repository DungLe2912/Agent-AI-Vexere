import { Client as PgClient } from "pg";

export class PostgresAdapter {
  constructor(conn) {
    this.client = new PgClient({ connectionString: conn });
  }

  async connect() {
    await this.client.connect();
  }

  async query(sql) {
    return this.client.query(sql);
  }
}
