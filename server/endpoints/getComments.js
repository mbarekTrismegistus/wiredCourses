import { eq } from "drizzle-orm";
import * as schema from "../db/schema.js"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { comment } from "../db/schema.js";
import { configDotenv } from 'dotenv';


configDotenv()



const client = postgres(process.env.DATABASE_URL, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})

export default async function getCourse(id){
    let data = await db.query.comment.findFirst({
        where: eq(comment.id, id),
        with: {
            user: {
                columns: {
                    password: false
                }
            }
        }
    })
    return data
}