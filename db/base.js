// Base Database Adapter Interface
export class DatabaseAdapter {
  async connect() {
    throw new Error("Method 'connect()' must be implemented");
  }

  async query(sql) {
    throw new Error("Method 'query()' must be implemented");
  }

  async close() {
    throw new Error("Method 'close()' must be implemented");
  }
}
