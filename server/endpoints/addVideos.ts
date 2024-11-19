import { db } from "../db";
import { video } from "../db/schema";



export default async function addVideos(req: any){
    let data = req.data.map((e: any) => {
        return {
            ...e,
            courseId: req.courseId
        }
    })
    let res = await db.insert(video).values(data).returning()
    return res


}