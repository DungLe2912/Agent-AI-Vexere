function renderCondition(node) {
  if (node.type === "condition") {
    if (node.operator === "ILIKE") {
      return `${node.column} ILIKE '${node.value}'`;
    }

    if (node.operator === "BETWEEN") {
      const [from, to] = node.value;
      return `${node.column} BETWEEN '${from}' AND '${to}'`;
    }

    return `${node.column} ${node.operator} ${
      typeof node.value === "number" ? node.value : `'${node.value}'`
    }`;
  }

  const joined = node.conditions
    .map(renderCondition)
    .join(node.type === "and" ? " AND " : " OR ");

  return `(${joined})`;
}

export function generateSQL(plan, schema = null) {
  const selectClause = plan.aggregate
    ? `${plan.aggregate.fn}(${plan.aggregate.column}) AS ${plan.aggregate.alias}`
    : plan.select.join(", ");

  let sql = `
SELECT ${selectClause}
FROM ${plan.from}
`;

  if (plan.join) {
    sql += `JOIN ${plan.join.table} ON ${plan.join.on}\n`;
  }

  if (plan.where?.conditions?.length) {
    sql += `WHERE ${renderCondition(plan.where)}\n`;
  }

  if (plan.limit) {
    sql += `LIMIT ${plan.limit}\n`;
  }

  return sql.trim() + ";";
}

// Helper to fix SQL based on schema
export function regenerateSQL(openai, originalSQL, error, schema) {
  return new Promise(async (resolve, reject) => {
    const prompt = `
You are a SQL expert. The following SQL query failed with an error.
Your job is to fix it based on the actual database schema.

Original SQL:
${originalSQL}

Error:
${error}

Actual Database Schema:
${schema}

Rules:
1. Find the table and column mentioned in the error
2. Check the actual schema for the correct column name
3. Replace incorrect column names with correct ones from schema
4. Return ONLY the fixed SQL query, nothing else
5. Do not change the query logic, only fix column/table names

Fixed SQL:
`;

    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const fixedSQL = res.choices[0].message.content
        .trim()
        .replace(/```sql|```/g, "")
        .trim();

      resolve(fixedSQL);
    } catch (err) {
      reject(err);
    }
  });
}
