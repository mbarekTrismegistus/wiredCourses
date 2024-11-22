import e from "express"
import getUsers from "./endpoints/getUsers.js"
import addTeacher from "./endpoints/registre.js"
import addCourse from "./endpoints/addCourse.js"
import cors from "cors"
import { createSession, decrypt, googleAuth, login } from "./endpoints/auth.js"
import cookieParser from 'cookie-parser'
import { jwtDecode } from "jwt-decode";
import getCourses from "./endpoints/getCourses.js"
import getCourse from "./endpoints/getCourse.js"
import addVideos from "./endpoints/addVideos.js"
import getRandomCourse from "./endpoints/getRandomCourse.js"






const app = e()


app.use(e.json())
app.use(e.urlencoded({ extended: false }))
app.use(cors({
    credentials: true, 
    origin: 'https://wired-courses.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers

}))
app.use(cookieParser())

app.listen(1515, () => {
    console.log("listening on 1515")
})

app.get('/hello', (req, res) => {
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
    let data = await addTeacher(req.body)
    if(data){
        res.status(200).json(data)
    }
    else{
        res.status(500)
    }
})

app.post("/addCourse", async (req, res) => {
    let data = await addCourse(req.body.course)
    if(data){
        let videos = await addVideos({
            courseId: data[0].id,
            data: req.body.videos.media
        })
        if(videos){
            res.status(200).json(videos)
        }
        else{
            res.status(500)
        }
    }
    else{
        res.status(500)
    }
})

app.post("/auth/registre", async (req, res) => {
    let data = await addTeacher(req.body)
    if(data){
        let session = await createSession(data[0])
        res.cookie('session', data, {httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 1000, sameSite: "None"})
        res.status(200).json(session)
    }
    else{
        res.status(500)
    }
})


app.post("/auth/login", async (req, res) => {
    res.set('Cache-Control', 'no-store');
    let data = await login(req.body)
    if(data){
        console.log(data)
        res.cookie('session', data, {httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 1000, sameSite: "None"})
        res.status(200).json(data)
    }
    else{
        res.status(401).json({msg: "info false"})
    }
})

app.post("/auth/google", async (req, res) => {
    let decoded = jwtDecode(req.body.credential)
    let session = await googleAuth(decoded)
    res.cookie('session', session, {httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 1000, path: "/"})
    res.redirect("http://localhost:4200")

    
})


app.post("/auth/logout", async (req, res) => {
    res.clearCookie("session")
    res.status(200).json("cleared")
})

app.get("/auth/session", async (req, res) => {
    if(req.cookies.session){
        let data = await decrypt(req.cookies.session)
        res.status(200).json(data)

    }
    else{
        return undefined
    }
    
})


app.get("/courses", async (req, res) => {
    let data = await getCourses()
    res.status(200).json(data)
})

app.get("/courses/:id", async (req, res) => {
    let { id } = req.params
    let data = await getCourse(Number(id))
    res.status(200).json(data)
})

app.get("/randomCourse", async (req, res) => {
    let data = await getRandomCourse()
    res.status(200).json(data)
})






