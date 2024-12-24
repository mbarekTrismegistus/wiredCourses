import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { course } from "../db/schema.js";



export default async function countView(id){
    console.log(id)
    let res = await db.update(course).set({views: sql`${course.views} + 1`}).where(eq(course.id, id))
    return res
}