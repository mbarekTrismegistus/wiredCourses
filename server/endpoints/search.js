import { sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { course, users } from "../db/schema.js";




export default async function search(keyword){
    let search = keyword.replace(/ /g,":* | ") 
    search = `${search+':*'}`
    console.log(search)
    let courses = await db.select().from(course).where(sql`(
        setweight(to_tsvector('english', ${course.title}), 'A') ||
        setweight(to_tsvector('english', ${course.description}), 'B'))
        @@ to_tsquery('english', ${search}) 
    `)

    let user = await db.select().from(users).where(sql`(
        setweight(to_tsvector('english', ${users.firstname}), 'A') ||
        setweight(to_tsvector('english', ${users.lastname}), 'B'))
        @@ to_tsquery('english', ${search}) 
    `)
    return {
        course: courses,
        users: user
    }
}