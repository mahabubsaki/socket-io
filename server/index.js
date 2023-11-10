import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const port = 5000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

io.on("connection", socket => {
    console.log('connected user ' + socket.id);
    socket.on('disconnect', () => {
        console.log('disconnected user ' + socket.id);
    });
    socket.on('join_room', (roomid) => {
        socket.join(roomid);
        console.log(`user with id ${socket.id} joined room with id ${roomid}`);
    });
    socket.on('send_message', data => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data);
    });
});

app.get('/', async (req, res) => {
    res.send({ message: "s" });
});

server.listen(port, () => {
    console.log('listening to ' + port + ' port');
});
