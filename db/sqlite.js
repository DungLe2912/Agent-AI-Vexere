import sqlite3 from "sqlite3";
import { DatabaseAdapter } from "./base.js";

export class SQLiteAdapter extends DatabaseAdapter {
  constructor(filepath) {
    super();
    this.filepath = filepath;
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.filepath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  async query(sql) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve({ rows });
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
