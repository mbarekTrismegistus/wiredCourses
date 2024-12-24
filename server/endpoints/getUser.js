import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema.js"
import postgres from "postgres";
import { configDotenv } from 'dotenv';
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";


configDotenv()

let client = postgres(process.env.DATABASE_URL, {prepare: false})

let db = drizzle({
    client: client,
    schema: schema
})


export default async function getUser(id) {
    let data = await db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
            courses: true
        },
        columns: {
            password: false
        }
    })

    return data
}