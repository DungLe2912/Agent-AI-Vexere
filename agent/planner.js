function buildDateCondition(intent) {
  if (intent.startDate && intent.endDate) {
    return {
      type: "condition",
      column: "DATE(trips.departure_time)",
      operator: "BETWEEN",
      value: [intent.startDate, intent.endDate],
    };
  }

  if (intent.date) {
    return {
      type: "condition",
      column: "DATE(trips.departure_time)",
      operator: "=",
      value: intent.date,
    };
  }

  return null;
}

export function planQuery(intent) {
  // Skip planning if no intent (for greetings/help)
  if (!intent || !intent.intent) {
    return null;
  }

  /* ========= ANALYTICS ========= */
  if (intent.intent === "ANALYTICS") {
    const conditions = [];

    if (intent.destination) {
      conditions.push({
        type: "condition",
        column: "routes.destination",
        operator: "ILIKE",
        value: intent.destination,
      });
    }

    if (intent.origin) {
      conditions.push({
        type: "condition",
        column: "routes.origin",
        operator: "ILIKE",
        value: intent.origin,
      });
    }

    const dateCond = buildDateCondition(intent);
    if (dateCond) conditions.push(dateCond);

    if (intent.status) {
      conditions.push({
        type: "condition",
        column: "trips.status",
        operator: "=",
        value: intent.status,
      });
    }

    return {
      from: "trips",
      join: {
        table: "routes",
        on: "trips.route_id = routes.route_id",
      },
      aggregate: {
        fn: intent.metric || "SUM",
        column: intent.field || "available_seats",
        alias: "result",
      },
      where: {
        type: "and",
        conditions,
      },
    };
  }

  /* ========= AVAILABILITY ========= */
  if (intent.intent === "AVAILABILITY") {
    const conditions = [];

    if (intent.origin) {
      conditions.push({
        type: "condition",
        column: "routes.origin",
        operator: "ILIKE",
        value: intent.origin,
      });
    }

    if (intent.destination) {
      conditions.push({
        type: "condition",
        column: "routes.destination",
        operator: "ILIKE",
        value: intent.destination,
      });
    }

    const dateCond = buildDateCondition(intent);
    if (dateCond) conditions.push(dateCond);

    if (intent.status) {
      conditions.push({
        type: "condition",
        column: "trips.status",
        operator: "=",
        value: intent.status,
      });
    }

    return {
      from: "trips",
      join: {
        table: "routes",
        on: "trips.route_id = routes.route_id",
      },
      select: [
        "trips.trip_id",
        "routes.origin",
        "routes.destination",
        "trips.departure_time",
        "trips.status",
        "trips.available_seats",
      ],
      where: {
        type: "and",
        conditions,
      },
      limit: intent.limit || null,
    };
  }

  /* ========= PRICING ========= */
  if (intent.intent === "PRICING") {
    const conditions = [];

    if (intent.origin) {
      conditions.push({
        type: "condition",
        column: "origin",
        operator: "ILIKE",
        value: intent.origin,
      });
    }

    if (intent.destination) {
      conditions.push({
        type: "condition",
        column: "destination",
        operator: "ILIKE",
        value: intent.destination,
      });
    }

    if (intent.priceFilter) {
      conditions.push({
        type: "condition",
        column: "base_price",
        operator: intent.priceFilter.operator,
        value: intent.priceFilter.value,
      });
    }

    return {
      from: "routes",
      select: ["route_id", "origin", "destination", "base_price"],
      where: {
        type: "and",
        conditions,
      },
      limit: intent.limit || null,
    };
  }

  return null;
}
