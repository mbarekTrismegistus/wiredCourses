import { SignJWT, jwtVerify } from 'jose'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import registre from './registre.js'


const key = new TextEncoder().encode(process.env['AUTH_SECRET'])




async function encrypt(payload){
    return new SignJWT(payload).setProtectedHeader({alg: "HS256"})
    .setIssuedAt().setExpirationTime("1day").sign(key)
}


export async function createSession(payload){
    let jwt = await encrypt(payload)
    return jwt
}


export async function decrypt(session){
    const { payload } = await jwtVerify(session, key, {
        algorithms: ['HS256']
    })

    return payload
}

export async function login(data){
    console.log(process.env['AUTH_SECRET'])
    let user = await db.select().from(users).where(eq(users.email, data.email))

    if(user[0]){
        if(user[0].password === data.password){
            let session = await createSession(
                {
                    id: user[0].id,
                    email: user[0].email,
                    picture: user[0].picture,
                    firstname: user[0].firstname,
                    lastname: user[0].lastname
                }
            )
            return session
        }
        else{
            return false
        }
    }
    else{
        return false
    }


}


export async function googleAuth(payload){
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
