import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { rating } from "../db/schema.js";



export async function getRating(req){
    console.log(req)
    let res = await db.select({ rating: sql`avg(rate)` }).from(rating).where(and(eq(rating.courseId, req.courseId), isNotNull(rating.rate)))
    console.log(res)
    return res[0]
}

export async function getUserRating(params) {
    let res = await db.select().from(rating).where(and(eq(rating.courseId, params.courseId), eq(rating.userId, params.userId)))
    return res[0]

}