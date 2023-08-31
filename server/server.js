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
    // console.log("New user connected: ", socket.id);

    socket.on("init_chat", (username) => {
        socket.emit("new_user_joined_chat", username);

    });

    socket.on("join_room", ({previousRoom, room, username}) => {
        socket.leave(previousRoom);
        socket.join(room);
        socket.broadcast.emit("new_user_joined_chat", username);
        let roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms, io.sockets);
        if (!roomList.hasOwnProperty("Lobby")) {
            roomList = {...roomList, "Lobby": []}
        }
        io.emit("list_of_rooms", roomList);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    });

    socket.on("disconnect", ({username, socket}) => {
        let roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms, io.sockets);
        if (!roomList.hasOwnProperty("Lobby")) {
            roomList = {...roomList, "Lobby": []}
        }
        io.emit("list_of_rooms", roomList);
    });
   
    socket.on("is_typing", ({room, username, isTyping}) => {
        socket.to(room).emit("user_is_typing", { username, isTyping })
     });
});


function convertMapOfSetsToObjectOfArrays(mapOfSets, sockets) {

    const objectOfArrays = {};

    for (const [key, set] of mapOfSets) {
        if(!sockets.sockets.has(key)) {        
            objectOfArrays[key] = Array.from(set);
        }
    }

    return objectOfArrays;
}


server.listen(3001, () => console.log("Server is up and running"));