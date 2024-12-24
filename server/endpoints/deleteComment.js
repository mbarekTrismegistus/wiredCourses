import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { comment } from "../db/schema.js";



export async function deleteComment(id){
    let res = await db.delete(comment).where(eq(comment.id, id))
    return res
}
