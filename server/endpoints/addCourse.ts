import { db } from "../db";
import { course } from "../db/schema";



export default async function addCourse(req: any){
    let res = await db.insert(course).values(req).returning()
    return res
}