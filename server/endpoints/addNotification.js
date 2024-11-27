import { db } from "../db/index.js";
import { notifications } from "../db/schema.js";



export default async function addNotification(req){
    console.log("hello")
    let res = await db.insert(notifications).values(req).returning()
    return res
}