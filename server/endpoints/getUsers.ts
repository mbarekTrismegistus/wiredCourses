import { db } from "../db";
import { users } from "../db/schema";

export default async function getUsers(){
    let data = await db.select().from(users)
    return data
}