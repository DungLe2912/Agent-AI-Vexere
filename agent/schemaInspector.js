export async function getTableSchema(db, dbType) {
  let schemaQuery;

  switch (dbType.toLowerCase()) {
    case "postgresql":
    case "postgres":
    case "pg":
      schemaQuery = `
        SELECT 
          table_name,
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `;
      break;

    case "mysql":
    case "mariadb":
      schemaQuery = `
        SELECT 
          table_name,
          column_name,
          data_type
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        ORDER BY table_name, ordinal_position;
      `;
      break;

    case "sqlite":
    case "sqlite3":
      // SQLite requires querying each table separately
      const tables = await db.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
      );

      const schema = {};
      for (const table of tables.rows) {
        const columns = await db.query(`PRAGMA table_info(${table.name});`);
        schema[table.name] = columns.rows.map((col) => ({
          column_name: col.name,
          data_type: col.type,
        }));
      }

      return formatSchema(schema);

    default:
      throw new Error(`Schema inspection not supported for ${dbType}`);
  }

  const result = await db.query(schemaQuery);
  return formatSchemaFromRows(result.rows);
}

function formatSchemaFromRows(rows) {
  const schema = {};

  for (const row of rows) {
    const tableName = row.table_name;
    if (!schema[tableName]) {
      schema[tableName] = [];
    }
    schema[tableName].push({
      column_name: row.column_name,
      data_type: row.data_type,
    });
  }

  return formatSchema(schema);
}

function formatSchema(schema) {
  let formatted = "Database Schema:\n\n";

  for (const [tableName, columns] of Object.entries(schema)) {
    formatted += `Table: ${tableName}\n`;
    for (const col of columns) {
      formatted += `  - ${col.column_name} (${col.data_type})\n`;
    }
    formatted += "\n";
  }

  return formatted;
}
