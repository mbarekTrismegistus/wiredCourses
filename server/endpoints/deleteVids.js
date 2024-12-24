import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { video } from "../db/schema.js";



export async function deleteVids(req){
    let res = await db.delete(video).where(eq(video.courseId, req))
    return res
}

export async function deleteVid(id){
    if(id){
        let res = await db.delete(video).where(eq(video.id, id))
        return res

    }
    else{
        return []
    }
}