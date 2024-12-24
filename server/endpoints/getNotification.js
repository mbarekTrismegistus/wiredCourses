import * as schema from "../db/schema.js"
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { configDotenv } from 'dotenv';
import { desc, eq } from "drizzle-orm";
import { notifications } from "../db/schema.js";


configDotenv()



const client = postgres(process.env.DATABASE_URL, { prepare: false });


const db = drizzle({
    client: client,
    schema: schema
})



export default async function getNotifications(params) {
    let data = await db.query.notifications.findMany({
        where: eq(notifications.userId, params),
        with: {
            sender: {
                columns: {
                    password: false
                }
            }
        },
        orderBy: [desc(notifications.notificationDate)]
    })
    return data
}