import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

// Neon client
const sql = neon(process.env.DATABASE_URL!);

// Export a Drizzle instance
export const db = drizzle(sql);
