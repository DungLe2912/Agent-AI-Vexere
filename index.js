import OpenAI from "openai";
import { ask, rl } from "./utils/cli.js";
import { DatabaseFactory } from "./db/factory.js";
import { detectIntent } from "./agent/intentParser.js";
import { planQuery } from "./agent/planner.js";
import { generateSQL } from "./agent/sqlGenerator.js";
import { formatResponse } from "./agent/responseFormatter.js";
import { config } from "./config/env.js";

// Debug mode - set to false for production
const DEBUG_MODE = process.env.DEBUG === "true";

/* =======================
   MAIN LOOP
======================= */
(async () => {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });

  // Auto-detect database type if not specified
  const dbType = DatabaseFactory.detectTypeFromConnectionString(
    config.database.url
  );

  const db = DatabaseFactory.create(dbType, config.database.url);

  try {
    await db.connect();
    console.log(
      `✅ Agent ready (${dbType.toUpperCase()}) - type 'exit' to quit\n`
    );
  } catch (error) {
    console.error(`\n❌ Không thể kết nối database: ${error.message}`);
    console.error(`💡 Kiểm tra lại DATABASE_URL trong file .env\n`);
    process.exit(1);
  }

  while (true) {
    const question = await ask("> ");
    if (question.toLowerCase() === "exit") break;

    try {
      const result = await detectIntent(openai, question);

      // Handle greeting or help
      if (result.type === "GREETING" || result.type === "HELP") {
        console.log(`\n💬 ${result.response}\n`);
        continue;
      }

      // Handle query - extract intent from result
      const intent = {
        intent: result.intent,
        metric: result.metric,
        field: result.field,
        origin: result.origin,
        destination: result.destination,
        date: result.date,
        startDate: result.startDate,
        endDate: result.endDate,
        status: result.status,
        priceFilter: result.priceFilter,
        limit: result.limit,
      };

      if (DEBUG_MODE) console.log("🧠 Intent:", intent);

      const plan = planQuery(intent);

      // Skip if no plan (shouldn't happen for QUERY type)
      if (!plan) {
        console.log(
          "\n💬 Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Hãy thử hỏi lại nhé!\n"
        );
        continue;
      }

      if (DEBUG_MODE) console.log("🗺️ Plan:", JSON.stringify(plan, null, 2));

      const sql = generateSQL(plan);
      if (DEBUG_MODE) console.log("🧠 SQL:", sql);

      const res = await db.query(sql);
      if (DEBUG_MODE) console.table(res.rows);

      // Format response tự nhiên
      const answer = await formatResponse(openai, intent, res.rows);
      console.log(`\n💬 ${answer}\n`);
    } catch (e) {
      console.error("❌ Error:", e.message);
    }
  }

  await db.close();
  rl.close();
  process.exit(0);
})();
