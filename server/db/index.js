import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configDotenv } from 'dotenv';


configDotenv()


const client = postgres(process.env.DATABASE_URL, { prepare: false });
export const db = drizzle(client);