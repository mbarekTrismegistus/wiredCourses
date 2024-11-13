import { db } from "../db";
import { users } from "../db/schema";


export default async function addTeacher(req: any){
    let res = await db.insert(users).values(req).returning()
    return res
}