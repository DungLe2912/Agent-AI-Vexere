import { PostgresAdapter } from "./pg.js";
import { MySQLAdapter } from "./mysql.js";
import { MongoDBAdapter } from "./mongodb.js";
import { SQLiteAdapter } from "./sqlite.js";

export class DatabaseFactory {
  static create(type, connection) {
    switch (type.toLowerCase()) {
      case "postgresql":
      case "postgres":
      case "pg":
        return new PostgresAdapter(connection);

      case "mysql":
      case "mariadb":
        return new MySQLAdapter(connection);

      case "mongodb":
      case "mongo":
        return new MongoDBAdapter(connection);

      case "sqlite":
      case "sqlite3":
        return new SQLiteAdapter(connection);

      default:
        throw new Error(
          `Unsupported database type: ${type}. Supported types: postgresql, mysql, mongodb, sqlite`
        );
    }
  }

  static detectTypeFromConnectionString(connectionString) {
    if (
      connectionString.startsWith("postgresql://") ||
      connectionString.startsWith("postgres://")
    ) {
      return "postgresql";
    }
    if (connectionString.startsWith("mysql://")) {
      return "mysql";
    }
    if (
      connectionString.startsWith("mongodb://") ||
      connectionString.startsWith("mongodb+srv://")
    ) {
      return "mongodb";
    }
    if (
      connectionString.endsWith(".db") ||
      connectionString.endsWith(".sqlite")
    ) {
      return "sqlite";
    }

    // Default to PostgreSQL if can't detect
    return "postgresql";
  }
}
