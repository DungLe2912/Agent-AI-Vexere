import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env file from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../.env");

dotenv.config({ path: envPath });

export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};

// Validate required environment variables
if (!config.openai.apiKey) {
  console.error("❌ Missing OPENAI_API_KEY in .env file");
  process.exit(1);
}

if (!config.database.url) {
  console.error("❌ Missing DATABASE_URL in .env file");
  process.exit(1);
}
