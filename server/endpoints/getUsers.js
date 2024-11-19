import { db } from "../db/index.js";
import { users } from "../db/schema.js";

export default async function getUsers(){
    let data = await db.select().from(users)
    return data
}