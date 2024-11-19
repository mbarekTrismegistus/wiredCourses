import { SignJWT, jwtVerify } from 'jose'
import cookie from "cookie"
import { db } from '../db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import registre from './registre'

const key = new TextEncoder().encode(process.env['AUTH_SECRET'])


async function encrypt(payload: any){
    return new SignJWT(payload).setProtectedHeader({alg: "HS256"})
    .setIssuedAt().setExpirationTime("1day").sign(key)
}


export async function createSession(payload:  any){
    let jwt = await encrypt(payload)
    return jwt
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


export async function googleAuth(payload: any){
    let user = await db.select().from(users).where(eq(users.email, payload.email))
    if(user[0]){
        return await login(user[0])
    }
    else{
        let user = await registre({
            firstname: payload.given_name,
            lastname: payload.family_name,
            picture: payload.picture,
            email: payload.email
        })
        let session = await createSession(user[0])
        return session
    }
}
