import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.ts", // Update path to your schema file
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
