# Multi-Database Support

This agent supports multiple database types with automatic detection and unified interface.

## Supported Databases

- **PostgreSQL** ✅
- **MySQL** ✅
- **MongoDB** ⚠️ (Limited - requires NoSQL query adaptation)
- **SQLite** ✅

## Configuration

```env
# Auto-detects as PostgreSQL
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Auto-detects as MySQL
DATABASE_URL=mysql://user:pass@localhost:3306/dbname

# Auto-detects as MongoDB
DATABASE_URL=mongodb://user:pass@localhost:27017/dbname

# Auto-detects as SQLite
DATABASE_URL=/path/to/database.db
```

## Connection String Formats

### PostgreSQL

```
postgresql://username:password@hostname:5432/database_name
postgres://username:password@hostname:5432/database_name
```

### MySQL/MariaDB

```
mysql://username:password@hostname:3306/database_name
```

### MongoDB

```
mongodb://username:password@hostname:27017/database_name
mongodb+srv://username:password@cluster.mongodb.net/database_name
```

### SQLite

```
/absolute/path/to/database.db
./relative/path/to/database.db
```

## Architecture

```
db/
├── base.js          # Base adapter interface
├── factory.js       # Database factory with auto-detection
├── pg.js           # PostgreSQL adapter
├── mysql.js        # MySQL adapter
├── mongodb.js      # MongoDB adapter (limited)
└── sqlite.js       # SQLite adapter
```

## Usage Example

```javascript
import { DatabaseFactory } from "./db/factory.js";

// Create database instance
const db = DatabaseFactory.create("postgresql", "postgresql://...");

// Or auto-detect
const dbType = DatabaseFactory.detectTypeFromConnectionString(url);
const db = DatabaseFactory.create(dbType, url);

await db.connect();
const result = await db.query("SELECT * FROM trips");
await db.close();
```

## MongoDB Note

⚠️ MongoDB uses NoSQL queries, not SQL. The current SQL generator produces SQL syntax which is incompatible with MongoDB. To use MongoDB, you would need to:

1. Create a separate query generator for MongoDB
2. Convert the query plan to MongoDB aggregation pipeline
3. Use the `executeMongoQuery()` method instead of `query()`

For production use with MongoDB, consider creating a separate adapter layer that translates the query plan to MongoDB-specific operations.
