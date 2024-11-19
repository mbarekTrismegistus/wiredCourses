import { eq } from "drizzle-orm";
import * as schema from "../db/schema"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { course } from "../db/schema";



const client = postgres(process.env['DATABASE_URL']!, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})

export default async function getCourse(id: number){
    let data = await db.query.course.findFirst({
        where: eq(course.id, id),
        with: {
            user: true,
            videos: true
        }
    })
    return data
}