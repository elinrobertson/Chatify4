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
        //socket.leave //logik för att lämna rummet man är i innan man går med i rummet
        socket.join(room);
        socket.broadcast.emit("new_user_joined_chat", username);
        const roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms);
        console.log(roomList);
        io.emit("list_of_rooms", roomList);
        //console.log(io.sockets.adapter.rooms);
    });

    
});

function convertMapOfSetsToObjectOfArrays(mapOfSets) {

    const objectOfArrays = {};
  
    for (const [key, set] of mapOfSets) {
      objectOfArrays[key] = Array.from(set);
    }

    return objectOfArrays;
  
}


server.listen(3001, () => console.log("Server is up and running"));