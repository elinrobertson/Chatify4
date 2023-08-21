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

    socket.on("init_chat", (username) => {
        socket.broadcast.emit("new_user_joined_chat", username);
    });

    socket.on("join_room", ({room, username}) => {
        socket.join(room);
        socket.broadcast.emit("new_user_joined_chat", username);
        console.log(io.sockets.adapter.rooms);
    });

    socket.on("list_of_rooms", ({room, username}) => {
        
    })
});



server.listen(3001, () => console.log("Server is up and running"));