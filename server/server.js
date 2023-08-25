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

// const rooms = ["Lobby", "Room1"]

app.use(cors());

io.on("connection", (socket) => {
    console.log("New user connected: ", socket.id);

    socket.on("init_chat", (username) => {
        console.log("inside init chat")
        socket.emit("new_user_joined_chat", username);

    });

    socket.on("join_room", ({previousRoom, room, username}) => {
        console.log("Leaving room: " + previousRoom)
        console.log("Socket ID: " + socket.id)
        socket.leave(previousRoom);
        console.log("Joining room " + room)
        socket.join(room);
        socket.broadcast.emit("new_user_joined_chat", username);
        let roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms);
        if (!roomList.hasOwnProperty("Lobby")) {
            roomList = {...roomList, "Lobby": []}
        }
        console.log(roomList);
        io.emit("list_of_rooms", roomList);
        console.log(socket.id)
    });

    
});

function convertMapOfSetsToObjectOfArrays(mapOfSets) {

    const objectOfArrays = {};
  
    for (const [key, set] of mapOfSets) {
      objectOfArrays[key] = Array.from(set);
    }
    //få tag i keys för map-listan, key från index1 (index0 är socket-id)
    //skicka till klienten
    console.log(objectOfArrays);
    return objectOfArrays;
  
}


server.listen(3001, () => console.log("Server is up and running"));