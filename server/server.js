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
        let roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms, io.sockets);//skickar med sockets
        if (!roomList.hasOwnProperty("Lobby")) {
            roomList = {...roomList, "Lobby": []}
        }
        console.log(roomList);
        io.emit("list_of_rooms", roomList);
        console.log(socket.id)
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })

    socket.on("disconnect", ({username, socket}) => {
        let roomList = convertMapOfSetsToObjectOfArrays(io.sockets.adapter.rooms, io.sockets);
        if (!roomList.hasOwnProperty("Lobby")) {
            roomList = {...roomList, "Lobby": []}
        }
        io.emit("list_of_rooms", roomList);
    });
   
    socket.on("is_typing", ({room, username, isTyping}) => {
        socket.to(room).emit("user_is_typing", { username, isTyping })
     })
});


function convertMapOfSetsToObjectOfArrays(mapOfSets, sockets) {

    const objectOfArrays = {};

    for (const [key, set] of mapOfSets) {
        if(!sockets.sockets.has(key)) {        //om nyckeln inte finns bland 
            //anslutna sockets, så ska nyckeln läggas till i objektet. Skulle 
            //nyckeln finnas så är det ett socket.id som vi inte vill skicka med
            objectOfArrays[key] = Array.from(set);
        }
    }
   
    console.log(objectOfArrays);
    return objectOfArrays;
}


server.listen(3001, () => console.log("Server is up and running"));