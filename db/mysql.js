import mysql from "mysql2/promise";
import { DatabaseAdapter } from "./base.js";

export class MySQLAdapter extends DatabaseAdapter {
  constructor(conn) {
    super();
    this.connectionString = conn;
    this.connection = null;
  }

  async connect() {
    this.connection = await mysql.createConnection(this.connectionString);
  }

  async query(sql) {
    const [rows] = await this.connection.execute(sql);
    return { rows };
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
    }
  }
}
