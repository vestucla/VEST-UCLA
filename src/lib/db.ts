import { createClient, Client } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error(
    "TURSO_DATABASE_URL is not set. Add it to .env.local (e.g. file:./vest.db for local development)."
  );
}

export const db: Client = createClient({ url, authToken });
