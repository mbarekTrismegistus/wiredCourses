import { db } from "../db/index.js";
import { users } from "../db/schema.js";


export default async function registre(req){
    let res = await db.insert(users).values(req).returning()
    return res
}