import e from "express"
import getUsers from "./endpoints/getUsers"
import addTeacher from "./endpoints/registre"
import addCourse from "./endpoints/addCourse"
import cors from "cors"
import { createSession, decrypt, login } from "./endpoints/auth"
import cookieParser from 'cookie-parser'
import multer from "multer"
const upload = multer({ dest: 'uploads/', limits: { fieldSize: 10 * 10 * 1024 * 1024 } })
import {google} from "googleapis"
import path from "path"
import stream from 'stream'



const app = e()


app.use(e.json())
app.use(e.urlencoded({ extended: false }))
app.use(cors({credentials: true, origin: 'http://localhost:4200'}))
app.use(cookieParser())

app.listen(1515, () => {
    console.log("listening on 1515")
})

app.get('/hello', (req: any, res: any) => {
    res.status(200).json({
        msg: "hello"
    })
})

app.get('/users', async (req, res) => {
    let data = await getUsers()
    res.status(200).json({
        msg: data
    })
})

app.post("/register/teacher", async (req, res) => {
    let data: any = await addTeacher(req.body)
    if(data){
        res.status(200).json(data)
    }
    else{
        res.status(500)
    }
})

app.post("/addCourse", upload.single('video'), async (req, res) => {
    console.log(req.file)
    res.status(200).json(req.file)
    // let data: any = await addCourse(req.body)
    // if(data){
    //     res.status(200).json(data)
    // }
    // else{
    //     res.status(500)
    // }
})

app.post("/auth/registre", async (req, res) => {
    let data: any = await addTeacher(req.body)
    if(data){
        let session: any = await createSession(data[0])
        res.setHeader("Set-cookie", session)
        res.status(200).json(session)
    }
    else{
        res.status(500)
    }
})

app.post("/auth/login", upload.single('file'), async (req, res) => {
    console.log(req.body.file)
    // let data: any = await login(req.body)
    // if(data){
    //     res.setHeader("Set-cookie", data)
    //     res.status(200).json(data)
    // }
    // else{
    //     // console.log(data
    //     res.status(401).json({msg: "info false"})
    // }
})

app.get("/auth/session", async (req, res) => {
    if(req.cookies.session){
        let data: any = await decrypt(req.cookies.session)
        res.status(200).json(data)

    }
    else{
        return undefined
    }
    
})






