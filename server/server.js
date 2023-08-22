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

const rooms = ["Lobby", "Room1"]

app.use(cors());

io.on("connection", (socket) => {
    console.log("New user connected: ", socket.id);

    socket.on("init_chat", (username) => {
        console.log("inside init chat")
        socket.emit("new_user_joined_chat", username);
        socket.emit("rooms", rooms);
    });

    socket.on("join_room", ({room, username}) => {
        socket.join(room);
        socket.broadcast.emit("new_user_joined_chat", username);
        console.log(io.sockets.adapter.rooms);
    });

    socket.on("create-room",(room) =>{
        rooms.push(room);
        console.log("nytt rum " + room);
    })
    socket.on("list_of_rooms", ({room, username}) => {
        
    })
});



server.listen(3001, () => console.log("Server is up and running"));