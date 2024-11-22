import { db } from "../db/index.js";
import { comment } from "../db/schema.js";



export default async function addComment(req){
    let res = await db.insert(comment).values(req).returning()
    return res
}