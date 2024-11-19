import { db } from "../db";
import { course } from "../db/schema";



export default async function addCourse(req: any){
    console.log(req)
    let res = await db.insert(course).values(req).returning()
    return res
}