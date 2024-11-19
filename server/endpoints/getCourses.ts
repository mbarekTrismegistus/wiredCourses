import { eq, sql } from "drizzle-orm";
import * as schema from "../db/schema"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { course } from "../db/schema";



const client = postgres(process.env['DATABASE_URL']!, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})

export default async function getCourses(){
    let data = await db.query.course.findMany({
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