import {Server} from "socket.io";

export const toneServer = (server) => {
    let io = null
    if (!server?.httpServer) {
        io = new Server(server)
        return
    } else {
        io = new Server(server.httpServer)
    }
    io.on('connection', (socket) => {
        setInterval(() => {
            const frequency = Math.random() * 500 + 100; // Random frequency between 100 and 600 Hz
            const duration = Math.random() * 500 + 100; //  between 100 and 600 millisecond duration
            const noteData = {frequency, duration};
            socket.emit('note', JSON.stringify(noteData))
        }, 100);
    })
}
