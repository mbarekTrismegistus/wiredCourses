import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { rating } from "../db/schema.js";



export default async function updateRating(req){
    console.log(req)
    let isExist = await db.select().from(rating).where(and(eq(rating.courseId, req.courseId), eq(rating.userId, req.userId)))
    console.log(isExist)
    if(isExist[0]){
        console.log("update")
        let res = await db.update(rating).set({rate: req.rate}).where(and(eq(rating.courseId, req.courseId), eq(rating.userId, req.userId)))
        return res
    }
    else{
        console.log("insert")
        let res = await db.insert(rating).values({rate: req.rate, courseId: req.courseId, userId: req.userId}).returning()
        return res
    }
}