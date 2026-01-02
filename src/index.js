import OpenAI from "openai";
import { ask, rl } from "../utils/cli.js";
import { PostgresAdapter } from "../db/pg.js";
import { detectIntent } from "../agent/intentParser.js";
import { planQuery } from "../agent/planner.js";
import { generateSQL } from "../agent/sqlGenerator.js";
import { formatResponse } from "../agent/responseFormatter.js";
import { config } from "../config/env.js";

/* =======================
   MAIN LOOP
======================= */
(async () => {
  const openai = new OpenAI({ apiKey: config.openai.apiKey });
  const db = new PostgresAdapter(config.database.url);

  await db.connect();
  console.log("✅ Agent ready (type 'exit' to quit)\n");

  while (true) {
    const question = await ask("> ");
    if (question.toLowerCase() === "exit") break;

    try {
      const intent = await detectIntent(openai, question);
      console.log("🧠 Intent:", intent);

      const plan = planQuery(intent);
      console.log("🗺️ Plan:", JSON.stringify(plan, null, 2));

      const sql = generateSQL(plan);
      console.log("🧠 SQL:", sql);

      const res = await db.query(sql);
      console.table(res.rows);

      // Format response tự nhiên
      const answer = await formatResponse(openai, intent, res.rows);
      console.log("\n💬 Trả lời:", answer, "\n");
    } catch (e) {
      console.error("❌ Error:", e.message);
    }
  }

  rl.close();
  process.exit(0);
})();
