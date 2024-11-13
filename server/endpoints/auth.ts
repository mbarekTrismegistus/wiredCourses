import { SignJWT, jwtVerify } from 'jose'
import cookie from "cookie"
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

const key = new TextEncoder().encode(process.env['AUTH_SECRET'])


async function encrypt(payload: any){
    return new SignJWT(payload).setProtectedHeader({alg: "HS256"})
    .setIssuedAt().setExpirationTime("1day").sign(key)
}


export async function createSession(payload:  any){
    let jwt = await encrypt(payload)
    return cookie.serialize("session", jwt, {
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: true,
        domain: "localhost",
        path: "/"
    })
}

export async function decrypt(session: any){
    const { payload } = await jwtVerify(session, key, {
        algorithms: ['HS256']
    })

    return payload
}

export async function login(data: any){

    let user = await db.select().from(users).where(eq(users.email, data.email))

    if(user[0].password === data.password){
        let session = await createSession(user[0])
        return session
    }
    else{
        return false
    }

}