const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors")

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});

app.use(cors());

io.on("connection", (socket) => {
    console.log("New client connected: ", socket.id);

    io.emit("test", "Testing, testing, 1,2,3")

    socket.on("init_chat", (username) => {
        socket.broadcast.emit("new_user_joined_chat", username);
    });
});



server.listen(3000, () => console.log("Server is up and running"));