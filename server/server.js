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
import addComment from "./endpoints/addComment.js"
import getUser from "./endpoints/getUser.js"
import getNotifications from "./endpoints/getNotification.js"
import addNotification from "./endpoints/addNotification.js"
import readNotif from "./endpoints/readNotif.js"
import search from "./endpoints/search.js"
import countView from "./endpoints/countView.js"
import deleteCourse from "./endpoints/deleteCourse.js"
import getComments from "./endpoints/getComments.js"
import {deleteVids, deleteVid } from "./endpoints/deleteVids.js"
import editCourse from "./endpoints/editCourse.js"
import { deleteComment } from "./endpoints/deleteComment.js"
import updateRating from "./endpoints/updateRating.js"
import { getRating, getUserRating } from "./endpoints/getRating.js"



const app = e()



app.use(e.json())
app.use(e.urlencoded({ extended: false }))
app.use(cors({
    credentials: true, 
    origin: 'https://wired-courses.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization']

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

app.post("/editCourse", async (req, res) => {
    let session = await decrypt(req.cookies.session)
    if(session){
        let body = req.body
        // console.log(body)
        let data = await editCourse(body.course)
        if(data){
            let deleted = await deleteVids(data[0].id)
            if(deleted){
                console.log("deleted")
                let videos = await addVideos({
                    courseId: data[0].id,
                    data: req.body.videos.media
                })
                if(videos){
                    res.status(200).json({course: data, videos: videos})
                }
                else{
                    res.status(500)
                }
            }
        }
        else{
            res.status(500)
        }
    }
    else{
        res.status(401)
    }
    
})

app.post("/addCourse", async (req, res) => {
    let session = await decrypt(req.cookies.session)
    if(session){
        let body = {
            ...req.body.course,
            userId: session.id
        }
        let data = await addCourse(body)
        if(data){
            let videos = await addVideos({
                courseId: data[0].id,
                data: req.body.videos.media
            })
            if(videos){
                res.status(200).json({course: data, videos: videos})
            }
            else{
                res.status(500)
            }
        }
        else{
            res.status(500)
        }
    }
    else{
        res.status(401)
    }
    
})

app.post("/auth/registre", async (req, res) => {
    let data = await addTeacher(req.body)
    if(data){
        let session = await createSession({
            id: data[0].id,
            email: data[0].email,
            picture: data[0].picture,
            firstname: data[0].firstname,
            lastname: data[0].lastname
        })
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
    res.redirect("https://wired-courses.vercel.app")

    
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
        res.status(401).json("login first")
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

app.get("/courses/comments/:id", async (req, res) => {
    let { id } = req.params
    let { cursor } = req.query
    let data = await getComments(Number(id), Number(cursor))
    let isStillComments = await getComments(Number(id), Number(cursor) + 1)
    if(isStillComments.length > 0){
        res.status(200).json({data: data, nextCursor: Number(cursor) + 1})
    }
    else{
        res.status(200).json({data: data})
    }
})

app.get("/randomCourse", async (req, res) => {
    let data = await getRandomCourse()
    res.status(200).json(data)
})


app.post("/comment", async (req, res) => {
    let session = await decrypt(req.cookies.session)
    let body = {
        ...req.body.comment,
        userId: session.id
    }
    let data = await addComment(body)
    console.log(req.body.userId)
    if(req.body.userId != session.id){
        await addNotification({
            userId: req.body.userId,
            senderId: session.id,
            content: `${session.firstname}  ${session.lastname} ${req.body?.isReply ? " replied to your comment " : " commented on your post" }`,
            notifyLink: `/courses/${req.body.comment.courseId}`
        })
    }
    if(data){
        res.status(200).json({comment: data})
    }
    else{
        res.status(500).json({msg: "error happened"})
    }
})


app.get("/users/:id", async (req, res) => {
    let {id} = req.params
    let data = await getUser(id)
    if(data){
        res.status(200).json(data)
    }
    else{
        res.status(400).json({msg: "user not found"})
    }
})




app.get("/notifications", async (req, res) => {

    if(req.cookies.session){
        let session = await decrypt(req.cookies.session)
        let data = await getNotifications(Number(session.id))
        if(data){
            res.status(200).json(data)
        }
        else{
            res.status(500).json("something went wrong")
        }
    }
    else{
        res.status(401).json("login")
    }
})


app.post('/readNotif', async (req, res) => {

    let data = await readNotif(req.body.id)
    if(data){
        res.status(200).json(data)
    }
    else{
        res.status(500)
    }
})


app.get('/search', async (req, res) => {
    let keywords = req.query.keywords
    let data = await search(keywords)
    res.status(200).json(data)
})


app.post("/courses/countView", async (req, res) => {
    let { id } = req.body
    let data = await countView(id)
    res.status(200).json(data)
})

app.post("/deleteCourse", async (req, res) => {
    let { id } = req.body
    let {userId} = req.body
    if(req.cookies.session){
        let session = await decrypt(req.cookies.session)
        if(session){
            if(userId == session.id){
                let data = await deleteCourse(id)
                res.status(200).json(data)
            }
            else{
                res.status(401).json("unauthorized")
            }
        }
        else{
            res.status(401).json("unauthorized")
        }
    }
    else{
        res.status(401).json("login")
    }
    
})


app.post("/deleteVid", async (req, res) => {
    if(req.cookies.session){
        let data = await deleteVid(req.body.id)
        if(data){
            res.status(200).json(data)
        }
    }
})

app.post("/deleteComment", async (req, res) => {
    if(req.cookies.session){
        let session = await decrypt(req.cookies.session)
        if(session){
            if(req.body.userId == session.id){
                let data = await deleteComment(req.body.id)
                res.status(200).json(data)
            }
            else{
                res.status(401).json("unauthorized")
            }
        }
        else{
            res.status(401).json("unauthorized")
        }
    }
    else{
        res.status(401).json("login")
    }
})


app.post("/rateCourse", async(req, res) => {
    if(req.cookies.session){
        let session = await decrypt(req.cookies.session)
        if(session){
            let data = await updateRating(req.body)
            if(data){
                res.status(200).json(data)
            }
            else{
                res.status(500)
            }

        }
        else{
            res.status(401).json("unauthorized")
        }
    }
    else{
        res.status(401).json("login")
    }
})


app.get("/getRating/:courseId/:userId", async(req, res) => {
    let {courseId} = req.params
    let {userId} = req.params
    let rating = await getRating({courseId: courseId, userId: userId})
    let userRating = await getUserRating({courseId: courseId, userId: userId})
    if(rating || userRating){
        res.status(200).json({rating: rating, userRating: userRating})
    }
    else{
        res.status(500)
    }


})

