import io from 'socket.io-client';



export class SocketService {
    socket:any;
    constructor() {   }
    setupSocketConnection(id:any) {
      this.socket = io('/ws', {transports: ['polling', 'websocket']});
      this.socket.emit('join', {id: id()})

      this.socket.on('sendbacknotif', (msg:any) => {
        console.log(msg)
      });
    }

    disconnect() {
        if (this.socket) {
          this.socket.disconnect();
        }
      }
}