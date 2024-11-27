import { desc, eq } from "drizzle-orm";
import * as schema from "../db/schema.js"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { course } from "../db/schema.js";
import { configDotenv } from 'dotenv';
import { comment } from "../db/schema.js";


configDotenv()



const client = postgres(process.env.DATABASE_URL, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})

export default async function getCourse(id){
    let data = await db.query.course.findFirst({
        where: eq(course.id, id),
        with: {
            user: {
                columns: {
                    password: false
                }
            },
            comments: {
                with: {
                    user: {
                        columns: {
                            password: false
                        }
                    }
                },
                orderBy: [desc(comment.dateCommented)]
            },
            videos: true
        }
    })
    return data
}