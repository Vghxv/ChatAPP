const express =require("express");
const { unwatchFile } = require("fs");
const Socket = require("socket.io");
const app = express();

const server = require("http").createServer(app);
const io = Socket(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

let PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const users = [];

io.on("connection", (socket) => {
    console.log(`New client ${socket.id} connected`);
    // EVENTLISTENERS
    socket.on("adduser", (username) => {
        socket.user = username;
        users.push(username);
        io.sockets.emit("users", users);
        console.log(users);
    });

    socket.on("message",(message)=>{
        io.sockets.emit("message_client",{
            message,
            // or like this "message: message,"
            user : socket.user
        })
    });
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnected`, socket.user);
        if(socket.user){
            users.splice(users.indexOf(socket.user), 1);
            io.sockets.emit("users", users);
            console.log("remaining",users);
        }
    });

});