import { eq } from "drizzle-orm"
import { db } from "../db/index.js"
import { course } from "../db/schema.js"
import getCourse from "./getCourse.js"
import { createClient } from "@supabase/supabase-js"


export const supabase = createClient("https://bqnwxzdqfkmujzqgkyvq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbnd4emRxZmttdWp6cWdreXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTA1MDIwMiwiZXhwIjoyMDM2NjI2MjAyfQ.nt_CHK0ISYb1D9zlgfax7CIoSM87ccgoBB_Se3zrw38")



export default async function deleteCourse(id) {
    let courseVid = await getCourse(id)
    courseVid.videos.forEach(async(v) => {
        const { data, error } = await supabase
      .storage
      .from('wiredcourses')
      .remove([`public/${v.url.split("/").pop()}`])
      console.log(data)
    })
    let res = await db.delete(course).where(eq(course.id, id))
    return "res"
}