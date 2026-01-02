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

export function generateSQL(plan) {
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
