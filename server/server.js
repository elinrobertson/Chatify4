const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("New user connected: ", socket.id);

    io.emit("test", "Testing, testing, 1,2,3")

    socket.on("init_chat", (username) => {
        socket.broadcast.emit("new_user_joined_chat", username);
    });

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(io.sockets.adapter.rooms);
    });
});



server.listen(3001, () => console.log("Server is up and running"));