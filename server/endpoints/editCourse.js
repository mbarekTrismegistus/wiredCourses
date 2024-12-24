import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { course } from "../db/schema.js";



export default async function editCourse(req){
    let res = await db.update(course).set({
        title: req.title,
        description: req.description,
        thumbnail: req.thumbnail,
        duration: req.duration
    }).where(eq(course.id, req.id)).returning()
    console.log(res)
    return res
}