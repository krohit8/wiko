import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import assert from "node:assert";

assert(process.env.DATABASE_URL, "DATABASE_URL is required");
console.log(process.env.DATABASE_URL);
export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/db/Schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
