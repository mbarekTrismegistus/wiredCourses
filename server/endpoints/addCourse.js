import { db } from "../db/index.js";
import { course } from "../db/schema.js";



export default async function addCourse(req){
    let res = await db.insert(course).values(req).returning()
    return res
}