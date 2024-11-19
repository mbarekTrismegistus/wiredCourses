import { db } from "../db/index.js";
import { video } from "../db/schema.js";



export default async function addVideos(req){
    let data = req.data.map((e) => {
        return {
            ...e,
            courseId: req.courseId
        }
    })
    let res = await db.insert(video).values(data).returning()
    return res


}