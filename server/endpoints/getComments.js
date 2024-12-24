import { and, desc, eq, isNull } from "drizzle-orm";
import * as schema from "../db/schema.js"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configDotenv } from 'dotenv';
import { comment } from "../db/schema.js";


configDotenv()



const client = postgres(process.env.DATABASE_URL, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})

export default async function getComments(id, cursor){
    let stillHaveChildren = true
    let data = await db.query.comment.findMany({
        where: and(eq(comment.courseId, id), isNull(comment.parrentId)),
        with: {
            user: {
                columns: {
                    password: false
                }
            },

        },
        orderBy: [desc(comment.dateCommented)],
        limit:5,
        offset: cursor * 5



    })
    let parrentLeft = data
    while(stillHaveChildren){
        let newParrent = []
        for (let index = 0; index < parrentLeft.length; index++) {
            let childrens = await db.query.comment.findMany({
                where: eq(comment.parrentId, parrentLeft[index].id),
                with: {
                    user: {
                        columns: {
                            password: false 
                        }
                    },
        
                },
                orderBy: [desc(comment.dateCommented)],
        
        
            })
            newParrent = newParrent.concat(childrens)
            data = data.concat(childrens)
        }
        parrentLeft = newParrent
        // console.log(parrentLeft)
        if(parrentLeft.length == 0){
            stillHaveChildren = false
        }
        // console.log(stillHaveChildren)
    }
    console.log(data)
    return data
}