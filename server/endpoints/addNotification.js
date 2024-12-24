import { db } from "../db/index.js";
import { notifications } from "../db/schema.js";



export default async function addNotification(req){
    let res = await db.insert(notifications).values(req).returning()
    return res
}