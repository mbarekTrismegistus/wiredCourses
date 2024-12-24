import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { notifications } from "../db/schema.js";



export default async function readNotif(id){
    let res = await db.update(notifications).set({isRead: true}).where(eq(notifications.id, id)).returning()
    return res
}