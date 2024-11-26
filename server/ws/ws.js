import e from "express"
import { createServer } from 'http';
import { Server } from 'socket.io'; 
import { configDotenv } from 'dotenv';


configDotenv()

const port = process.env.PORT || 4000;

const app = e()




const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { 
    origin: ['https://wired-courses.vercel.app', 'https://wired-courses-m68i.vercel.app'],
    methods: ["GET", "POST"],
    credentials: true,
 } });

io.on('connection', (socket) => {
    console.log("connected")
    socket.emit("msg", "hello ")
    socket.on('disconnect', (reason) => {
        console.log('disconnected cause of', reason)
    })
    socket.on('join', function(data){
        socket.join(data.id)
    })
    socket.on('addnotif', (msg) => {
        console.log("it is", msg.id)
        io.sockets.in(msg.id).emit('sendbacknotif', "hello from server to ws to angular")
    });
})



httpServer.listen(port, () => {
    console.log('listening on *:1516');
});