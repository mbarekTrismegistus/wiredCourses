import e from "express"
import { createServer } from 'http';
import { Server } from 'socket.io'; 

const app = e()




const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: ['*'] } });

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
    socket.on('join', function(data){
        socket.join(data.id)
    })
    socket.on('addnotif', (msg) => {
        console.log("it is", msg.id)
        io.sockets.in(msg.id).emit('sendbacknotif', "hello from server to ws to angular")
    });
})



httpServer.listen(1516, () => {
    console.log('listening on *:1516');
});